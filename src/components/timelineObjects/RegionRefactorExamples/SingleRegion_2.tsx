/**
 * Regions are visual overlays on the waveform that can be used to mark segments of audio.
 * Regions can be clicked on, dragged and resized.
 * You can set the color and content of each region, as well as their HTML content.
 */

import BasePlugin, { type BasePluginEvents } from './base-plugin.js'
import { makeDraggable } from './draggable.js'
import EventEmitter from './event-emitter.js'
import createElement from './dom.js'
import React, { FC } from 'react'

export type RegionsPluginOptions = undefined

export type RegionsPluginEvents = BasePluginEvents & {
  /** When a region is created */
  'region-created': [region: Region]
  /** When a region is being updated */
  'region-update': [region: Region, side?: 'start' | 'end']
  /** When a region is done updating */
  'region-updated': [region: Region]
  /** When a region is removed */
  'region-removed': [region: Region]
  /** When a region is clicked */
  'region-clicked': [region: Region, e: MouseEvent]
  /** When a region is double-clicked */
  'region-double-clicked': [region: Region, e: MouseEvent]
  /** When playback enters a region */
  'region-in': [region: Region]
  /** When playback leaves a region */
  'region-out': [region: Region]
}

export type RegionEvents = {
  /** Before the region is removed */
  remove: []
  /** When the region's parameters are being updated */
  update: [side?: 'start' | 'end']
  /** When dragging or resizing is finished */
  'update-end': []
  /** On play */
  play: []
  /** On mouse click */
  click: [event: MouseEvent]
  /** Double click */
  dblclick: [event: MouseEvent]
  /** Mouse over */
  over: [event: MouseEvent]
  /** Mouse leave */
  leave: [event: MouseEvent]
}

export type RegionParams = {
  /** The id of the region, any string */
  id?: string
  /** The start position of the region (in seconds) */
  start: number
  /** The end position of the region (in seconds) */
  end?: number
  /** Allow/dissallow dragging the region */
  drag?: boolean
  /** Allow/dissallow resizing the region */
  resize?: boolean
  /** The color of the region (CSS color) */
  color?: string
  /** Content string or HTML element */
  content?: string | HTMLElement
  /** Min length when resizing (in seconds) */
  minLength?: number
  /** Max length when resizing (in seconds) */
  maxLength?: number
  /** The index of the channel */
  channelIdx?: number
  /** Allow/Disallow contenteditable property for content */
  contentEditable?: boolean
}

class SingleRegion extends EventEmitter<RegionEvents> implements Region {
  public element: HTMLElement
  public id: string
  public start: number
  public end: number
  public drag: boolean
  public resize: boolean
  public color: string
  public content?: HTMLElement
  public minLength = 0
  public maxLength = Infinity
  public channelIdx: number
  public contentEditable = false
  public regionStyle: {}
  public regionElement: React.RefObject<HTMLDivElement>
  public leftHandleStyle = {}
  public leftHandleElement: React.RefObject<HTMLDivElement>
  public rightHandleStyle = {}
  public rightHandleElement: React.RefObject<HTMLDivElement>
  public subscriptions: (() => void)[] = []

  constructor(params: RegionParams, private totalDuration: number, private numberOfChannels = 0) {
    super()

    this.subscriptions = []
    this.id = params.id || `region-${Math.random().toString(32).slice(2)}`
    this.start = this.clampPosition(params.start)
    this.end = this.clampPosition(params.end ?? params.start)
    this.drag = params.drag ?? true
    this.resize = params.resize ?? true
    this.color = params.color ?? 'rgba(0, 0, 0, 0.1)'
    this.minLength = params.minLength ?? this.minLength
    this.maxLength = params.maxLength ?? this.maxLength
    this.channelIdx = params.channelIdx ?? -1
    this.contentEditable = params.contentEditable ?? this.contentEditable

    this.regionStyle = {}
    this.leftHandleStyle = {}
    this.rightHandleStyle = {}
    this.regionElement = React.createRef()
    this.leftHandleElement = React.createRef()
    this.rightHandleElement = React.createRef()

    this.element = this.initElement()
    this.setContent(params.content)
    this.setPart()

    this.renderPosition()
    this.initMouseEvents()
  }

  private clampPosition(time: number): number {
    return Math.max(0, Math.min(this.totalDuration, time))
  }

