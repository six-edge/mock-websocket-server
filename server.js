import { Server } from "https://unpkg.com/mock-socket@9.1.3/dist/mock-socket.es.mjs"
import { getResponse } from './responseSet.js'
import { log } from './logger.js'

// Mock WebSocket Server

export function createServer(wsUrl = '') {
  const server = new Server(wsUrl)
  const subscriptions = new Map()
  
  server.on('connection', async socket => {
    console.log('Client connected')
    socket.on('message', async (msg) => {
      const send = (data) => socket.send(JSON.stringify(data))
      const req = JSON.parse(msg)
      try {
        const res = await getResponse(req)
        const subscribe = req?.header?.subscribe
        const jobId = req?.header?.id_job
        const msgName = req?.Message
        if (subscribe && jobId) {
          const subId = setInterval(() => send(res.update(req)), res.delayMs)
          subscriptions.set(jobId, subId)
          send(res.create(req))
          return
        }
        if (msgName === 'CancelSubscriptionRequest') {
          const subId = subscriptions.get(jobId)
          clearInterval(subId)
          send(res.cancel(req))
          return
        }
        send(res.create(req))
      }
      catch (e) {
        if (e.message === "Close") {
          console.log('Server closing socket')
          return socket.close()
        }
        send({
          Message: "ErrorResponse",
          reason: {
            value: 1000
          },
          description: e.message
        })
      }
    })
    
    server.on('close', () => {
      console.log('Server shutting down. Clearing subcriptions.')
      for (let subId of subscriptions.values()) {
        clearInterval(subId)
      }
    })
  })
  
  return server
}
