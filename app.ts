import express from "express"
import cookieParser from "cookie-parser"
import {PORT} from './config/env.js'
import authRouter from './routes/auth.routes.js'
import connectToDatabase from "./database/mongodb.js"
import errorMiddleware from "./middleware/error.middleware.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())



app.use('/api/v1/auth', authRouter)


app.use(errorMiddleware)

app.get('/', (req,res) =>{
  res.send('hi')
})

app.listen(PORT, async() => {
  console.log(`Server running on port ${PORT}`);

  await connectToDatabase();
});

export default app