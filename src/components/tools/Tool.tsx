import { Renderer } from '../Renderer'

type ToolAction = {
    [name: string]: number // "[ToolName]" : ToolActionsEnum.Action
}

type ToolParams = {
    name: string
    actions: Array<ToolAction>
    isEnabled: boolean
}

class Tool {
    private name: string;
    private actions: Array<ToolAction>;
    public isEnabled: boolean;
    public isActive: boolean;

    constructor(params: ToolParams) {
        this.name = params.name;
        this.actions = params.actions;
        this.isEnabled = params.isEnabled;
        this.isActive = false;

        // TODO accept web audio and renderer
    }
}

type ToolMap = {
    // TODO: done like EventMap   
}

export { Tool, type ToolAction, type ToolParams, type ToolMap }