import { describe, expect, it, beforeAll, afterAll, jest, beforeEach } from '@jest/globals';
import { Server } from 'ws';
import { ConnectionManager } from '../src/Connection/ConnectionManager';

// Assuming WebSocket is imported or globally available for the mock client connection
import WebSocket from 'ws';

let mockServer: Server;
let connectionManager: ConnectionManager;

beforeAll((done) => {
  mockServer = new Server({ port: 12345 });
  connectionManager = new ConnectionManager(mockServer);
  mockServer.on('listening', done);
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  mockServer.close();
});

beforeEach(() => {
  connectionManager = new ConnectionManager(mockServer);
});

describe('ConnectionManager', () => {
  it('adds and retrieves a connection', (done) => {
    const ws = new WebSocket('ws://localhost:12345');
    ws.on('open', () => {
      const id = connectionManager.addConnection(ws);
      expect(connectionManager.getConnection(id)).toBe(ws);
      ws.close();
      done();
    });
  });

  it('removes a connection', (done) => {
    const ws = new WebSocket('ws://localhost:12345');
    ws.on('open', () => {
      const id = connectionManager.addConnection(ws);
      connectionManager.removeConnection(id);
      expect(connectionManager.getConnection(id)).toBeUndefined();
      ws.close();
      done();
    });
  });

  it('returns the connection count', (done) => {
    // Create two WebSocket connections in parallel
    const ws1 = new WebSocket('ws://localhost:12345');
    const ws2 = new WebSocket('ws://localhost:12345');

    Promise.all([
      new Promise<void>((resolve) => ws1.on('open', resolve)),
      new Promise<void>((resolve) => ws2.on('open', resolve))
    ])
      .then(() => {
        connectionManager.addConnection(ws1);
        connectionManager.addConnection(ws2);

        expect(connectionManager.getConnectionCount()).toBe(2);

        // Clean up
        ws1.close();
        ws2.close();
        done();
      })
      .catch((error) => {
        console.error('WebSocket connection error:', error);
        ws1.close();
        ws2.close();
        done(error);
      });
  });
});
