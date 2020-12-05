var express = require('express')
var router = express.Router();
var User = require("../model/user.model");
var Friends = require("../model/friend.model");

router.get("/users", function (req, res) {
    var users = User.find().select({"username": 1, "_id": 1, "gmail": 1, "avatar": 1, "friend": 1, "information": 1});
    users.exec(function (err, someValue) {
        if (err) {
            console.log(err);
            return
        }
        ;
        res.json(someValue);
    });
});

router.get("/usersFriend", async function (req, res) {
    var idUser = res.locals.idUser;
    var userID = await User.findOne({_id: idUser});
    var friends = userID.friend;
    var userFriends = [];
    var allUser = await User.find().select({"username": 1, "_id": 1, "gmail": 1, "avatar": 1, "friend": 1});
    allUser.forEach(item1 => {
        friends.forEach(item2 => {
            if (item1._id == item2) {
                userFriends.push(item1);
            }
        })
    });
    res.json(userFriends);
});

router.post("/usersFriend", function (req, res) {
    var result = req.body;
});

// router.get("/friends", function(){
// 	var friends = await Friends.find();
// 	res.json(friends);
// });


module.exports = router;