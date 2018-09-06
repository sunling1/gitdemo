var express=require("express");
var router=express.Router();
var adminModel=require("../module/adminModule");
var upFile=require("../public/upFile")
//管理员登录接口
router.post("/adminLogin",adminModel._adminLogin);
router.get("/adminToken",adminModel._adminToken);
//router.get("/add",adminModel._add);
//获取所有管理员接口
router.get("/",adminModel._admin);
//通过id获取管理员日志接口
router.get("/adminLog",adminModel._adminLog);
//查看管理员名称是否重复
router.get("/adminRepeat",adminModel._adminRepeat);
//添加管理员接口；
router.post("/addAdmin",adminModel._addAdmin);
//添加验证密码接口
router.post("/makeSurePass",adminModel._makeSurePass);
//添加更改密码接口
router.post("/resetPass",adminModel._resetPass);
//图片上传接口；
router.post("/upload",upFile.upFileCallBack);
//类别名字是否重复
router.get("/isTypeIn",adminModel._isTypeIn);
//上传商品类别；
router.post("/shopType",adminModel._shopType);

//获取商品类别；
router.get("/shopType",adminModel._shopType1);
//删除类别
router.get("/delType",adminModel._delType);

//添加店铺信息
router.post("/shop",adminModel._shop);
//获取店铺信息
router.get("/getShop",adminModel._getShop);
//删除店铺
router.get("/deleteShop",adminModel._deleteShop);
//不允许商品类别重复
router.get("/goodsTypeRep",adminModel._goodsTypeRep);

//添加商品类别
router.post("/goodsType",adminModel._goodsType);
//获取商品类别
router.get("/goodsType",adminModel._goodsType1);

//上传商品图片
router.post("/addGoodsPic",upFile.upFileCallBack);
//上传商品
router.post("/addGoodsList",adminModel._addGoodsList);

//获取商品
router.get("/getGoods",adminModel._getGoods);
//删除shangpin
router.get("/delGoods",adminModel._delGoods);

//上传广告图片
router.post("/addAdvPic",upFile.upFileCallBack);
//添加广告
router.post("/addAdv",adminModel._addAdv);
//获取广告
router.get("/getAdv",adminModel._getAdv);
//修改广告
router.get("/upAdv",adminModel._upAdv);
router.post("/upAdvData",adminModel._upAdvData);

module.exports=router;
