import { FC } from "react"

import EventEmitter from "./EventEmitter"

// Renderer Class

type RenderEvents = {
    render: [],
    rendered: [],
    pan: [],
    zoom: [],
    clickStart: [],
    clickEnd: [],
    doubleClick: [],
    dragStart: [],
    dragMove: [],
    dragEnd: [],
}

class Renderer extends EventEmitter<RenderEvents> {

}

// Renderer Component

interface RendererProps {
    renderer: Renderer
}

const RendererComponent: FC<RendererProps>  = (props: RendererProps) => {

    return <> </>
}

export { Renderer, RendererComponent }
