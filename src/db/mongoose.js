const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindAndModify:false
})
