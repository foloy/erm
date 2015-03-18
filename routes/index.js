/**
 * Created by Administrator on 2015/3/11.
 */
var crypto = require('crypto'),
    User =require('../models/user.js');

module.exports=function(app){
    app.get('/home',function(req,res){
        res.render('index',{
            user:req.session.user,
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    app.get('/register', function (req, res) {
        res.render('register')
    });

    app.get('/login',checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login');
    });

    /*app.post('/login',checkNotLogin);*/
    app.post('/login', function (req, res) {
        var md5=crypto.createHash('md5'),
            password = md5.update(req.body.password).digest('hex');
        User.get(req.body.code,function(err,user){
            //检查用户
            if(!user){
                req.flash('error','用户名密码错误！');
                return res.redirect('/login');
            }
            //查询密码
            if(user.password!=password){
                req.flash('error','用户名密码错误！');
                return res.redirect('/login');
            }
            //存入session
            req.session.user =user;
            req.flash('success','登录成功!');
            res.redirect('/home');
        });
    });

    app.post('/reg',function(req,res){
        var code = req.body.code,
            name =req.body.name;
        //生成md5值
        var md5 = crypto.createHash('md5'),
            password =md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name:req.body.name,
            password:password,
            code:req.body.code
        });
        //增加用户
        newUser.save(function(err,user){
            req.session.user =user;
            req.flash('success');
            res.redirect('/login');
        });
    });

    app.get('logout',checkLogin);
    app.get('/logout',function(req,res){
        req.session.user =null;
        req.flash('success','登出成功!');
        res.redirect('/login');
    });

    app.get('/test',function(req,res){
        res.render('index');
    });

    function checkNotLogin(req,res,next){
        if(req.session.user){
            req.flash('error','已登录!');
            res.redirect('back');
        }
        next();
    }

    function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录!');
            res.redirect('/login');
        }
        next();
    }
};