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
  create(req) {
    return {
      Message: "HighLevelResponse",
      header: {
        id_job: req.header.id_job
      },
      data: `subscribe ${Math.random()}`
    }
  },
  update(req) {
    return {
      Message: 'HighLevelUpdate',
      header: {
        id_job: req.header.id_job
      },
      data: `update ${Math.random()}`
    }
  },
  delayMs: 3000,
})

responseSet.add({
  matches: (req) => req.Message === "CancelSubscriptionRequest",
  cancel(req) {
    return {
      Message: 'CancelSubscriptionResponse',
      header: {
        id_job: req.header.id_job
      },
    }
  },
})

responseSet.add({
  matches: (req) => req.Message === "AuthRequest",
  create: (req) => false,
  delayMs: 12000,
  closeConnection: true,
})

// Map request to response

export const getResponse = async (req) => {
  for (let res of responseSet) {
    if (res.matches(req)) {
      await new Promise(
        resolve => setTimeout(
          resolve, res.delayMs ?? 10)
      )
      if (res.closeConnection) {
        throw new Error("Close")
      }
      return res 
    }
  }
  throw new Error("No matching response.")
}
