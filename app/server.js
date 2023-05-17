import express from 'express'
import timeout from './timeout.js'
import middleware, { setup } from './prometheus.js'

const start = async () => {
  await setup()
  const web = express()
  web.use(middleware)
  web.get('/test', async (_, res) => {
    await timeout(Math.random() * 1e3)
    res.status(200).send('🚀')
  })
  web.listen(5001)
}

start()