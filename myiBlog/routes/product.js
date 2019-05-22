const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const product = require('../models/product');
const login=require('../middlewares/login')

router.get('/delete/:id', login,function (req, res) {
   
    //根据id查询数据库  删除这个数据
    product.findByIdAndRemove(req.params.id, function (err) {
        if (err) throw err;
        console.log("数据库删除成功");
        
        res.redirect("/add/list");
    })
})
router.get('/update/:id', login,function (req, res) {
    
    product.findById(req.params.id, function (err, result) {
        if (err) throw err;
        
        res.render("update", {
            data: result
        })
    })
})

router.post('/update/:id', function (req, res) {
    //解析数据
    const form = new formidable.IncomingForm();
    //保持上传文件扩展名不变
    form.keepExtensions = true;
    //转换请求里的表单数据
    form.parse(req, function (err, fields, files) {
        if (err) throw err;
        //组装数据
        var obj = {
            ...fields,
            updateAt: new Date() 
        }
      
        product.findByIdAndUpdate(req.params.id,obj,function(err){
            if(err) throw err;
            console.log("更新成功");
           
            res.redirect('/add/list');
        })
    })
})
module.exports = router;