import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import AppError, { catchAsync } from '../utils/CustomError.js'




export const authUser = catchAsync(async(req , res , next)=>{


const {token} = req.cookies

if(!token){
    throw new AppError('Token is required',400)
}

const decode = jwt.verify(token, process.env.JWT_SECRET)

if(!decode){
    throw new AppError('Token is invalid or expired',400)
}

const user = await User.findById(decode.id)

if (!user) {
    throw new AppError("User not found", 404)
}

  req.user = user 

next()


})










