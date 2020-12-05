var User = require("../model/user.model");
var md5 = require('md5');

module.exports.dangky = function (req, res) {
    res.render("./dangky", {error: ""});
};

module.exports.luuDuLieu = async function (req, res) {
    var resultCheck = checkAll(req.body.username, req.body.usergmail, req.body.userpass1, req.body.userpass2);
    if (!resultCheck) {
        res.json({
            error: "Phát hiện nghi vấn hack!"
        });
        return;
    }
    ;

    var newUser = {
        username: req.body.username,
        gmail: req.body.usergmail,
        password: md5(req.body.userpass1),
        avatar: "/image/avatar-demo.png",
        information: []
    };
    // var user = await User.findOne({gmail: req.body.usergmail});
    // if(user){
    //     res.json("Email bạn đã có người sử dụng rồi! Vui lòng sử dụng email khác hoặc sử dụng tính năng quên mật khẩu để đăng nhập.");
    //     return;
    // } else {
    //
    // }
    //KIỂM TRA EMAIL TRÙNG LẶP
    User.create(newUser);
    var user = await User.findOne({gmail: newUser.gmail});
    res.cookie("cookieAuth", user._id)
    res.redirect("/home");
};


module.exports.dangnhap = function (req, res) {
    res.render("./dangnhap");
}

module.exports.postDangnhap = async function (req, res) {
    var userGmail = req.body.userGmail;
    var userPass = req.body.userPass;
    var userID = await User.findOne({gmail: userGmail});
    if (!userID) {
        res.render("./dangnhap");
        return
    }
    ;
    if (userID.gmail !== userGmail) {
        res.render("./dangnhap");
        return
    }
    ;
    if (userID.password !== md5(userPass)) {
        res.render("./dangnhap");
        return
    }
    ;
    res.cookie("cookieAuth", userID._id)
    res.redirect("http://localhost:3000/home");
}

module.exports.recoveryPass = async function (req, res) {
    //
    res.send("Hiện tại chưa thêm chức năng này!");
}

// ------------------
// module check
function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i = 0; i < pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    var variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    return parseInt(score);
}

function kiemTraChieuDai(item, lengthSt) {
    if (!item) {
        return false;
    }
    ;
    if (item.length <= lengthSt) {
        return true
    } else {
        return false
    }
    ;
}

function checkAll(username, usergmail, userpass1, userpass2) {
    if (!kiemTraChieuDai(username, 20) || username == "") {
        return false;
    }
    ;
    if (usergmail.indexOf("@gmail.com") == -1) {
        return false;
    }
    ;
    if (scorePassword(userpass1) < 30) {
        return false;
    }
    ;
    if (userpass1 !== userpass2) {
        return false;
    }
    ;
    return true;
};
	
