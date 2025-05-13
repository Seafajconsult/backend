import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient();
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        throw new WsException('Unauthorized');
      }
      
      const payload = this.jwtService.verify(token);
      
      // Attach user to client data for use in gateway
      client.data.user = payload;
      
      return true;
    } catch (error) {
      throw new WsException('Unauthorized');
    }
  }
}
