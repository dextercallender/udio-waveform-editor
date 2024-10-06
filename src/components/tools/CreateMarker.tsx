import { FC, useState, useEffect, useRef } from 'react'
import { ToolAction, ToolParams, Tool } from '../tools/Tool'
import EventEmitter from '../EventEmitter'

enum MarkerToolActions {
    Enable = 0,
    Click = 1,
    Disable = 2
}

const MarkerToolParams: ToolParams = {
    name: "Marker Tool", 
    actions: [
        { "Enable" : MarkerToolActions.Enable },
        { "Click" : MarkerToolActions.Click },
        { "Disable" : MarkerToolActions.Disable }
    ], 
    isEnabled: false,
}

type MarkerToolEvents = {
    click: [relativeX: number, relativeY: number]
    render: []
    rendered: []
  }
  

class MarkerTool extends EventEmitter<MarkerToolEvents> {

    // TODO: Implement MarkerTool Functionality

}

// Props for MarkerToolComponent
interface MarkerToolProps {
    
}

const CreateMarkerButton : FC<MarkerToolProps> = (props: MarkerToolProps) => {

    const markerTool =  useRef(new MarkerTool())

    return (
        // markerTool.current.enabled ?
        <>
            { /* Renderer Marker Tool Button */ }
        </>
    )
}

export { CreateMarkerButton } 
