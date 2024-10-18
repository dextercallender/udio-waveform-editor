import { FC, ReactElement, useState, useEffect, useRef, useMemo, createContext, memo} from 'react';

import WaveSurfer, { type WaveSurferEvents, type WaveSurferOptions } from 'lib/wavesurfer.js/src/wavesurfer'
import RegionsPlugin from 'lib/wavesurfer.js/src/plugins/regions'

import {Renderer, RendererComponent} from './Renderer'
import { Provider } from 'react-redux'
import store from './eventsStore/EventsStore';
import { Tool } from './tools/Tool'


/* WAVESURFER PROPS */

type WavesurferEventHandler<T extends unknown[]> = (wavesurfer: WaveSurfer, ...args: T) => void

type OnWavesurferEvents = {
  [K in keyof WaveSurferEvents as `on${Capitalize<K>}`]?: WavesurferEventHandler<WaveSurferEvents[K]>
}

/* WAVEFORM EDITOR TYPES */

type WaveformEditorPropsExtension = {
    containerRef: Required<React.RefObject<HTMLDivElement>>
    regionColor: string
}

export type WaveformEditorProps = Omit<WaveSurferOptions, 'container'> & OnWavesurferEvents & WaveformEditorPropsExtension

type WaveformEditorState = {

}

type WaveformEditorEvents = {

}

type WaveformEditorType = {
    wavesurferInstance: WaveSurfer | null
    // playhead?: number
    // toolMap: Array<Tool>
    // renderers: Renderer     
    // webaudio: 
}

// Waveform Editor Hooks

type WaveformEditorHooks = {
    useWaveformEditor: (props: WaveformEditorProps) => WaveformEditorType
    useWaveformEditorState: (waveformEditor: WaveformEditorType) => WaveformEditorState
    useWaveformEditorEvents: (waveformEditor: WaveformEditorType) => WaveformEditorEvents
}

const useWaveformEditorHooks = (props: WaveformEditorProps) : WaveformEditorHooks => {

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
    const flatOptions = useMemo(() => Object.entries(props).flat(), [props])
    
    const [regionsPlugin, setRegionsPlugin] = useState<RegionsPlugin>(RegionsPlugin.create())

    // Create Wavesurfer Instance
    useEffect(() => {
        if (!props.containerRef.current) return
        const ws = WaveSurfer.create({
          ...props,
          container: props.containerRef.current,
          plugins: [regionsPlugin]
        })
        setWavesurfer(ws)

        return () => {
          ws.destroy()
        }

      }, [props.containerRef, ...flatOptions])
    
    // TODO use regions plugin and update styles and creation

    // Region Action Handlers
    // But where to add additional buttons
    wavesurfer?.on('decode', () => {
        regionsPlugin.addRegion({
            start: 0,
            end: 8,
            content: 'Resize me',
            color: 'rgba(255, 0, 0, 0.1)',
            drag: false,
            resize: true,
          })
    })


    // useEffect(() => {
    // }, wavesurfer?.on('decode'))

    // wavesurfer?.on('decode', () => {
        
    // })

    // TODO use minimap plugin
    // TODO use all other plugins you find in the udio FE codebase

    // TODO Do stuff for state
    // TODO Do stuff for events

    // Return Waveform Editor Hooks
    const useWaveformEditor = (props: WaveformEditorProps) : WaveformEditorType => {
        return { wavesurferInstance: wavesurfer }
    }
   
    const useWaveformEditorState = (waveformEditor: WaveformEditorType) => { return {} }
    const useWaveformEditorEvents = (waveformEditor: WaveformEditorType) => { return {} }

    const hooks : WaveformEditorHooks = {
        useWaveformEditor,
        useWaveformEditorState,
        useWaveformEditorEvents,
    }
    return hooks
}

// Waveforn Editor Component

const WaveformEditor: FC<WaveformEditorProps> = memo((props: WaveformEditorProps) : ReactElement =>  {

    const wavesurferRef = useRef<HTMLDivElement>(null)
    const miniMapRef = useRef<HTMLDivElement | null>(null);

    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)
    const flatOptions = useMemo(() => Object.entries(props).flat(), [props])
    
    const waveformEditorContext = createContext({}) // context needed for all nested components

    const [regionsPlugin, setRegionsPlugin] = useState<RegionsPlugin>(RegionsPlugin.create())


    // Create Wavesurfer Instance
    useEffect(() => {
        if (!wavesurferRef.current) return

        const ws = WaveSurfer.create({
          ...props,
          container: wavesurferRef.current,
          plugins: [regionsPlugin],
        //   renderFunction: () => {}
        })
        setWavesurfer(ws)

        ws?.on('decode', () => {
            regionsPlugin.addRegion({
                start: 0,
                end: 8,
                content: 'Resize me',
                color: 'rgba(255, 0, 0, 0.1)',
                drag: false,
                resize: true,
            })
        })


        return () => {
          ws.destroy()
        }

      }, [props.containerRef, ...flatOptions])

    return (
        <>
            <Provider store={store}>
                <div ref={wavesurferRef}>

                </div>
            </Provider>
        </>
    )
})

export  { WaveformEditor, useWaveformEditorHooks }