var mongodb=require("mongodb");
var MongoClient=mongodb.MongoClient;
var connectStr="mongodb://127.0.0.1:27017";

function _connect(cb){
	MongoClient.connect(connectStr,function(err,client){
		if(err){
			console.log("失败");
		}else{
			var db=client.db("child1803");
			cb(db);
		}
	})
}
//插入一个
module.exports.insertOne=function(collection,obj,cb){
	_connect(function(db){
		db.collection(collection).insertOne(obj,function(err,results){
			cb(err,results);
		})
	
	})
}

//查找
module.exports.find=function(collection,obj,cb){
	obj.whereObj=obj.whereObj||{};
	obj.sortObj=obj.sortObj||{};
	obj.limit=obj.limit||0;
	obj.skip=obj.skip||0;
	
	_connect(function(db){
		db.collection(collection).find(obj.whereObj).sort(obj.sortObj).limit(obj.limit).skip(obj.skip).toArray(function(err,results){
			cb(err,results);
		})
	})
}

//查找个数
module.exports.count=function(collection,whereObj,cb){
	_connect(function(db){
		db.collection(collection).count(whereObj).then(function(count){
			cb(count);
		})
	})
}

//根据id查找

module.exports.findOneById=function(collection,id,cb){
	_connect(function(db){
		db.collection(collection).findOne({_id:mongodb.ObjectId(id)},function(err,results){
			cb(err,results);
		})
	})
}


//根据id删除
module.exports.deleteOneById=function(collection,id,cb){
	_connect(function(db){
		db.collection(collection).deleteOne({_id:mongodb.ObjectId(id)},function(err,results){
			cb(err,results);
		})
	})
}


//根据id更改
module.exports.updateOneById=function(collection,id,upObj,cb){
	_connect(function(db){
		db.collection(collection).updateOne({_id:mongodb.ObjectId(id)},upObj,function(err,results){
			cb(err,results);
		})
	})
}
module.exports.updateOne = function(collection,query,update,cb){
	_connect(function(db){
		db.collection(collection).updateOne(query,{$set:update},function(err,data){
			cb(err,data)
		})
	})
}