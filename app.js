const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const  userRouter  = require('./router/userRouter'); 
const homeRouter = require('./router/home')
const cookieParser  = require('cookie-parser')
const planRouter = require('./router/planRouter')
const reviewRouter = require('./router/reviewRouter')
const app = express();
const port = 3000;


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.use(express.static('./public'));
mongoose.connect("mongodb://localhost:27017/FoodApp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use('/',homeRouter);
app.use('/user',userRouter);
app.use('/plans',planRouter)
app.use('/review',reviewRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

