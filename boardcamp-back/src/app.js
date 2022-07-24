import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import categoriesRouter from './routers/categoriesRouter.js'
import gamesRouter from './routers/gamesRouter.js'

dotenv.config()

const app = express()
app.use(cors(), express.json())

app.use(categoriesRouter)
app.use(gamesRouter)

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log('Server listening on port ', PORT)
})
