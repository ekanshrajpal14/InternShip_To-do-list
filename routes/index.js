var express = require('express');
var router = express.Router();
const userModel = require('./users');
const userTask = require("./task");
const passport = require('passport');
const localstrategy = require('passport-local');
passport.use(new localstrategy(userModel.authenticate()));
/* GET home page. */




router.get('/', function (req, res, next) {
  res.send("please create your account or login" + "\n for creating a account go to /register(post) and provide username and password in body(parser) \n To login your account go to /login(post) and provide username and password in body(parser) ");

});
// creating a user 
router.post("/register", function (req, res) {
  var newUser = new userModel({
    username: req.body.username
  })
  userModel.register(newUser, req.body.password).then(function (registeruser) {
    passport.authenticate('local')(req, res, function () {
      res.redirect("/profile")
    })

  }).catch(function (err) {
    res.send(err.message);
  })
});

// user login route
router.post('/login', passport.authenticate('local', {

  successRedirect: '/profile',
  failureRedirect: '/'
}), function (req, res) { });
// created successgully


// logout 
router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  })
});
// profile page
router.get("/profile", isLoggedIn, (req, res) => {
  res.send("Your account has been created successfully or logged in successfully\nFor creating a task go to /create/task(post) and provide 'task','title','desc' in body and use the as it is name or key in (postman)")
})

// create a new task
router.post("/create/task", isLoggedIn, async function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    if (req.body.title == undefined || req.body.task == undefined || req.body.desc == undefined) {

      res.send("Please provide all the attribute => 'task , title & desc '")
    }
    else {
      var title = "", newTask = "", desc = "";
      newTask = await req.body.task;
      desc = await req.body.desc;
      title = await req.body.title;

      if (newTask.trim() == "" || desc.trim() == "" || title.trim() == "") {
        res.send("Task or desc or title cannot be null ..please type a valid task ");
      }
      else {
        var full = {
          task: newTask,
          status: false,
          userId: user._id,
          title: title,
          desc: desc
        }
        var createdTask = await userTask.create(full);
        user.taskid.push(createdTask._id);
        await user.save();

        res.send("task is created " + createdTask + "\nTo see the all task created by you which was not completed go to  /alltask(get)  ");
      }

    }

  })
})
// see your all the task which is not completed till now
router.get("/alltask", isLoggedIn, (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).populate("taskid").then(function (user) {
    var arr = [];
    user.taskid.forEach(function (e) {
      if (e.status == false) {
        arr.push(e);
      }
    })
    res.send(arr + "\n" + " NOTE : To delete any task go to route /delete(post) and provide id attribute with name id");
  })
})

// edit pre page
router.get("/edit", isLoggedIn, (req, res) => {
  res.send("Go to /edit/task and give 'id'(mandatory) and 'task' or 'title' or 'desc'  respectively in body which u want to edit if any of that which u don't want to update so just wirte the name or key and just leave the value box blank... it will automatically skip that unchanged attribute");
})


// edit details

router.post("/edit/task", isLoggedIn, (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).populate("taskid").then(async function (user) {

    if (req.body.title == undefined || req.body.id == undefined || req.body.task == undefined || req.body.desc == undefined) {

      res.send("Please provide all the attribute => 'id , task , title & desc '")

    }
    else {

      var id = req.body.id;
      var task = req.body.task;
      var title = req.body.title;
      var desc = req.body.desc;

      if (task.trim() == "" && title.trim() == "" && desc.trim() == "") {
        res.send("All the given Value is null ..retry!!");
      }
      else {
        var idx = await user.taskid.filter((d, i) => {
          if (id == d._id) {
            return d;
          }
        });
        console.log(idx);
        if (task.trim() == "") {
          task = idx[0].task;
        }
        if (title.trim() == "") {
          title = idx[0].title;
        }
        if (desc.trim() == "") {
          desc = idx[0].desc;
        }

        userTask.findOneAndUpdate({ _id: id }, { task: task, title: title, desc: desc }).then(function (task) {
          res.send(task + "\n" + "Task has been updated \n If you want to mark any of the task completed then go to route /complete(get) and provide the id of the task in query ");
        }).catch(function (err) {
          if (err.name == "CastError") {
            res.send("Please type ID or enter the correct ID");
          }
        })
      }


    }

  })
})

// delete any task
router.post("/delete", isLoggedIn, (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    if (user.taskid.includes(req.body.id)){
      userTask.findByIdAndDelete({ _id: req.body.id }).then(async function (done) {
        res.send(done + "\nThis task has been removed .. if you want to update any of the task go to /edit(get)");
        await user.taskid.splice(user.taskid.indexOf(req.body.id), 1);
        await user.save();
      }).catch((err) => {
        if (err.name == "CastError") {
          res.send("Please type ID or enter the correct ID");
        }
      });
    }
    else{
      res.send("Please type ID or enter the correct ID");
    }
    

  });

});

// mark task as an complete
router.get("/complete", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).then(async function (user) {
    var id = 0;
    if (req.query.id == undefined) {
      res.send("u didnt pass id may be")
    }
    id = req.query.id;
    userTask.findOne({ _id: id }).then(async function (task) {
      console.log(task.userId);
      // console.log(user);
      console.log();
      if (user.taskid.includes(id)) {
        if (task.status) {
          res.send("Its already marked as completed");

        }
        else if (task.status == false) {
          task.status = true;
          await task.save();
          res.send(task + "\n" + "successfull marked as completed")
        }
      }
      else {
        res.send("something is wrong or may be id is not matched")
      }
    }).catch(function (err) {
      if (err.name == "CastError") {
        res.send("Please type ID or enter the correct ID");
      }
    })


    // if (checker[0].status == false) {
    //   var status = true;

    //   userTask.findOneAndUpdate({ _id: req.query.id }, { status: status }).then(function (task) {
    //     res.send(task + "\n" + "Completed Task");

    //   }).catch(function (err) {
    //     if (err.name == "CastError") {
    //       res.send("Please type ID or enter the correct ID");
    //     }
    //   })

    // }
    // else if (checker[0].status == true) {
    // }
    // else {
    //   res.send("Something you missed");

    // }

  });
});
// fetch all the completed task
router.get("/fetch/completetask", isLoggedIn, function (req, res) {
  userModel.findOne({ username: req.session.passport.user }).populate("taskid").then(async function (user) {
    var arr = [];
    user.taskid.forEach(function (e) {
      if (e.status == true) {
        arr.push(e);
      }
    })
    res.send(arr);
  })
})

// for admin
router.get("/check", (req, res) => {
  userModel.find().then(function (e) {
    res.send(e);
  });
});
// for admin
router.get("/task", (req, res) => {
  userTask.find().then(function (e) {
    res.send(e);
  });
});
// for check that user is login in or not
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.redirect("/");
  }
}

module.exports = router;
