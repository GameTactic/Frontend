import { ActionContext, Module } from 'vuex'
import { Tool } from '@/tools/Tool'
import { CanvasElement } from '@/types/Canvas'
import Ping from '@/tools/Ping'
import FreeDraw from '@/tools/FreeDraw'
import Erase from '@/tools/Erase'
import Circle from '@/tools/Circle'
import Line from '@/tools/Line'

export enum ToolGetters {
  ENABLED_TOOL = 'enabledTool',
  TOOLS = 'tools',
  TOOL = 'tool',
  ENABLED = 'enabled'
}

export enum ToolsAction {
  ENABLE_TOOL = 'enableTool',
  DISABLE_TOOL = 'disableTool',
  ENABLE = 'enable',
  DISABLE = 'disable',
  SET_TOOL = 'setTool',
  SET_COLOUR = 'setColour',
  SET_SIZE = 'setSize',
  SET_ENDSTYLE = 'setEndStyle',
  SET_STROKESTYLE = 'setStrokeStyle',
  SET_TEMPORARILY = 'setTemporarily'
}

export interface ToolState {
  enabledTool?: Tool;
  enabled: boolean;
  tools: Tool[];
  history: CanvasElement[];
}

export enum ToolsMutation {
  SET_ENABLED_TOOL = 'SET_ENABLED_TOOL',
  SET_DISABLED_TOOL = 'SET_DISABLED_TOOL',
  SET_ENABLED = 'SET_ENABLED',
  SET_DISABLED = 'SET_DISABLED',
  SET_TOOL = 'SET_TOOL',
  SET_COLOUR = 'SET_COLOUR',
  SET_SIZE = 'SET_SIZE',
  SET_ENDSTYLE = 'SET_ENDSTYLE',
  SET_STROKESTYLE = 'SET_STROKESTYLE',
  SET_TEMPORARILY = 'SET_TEMPORARILY'
}

type ToolActionContext = ActionContext<ToolState, {}>;

const ToolModule: Module<ToolState, {}> = {
  namespaced: true,
  state () {
    return {
      enabledTool: undefined,
      enabled: false,
      history: [],
      tools: [
        new Ping('ping', 5, '#005555'),
        new FreeDraw('freedraw', 6, '#FF0000'),
        new Erase('erase'),
        new Circle('circle', 5, '#FF0000'),
        new Line('line', 3, '#FF0000', 'line', 0, false)
      ]
    }
  },
  getters: {
    [ToolGetters.TOOLS]: state => state.tools,
    [ToolGetters.ENABLED_TOOL]: state => state.enabledTool,
    [ToolGetters.TOOL]: (state) => (name: string) => state.tools.find(tool => tool.name === name),
    [ToolGetters.ENABLED]: state => state.enabled
  },
  mutations: {
    [ToolsMutation.SET_ENABLED_TOOL] (state: ToolState, payload: string) {
      state.enabledTool = state.tools.find(tool => tool.name === payload)
    },
    [ToolsMutation.SET_DISABLED_TOOL] (state: ToolState) {
      state.enabledTool = undefined
    },
    [ToolsMutation.SET_ENABLED] (state: ToolState) {
      state.enabled = true
    },
    [ToolsMutation.SET_DISABLED] (state: ToolState) {
      state.enabled = false
    },
    [ToolsMutation.SET_TOOL] (state: ToolState, payload: Tool) {
      let foundIndex = -1
      const found = state.tools.find((tool: Tool, index: number) => {
        foundIndex = index
        return tool.name === payload.name
      })

      if (found) {
        state.tools.splice(foundIndex, 1, { ...found, ...payload })
      }
      state.enabledTool = payload
    },
    [ToolsMutation.SET_COLOUR] (state: ToolState, colour: string) {
      if (state.enabledTool) {
        state.enabledTool.colour = colour
      }
    },
    [ToolsMutation.SET_SIZE] (state: ToolState, size: number) {
      if (state.enabledTool) {
        state.enabledTool.size = size
      }
    },
    [ToolsMutation.SET_ENDSTYLE] (state: ToolState, endStyle: string) {
      if (state.enabledTool) {
        state.enabledTool.endStyle = endStyle
      }
    },
    [ToolsMutation.SET_STROKESTYLE] (state: ToolState, strokeStyle: number) {
      if (state.enabledTool) {
        state.enabledTool.strokeStyle = strokeStyle
      }
    },
    [ToolsMutation.SET_TEMPORARILY] (state: ToolState, temporarily: boolean) {
      if (state.enabledTool) {
        state.enabledTool.temporarily = temporarily
      }
    }
  },
  actions: {
    [ToolsAction.ENABLE_TOOL] (context: ToolActionContext, toolName: string) {
      context.commit(ToolsMutation.SET_ENABLED_TOOL, toolName)
    },
    [ToolsAction.DISABLE_TOOL] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_DISABLED_TOOL)
    },
    [ToolsAction.ENABLE] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_ENABLED)
    },
    [ToolsAction.DISABLE] (context: ToolActionContext) {
      context.commit(ToolsMutation.SET_DISABLED)
    },
    [ToolsAction.SET_TOOL] (context: ToolActionContext, tool: Tool) {
      context.commit(ToolsMutation.SET_TOOL, tool)
    },
    [ToolsAction.SET_COLOUR] (context: ToolActionContext, colour: string) {
      context.commit(ToolsMutation.SET_COLOUR, colour)
    },
    [ToolsAction.SET_SIZE] (context: ToolActionContext, size: number) {
      context.commit(ToolsMutation.SET_SIZE, size)
    },
    [ToolsAction.SET_ENDSTYLE] (context: ToolActionContext, endStyle: string) {
      context.commit(ToolsMutation.SET_ENDSTYLE, endStyle)
    },
    [ToolsAction.SET_STROKESTYLE] (context: ToolActionContext, strokeStyle: string) {
      context.commit(ToolsMutation.SET_STROKESTYLE, strokeStyle)
    },
    [ToolsAction.SET_TEMPORARILY] (context: ToolActionContext, temporarily: boolean) {
      context.commit(ToolsMutation.SET_TEMPORARILY, temporarily)
    }
  }
}

export default ToolModule
