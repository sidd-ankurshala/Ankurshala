import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:4043'); // Replace with backend URL
  }

  sendMessage(username: string, message: string) {
    this.socket.emit('chatMessage', { username, message });
  }

  receiveMessages(
    callback: (data: { username: string; message: string }) => void
  ) {
    this.socket.on('chatMessage', callback);
  }

  disconnect() {
    this.socket.disconnect();
  }
}
