const express = require('express');
const bcryptjs = require('bcryptjs')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express();
const port = process.env.PORT



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(doc|docx)$/)){
            return cb(new Error('Please upload a word document'))
        }
        cb(undefined,true)
    }
})

app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

app.listen(port,()=>{
    console.log('Server is up on port '+ port)
})

// app.use((req,res,next)=>{
//     //console.log(req.method,req.path)
//     if(req.method=='GET'){
//         res.send('GET requests are desable')
//     }
//     else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Site is currenly down,Check back later!')
//     next()
// })

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async ()=>{
//     // const task = await Task.findById( "5ecd0664a61a771c587d93f3")
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
//     const user = await User.findById("5ecd022fb3a47f0f44d81f67")
//     await user.populate('myTask').execPopulate()
//     console.log(user.myTask)
// }
// main()

// const myFunc = async ()=>{
//     const token = jwt.sign({_id:'abc123'},'thisismynodecourse',{expiresIn:'2 days'})
//     console.log(token)

//     const data = jwt.verify(token,'thisismynodecourse')
//     console.log(data)
// }

// myFunc()

// const myfunc = async()=>{

//     const password = 'smb3232'
//     const hashpassword = await bcryptjs.hash(password,8)

//     console.log(password)
//     console.log(hashpassword)

//     const isMatch = await bcryptjs.compare(password,hashpassword)
//     console.log(isMatch)

// }
// myfunc()