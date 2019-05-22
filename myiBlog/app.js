var express = require('express');
var app = express();
var path = require('path');
const mongoose = require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const MongoStore=require('connect-mongo')(session);
const moment = require('moment');
app.locals.moment = moment;

//ejs模板设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
//引入静态资源
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser());//post req.body 处理Json编码的数据
app.use(cookieParser("123"));
app.use(session({
  secret:"123",
  name:"sessionId",
  cookie:{maxAge:60*1000},
  rolling:true,
  store:new MongoStore({
    url:"mongodb://localhost:27017/Myiblog"  //session保存到指定的数据库
  })
}));

//路由控制  根据不同功能划分模块
app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/register'));
app.use('/add', require('./routes/add'));
app.use('/product', require('./routes/product'));

//链接数据库
mongoose.connect("mongodb://localhost/Myiblog", {
  useNewUrlParser: true,
  useFindAndModify: false
});
//提示数据库连接成功
const con = mongoose.connection;
con.on('open', function () {
  console.log("数据库连接成功");
})

//退出程序
app.get('/loginout',function(req,res){
  req.session.destroy(function(err){
    if(err) throw err;
    console.log("退出成功");
  })
  //重定向登录
  res.redirect('/login');
})

// error handler
app.use(function (err, req, res, next) {
  res.send('error');
});
app.listen(8000);
//模块暴露
module.exports = app;