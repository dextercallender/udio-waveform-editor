/**
 * Regions are visual overlays on the waveform that can be used to mark segments of audio.
 * Regions can be clicked on, dragged and resized.
 * You can set the color and content of each region, as well as their HTML content.
 */

import BasePlugin, { type BasePluginEvents } from './base-plugin.js'
import { makeDraggable } from './draggable.js'
import EventEmitter from './event-emitter.js'
import createElement from './dom.js'

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
  totalDuration: number
  numberOfChannels?: number
  subscriptions?: (() => void)[]
}

// React Single Region Functional Component 

import { FC, useEffect, useRef, useState } from 'react'
import { kMaxLength } from 'buffer'

const SingleRegionComponent: FC<RegionParams> = (props: RegionParams) => {
  
  // METHODS

  const clampPosition = (time: number): number => {
    return Math.max(0, Math.min(staticState.totalDuration, time))
  }

  const addResizeHandles = () => {
    setleftHandleStyle({
      ...handleStyle,
      left: '0',
      borderLeft: '2px solid rgba(0, 0, 0, 0.5)',
      borderRadius: '2px 0 0 2px',
    })

    setrightHandleStyle({
      ...handleStyle,
      right: '0',
      borderRight: '2px solid rgba(0, 0, 0, 0.5)',
      borderRadius: '0 2px 2px 0',
    })

    // Resize
    const resizeThreshold = 1
    staticState.subscriptions && staticState.subscriptions.push(
      makeDraggable(
        leftHandleRef,
        (dx) => onResize(dx, 'start'),
        () => null,
        () => onEndResizing(),
        resizeThreshold,
      ),
      makeDraggable(
        rightHandleRef,
        (dx) => onResize(dx, 'end'),
        () => null,
        () => onEndResizing(),
        resizeThreshold,
      ),
    )
  }

  const onResize = (dx: number, side: 'start' | 'end') => {
    if (!dynamicState.resize) return
    _onUpdate(dx, side)
  }

  const onEndResizing = () => {
    if (!dynamicState.resize) return
    emit('update-end')  // TODO use redux event store
  }

  const renderPosition =() => {
    if (!staticState.start || !staticState.end || !staticState.totalDuration)
      return
    const start = staticState.start / staticState.totalDuration
    const end = (staticState.totalDuration - staticState.end) / staticState.totalDuration
    if (elementRef.current) {
      elementRef.current.style.left = `${start * 100}%`
      elementRef.current.style.right = `${end * 100}%`
    }
  }

  const toggleCursor = (toggle: boolean) => {
    if (!dynamicState.drag || !elementRef.current || !elementRef.current.style) return
    elementRef.current.style.cursor = toggle ? 'grabbing' : 'grab'
  }

  // STATE

  // Mostly static state
  const [staticState, setStaticState] = useState<Partial<RegionParams>>({
    id: props.id,
    start: clampPosition(props.start),
    end: clampPosition(props.end ?? props.start),
    totalDuration: props.totalDuration,
    numberOfChannels: props.numberOfChannels,
    minLength: props.minLength ?? 0,
    maxLength: props.maxLength ?? Infinity,
    channelIdx: props.channelIdx ? -1,
    contentEditable: props.contentEditable ?? false,
    subscriptions: [],
  })

  // Mostly dynanmic state (can be split out/memoized as needed)
  const [dynamicState, setDynamicState] = useState<Partial<RegionParams>>({
    drag: props.drag ?? true,
    resize: props.resize ?? true,
    color: props.color ?? 'rgba(0, 0, 0, 0.1)',
  })

  const [elementHeight, setElementHeight] = useState(0)
  const [elementTop, setElementTop] = useState(0)
  const [elementStyle, setElementStyle] = useState({})
  const [handleStyle, setHandleStyle] = useState({
    position: 'absolute',
    zIndex: '2',
    width: '6px',
    height: '100%',
    top: '0',
    cursor: 'ew-resize',
    wordBreak: 'keep-all',
  })
  const [leftHandleStyle, setleftHandleStyle] = useState(null)
  const [rightHandleStyle, setrightHandleStyle] = useState(null)
  
  // REFS

  const elementRef = useRef<HTMLDivElement>(null)
  const leftHandleRef = useRef<HTMLDivElement>(null)
  const rightHandleRef = useRef<HTMLDivElement>(null)

  // TODO render position
  // TODO init mouse events

  // HOOKs

  useEffect(()=> {
    const isMarker = staticState.start === staticState.end

    setElementTop(0)
    setElementHeight(100)

    if (staticState.channelIdx && 
      staticState.numberOfChannels &&
      staticState.channelIdx >= 0 && staticState.channelIdx < staticState.numberOfChannels) {
      setElementHeight(100 / staticState.numberOfChannels)
      setElementTop(elementHeight * staticState.channelIdx)
    } 

    setElementStyle({
      position: 'absolute',
      top: `${elementTop}%`,
      height: `${elementHeight}%`,
      backgroundColor: isMarker ? 'none' : staticState.color,
      borderLeft: isMarker ? '2px solid ' + staticState.color : 'none',
      borderRadius: '2px',
      boxSizing: 'border-box',
      transition: 'background-color 0.2s ease',
      cursor: dynamicState.drag ? 'grab' : 'default',
      pointerEvents: 'all',
    })

    if (!isMarker && dynamicState.resize) {
      addResizeHandles()
    }

    // TODO set content
    // TODO set part
    
  })

  // Handle click interactions

  // Handle Drag
  useEffect(() => {
    // TODO implement makeDraggable
    renderPosition()
  }, [dynamicState.drag])

  // Handle Resize
  useEffect(()=> {
    // TODO implement makeDraggable
    renderPosition()
  }, [dynamicState.resize])

  return (
    <>
        <div id="left-handle" key="region-handle-left" ref={leftHandleRef} />
        <div id="region" ref={elementRef} style={elementStyle} />
        <div id="right-handle" key="region-handle-right" ref={rightHandleRef} />
    </>
  )
}

export type Region = SingleRegion