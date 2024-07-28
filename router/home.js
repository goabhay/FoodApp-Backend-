const express = require('express')
const frontRouter = express.Router()

frontRouter.route('/')
.get((req,res)=>{
    res.render('home');
})


module.exports = frontRouter