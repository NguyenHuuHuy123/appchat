var express = require('express')
var router = express.Router();
var controller = require("../controller/home.controller");

var multer  = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
 
var upload = multer({ storage: storage})

router.get("/", controller.home);

router.get("/update", controller.homeUpdate);
router.post("/update",
	upload.single('avatar'), 
	controller.postHomeUpdate
	);
router.post("/updatefriend", controller.updateFriend);

module.exports = router;
