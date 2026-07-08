import mongoose from "mongoose";
import validator from 'validator'

import jwt from 'jsonwebtoken'


const userSchema = new mongoose.Schema({

name :{
    type : String,
    required :  true
},

email : {
    type : String,
    required :  true,
    unique : true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Email is Invalid')
        }
    }

},

password :{
    type : String,
    required :  true,
    select :false,
    validate(value){
        if(!validator.isStrongPassword(value)){
          throw new Error('Password is Invalid',400)
        }
    }

},

assistantName :{
    type : String,
},

assistantImg :{
    type : String,
},

history : {
    type :String
}


}, {timestamps : true} )





userSchema.methods.getJWTToken = function (){


const token = jwt.sign({id : this._id}, 
    process.env.JWT_SECRET, {expiresIn : '7d'}) 

return token

}


export default mongoose.model('User', userSchema)


