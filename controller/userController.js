const userModel = require('../models/userModel')

module.exports.getUser = async function getUser(req, res) {
    try {
        let id = req.id;
      
        let user = await userModel.findById(id);

        if (user) {
             return res.json(user);
            //res.render('dashboard',{user:{name:user.name,img:user.img}})
        } else {
            return res.json({
                message: "User not found"
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports.updateUser = async function updateUser(req, res) {
    try {
        const userId = req.params.id; // Assuming user ID is in the URL parameter
        const userDataToUpdate = req.body;

        const user = await userModel.findById(userId);
        
        if (user) {
            // Exclude fields that should not be updated directly (like confirmPassword)
            // delete userDataToUpdate.confirmPassword;

            // Update user fields based on the data received
            for (let key in userDataToUpdate) {
                user[key] = userDataToUpdate[key];
            }
           

             const updatedUser = await user.save();
            res.json({
                message: "User updated successfully",
                data: updatedUser
            });
        } else {
            res.status(404).json({
                message: "User not found"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};


module.exports.deleteUser = async function deleteUser(req, res) {
    try{
        let id = req.params.id;
   let user =  await userModel.findByIdAndDelete(id);
   if(!user){
    res.json({
        message:"user not foun"
    })
   }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
   

}

module.exports.getAllUser =  async function getAllUser(req, res) {
    try {
       let users = await userModel.find();
       if(users){
        res.json({
            message:"users retrived",
            data:users
        })
       }
       else{
        res.json({
            message:"no user exist"
        })
       }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// module.exports.updateProfileImage = function updateProfileImage(req,res){
//     console.log(req.body)
//     res.json({
//         message:"file uploaded succesfully"
//     })
// }









