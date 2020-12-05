var User = require("../model/user.model");
var Friend = require("../model/friend.model");

module.exports.home = async function (req, res) {
    var idUser = res.locals.idUser;
    var userID = await User.findOne({_id: idUser});
    res.render("./home", {
        user: userID
    });
}

module.exports.homeUpdate = async function (req, res) {
    var idUser = res.locals.idUser;
    var userID = await User.findOne({_id: idUser});
    res.render("./homeUpdate", {
        user: userID
    });
}

//Cap nhat thong tin nguoi dung
module.exports.postHomeUpdate = async function (req, res) {
    var name = req.body.username;
    var idUser = res.locals.idUser;
    var user = await User.findOne({_id: idUser});
    if (name !== "") {
        user.username = req.body.username;
    }
    ;
    if (req.file) {
        user.avatar = "/uploads/" + req.file.filename;
    }
    ;
    user.save();
    res.redirect("/home");
}

module.exports.updateFriend = async function (req, res) {
    var idFriend = req.body.idFriend;
    var status = req.body.status;
    var idUser = res.locals.idUser;
    var user = await User.findOne({_id: idUser});
    var userFriend = await User.findOne({_id: idFriend});


    if (status == "choxacnhan") {
        user.friend.push(idFriend);
        userFriend.friend.push(idUser);
        user.information = user.information.filter(item => item.idFriend !== idFriend);
        userFriend.information = user.information.filter(item => item.idFriend !== idUser);

        // Tạo db lưu lại nội dung chat
        // Tạo một document lưu lại thông tin A và B chát với nhau
        var elementMess = {
            id1: idUser,
            id2: idFriend,
            mess: [{
                idAb: idFriend,
                content: "Xin chào, rất vui được làm quen với bạn!"
            }]
        };
        Friend.create(elementMess);
    }

    if (status == "none") {
        var userNew1 = {idFriend: idFriend, status: "daguiloimoi", content: "Đã gửi lời mời"};
        var userNew2 = {idFriend: idUser, status: "choxacnhan", content: "Xác nhận"};
        user.information.push(userNew1);
        userFriend.information.push(userNew2);
    }
    user.save();
    userFriend.save();
}

//
// module.exports.socketio = function (socket) {
//
// }