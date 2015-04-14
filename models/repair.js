var mongodb = require('./db');

function Repair(repair){
    this.code =repair.code;
    this.hitchCode =repair.hitchCode;
    this.user =repair.user;
    this.time =repair.time;
    this.result =repair.result;
    this.desc =repair.desc
};

module.exports =Repair;

//存储信息
Repair.prototype.save =function(callback) {
    //数据文档
    var repair = {
        code: this.code,
        hitchCode: this.hitchCode,
        user: this.user,
        time: this.time,
        result: this.result,
        desc: this.desc
    };

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取equipment集合
        db.collection('repairs', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据
            collection.insert(repair, {
                safe: true
            }, function (err, repair) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, repair[0]);
            });
        });
    });
};

//读取设备信息
Repair.get =function(code,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('repairs',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.findOne({
                code:code
            },function(err,repair){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
                callback(null,repair);//success
            });
        });
    });
};

//读取用户信息
Repair.list =function(hitchCode,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('repairs',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(hitchCode!=undefined){
                query.hitchCode=hitchCode;
            }
            //获取用户列表
            collection.find(query).toArray(function(err,repairs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, repairs);
            });
        });
    });
};