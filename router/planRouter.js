const express = require('express');
const planRouter = express.Router();
const { isAuthorised, protectRoute } = require('../controller/authController');
const { createPlan, updatePlan, deletePlan, getAllPlans, getPlan } = require('../controller/planController');




// all plans
planRouter.route('/allPlans')
.get(getAllPlans);

// own plan -> logged in necessary
planRouter.use(protectRoute); 
planRouter.route('/plan/:id')
.get(getPlan);

// admin and restaurant owner can perform crud on plans
planRouter.use(isAuthorised('admin', 'restaurantowner')); // Fixed the typo here
planRouter.route('/crud')
.post(createPlan)


planRouter.route('/crud/:id')
.delete(deletePlan)
.patch(updatePlan);

module.exports = planRouter;


