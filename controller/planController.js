const planModel = require('../models/plansModel')

module.exports.createPlan = async function createPlan(req, res) {
    try {
      let data = req.body;
      const planData = await planModel.create(data);
  
      res.json({
        message: "Plan created successfully",
        data: planData
      });
    } catch (err) {
      res.json({
        message: err.message
      });
    }
  };
  

module.exports.updatePlan = async function updatePlan(req,res){
    try {
        let pid = req.params.id;
        console.log(pid);
        let dataToBeUpdated = req.body;
        let keys = Object.keys(dataToBeUpdated); // Using Object.keys() to get an array of keys
        let plan = await planModel.findById(pid);
    
        if (plan) {
            for (let key of keys) {
                plan[key] = dataToBeUpdated[key];
            }
    
            await plan.save();
            res.json({
                message: "Updated successfully"
            });
        } else {
            res.json({
                message: "No such plan exists"
            });
        }
    } catch (err) {
        res.json({
            message: err.message
        });
    }
    
}

module.exports.deletePlan = async function deletePlan(req,res){
    try {
        const pid = req.params.id;
        const deletedPlan = await planModel.findByIdAndDelete(pid);
        
    
        if (!deletedPlan) {
            return res.status(404).json({
                message: "No plan found with the given ID"
            });
        }
    
        return res.json({
            message: "Plan deleted successfully",
            data: deletedPlan
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
    
}

module.exports.getAllPlans = async function getAllPlans(req,res){
    try{
        let plans = await planModel.find() 
        if(plans){
            res.json({
                message:"all plans retrieved",
                data:plans
            })
           // res.render('plans',{plans})
        }
        else{
            res.json({
                message:"no pland found"
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.getPlan = async function getPlan(req,res){
    let pid = req.params.id;
    try{
        let plan = await planModel.findById(pid)
        if(plan){
            res.json({
                message:"plan reterived",
                data:plan
            })
        }
        else{
            res.json({
                message:"no such plan exist"
            })
        }
    }
    catch(err){
        res.status.json({
            message:err.message
        })
    }   
}

module.exports.top3plans = async function top3plans(req,res){
    try{
        const top3 = await planModel.find().sort({ratingsAverage:-1}).limit(3)
        return res.json({
            message:"top3 plans reterived",
            data:top3
        })
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

