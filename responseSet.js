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
  matches: (req) => req.Message === "AuthRequest",
  create: (req) => false,
  delayMs: 3000,
  closeConnection: true,
})

export { responseSet }
