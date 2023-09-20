const mongoose = require("mongoose");
mongoose.set('strictQuery', false)
mongoose.connect("mongodb://localhost/internshala").then(function () {
  console.log("connected to DB "); 
});

const plm = require("passport-local-mongoose");

var userSchema = mongoose.Schema({
  username: {
    type:String,
    required:true,
    unique:true,
  },
  password: String,
  taskid: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "task"
  }],
  

});

userSchema.plugin(plm);

module.exports = mongoose.model("user", userSchema);
