// support complex message handling
// e.g. change response based on request (id_job)

const app = document.getElementById("app")

function log(msg, data = "") {
  const str = JSON.stringify(data, null, 2)
  const p = document.createElement('p')
  const out = data ? `${msg}: ${str}` : msg
  p.innerHTML = out
  app.appendChild(p)
  console.log(out)
}

// response catalog
const responseSet = new Set()

responseSet.add({
  matches: (req) => req.path === "/api/v1",
  create: (req) => ({
    Message: "HighLevelResponse",
    header: {
      id_job: req.header.id_job
    },
    data: `rofl ${Math.random()}`
  }),
  delayMs: 200,
  closeConnection: false
})

responseSet.add({
  matches: (req) => req.path === "/api/v2",
  create: (req) => ({
    Message: "HighLevelResponse",
    header: {
      id_job: req.header.id_job
    },
    data: `copter ${Math.random()}`
  }),
  delayMs: 2000,
  closeConnection: false,
})

responseSet.add({
  matches: (req) => req.path === "/api/v3",
  create: (req) => false,
  delayMs: 3000,
  closeConnection: true,
})

// server
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

async function onMessage(msg) {
  try {
    return await getResponse(msg)
  } 
  catch (e) {
    if (e.message === "Close") {
      return {
        Message: "ClosingSocket"
      }
    }
    return {
      Message: "ErrorResponse",
      reason: {
        value: 1000
      },
      description: e.message
    }
  }
}

async function run() {
  const res = await onMessage({
    Message: "HighLevelRequest",
    header: {
      id_job: 6
    },
    path: "/api/v1"
  })
  log('response', res)

  const res2 = await onMessage({
    Message: "HighLevelRequest",
    header: {
      id_job: 7
    },
    path: "/api/v2"
  })
  log('response', res2)
  
  const res3 = await onMessage({
    Message: "HighLevelRequest",
    header: {
      id_job: 8
    },
    path: "/api/v3"
  })
  log('response', res3)

  const errRes = await onMessage({})
  log('response', errRes)
}

run()
