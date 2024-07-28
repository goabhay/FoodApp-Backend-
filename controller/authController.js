const userModel = require('../models/userModel');
const express = require('express');
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcrypt'); 
const JWT_KEY = "alkfdasjdfkfda5f45sdf";
const multer = require('multer');


// sign up user ( we create jwt and store it as cookie at the time of first login only , not at sign up )
module.exports.signup = async function signup(req, res) {
   try {

   
      let data = req.body;
      let user = await userModel.create(data);
      if (user) {
         return res.json({
            message: "user signed up",
            data: user
         });
      } else {
         return res.json({
            message: "error"
         });
      }
   } catch (err) {
      res.json({
         message: err.message
      });
   }
};



module.exports.login = async function login(req, res) {
   try {
      let data = req.body;
     
      if (data.email) {
         let user = await userModel.findOne({ email: data.email });
         if (user) {
            let result = await bcrypt.compare(data.password, user.password); 
            if (result) {
               let uid = user['_id'];

               // jwt has three field : payload,sign,header(present by default,payload: unique id,sign:secret string+payload+header)

               let token = jwt.sign({ payload: uid }, JWT_KEY); 
                
               res.cookie('login', token, { httpOnly: true });
               return res.json({ 
                  message: "User has logged in",
                  userDetails: user
               });
              
              // res.render('dashboard', { user });
            } else {
               return res.json({
                  message: "Wrong password"
               });
            }
         } else {
            return res.json({
               message: "User Not Found"
            });
         }
      } else {
         return res.json({
            message: "Invalid credentials"
         });
      }
   } catch (err) {
      res.json({
          message: err.message
     
      });
   }
};

// to check the user role
module.exports.isAuthorised = function isAuthorised(roles) {
   return function (req, res, next) {
      if (roles.includes(req.role)) { 
         next();
      } else {
         res.status(401).json({ message: "Unauthorized" });
      }
   };
};

// protect route (it will check if the user is logged in , if it is the case then it will attach .id and .role to 'req' object
// to facillitate the following function to use it (userProfie-> uid & AllUser -> role( only admin is allowed)))
module.exports.protectRoute =async function protectRoute(req, res, next) {
   try {
      if (req.cookies.login) {
          // Check if the cookie value is "logout"
          if (req.cookies.login === "logout") {
              return res.status(401).json({ message: "User logged out" });
          }
          
          const payload = jwt.verify(req.cookies.login, process.env.JWT_SECRET_KEY);
          if (payload) {
              const user = await userModel.findById(payload.id);
              if (user) {
                  req.id = user._id;
                  req.role = user.role;
                  next();
              } else {
                  return res.status(401).json({ message: "User not found" });
              }
          } else {
              return res.status(401).json({ message: "User not verified" });
          }
      } else {
          return res.status(401).json({ message: "User not authenticated" });
      }
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};



module.exports.forgetpassword = async function forgetpassowrd(req,res){
   let {email} = req.body
   try{
      const user = await userModel.findOne({email:email})
      if(user){

      // resetToken is user to create token
      const resetToken = user.createResetToken();
      let resetPasswordLink = `${req.protocol}://${req.get('host')}/resetpassword/${req.resetToken}`;

      // send email to the user
      // done via nodemailer
      }
      else{
         return res.json({
            message:"please signup"
         })
      }
   }
   catch(err){
         return res.json({
            message:err.message
         })
   }
}


module.exports.resetpassword = async function resetpassword(req,res){
   const token = req.params.token;

   try{
      let {password,confirmPassword} = req.body
   const user = await userModel.findOne({resetToken:token})
   if(user){
      // resetPasswordHandler will save the password in db
   user.resetPasswordHandler(password,confirmPassword)
   await user.save()
   res.json({
      message:"user password changed succesfully "
   })
   }
   else{
      res.json({
         message : "user not found"
      })
   }
   }
   catch(err){
      return res.json({
         message : err.message
      })
   }
}




module.exports.logout = function logout(req,res){
   res.cookie('login',' ',{maxAge:1})
   res.json({
      message:"user logged out succesfully"
   })
   //res.redirect('/')
   
}



// Multer configuration
const storage = multer.diskStorage({
   destination: function(req, file, cb) {
      cb(null, 'public/images'); // Destination folder for uploaded images
   },
   filename: function(req, file, cb) {
      const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'profileImage-' + suffix + '.' + file.originalname.split('.').pop()); // Set filename with original extension
   }
});

const fileFilter = function(req, file, cb) {
   if (file.mimetype.startsWith('image')) {
      cb(null, true); // Accept the file if it's an image
   } else {
      cb(new Error('Not an Image! Please upload an image')); // Reject the file if it's not an image
   }
};

const upload = multer({
   storage: storage,
   fileFilter: fileFilter
});


module.exports.editHandler = async function(req, res) {
   try {
      upload.single('newPhoto')(req, res, async function(err) {
         if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: 'Invalid file' });
         } else if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
         }

         const { newName } = req.body;
         const newPhoto = req.file; // Contains the file data
            console.log(newName);
            console.log(newPhoto)
            console.log(req.id)
         // Update user's profile data with the new name and uploaded image path
         const user = await userModel.findById(req.id);
         console.log(user);
         user.name = newName;
         // if (newPhoto) {
         //    user.profileImage = newPhoto.path;
         // }
         user.profileImage = newPhoto.path;
           await user.save();
          console.log(user);

         res.status(200).json({ message: 'Profile updated successfully' });
      });
   } catch (err) {
      console.error('Error editing profile:', err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};








