const express = require('express');
const multer = require('multer')
const app = express();
const userRouter = express.Router();
const { getUser, getAllUser, updateUser, deleteUser } = require('../controller/userController');
const { protectRoute, isAuthorised , signup, login,logout,forgetpassword,resetpassword, editHandler} = require('../controller/authController');


userRouter.route('/')
.get((req,res)=>{
  res.render('getStarted')
})

// user's options


// user interaction
userRouter.route('/signup')
  .post(signup);

userRouter.route('/login')
  .post(login);



userRouter.route('/forgetpassword')
.post(forgetpassword)



// profile page
userRouter.use(protectRoute); // Apply protectRoute middleware for all routes defined after this line


userRouter.route('/:id')
.patch(updateUser)
.delete(deleteUser);

userRouter.route('/userProfile')
  .get(getUser);

userRouter.route('/resetpassword/:token')
.post(resetpassword)

userRouter.route('/logout')
.get(logout)


// admin specific function
userRouter.use(isAuthorised(['admin'])); // Apply isAuthorised middleware for all routes defined after this line
userRouter.route('/getAllUser')
  .get(getAllUser);




userRouter.route('/editProfile')
.post(editHandler)



// // Mount userRouter at '/user'
// app.use('/user', userRouter);

module.exports = userRouter;
