
import express from 'express'
import { login, logout, signUp } from '../controllers/authController.js'


const authRouter = express.Router()




authRouter.post('/signup-user', signUp  )
authRouter.post('/login-user' , login )
authRouter.post('/logout-user', logout )



export default authRouter





