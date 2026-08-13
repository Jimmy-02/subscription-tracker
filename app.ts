import express from "express"
import {PORT} from './config/env.js'
import authRouter from './routes/auth.routes.js'
import connectToDatabase from "./database/mongodb.js"
import errorMiddleware from "./middleware/error.middleware.js"

const app = express()




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