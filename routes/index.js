/**
 * Created by Administrator on 2015/3/11.
 */
module.exports=function(app){
    app.get('/', function (req, res) {
        res.render('index')
    })
    app.get('/new',function(req,res){
        res.render('index')
    })
    app.get('/test',function(req,res){

        res.render('index');
    })
}