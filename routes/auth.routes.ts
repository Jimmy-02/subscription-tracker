import {Router} from 'express'

const authRouter = Router()

authRouter.post('/sign-up', (req,res)=>res.send('hi111'))

export default authRouter