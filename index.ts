import { WebSocket } from './res/connect';
import { EventEmitter } from 'events';
import * as types from './res/parser/types';
import parser from './res/parser';

interface Options{
  url: string,
  maxRetries: number
}

export class OneBot {
  private socket: WebSocket
  
  public SocketEvent: types.SocketEvent
  public BotEvent: types.BotEvent
  
  constructor(Options: Options) {
    this.socket = new WebSocket(Options.url, Options.maxRetries);
    this.SocketEvent = new EventEmitter();
    this.BotEvent = new EventEmitter();

    this.socket.onopen = (event) => {
      this.SocketEvent.emit('connect');
    }

    this.socket.onmessage = (data) => {
      this.SocketEvent.emit('message', data);
      this.handleMessage(data);
    }
  }

  handleMessage(message: any) {
    parser(message, (type: any, data: any) => {
      this.BotEvent.emit(type, data)
    })
  }
}