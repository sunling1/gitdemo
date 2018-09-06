var express=require("express");
var router=express.Router();
var apiModel=require("../module/apiModule");
var upFile=require("../public/upFile")
//router.get("/shop",apiModel._getShop);
router.get("/advSwiper",apiModel._advSwiper);
router.get("/newType",apiModel._newType);
router.get("/getNew",apiModel._getNew);
router.get("/getActive",apiModel._getActive);
router.get("/getNewType",apiModel._getNewType);
router.post("/yzm",apiModel._getYzm);
router.post("/sign",apiModel._sign);
router.get("/login",apiModel._login);
module.exports=router;
