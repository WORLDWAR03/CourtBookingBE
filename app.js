var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const authRouter= require('./routes/authRouter')
const userRouter=require('./routes/userRouter')
const paymentRouter=require('./routes/paymentRouter')
var venderRouter = require('./routes/venderrouter');
const connectDataBase = require('./config/dbConfig');
const cors=require("cors");
require('dotenv').config()

var app = express();



connectDataBase()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


const corsOptions ={
  origin:'*', 
  credentials:true,           
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





app.use('/auth', authRouter);
app.use('/vender', venderRouter);
app.use('/users', userRouter);
app.use('/payment', paymentRouter);
// app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
