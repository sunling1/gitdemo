var jwt=require("jsonwebtoken");
var key="jdsahfhfhf";//自定义秘钥。

exports.setToken=function(context,time){
	return jwt.sign(context,key,{expiresIn:time});//sign设置加密
}

exports.getToken=function(token,callback){
	jwt.verify(token,key,function(err,data){
		if(err){
			callback(err,null);
		}else{
			callback(null,data);
		}
	})
}
