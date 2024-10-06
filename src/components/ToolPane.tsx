import { FC } from 'react'
import { Tool } from './tools/Tool'

interface ToolPaneProps {
    toolMap: Array<Tool>    // May not be an array, maybe a map
}

// Returns a rendered pane of possible tools
const ToolPane : FC<ToolPaneProps> = (props: ToolPaneProps) => {
    return (
        <>
            
        </>
    )
}

export default ToolPane