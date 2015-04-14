var mongodb = require('./db');

function Transfer(transfer){
    this.code =transfer.code;
    this.fromDept =transfer.fromDept;
    this.toDept =transfer.toDept;
    this.user =transfer.user;
    this.time =transfer.time
};

module.exports =Transfer;

//存储信息
Transfer.prototype.save =function(callback) {
    //数据文档
    var transfer = {
        code: this.code,
        fromDept: this.fromDept,
        toDept: this.toDept,
        user: this.user,
        time: this.time
    };

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取transfer集合
        db.collection('transfers', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据
            collection.insert(transfer, {
                safe: true
            }, function (err, transfer) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, transfer[0]);
            });
        });
    });
};

//读取调拨设备信息
Transfer.get =function(code,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('transfers',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.findOne({
                code:code
            },function(err,transfer){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
                callback(null,transfer);//success
            });
        });
    });
};

//读取调拨设备信息
Transfer.list =function(code,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('transfers',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(code!=undefined){
                query.code=code;
            }
            //获取用户列表
            collection.find(query).toArray(function(err,transfers) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, transfers);
            });
        });
    });
};