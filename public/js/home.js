var url = "http://localhost:3000/api/users";
var xhr = new XMLHttpRequest();
var giaTriTraVe;

xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        giaTriTraVe = xhr.responseText;
        render(friendUser(accountID));
    }
}

xhr.open('GET', url);
xhr.send();

var hopTinNhan = document.querySelector('#hoptinnhan-sidebar');
hopTinNhan.addEventListener('click', getIdUser);

var imageFriend = document.querySelector('#imageFriend');
var nameFriend = document.querySelector('#nameFriend');


function getIdUser(event) {
    var dataIdFriend = event.target.dataset.id;
    var dataStatus = event.target.dataset.status;
    var onhaptinnhanElement = document.querySelector('#onhaptinnhan');
    var noiDungChatElement = document.querySelector('#idnoidungchat');
    noiDungChatElement.dataset.id = dataIdFriend;
    noiDungChatElement.innerHTML = "";
    JSON.parse(giaTriTraVe).forEach(function (user) {
        if (user._id == dataIdFriend) {
            imageFriend.style.backgroundImage = "url(./public" + user.avatar + ")";
            nameFriend.innerHTML = user.username;
            if (dataStatus == "friend") {
                socket.emit("client-gui-id-friend-len-server", dataIdFriend);
            }
            onhaptinnhanElement.value = "";
            onhaptinnhanElement.dataset.id = dataIdFriend;
            return
        }
    });
}

//Phía trên là JS chọn tin nhắn

//Phía dưới là JS tìm kiếm bạn bè
var accountID = document.getElementById("accountID").dataset.id;
imageFriend.style.backgroundImage = "url(./public/uploads/thongbao.jpg)";
nameFriend.innerHTML = "Thông báo"; //Hiển thị thông báo


var findFriend = document.getElementById("otimkiemId");
findFriend.addEventListener("keyup", function () {
    // arrFriendResult(findFriend.value);
    if (findFriend.value == "") {
        render(friendUser(accountID)); // Xuất ra màn hình mảng user
        return
    }
    ;
    arrFriendResult(findFriend.value);
    sendData(); //Chạy hàm send data bằng Ajax nếu click vào nút kết bạn
    // Loc friend
    // Render friend
});

function arrFriendResult(keyword) {
    var arrUser = JSON.parse(giaTriTraVe);
    var arrFilter = arrUser.filter(function (item) {
        return item.username.indexOf(keyword) !== -1;
    })
    renderFindFriend(arrFilter); // Xuất ra các mảng user đã tìm được
}

function render(arr) {
    if (arr) {
        content = arr.map(function (friend) {
            return "<div class=\"item_tinnhan\" data-id=\"" + friend._id + "\" data-status=\"friend\"><img class=\"img-vatar-friend\" style=\"background-image: url(./public" + friend.avatar + ")\" data-id=\"" + friend._id + "\" data-status=\"friend\"><div class=\"box-item-mess\" data-id=\"" + friend._id + "\"><span class=\"name-frient\">" + friend.username + "</span><span class=\"content-mess-short\" >Nội dung tin nhắn...</span></div><div class=\"thongbao\"><span>Bạn bè</span><span class=\"soluongtinnhanchuadoc\">4</span></div></div>";
        })
        hopTinNhan.innerHTML = content.join("");
    }
}

