var express=require("express");
var http=express();
var bodyParser=require("body-parser");
var adminRouter=require("./router/admin");
var apiRouter=require("./router/api");
http.listen(8080,function(){
	console.log("开启成功，端口号：8080");
})
http.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin","*");
	next();
})
http.use(bodyParser.urlencoded({extended:false}));
http.use("/admin",adminRouter)
http.use("/api",apiRouter);
http.all("*",function(req,res){
	res.sendFile(__dirname+req.url);
})


