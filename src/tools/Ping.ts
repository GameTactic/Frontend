import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import throttle from 'lodash.throttle'
import uuid from 'uuid'
import PingCreator from '@/tools/shapes/PingCreator'

export default class Ping implements Tool {
  private pingCreator: PingCreator
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string) {
    this.pingCreator = new PingCreator(this.size, this.colour)
  }

  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.triggerPing(e, canvasElement, layer, socket)
  }

  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.triggerPing(e, canvasElement, layer, socket)
  }, 75)

  mouseUpAction = (): void => {
    // mouse up action
  }

  triggerPing = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.tool = {
      name: this.name,
      colour: this.colour,
      size: this.size
    }
    this.pingCreator.create(canvasElement, layer)
    this.sendToWebSocket(canvasElement, socket)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.pingCreator = new PingCreator(
      canvasElement.tool.size,
      canvasElement.tool.colour
    )
    this.pingCreator.create(canvasElement, layer)
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'ping',
        colour: this.colour,
        size: this.size
      },
      temporary: true,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
