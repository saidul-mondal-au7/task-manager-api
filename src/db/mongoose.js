const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})




// const task = new Task({
//     description:'andrew rocking!',
//     // completed:false
// })

// task.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log('Error!',error)
// })