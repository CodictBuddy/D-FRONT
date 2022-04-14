import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {}

  loginUserSocket(userId) {
    if (!userId) return;
    this.socket.connect();
    this.socket.emit('enter-room', { room_id: userId });
  }
}
