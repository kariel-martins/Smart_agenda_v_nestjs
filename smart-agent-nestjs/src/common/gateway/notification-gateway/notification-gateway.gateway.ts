import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
    credentials: true,
  },
})
export class NotificationGatewayGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      client.join(userId);
    }
  }
  sendToUser(userId: string, message: string) {
    this.server.to(userId).emit("calendar:notification", {
      message,
    });
  }
}