function renderFindFriend(arr) { //Render ra mảng friend đã tìm kiếm. Tùy theo user mà hiển thị khác nhau
    if (arr) {
        content = arr.map(function (friend) {
            var quanhe = "Kết bạn";
            var datastatus = "none";
            friendUser(accountID).forEach(function (item) {
                if (friend._id == item._id) {
                    quanhe = "Bạn bè";
                    datastatus = "friend";
                }
                ;
            });
            if (friend._id == accountID) {
                quanhe = "Profile";
                datastatus = "frofile";
            }
            ;

            arrInfor(accountID)
                .forEach(function (item) {
                    if (friend._id == item.idFriend) {
                        quanhe = item.content;
                        datastatus = item.status;
                    }
                    ;
                });
            return "<div class=\"item_tinnhan\" data-id=\"" + friend._id + "\" data-status=\"" + datastatus + "\"><img class=\"img-vatar-friend\" style=\"background-image: url(./public" + friend.avatar + ")\" data-id=\"" + friend._id + "\" data-status=\"" + datastatus + "\"><div class=\"box-item-mess\" data-id=\"" + friend._id + "\"><span class=\"name-frient\">" + friend.username + "</span><span class=\"content-mess-short\" >Nội dung tin nhắn...</span></div><div class=\"thongbao\"><span class=\"btn-ketban\" data-status=\"" + datastatus + "\" data-id=\"" + friend._id + "\">" + quanhe + "</span></div></div>";
        })
        hopTinNhan.innerHTML = content.join("");
    }
}

function friendUser(accountID) { // Lọc danh sách bạn bè của User
    var listUser = JSON.parse(giaTriTraVe);
    var friendArr = [];
    listUser.forEach(function (user) {
        if (user._id == accountID) {
            user.friend.forEach(function (item1) {
                listUser.forEach(function (item2) {
                    if (item2._id == item1) {
                        friendArr.push(item2);
                    }
                })
            })
        }
    })
    return friendArr
}


function arrInfor(accountID) {  //Lấy ra mảng thông báo của user
    var listUser = JSON.parse(giaTriTraVe); //Giá trị trả về từ Ajax - toàn bộ user
    var thongbao;
    listUser.forEach(function (user) {
        if (user._id == accountID) {
            // console.log(user.information);
            thongbao = user.information;
        }
    })
    return thongbao;
}

// Ajax change status
//Hàm gửi dữ liệu kết bạn / chấp nhận kết bạn

function sendData() {
    var element = document.querySelectorAll(".btn-ketban");
    element.forEach(function (item) {
        item.addEventListener("click", function () {
            var idFriend = item.getAttribute('data-id');
            var status = item.getAttribute('data-status');
            //Gửi giá trị id của friend và trạng thái kích hoạt
            if (status == "none") {
                ajaxData(idFriend, status);
                item.dataset.status = "daguiloimoi";
                item.innerHTML = "Đã gửi lời mời";
            }
            ;
            if (status == "choxacnhan") {
                ajaxData(idFriend, status);
                item.dataset.status = "friend";
                item.innerHTML = "Bạn bè";
                location.reload();
            }
            ;

        });
    });
}


function ajaxData(idfriend, status) { //Hàm này dùng để gửi ajax data về server
    var xhr2 = new XMLHttpRequest();
    // idfriend, status
    // {idFriend: idfriend, status:status}
    var valueAjax = JSON.stringify({idFriend: idfriend, status: status})
    xhr2.open('POST', "http://localhost:3000/home/updatefriend");
    xhr2.setRequestHeader("Content-type", "application/json"); //Chọn kiểu dữ liệu cần gửi
    xhr2.send(valueAjax);
}


//Cài đặt nút thông báo. Click vào nút chuông để xem các thông báo
var elementMenu = document.querySelectorAll(".menu-item");


elementMenu.forEach(function (item) {
    var action = item.id;
    item.addEventListener("click", function () {
        if (action == "thongbaoId") {
            renderThongBao(arrInfor(accountID));
            sendData();
        }
        ;
        if (action == "tinnhanId") {
            render(friendUser(accountID));
        }
        ;
    })
});