  private setPart() {
    const isMarker = this.start === this.end
    this.element.setAttribute('part', `${isMarker ? 'marker' : 'region'} ${this.id}`)
  }

  private addResizeHandles(element: HTMLElement) {
    const handleStyle = {
      position: 'absolute',
      zIndex: '2',
      width: '6px',
      height: '100%',
      top: '0',
      cursor: 'ew-resize',
      wordBreak: 'keep-all',
    }

    this.leftHandleStyle = {
        ...handleStyle,
        left: '0',
        borderLeft: '2px solid rgba(0, 0, 0, 0.5)',
        borderRadius: '2px 0 0 2px',
    }

    const leftHandle = createElement(
      'div',
      {
        part: 'region-handle region-handle-left',
        style: {
          ...handleStyle,
          left: '0',
          borderLeft: '2px solid rgba(0, 0, 0, 0.5)',
          borderRadius: '2px 0 0 2px',
        },
      },
      element,
    )

    this.rightHandleStyle = {
        ...handleStyle,
        right: '0',
        borderRight: '2px solid rgba(0, 0, 0, 0.5)',
        borderRadius: '0 2px 2px 0',
    }

    const rightHandle = createElement(
      'div',
      {
        part: 'region-handle region-handle-right',
        style: {
          ...handleStyle,
          right: '0',
          borderRight: '2px solid rgba(0, 0, 0, 0.5)',
          borderRadius: '0 2px 2px 0',
        },
      },
      element,
    )

    // Resize
    const resizeThreshold = 1
    this.subscriptions.push(
      makeDraggable(    // TODO : refactor makeDraggable to work on React component via ref
        this.leftHandleElement.current,
        (dx) => this.onResize(dx, 'start'),
        () => null,
        () => this.onEndResizing(),
        resizeThreshold,
      ),
      makeDraggable(    // TODO : refactor makeDraggable to work on React component via ref
        this.rightHandleElement.current,
        (dx) => this.onResize(dx, 'end'),
        () => null,
        () => this.onEndResizing(),
        resizeThreshold,
      ),
    )
  }

  private removeResizeHandles(element: HTMLElement) {
    const leftHandle = element.querySelector('[part*="region-handle-left"]')
    const rightHandle = element.querySelector('[part*="region-handle-right"]')
    if (leftHandle) {
      element.removeChild(leftHandle)
    }
    if (rightHandle) {
      element.removeChild(rightHandle)
    }
  }

  private initElement() {
    const isMarker = this.start === this.end

    let elementTop = 0
    let elementHeight = 100

    if (this.channelIdx >= 0 && this.channelIdx < this.numberOfChannels) {
      elementHeight = 100 / this.numberOfChannels
      elementTop = elementHeight * this.channelIdx
    }

    this.regionStyle = {
        position: 'absolute',
        top: `${elementTop}%`,
        height: `${elementHeight}%`,
        backgroundColor: isMarker ? 'none' : this.color,
        borderLeft: isMarker ? '2px solid ' + this.color : 'none',
        borderRadius: '2px',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease',
        cursor: this.drag ? 'grab' : 'default',
        pointerEvents: 'all',
    }

    // Add resize handles
    if (!isMarker && this.resize) {
      this.addResizeHandles(element)
    }

    return element
  }

  private renderPosition() {
    const start = this.start / this.totalDuration
    const end = (this.totalDuration - this.end) / this.totalDuration
    this.element.style.left = `${start * 100}%`
    this.element.style.right = `${end * 100}%`
  }

  private toggleCursor(toggle: boolean) {
    if (!this.drag || !this.element?.style) return
    this.element.style.cursor = toggle ? 'grabbing' : 'grab'
  }

  private initMouseEvents() {
    const { element } = this
    if (!element) return

    element.addEventListener('click', (e) => this.emit('click', e))
    element.addEventListener('mouseenter', (e) => this.emit('over', e))
    element.addEventListener('mouseleave', (e) => this.emit('leave', e))
    element.addEventListener('dblclick', (e) => this.emit('dblclick', e))
    element.addEventListener('pointerdown', () => this.toggleCursor(true))
    element.addEventListener('pointerup', () => this.toggleCursor(false))

    // Drag
    this.subscriptions.push(
      makeDraggable(
        element,
        (dx) => this.onMove(dx),
        () => this.toggleCursor(true),
        () => {
          this.toggleCursor(false)
          this.drag && this.emit('update-end')
        },
      ),
    )

    if (this.contentEditable && this.content) {
      this.content.addEventListener('click', (e) => this.onContentClick(e))
      this.content.addEventListener('blur', () => this.onContentBlur())
    }
  }

