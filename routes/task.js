const mongoose = require("mongoose");


var userSchema = mongoose.Schema({
    task:{
        type:String,
    },
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
    status: {
        type:Boolean,
        default:false
    },
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date:{
        type:Date,
        default:Date.now()
    }


});


module.exports = mongoose.model("task", userSchema);
