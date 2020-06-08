require('../src/db/mongoose');
const Task = require('../src/models/task');

const delete_task = async(id)=>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count;
}

delete_task("5ec9c46b4f1be90b0c4c89c2").then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})
