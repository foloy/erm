var mongodb = require('./db');

function Hitch(hitch){
    this.code =hitch.code;
    this.name =hitch.name;
    this.user =hitch.user;
    this.time =hitch.time;
    this.desc =hitch.desc
};

module.exports =Hitch;

//存储信息
Hitch.prototype.save =function(callback) {
    //数据文档
    var equipment = {
        code: this.code,
        name: this.name,
        user: this.user,
        time: this.time,
        desc: this.desc
    };

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取equipment集合
        db.collection('hitches', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据
            collection.insert(hitch, {
                safe: true
            }, function (err, hitch) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, hitch[0]);
            });
        });
    });
};

//读取设备信息
Hitch.get =function(code,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('hitches',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.findOne({
                code:code
            },function(err,hitch){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
                callback(null,hitch);//success
            });
        });
    });
};

//读取用户信息
Hitch.list =function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('hitches',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name!=undefined){
                query.name=name;
            }
            //获取用户列表
            collection.find(query).toArray(function(err,hitches) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, hitches);
            });
        });
    });
};