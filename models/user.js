/**
 * Created by cpf on 2015/3/17.
 */
var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.code = user.code;
    this.dept =user.dept;
    this.kind =user.kind;
    this.position =user.position;
    this.gender =user.gender;
    this.right =user.right
};

module.exports =User;

//存储信息
User.prototype.save = function(callback){
    //数据文档
    var user ={
        name:this.name,
        password:this.password,
        code:this.code,
        dept:this.dept,
        kind:this.kind,
        position:this.dept,
        gender:this.gender,
        right:this.right
    };

    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取user集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //插入数据
            collection.insert(user,{
                safe:true
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);
                }
                callback(null,user[0]);
            });
        });
    });
};


//读取用户信息
User.get =function(code,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.findOne({
                code:code
            },function(err,user){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
                callback(null,user);//success
            });
        });
    });
};

//读取用户信息
User.list =function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name!=undefined){
                query.name=name;
            }
            //获取用户列表
            collection.find(query).toArray(function(err,users) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, users);
            });
        });
    });
};

User.delete =function(code,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.remove({
                code:code
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
            });
        });
    });
}