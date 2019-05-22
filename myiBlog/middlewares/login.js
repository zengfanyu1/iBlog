//判断登录权限的
module.exports = function (req, res, next) {

    if(req.session.username&&req.session.password){
        //登录成功
        next()
    }else{
        //登录失败
        res.redirect('/login');
    }
    
}