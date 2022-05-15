import { WebSocket, Server } from "https://unpkg.com/mock-socket@9.1.3/dist/mock-socket.es.mjs"
import { responseSet } from './responseSet.js'

const app = document.getElementById("app")

// Logger

function log(msg, data = "") {
  const str = JSON.stringify(data, null, 2)
  const p = document.createElement('p')
  const out = data ? `${msg}: ${str}` : msg
  p.innerHTML = out
  app.appendChild(p)
}

// Map request to response

async function getResponse(req) {
  for (let res of responseSet) {
    if (res.matches(req)) {
      await new Promise(
        resolve => setTimeout(
          resolve, res.delayMs)
      )
      if (res.closeConnection) {
        throw new Error("Close")
      }
      return res.create(req)
    }
  }
  throw new Error("No matching response.")
}

// Mock WebSocket Server

const wsUrl = 'ws://localhost:8080'
const server = new Server(wsUrl)

server.on('connection', async socket => {
  console.log('Client connected')
  socket.on('message', async (msg) => { 
    const send = (data) => socket.send(JSON.stringify(data))
    const obj = JSON.parse(msg)
    try {
      send(await getResponse(obj)) 
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
})

// WebSocket Client

const client = new WebSocket(wsUrl)

client.onmessage = (event) => {
  const data = JSON.parse(event.data)
  log('response', data)
}

client.onopen = async () => {
  const send = (data) => client.send(JSON.stringify(data))
  
  // Error: No matching response
  send({})
  
  // Rofl
  send({
    Message: "HighLevelRequest",
    header: {
      id_job: 6
    },
    path: "/api/v1"
  })

  // Copter
  send({
    Message: "HighLevelRequest",
    header: {
      id_job: 7
    },
    path: "/api/v2"
  })
  
  // Close connection after failed auth
  send({
    Message: "AuthRequest",
    header: {
      id_job: 8
    },
  })
}

client.onclose = () => console.log('Client WebSocket closed')
