/**
 * Created by Administrator on 2015/3/11.
 */
var crypto = require('crypto'),
    User =require('../models/user.js');

module.exports=function(app){
    app.get('/', function (req, res) {
        res.render('index')
    });
    app.get('/reg',function(req,res){
        var code = req.body.code,
            password =req.body.password;
        //生成md5值
        var md5 = crypto.createHash('md5'),
            password =md5.update(req.body.password).digest('hex');
        var newUser = new User({
            name:req.body.name,
            password:req.body.password,
            code:req.body.code
        });
        //增加用户
        newUser.save(function(err,user){
            req.session.user =user;
            req.flash('success');
            res.redirect('/');
        });
    });
    app.get('/test',function(req,res){

        res.render('index');
    })
};