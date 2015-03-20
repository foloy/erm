/**
 * Created by Administrator on 2015/3/11.
 */
var crypto = require('crypto'),
    User =require('../models/user.js');

module.exports=function(app){

    app.get('/home',checkLogin);
    app.get('/home',function(req,res){
        res.render('',{
            user:req.session.user
        });
    });

    app.get('/register', function (req, res) {
        res.render('register')
    });

    app.get('/login',checkNotLogin);
    app.get('/login', function (req, res) {
        res.render('login');
    });

    //app.post('/login',checkNotLogin);
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
            name =req.body.name,
            dept =req.body.dept,
            kind =req.body.kind,
            position =req.body.position,
            gender =req.body.gender,
            right=req.body.right,
            password='123456';
        //生成md5值
        var md5 = crypto.createHash('md5'),
            password =md5.update(password).digest('hex');
        var newUser = new User({
            name:req.body.name,
            password:password,
            code:req.body.code,
            dept:req.body.dept,
            kind:req.body.kind,
            position:req.body.position,
            gender:req.body.gender,
            right:req.body.right
        });
        //增加用户
        newUser.save(function(err,user){
            //req.session.user =user;
            req.flash('success');
            res.redirect('/user');
        });
    });

    app.get('/logout',checkLogin);
    app.get('/logout',function(req,res){
        req.session.user = null;
        req.flash('success','登出成功!');
        res.redirect('/login');
    });

    app.get('/',checkNotLogin);
    app.get('/',function(req,res){
        res.render('login',{
            success:req.flash('success').toString(),
            error:req.flash('error').toString()
        });
    });

    function checkNotLogin(req,res,next){
        if(req.session.user){
            req.flash('error','已登录!');
            res.redirect('/home');
        }
        next();
    }

    function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','未登录!');
            return res.redirect('/login');
        }
        next();
    }

    function checkRight(req,res,next){
        if(req.session.user.right==0){
            req.flash('error','用户权限不足!');
            res.redirect('/home');
        }
        next();
    }

    app.get('/equipment',checkLogin);
    app.get('/equipment',function(req,res){
        res.render('equipment',{
            user:req.session.user
        });
    });

    app.get('/user',checkLogin);
    app.get('/user',function(req,res){
        User.list(req.body.name,function(err,users){
            if(err){
                users=[];
            }
            res.render('user',{
                user:req.session.user,
                users:users
            });
        })
    })

    app.get('/user/delete',function(req,res){
        User.delete(req.body.code,function(err){
            res.render('user',{
                user:req.session.user,
                users:users
            });
        })
    })
};