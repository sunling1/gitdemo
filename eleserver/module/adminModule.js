var db=require("../public/db.js");
var md5=require("js-md5");
var jwt=require("../public/jwt.js");//引入jsonwebtoken模块
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const formidable = require("formidable");
exports._adminLogin=(req,res)=>{
	let data=req.body;
	console.log(data)
	var whereObj={adminName:data.adminName,
		adminPass:md5(data.adminPass)
	}
	db.find("adminList",{whereObj},function(err,result){
		if(err){
			res.send({
				status:"0",
				msg:"数据库连接失败"
			})
		}else{
			if(result.length==0){
				res.send({
					status:"-1",
					msg:"用户名与账号不匹配"
				})
			}else{
				db.insertOne("adminLog",{
					type:"1000",
					typeText:"登录",
					time:(new Date()).getTime()
				},(err,logers)=>{
					res.send({
						status:"1",
						msg:"登陆成功",
						data:{
							token_id:jwt.setToken({_id:result[0]._id},"7d"),
							adminId:result[0]._id,
							adminName:result[0].adminName,
							adminPower:result[0].adminPower
						}
					})
				})
			}
		}
	})
}

exports._adminToken=(req,res)=>{
	var token_id=req.query.token_id;
	jwt.getToken(token_id,function(err,data){
		if(err){
			res.status=401;
			res.send({
				status:"-1",
				statusText:err.name
			})
		}else{
			res.send({
				status:"1",
				statusText:"验证成功",
				data:data
			})
		}
	})
}

//exports._add=(req,res)=>{
//	db.insertOne("adminList",{adminName:"admin",adminPass:md5("123123")},function(err,data){
//		res.send({ok:1})
//	})
//}

exports._admin = (req,res)=>{
	db.find("adminList",{},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data:data
		});
	})
}

exports._adminLog = (req,res)=>{
//	db.count("adminLog",{adminId})
	db.find("adminLog",{where:{adminId:ObjectId(req.query.id)},limit:0,skip:0},(err,data)=>{
		res.send({
			status:"1",
			statusText:"success",
			data:data
		});
	})
}

exports._adminRepeat = (req,res)=>{
	let adminName = req.query.adminName;
	db.count("adminList",{adminName:adminName},(err,count)=>{
		res.send({
			status:"1",
			statusText:"success",
			count:count
		});
	})
}

exports._addAdmin = (req,res)=>{
	let data = req.body;
	let adminId = data.adminId;
	delete data.adminId;
	data.adminTime = (new Date()).getTime();
	data.adminPass = md5(data.adminPass);
	db.insertOne("adminList",data,function(err,result){
		db.insertOne("adminLog",{
			adminId:ObjectId(adminId),
			type:'1001',
			typeText:"添加了"+data.adminName+"管理员",
			time:data.adminTime
		},(err,logres)=>{
			res.send({
				status:"1",
				statusText:"success",
				data:result
			})
		})
	})
}

exports._makeSurePass = (req,res)=>{
	let data = req.body;
//	data.adminId
	db.findById("adminList",data.adminId,function(err,result){
		console.log(result);
		if(result.adminPass==md5(data.adminPass)&&result.adminName == data.adminName){
			res.send({
				status:"1",
				statusText:"密码正确"
			})
		}else{
			res.send({
				status:"-1",
				statusText:"密码有误无法修改密码"
			})
		}
		
	})
}

exports._resetPass = (req,res)=>{
	let data = req.body;
//	data.adminId
	db.updateById("adminList",data.adminId,{adminPass:md5(data.adminPass)},function(err,result){
		db.insertOne("adminLog",{
			adminId:ObjectId(data.adminId),
			type:'1002',
			typeText:"修改了"+data.adminName+"管理员的密码",
			time:(new Date()).getTime()
		},(err,logres)=>{
			res.send({
				status:"1",
				statusText:"修改成功",
			})
		})
	})
}

//验证图片类型是否有重复；
exports._isTypeIn=function(req,res){
	db.count("typeList",{typeName:req.query.typeName},function(count){
		if(count>0){
			res.send({
				status:"-1",
				statusText:"类别已存在"
			})
		}else{
			res.send({
				status:"1",
				statusText:"通过"
			})
		}
	})
}


//添加店铺类别
exports._shopType=function(req,res){
	let data=req.body;
	db.insertOne("typeList",{
		typeName:data.typeName,
		typeLogo:data.typeLogo,
		typeStart:data.typeStart,
		typeEnd:data.typeEnd
	},function(err,result){
		db.insertOne("adminLog",{
			adminId:ObjectId(data.adminId),
			type:"1003",
			typeText:"添加了"+data.typeName+"店铺类别",
			time:(new Date()).getTime()
		},function(err,logers){
			res.send({
				status:"1",
				statusText:"添加类别成功"
				
			})
		})
	})
}

//获取店铺类别
exports._shopType1=function(req,res){
	db.find("typeList",{},function(err,data){
		res.send({
			status:"1",
			data:data
		})
	})
}

