var db=require("../public/db.js");
var md5=require("js-md5");
var jwt=require("../public/jwt.js");//引入jsonwebtoken模块
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const formidable = require("formidable");
module.exports._advSwiper=function(req,res){
	db.find("advList",{},(err,data)=>{
		res.send({
			status:"1",
			statusText:"成功",
			data
		})
	})
}

module.exports._newType=function(req,res){
	
	db.find("typeList",{whereObj:{typeName:req.query.type}},function(err,data){
		res.send({
			status:'1',
			statusText:"成功",
			data:data[0]
		})
	})
}

module.exports._getNew=function(req,res){
	db.find("shopList",{whereObj:{typeId:req.query.typeId}},function(err,data){
		res.send({
			status:'1',
			statusText:"成功",
			data
		})
	})
}

module.exports._getActive=function(req,res){
	let come=req.query
	let typeName=come.type;
	let skip=come.skip*1;
	let limit=come.limit*1;
	console.log(typeName,skip,limit)
	db.find("shopList",{whereObj:{typeName:typeName},skip,limit},function(err,data){
		res.send({
			status:"1",
			data
		})
	})
}

module.exports._getNewType=function(req,res){
	db.find("shopList",{whereObj:{typeName:req.query.type}},function(err,data){
		res.send({
			status:"1",
			data
		})
	})
}

//获取验证码
exports._getYzm=function(req,res){
	let tel=req.body.tel;
	console.log(tel)
	db.count("yzmList",{tel},(count)=>{
		if(count==0){
			let yzm=Math.floor(Math.random()*899999)+100000;
			let time=new Date().getTime()+5*60*1000;
			db.insertOne("yzmList",{tel,code:yzm,exp:time},function(err,data){
				res.send({
					status:200,
					statusText:"success",
					data:{
						code:yzm,
						tel:tel
					}
				})
			})
		}else{
			db.find("yzmList",{whereObj:{tel}},(err,telRes)=>{
				let time=new Date().getTime();
				if(time-telRes[0].exp>0){
					let yzm=Math.floor(Math.random()*899999)+100000;
					let time=new Date().getTime()+5*60*1000;
					db.updateOne("yzmList",{tel},{code:yzm,exp:time},function(err,data){
						res.send({
							status:200,
							statusText:"success",
							data:{
								code:yzm,
								tel:tel
							}
						})
					})
				}else{
					res.send({
						status:200,
						statusText:"success",
						data:{
							code:telRes[0].code,
							tel:tel
						}
					})
				}
			})
		}
	})
}

//注册
module.exports._sign=function(req,res){
	let data=req.body;
	db.insertOne("loginList",{
		tel:data.tel,
		name:data.name,
		passWord:data.passWord,
		rePassWord:data.rePassWord,
		yzm:data.yzm,
				
	},function(err,data){
		res.send({
			status:"1",
			statusText:"success",
		})
	})
}