function renderThongBao(arr) {  //Truyen vao mot mang thong bao. Render ra HTML mang do
    var content = arrInfor(accountID).map(function (infor) {
        var objectUser = idToObjectUser(infor.idFriend) //Nhận vào id user trong thông báo. Trả về chính xác object user đó
        return "<div class=\"item_tinnhan\" data-id=\"" + infor.idFriend + "\"><img class=\"img-vatar-friend\" style=\"background-image: url(./public" + objectUser.avatar + ")\" data-id=\"" + infor.idFriend + "\"><div class=\"box-item-mess\" data-id=\"" + infor.idFriend + "\"><span class=\"name-frient\">" + objectUser.username + "</span><span class=\"content-mess-short\" >Nội dung tin nhắn...</span></div><div class=\"thongbao\"><span class=\"btn-ketban\" data-status=\"" + infor.status + "\" data-id=\"" + infor.idFriend + "\">" + infor.content + "</span></div></div>";
    });
    hopTinNhan.innerHTML = content.join("");
};

function idToObjectUser(idUser) { //Truyen vao mot id user > Tra ve object cua user do
    var listUser = JSON.parse(giaTriTraVe);
    var user1;
    listUser.forEach(function (user) {
        if (user._id == idUser) {
            user1 = user;
        }
    })
    return user1;
}


var socket = io("http://localhost:3000/");
socket.emit("Gui-id-user-len-server", accountID);
socket.on("server-gui-tin-nhan-friend-ve-client", function (contentMess) {
    var noiDungChatElement = $("#idnoidungchat");

    // Giới hạn tin nhắn in ra màn hình
    var step = contentMess.length -12;
    if(step < 0) {
        step = 0;
    };
    var arrayMess = contentMess.slice(step, contentMess.length);
    arrayMess.map(function (item) {
        if (item.idAb == accountID) {
            var bien1 = `
             <div class=\"mess-by-me\">
                <span>${item.content}</span>
            </div>
            `
            noiDungChatElement.append(bien1)
            return bien1;
        } else {
            var bien2 = `
            <div class="tinnhanguidi">
                <div class=\"mess-friend\">
                    <span>` + item.content + `</span>
                </div>
            </div>
            `
            noiDungChatElement.append(bien2)
            return bien2;
        }

    })
})

// Bắt sự kiện gửi tin nhắn
$("#onhaptinnhan").keypress(function (event) {
    var valueContent = $(this).val();
    var content = $(this).val();
    var idAb = $(this).attr("data-id");
    if (event.keyCode == 13) {
        if (valueContent !== "") {
            socket.emit("Gui-noi-dung-tin-nhan-len-server",
                {
                    idFriend: idAb,
                    elementMess: {idAb: accountID, content: content}
                });

        }
        ;
        $(this).val("");
    }
    ;
})

//Bat su kien tin nhan gui ve tu server
socket.on("server-gui-tin-nhan-ve-cac-room-trong-client", function (contentMess) {
    var noiDungChatElement = $("#idnoidungchat");
    var dataIdFriend = $("#idnoidungchat").attr("data-id");
    console.log("Cap id user va account 1: " + contentMess.idfriend + " va: " + contentMess.idUser);
    console.log("Cap id user va account 2: " + dataIdFriend + " va: " + accountID);
    if (((contentMess.idfriend == dataIdFriend) && (contentMess.idUser == accountID)) || (contentMess.idfriend == accountID) && (contentMess.idUser == dataIdFriend)) {
        noiDungChatElement.empty();

        // Giới hạn tin nhắn in ra màn hình
        var step = contentMess.data.length -12;
        if(step < 0) {
            step = 0;
        };
        var arrayMess = contentMess.data.slice(step , contentMess.data.length);
        arrayMess.map(function (item) {
            if (item.idAb == accountID) {
                var bien1 = `
             <div class=\"mess-by-me\">
                <span>${item.content}</span>
            </div>
            `
                noiDungChatElement.append(bien1)
                return bien1;
            } else {
                var bien2 = `
            <div class="tinnhanguidi">
                <div class=\"mess-friend\">
                    <span>` + item.content + `</span>
                </div>
            </div>
            `
                noiDungChatElement.append(bien2)
                return bien2;
            }
        })
    }


})

