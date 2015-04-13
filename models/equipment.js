/**
 * Created by Administrator on 2015/3/19.
 */
var mongodb = require('./db');

function Equipment(equipment){
    this.code =equipment.code;
    this.name =equipment.name;
    this.model =equipment.model;
    this.manufacture =equipment.manufacture;
    this.startDate =equipment.startDate;
    this.validity =equipment.validity;
    this.dept =equipment.dept;
    this.user =equipment.user;
};

module.exports =Equipment;

//存储信息
Equipment.prototype.save =function(callback) {
    //数据文档
    var equipment = {
        code: this.code,
        name: this.name,
        model: this.model,
        manufacture: this.manufacture,
        startDate: this.startDate,
        validity: this.validity,
        dept: this.dept,
        user: this.user
    };

    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取equipment集合
        db.collection('equipments', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            //插入数据
            collection.insert(equipment, {
                safe: true
            }, function (err, equipment) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, equipment[0]);
            });
        });
    });
};

//读取设备信息
Equipment.get =function(code,callback){
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('equipments',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查找code
            collection.findOne({
                code:code
            },function(err,equipment){
                mongodb.close();
                if(err){
                    return callback(err);//err
                }
                callback(null,equipment);//success
            });
        });
    });
};

//读取用户信息
Equipment.list =function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('equipments',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query={};
            if(name!=undefined){
                query.name=name;
            }
            //获取用户列表
            collection.find(query).toArray(function(err,equipments) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, equipments);
            });
        });
    });
};