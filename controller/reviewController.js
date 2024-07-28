const reviewModel = require('../models/reviewModel')
const planModel = require('../models/plansModel')


module.exports.createReview = async function createReview(req,res){
    try{
       let id = req.params.plan   // plan id
       let plan = await planModel.findById(id);   // all plans madeby user
       console.log(plan)
       let review = await reviewModel.create(req.body)           // creating the review
       console.log(review)
     console.log(plan.rating);
       plan.reviewCnt = plan.reviewCnt + 1;
        plan.rating = (plan.rating + req.body.rating)/(plan.reviewCnt)
        plan.rating = plan.rating.toFixed(2);

        console.log(plan.rating)
       await plan.save();
       res.json({
        message:"review created succesfully",
        data:review
       })
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.updateReview = async function updateReview(req,res){
    try {
        let planid = req.params.id;
        // review id from frontend
        let id = req.body.id; // review id
        let dataToBeUpdated = req.body; 
        let review = await reviewModel.findById(id);  // it will find the review
        
        let keys = [];
        
        for (let key in dataToBeUpdated) { 
            keys.push(key);
        }
        if (review) {
            for (let key of keys) { 
                if(key == id) continue;
                review[key] = dataToBeUpdated[key];
            }
            await review.save(); 
            res.json({
                message: "Updated Successfully"
            });
        } else {
            res.json({
                message: "No such review"
            });
        }
    } catch (err) {
        res.json({
            message: err.message
        });
    }
}






module.exports.deleteReview = async function deleteReview(req,res){

    try{
        const pid = req.params.id
        let plans = await planModel.findById(pid);
        let rid = req.body.id;
        let review = await reviewModel.findByIdAndDelete(rid);
        if(review){
            res.json({
                message:"deleted succesfully",
                data:review
            })
        }
        else{
            res.status(404).json({
                message:"no such review exist"
            })
        }

    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.getAllReviews = async function getAllReviews(req,res){
    try{
        let allReviews = await reviewModel.find();
       
        if(allReviews){
            res.json({
                message:"all reviews retrived",
                data:allReviews
            })
        }
        else{
            res.json({
                message:"no review exits"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.top3Reviews = async function top3Reviews(req,res){
    try{
        let top3 = await reviewModel.find().sort({ rating: -1 }).limit(3);

        if(top3){
            res.json({
                message:"top3 Reviews",
                data:top3
            })
        }
        else{
            res.json({
                message:"no reviews"
            })
        }
        
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

module.exports.getPlanReviews = async function getPlanReviews(req,res){
    try{
        const pid = req.params.id
        let review = await reviewModel.find()
        if(review){
            review = review.filter(rev=>rev.plan.id === pid)
            res.json({
                message:"review found",
                data:review
            })
            //res.render('review',{review})
        }
        else{
            res.json({
                message:"review not found"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}


