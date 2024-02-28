import { v4 as uuidv4 } from 'uuid';
import WebSocket, { Server } from 'ws';

export class ConnectionManager {
  private connections: Map<string, WebSocket>;
  private wsToIdMap: Map<WebSocket, string>;
  private wss: Server;
  constructor(wss: Server) {
    this.connections = new Map();
    this.wsToIdMap = new Map();
    this.wss = wss;
  }

  public addConnection(ws: WebSocket): string {
    const id = uuidv4();
    this.connections.set(id, ws);
    this.wsToIdMap.set(ws, id); // Store reverse mapping here
    console.log(`Added connection with ID: ${id}`);
    ws.on('error', (error) => {
      console.error(`WebSocket error for connection ${id}:`, error);
    });
    return id;
  }

  public removeConnection(id: string): void {
    const connection = this.connections.get(id);
    if (connection) {
      this.wsToIdMap.delete(connection); // Clean up the reverse mapping
      this.connections.delete(id);
      console.log(`Removed connection with ID: ${id}`);
      if (this.connections.size === 0) {
        console.log('No active connections remaining.');
      }
    } else {
      console.warn(`Attempted to remove a non-existent connection with ID: ${id}`);
    }
  }

  public removeConnectionByWebSocket(ws: WebSocket): void {
    const id = this.wsToIdMap.get(ws);
    if (id) {
      this.removeConnection(id); // Reuse existing removal logic
    }
  }

  public getConnection(id: string): WebSocket | undefined {
    return this.connections.get(id);
  }

  public getConnectionId(ws: WebSocket): string | undefined {
    return this.wsToIdMap.get(ws);
  }

  public getConnectionCount(): number {
    return this.connections.size;
  }

  public sendMessageToPlayers(ids: string[], message: string): void {
    ids.forEach((id) => {
      console.log('Sending message to player:', id);
      const ws = this.connections.get(id);
      if (ws) {
        ws.send(message);
      }
    });
  }

  public broadcastMessage(message: string): void {
    this.connections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    });
  }
}
