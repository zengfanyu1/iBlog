const express = require('express');
const router = express.Router();
const path = require('path');
const formidable = require('formidable');
const product=require("../models/product");
const login=require('../middlewares/login');//判断权限中间件

//添加页面输出
router.get("/", login,function (req, res) {
    res.render("add");
});

//添加上传响应
router.post('/', function (req, res) {
    //创建formidable.IncomingForm对象
    const form = new formidable.IncomingForm();
    //上传的文件保持原文件的名字
    form.keepExtensions = true;
    //转换请求中所包含的表单数据，callback会包含所有字段域和文件信息
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        //保存数据放到数据库
        var obj = {//组装数据
            ...fields,
        }
        var productIstance=new product(obj);//集合的实例 
        productIstance.save();//保存数据
        res.redirect('/add/list');
        
        
    })
})

router.get('/list', function (req, res) {
    //获取数据库数据
    product.find({},function(err,results){
        if(err) throw err;
        res.render('list', {arr:results})
    })
})

module.exports = router;