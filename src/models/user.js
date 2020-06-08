const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age:{
        type:Number,
        validate(value){
           if(value<0){
               throw new Error('age must be a positive number!')
           }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('myTask',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login!')
    }
    const isMatch = await bcryptjs.compare(password, user.password)

    if(!isMatch){
        throw new Error('Unable to login!')
    }
  
    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isDirectModified('password')){
        user.password = await bcryptjs.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
     const user = this
     await Task.deleteMany({owner:user._id})
     next()
})

const User = mongoose.model('User',userSchema)

// const me = new User({
//     name:'Ishu',
//     email:'Mondal@gamil.com ',
//     password:'ishu123',
//     age:3
// })

// me.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log('Error!',console.error)
// });

module.exports=User