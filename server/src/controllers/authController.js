import User from '../models/userModel.js'
import AppError, { catchAsync } from '../utils/CustomError.js'
import bcrypt from 'bcrypt'
import validator from 'validator'


export const signUp = catchAsync(async(req , res , next)=>{


const {name , email , password} = req.body

if(!name || !email || !password){
    throw new AppError('All Fields are required',400)
}

const ExistingUser = await User.findOne({email})

if(ExistingUser){
    throw new AppError('User already exist with same email',400)
}

if(!validator.isStrongPassword(password)){
    throw new AppError('Password must contain 1Caps, 1Lows, 1Symbol, 1no., morethan 8 characters')
}

const hashPass = await bcrypt.hash(password, 12)

const user = await User.create({
    name : name,
    email : email,
    password : hashPass
})


const token = user.getJWTToken()

res.cookie('token', token , {
    
httpOnly: true,
secure : true,
sameSite : 'none',
maxAge: 7*24*60*60*1000

})

return res.status(201).json({
    success : true,
    message : "new User is created",
    data:user
})


})


export const login = catchAsync(async(req,res,next)=>{

    const {email , password} = req.body

if( !email || !password){
    throw new AppError('Fields are Invalid',400)
}

const user = await User.findOne({email}).select('+password')

if(!user){
    throw new AppError('Invalid Credentials',400)
}

const checkPass = await bcrypt.compare(password , user.password)

if(!checkPass){
  throw new AppError('Invalid Credentials',400)
}

user.password = undefined

const token = user.getJWTToken()

res.cookie('token', token, {

httpOnly: true,
secure : true,
sameSite : 'none',
maxAge: 7*24*60*60*1000


} )

res.status(200).json({
    success :true,
    message: 'User Loggedin Successfully',
    data : user
})


})


export const logout = catchAsync(async(req , res , next)=>{

res.cookie('token', null , {maxAge : Date.now(0)} )

    res.status(200).json({
        success : true,
        message : 'User logged out successfully'
    })


})







