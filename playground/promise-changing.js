require('../src/db/mongoose');
const User = require('../src/models/user');

// User.findByIdAndUpdate("5ec95aea852e1515bc9eddb3",{age:31}).then((result)=>{
//     console.log(result)
//     return User.countDocuments({age:1})
// }).then((result2)=>{
//     console.log(result2)
// }).catch((e)=>{
//     console.log(e)
// })

const update = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count = await User.countDocuments({age})
    return count
}

update("5ec9c68aa5db071490d755d1",26).then((res)=>{
    console.log(res)
}).catch((e)=>{
    console.log(e)
})