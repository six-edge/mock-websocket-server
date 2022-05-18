import { WebSocket } from "https://unpkg.com/mock-socket@9.1.3/dist/mock-socket.es.mjs"
import { log } from './logger.js'

// WebSocket Client

export async function createClient(wsUrl = '') {
  const client = new WebSocket(wsUrl)

  client.onopen = () => Promise.resolve()
  client.onmessage = (event) => log('response', JSON.parse(event.data))
  client.onerror = (e) => Promise.reject('Something failed.', e)
  client.onclose = () => console.log('Client WebSocket closed')

  const send = (data) => client.send(JSON.stringify(data))

  return { client, send }
}
