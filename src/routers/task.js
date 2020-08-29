const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/task',auth,async(req,res)=>{
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//get  task?completed=true/false
//get/task?limit=10&skip=20
//get/task?sortBy=createdAt:desc
router.get('/task',auth,async(req,res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{
        // const task = await Task.find({owner:req.body._id})
        await req.user.populate({
            path:'myTask',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.myTask)
    }catch(e){
        res.status(500).send(e)
    }
})

// router.get('/task/:id',async(req,res)=>{

//     try{
//         const task = await Task.findById(req.params.id)
//         if(!task){
//             res.status(404).send()
//         }
//         res.send(task)
//     }catch(e){
//         res.status(500).send(e)
//     }
    
    // Task.findById(req.params.id).then((result)=>{
    //     if(!result){
    //         res.send(404).send()
    //     }
    //     res.send(result)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
// })
router.get('/task/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/task/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['description','completed']

    const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }
    try{
        const update_task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        //const update_task = await Task.findById(req.params.id)
        // updates.forEach((update)=>update_task[update]=req.body[update])
        // await update_task.save()
        // const update_task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!update_task){
            return res.status(404).send()
        }
        updates.forEach((update)=>update_task[update]=req.body[update])
        await update_task.save()
        res.send(update_task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/task/:id',auth,async(req,res)=>{
    try{
        //const update_task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findByIdAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})


module.exports=router