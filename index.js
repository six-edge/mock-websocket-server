import { createServer } from './server.js'
import { createClient } from './client.js'

const wsUrl = 'ws://localhost:8080'

const server = createServer(wsUrl)
const { send } = await createClient(wsUrl)

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

// Subscribe
send({
  Message: "HighLevelRequest",
  header: {
    id_job: 8,
    subscribe: true
  },
  path: "/api/v3"
})

const unsubscribe = () => send({
  Message: "CancelSubscriptionRequest",
  header: {
    id_job: 8,
  },
})

setTimeout(unsubscribe, 10000)

// Close connection after failed auth
send({
  Message: "AuthRequest"
})
