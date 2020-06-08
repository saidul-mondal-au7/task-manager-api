const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeMail,sendGoodbyMail} = require('../emails/account')
const router = new express.Router()

router.post('/users',async(req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        sendWelcomeMail(user.email,user.name)
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

router.get('/users', async(req,res)=>{
    try{
        const user = await User.find({})
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/users/me', auth, async(req,res)=>{
    res.send(req.user)
})
// router.get('/users/:id',async(req,res)=>{
//     const _id = req.params.id
//     try{
//         const user = await User.findById(_id)
//         if(!user){
//             res.status(404).send()
//         }
//         res.send(user)
//     }catch(e){
//         res.status(500).send(e)
//     }
// })

// router.patch('/users/:id',async(req,res)=>{
//     const updates = Object.keys(req.body)
//     const allowedUpdate = ['name','email','password','age']
//     const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

//     if(!isValidOperation){
//         return res.status(400).send({error:'Invalid updates!'})
//     }
//     try{
//         const update_user = await User.findById(req.params.id)
//         updates.forEach((update)=>update_user[update]=req.body[update])
//         await update_user.save()
//         //const update_user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
//         if(!update_user){
//             return res.status(404).send()
//         }
//         res.send(update_user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.patch('/users/me',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }
    try{
        
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

// router.delete('/users/:id',async(req,res)=>{
//     try{
//         const update_user = await User.findByIdAndDelete(req.params.id)
//         if(!update_user){
//             return res.status(404).send()
//         }
//         res.send(update_user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

router.delete('/users/me',auth,async(req,res)=>{
    try{
        await req.user.remove()
        sendGoodbyMail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

// router.delete('/users/me',async(req,res)=>{
//     try{
//         await req.user.remove()
//         res.send(req.user)
//     }catch(e){
//         res.status(400).send(e)
//     }
// })

const upload = multer({
    //dest:'avatars',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload jpg,jpeg or png file only!'))
        }
        cb(undefined,true)
    }
})


router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.send(404).send()
    }
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
module.exports=router