//删除店铺类别
exports._delType=function(req,res){
	db.deleteOneById("typeList",req.query.id,function(err,result){
		res.send({
			status:"1",
			statusText:'删除成功'
		})
	})
}


exports._shop=function(req,res){
	var form=new formidable.IncomingForm();
	form.encoding="utf-8";
	form.parse(req,(err,obj,files)=>{
		adminId=obj.adminId;
		delete obj.adminId;
		db.insertOne("shopList",obj,function(err,result){
			db.insertOne("adminLog",{
				adminId:ObjectId(adminId),
				type:"1004",
				typeText:"添加了"+obj.shopName+"店铺",
				time:(new Date()).getTime()
			},function(err,loger){
				res.send({status:"1",statusText:"添加成功"})
			})
		})
	})
}


//获取店铺信息
exports._getShop=function(req,res){
	db.find("shopList",{},function(err,result){
		res.send({
			status:"1",
			data:result
		})
	})
}


//删除店铺信息
exports._deleteShop=function(req,res){
	db.deleteOneById("shopList",req.query.id,function(err,data){
		res.send({
			status:"1",
			statusText:'删除成功'
		})
	})
}

//不允许商品类别重复
exports._goodsTypeRep=function(req,res){
	db.count("goodsType",{shopId:req.query.shopId,goodsType:req.query.goodsType},function(count){
		if(count>0){
			res.send({
				status:"-1",
				statusText:"商品已存在"
			})
		}else{
			res.send({
				status:"1",
				statusText:"通过"
			})
		}
	})
}


//添加商品类别
exports._goodsType=function(req,res){
	let data=req.body;
	db.findOneById("adminList",data.adminId,function(err,adminRes){
		if(adminRes.adminPower>3){
			res.send({
				status:"-1",
				statusText:"权限不足，无法添加类别"
			})
		}else{
			db.insertOne("goodsType",{
				goodsType:data.goodsType,
				shopId:data.shopId,
				shopName:data.shopName
			},function(err,typeRes){
				db.insertOne("adminLog",{
					adminId:ObjectId(data.adminTime),
					type:"1005",
					typeText:"添加了"+data.shopName+"店铺"+data.goodsType+"类别",
					time:(new Date()).getTime()
				},function(err,result){
					res.send({
						status:"1",
						statusText:"添加商品类别成功"
					})
				})
			})
		}
	})
}

exports._goodsType1=function(req,res){
	
	let whereObj={shopId:req.query.shopId}
	db.find("goodsType",{whereObj},function(err,result){
	
		res.send({
			status:"1",
			statusText:"成功",
			data:result
		})
	})
}


//上传商品集合
exports._addGoodsList=function(req,res){
	var form=new formidable.IncomingForm();
	form.encoding="utf-8";
	form.parse(req,(err,obj,files)=>{
//		console.log(obj)
		adminId=obj.adminId;
		delete obj.adminId;
		db.insertOne("goodsList",obj,function(err,result){
			db.insertOne("adminLog",{
				adminId:ObjectId(adminId),
				type:"1006",
				typeText:"添加了"+obj.shop_name+"店铺"+"的"+obj.goodsName+"商品",
				time:(new Date()).getTime()
			},function(err,loger){
				res.send({status:"1",statusText:"添加成功"})
			})
		})
	})
}


exports._getGoods=function(req,res){
	db.find("goodsList",{},function(err,data){
		res.send({
			status:"1",
			statusText:"成功",
			data:data
		})
	})
}

//删除商品接口
exports._delGoods=function(req,res){
	db.deleteOneById("goodsList",req.query.id,function(err,data){
		res.send({
			status:"1",
			statusText:"成功"
		})
	})
}

//添加广告
exports._addAdv=function(req,res){
	let body=req.body;
	
	let adminId=body.adminId;
	delete body.adminId
	db.insertOne("advList",body,function(err,data){
		db.insertOne("adminLog",{
				adminId:ObjectId(adminId),
				type:"1007",
				typeText:"添加了"+body.advName+"广告",
				time:(new Date()).getTime()
			},function(err,loger){
				res.send({status:"1",statusText:"添加成功"})
			})
	})
}

//获取广告
exports._getAdv=function(req,res){
	db.find("advList",{},function(err,data){
		res.send({
			status:"1",
			statusText:"成功",
			data:data
		})
	})
}

exports._upAdv=function(req,res){
	db.findOneById("advList",req.query.id,function(err,data){
		res.send({
			status:"1",
			statusText:"成功",
			data:data
		})
	})
}

exports._upAdvData=function(req,res){
	let data=req.body;
	console.log(data)
	db.updateOneById("advList",data.id,{
		$set:{
			advName:data.advName,
			advUrl:data.advUrl,
			advPic:data.advPic,
			advType:data.advType
		}
	},function(err,advRes){
		db.insertOne("adminLog",{
				adminId:ObjectId(data.adminId),
				type:"1008",
				typeText:"修改了"+data.advName+"广告",
				time:(new Date()).getTime()
			},function(err,loger){
				res.send({status:"1",statusText:"添加成功"})
			})
	})
}
