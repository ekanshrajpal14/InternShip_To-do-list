How to start the to do app => run cmd npx nodemon
open http://localhost:3000/ => on this page u will get a small msg for the next process


Important Note : the term id means you have to use mongoose default objectid which is created by mongoose by default when we create a user or task  ... Only use that id to do any of the operation where the id needed...

Important Note : the word id should be written as same 'id' and also for all the attributes like task title and etc...


All the post routes {
Note : use this only these given key names like username password task title etc...

# /register     => to create an account  ..inputs =>username and password (mandatory)

# /login        => to login an account   ..inputs =>username and password (mandatory)

# /create/task  => to create a new task  ..inputs =>task ,title and desc(description) (mandatory) 

# /edit/task    => to edit the task details   ..inputs => id (cannot be null) ,task(should be present) , title(should be present) , desc(should be present) ...should be present means u can remian them empty but that word should be in key name 

# /delete => to delete any of the task ..inputs => id(mandatory)


}

All the get routes {

# /logout => to logout the active user 
 
# /profile => its normal a profile page when user register or login they redirect to this page

# /alltask => this page show you the incomplete task

# /edit => This is a pre page before edit tha task you can get some info or msg

# /complete => This is a route to mark the task as completed ..inputs => id of the task only..

# /fetch/completetask => this is route by which you can fetch the completed task 


}

universal accessable routes {
Note : only for admin or development purpose 
# /check => for all the find all the users

# /task => for all the find all the task of every user
}