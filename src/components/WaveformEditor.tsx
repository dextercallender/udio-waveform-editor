import { FC, ReactElement, useState, createContext } from 'react';
import {Renderer, RendererComponent} from './Renderer'
import { Provider } from 'react-redux'
import store from './eventsStore/EventsStore';
import { Tool } from './tools/Tool'

// type WaveformEditor

interface WaveformEditorProps {
    
    // styles
    
}

// what f

type WaveFormEditorType = {
    playhead?: number
    toolMap: Array<Tool>
    renderers: Renderer     // TODO: support multiple renderers? cascading tracks/takes? 
    // webaudio: 
}

// Component
// returns a rendered component

const WaveformEditor: FC<WaveformEditorProps> = (props: WaveformEditorProps) : ReactElement =>  {
    
    const waveformEditorContext = createContext({}) // context needed for all nested components

     // playhead 

    // Event Listeners
    
    return (
        <>
            <Provider store={store}>
                <></>
            </Provider>
        </>
    )
}

export default WaveformEditor

// Hooks

type WaveformEditorHooks = {

}

const useWaveformEditor = (WaveformEditor: WaveFormEditorType) : WaveformEditorHooks => {
    const hooks : WaveformEditorHooks = {

    }
    return hooks
}


