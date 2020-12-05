const express = require('express')
const app = express()
const port = 3000;


app.set('view engine', 'ejs');
app.set('views', './views');

var bodyParser = require('body-parser');
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded
app.use('/public', express.static('public'));

var cookieParser = require('cookie-parser')
app.use(cookieParser());

var validateAuth = require("./validateAuth/validateLogin"); //Kiem tra cookie user da dang nhap

var homeRouter = require("./routers/home.router");
app.use("/home", validateAuth, homeRouter);

// Kết nối tới server
var server = require("http").Server(app);
var io = require("socket.io")(server);
// var controller = require("./controller/home.controller");
io.on("connection", socketIOFunction);

var userRouter = require("./routers/user.router");
app.use("/user", userRouter);

var apiRouter = require("./api/home.api");
app.use("/api", validateAuth, apiRouter);

var mongoose = require('mongoose');
mongoose.connect(
    'mongodb://localhost:27017/zalochat',
    {
        useNewUrlParser: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });


server.listen(port, () => {
    console.log(`Đang mở công tại http://localhost:${port}`)
})


// Controller socketio
var User = require("./model/user.model");
var Friend = require("./model/friend.model");

function socketIOFunction(socket) {
    socket.on("disconnect", function () {
        console.log("Ngat ket noi voi id: " + socket.id);
    })
    socket.on("Gui-id-user-len-server", async function (idUserHienTai) {
        console.log("Id cua user dang truy cap: " + idUserHienTai);
        var thongTinUserHienTai = await User.findOne({_id: idUserHienTai});
        var allUser = await User.find().select({
            "username": 1,
            "_id": 1,
            "gmail": 1,
            "avatar": 1,
            "friend": 1,
            "information": 1
        });
        socket.accountUser = thongTinUserHienTai;
        socket.allUser = allUser;
        //Join ID user hiện tại vào room các friend
        // 1. Xác định được ID của document trong DB chứa ID User đang trung cập và ID Friend
        // 2. Join id hiện tại vào trong room có tên là ID document chứa ID hiện tại và ID Friend
        var arrTinNhanTatCaUser = await Friend.find();

        // Tìm kiếm các document chưa id hiện tại và id friend
        // 1. Lọc tất cả các document có trong collection Friend. So sánh id1 của từng document. id1 nào trùng với id của user hiện tại thì ta lọc qua tât cả các id friend của user hiện tại. Nếu id2 trùng với id friend thì ta push vào mảng trống idArrFriend một document chứa id user hiện tại và id friend

        var idArrFriend = timArrayIdFriend(idUserHienTai, arrTinNhanTatCaUser);
        // 2. Join socket hiện tại vào room có tên là id của các document đã lọc được chứa id của user hiện tại và id friend của user đó
        socket.idArrFriend = idArrFriend;
        idArrFriend.forEach(function (capFriend) {
            socket.join(capFriend.toString());
        })

    })
    socket.on("client-gui-id-friend-len-server", async function (dataIdFriend) {
        // Xac dinh room cua id friend cua nhan duoc
        // Send mess vao room do
        var arrTinNhanTatCaUser = await Friend.find();
        // Tìm kiếm các document chưa id hiện tại và id friend
        // 1. Lọc tất cả các document có trong collection Friend. So sánh id1 của từng document. id1 nào trùng với id của user hiện tại thì ta lọc qua tât cả các id friend của user hiện tại. Nếu id2 trùng với id friend thì ta push vào mảng trống idArrFriend một document chứa id user hiện tại và id friend

        var idCapFriend = timIdCapFriend (dataIdFriend, socket.accountUser._id, arrTinNhanTatCaUser)

        if (idCapFriend){
            arrTinNhanTatCaUser.forEach(capFriend =>{
                if(capFriend._id == idCapFriend ){
                    socket.emit("server-gui-tin-nhan-friend-ve-client", capFriend.mess);
                }
            })
        }

    });
    socket.on("Gui-noi-dung-tin-nhan-len-server", async function (data) {
        var arrTinNhanTatCaUser = await Friend.find();
        var idCapFriend = timIdCapFriend (data.idFriend, data.elementMess.idAb , arrTinNhanTatCaUser);
        var capFriend = await Friend.findOne({_id: idCapFriend});
        capFriend.mess.push(data.elementMess);
        capFriend.save();
        io.sockets.in(idCapFriend.toString()).emit("server-gui-tin-nhan-ve-cac-room-trong-client",
            {
                idfriend:data.idFriend,
                idUser:data.elementMess.idAb,
                data: capFriend.mess
            });
    })

}

// Tạo một hàm truyền vào ba tham số: 1 id của user hiện tại, 1 id của friend, 1 array
// Tìm ra id của phần tử trong array chứa hai tham số id đã truyền vào. Return về id đó.
function timIdCapFriend (id1, id2, array){
    var idCapFriend;
    array.forEach(item =>{
        if((item.id1 == id1) && (item.id2 == id2)){
            idCapFriend = item._id;
            return
        };
        if((item.id1 == id2) && (item.id2 == id1)){
            idCapFriend = item._id;
            return
        }
    })
    return idCapFriend;
}

// Tạo một function truyền vào 2 tham số: 1 là id của user, 2 là array
// Tìm ra tìm ra các phần tử trong array chưa id 1. Gán các id của phần tử đó vào một mảng

function timArrayIdFriend( id, arr){
    var arrayFriend = [];
    arr.forEach(item =>{
        if((item.id1 == id ) || (item.id2 == id )){
            arrayFriend.push(item._id);
        }
    })
    return arrayFriend
}