import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import categoriesRouter from './routers/categoriesRouter.js'

dotenv.config()

const app = express()
app.use(cors(), express.json())

app.use(categoriesRouter)

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log('Server listening on port ', PORT)
})
