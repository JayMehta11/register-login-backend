const mongoose = require('mongoose');
const url = process.env.Database
mongoose.connect(url,(err)=>{
    if (err){
        console.log('Some error occured',err)
    }
    else{
        console.log("Data base connected successfully")
    }

})

require('./user.Model');
