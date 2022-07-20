import pg from 'pg'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

dotenv.config()

const { Pool } = pg

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const app = express()
app.use(cors(), express.json())

const PORT = process.env.PORT || 4001
app.listen(PORT, () => {
  console.log('Server listening on port ', PORT)
})
