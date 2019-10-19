// This example depends on hello.js to be running in another process.
// This Node is a socket that replies to hello.js with "world!" when it receives "Hello".
import { Client } from 'veza';

const node = new Client('world2')
  .on('error', (error, client) => console.error(`[IPC] Error from ${client.name}:`, error))
  .on('disconnect', client => console.error(`[IPC] Disconnected from ${client.name}`))
  .on('ready', async client => {
    console.log(`[IPC] Connected to: ${client.name}`);
    try {
      const result = await client.send('Hello', { timeout: 5000 });
      console.log(`[TEST] Hello ${result}`);
    } catch (error) {
      console.error(`[TEST] Client send errored: ${error}`);
    }
  });

node.connectTo('/var/ipc/drakolis').catch(error => console.error('[IPC] Disconnected!', error));
