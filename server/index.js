import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import ConnectDB from './src/config/DB.js'
import cors from 'cors'
import dns from 'dns'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { errorHandler } from './src/utils/CustomError.js'
import cloudinaryConnect from './src/config/Cloudinary.js'
import authRouter from './src/routes/authRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import geminiResponse from './src/utils/gemini.js'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(morgan('combined'))


app.use(cors({
    origin : 'http://localhost:5173',
    credentials: true

}))




app.use('/api', authRouter )
app.use('/api' , userRouter )





dns.setServers([
 '1.1.1.1',
 '8.8.8.8'

])

app.use(errorHandler)


const PORT = process.env.PORT
cloudinaryConnect()
ConnectDB()
.then(()=>{
    console.log('DB is connected')
    app.listen(PORT,()=>{
        console.log('Server is running on', PORT)
        
    })
    
}).catch((error)=>{
        console.log('DB Connection is failed',error)

})