  public _onUpdate(dx: number, side?: 'start' | 'end') {
    if (!this.element.parentElement) return
    const { width } = this.element.parentElement.getBoundingClientRect()
    const deltaSeconds = (dx / width) * this.totalDuration
    const newStart = !side || side === 'start' ? this.start + deltaSeconds : this.start
    const newEnd = !side || side === 'end' ? this.end + deltaSeconds : this.end
    const length = newEnd - newStart

    if (
      newStart >= 0 &&
      newEnd <= this.totalDuration &&
      newStart <= newEnd &&
      length >= this.minLength &&
      length <= this.maxLength
    ) {
      this.start = newStart
      this.end = newEnd

      this.renderPosition()
      this.emit('update', side)
    }
  }

  private onMove(dx: number) {
    if (!this.drag) return
    this._onUpdate(dx)
  }

  private onResize(dx: number, side: 'start' | 'end') {
    if (!this.resize) return
    this._onUpdate(dx, side)
  }

  private onEndResizing() {
    if (!this.resize) return
    this.emit('update-end')
  }

  private onContentClick(event: MouseEvent) {
    event.stopPropagation()
    const contentContainer = event.target as HTMLDivElement
    contentContainer.focus()
    this.emit('click', event)
  }

  public onContentBlur() {
    this.emit('update-end')
  }

  public _setTotalDuration(totalDuration: number) {
    this.totalDuration = totalDuration
    this.renderPosition()
  }

  /** Play the region from the start */
  public play() {
    this.emit('play')
  }

  /** Set the HTML content of the region */
  public setContent(content: RegionParams['content']) {
    this.content?.remove()
    if (!content) {
      this.content = undefined
      return
    }
    if (typeof content === 'string') {
      const isMarker = this.start === this.end
      this.content = createElement('div', {
        style: {
          padding: `0.2em ${isMarker ? 0.2 : 0.4}em`,
          display: 'inline-block',
        },
        textContent: content,
      })
    } else {
      this.content = content
    }
    if (this.contentEditable) {
      this.content.contentEditable = 'true'
    }
    this.content.setAttribute('part', 'region-content')
    this.element.appendChild(this.content)
  }

  /** Update the region's options */
  public setOptions(options: Omit<RegionParams, 'minLength' | 'maxLength'>) {
    if (options.color) {
      this.color = options.color
      this.element.style.backgroundColor = this.color
    }

    if (options.drag !== undefined) {
      this.drag = options.drag
      this.element.style.cursor = this.drag ? 'grab' : 'default'
    }

    if (options.start !== undefined || options.end !== undefined) {
      const isMarker = this.start === this.end
      this.start = this.clampPosition(options.start ?? this.start)
      this.end = this.clampPosition(options.end ?? (isMarker ? this.start : this.end))
      this.renderPosition()
      this.setPart()
    }

    if (options.content) {
      this.setContent(options.content)
    }

    if (options.id) {
      this.id = options.id
      this.setPart()
    }

    if (options.resize !== undefined && options.resize !== this.resize) {
      const isMarker = this.start === this.end
      this.resize = options.resize
      if (this.resize && !isMarker) {
        this.addResizeHandles(this.element)
      } else {
        this.removeResizeHandles(this.element)
      }
    }
  }

  public render() {
    return (
        <>
            <div id="left-handle" key="region-handle-left" ref={this.leftHandleElement} style={this.leftHandleStyle}/>
            <div id="region" ref={this.regionElement} style={this.regionStyle} />
            <div id="right-handle" key="region-handle-right" ref={this.rightHandleElement} style={this.rightHandleStyle}/>
        </>
    )
  }

  /** Remove the region */
  public remove() {
    this.emit('remove')
    this.subscriptions.forEach((unsubscribe) => unsubscribe())
    this.element.remove()
    // This violates the type but we want to clean up the DOM reference
    // w/o having to have a nullable type of the element
    this.element = null as unknown as HTMLElement
  }
}

export type Region = SingleRegion