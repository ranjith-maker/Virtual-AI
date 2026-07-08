
import express from 'express'
import { askToAssistant, getProfile, updateAssistant } from '../controllers/userController.js'
import { authUser } from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'



const userRouter = express.Router()


userRouter.get('/view-profile' , authUser, getProfile )
userRouter.post('/update-assistant', authUser, upload.single('image'), updateAssistant  )
userRouter.post('/asktoai', authUser, askToAssistant )






export default userRouter
