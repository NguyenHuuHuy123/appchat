// Khai bao bien Name
var elementErro = document.getElementById("thongbaoloi1");
var elementName = document.getElementById("input_name");


var styleName = elementName.style;

elementName.addEventListener("blur",kiemTraOName);
elementName.addEventListener("focus",xoaBaoLoi);

function kiemTraOName(){
	var valueName = elementName.value;
	if ( !kiemTraChieuDai(valueName, 20) ){
		elementName.style.border = "red 1px solid";
		elementErro.innerHTML = "Quá ký tự cho phép: Nhập dưới 10 ký tự";
	};
	if (valueName =="" ){
		elementName.style.border = "red 1px solid";
		elementErro.innerHTML = "Bạn không được bỏ trống";
	};
	
}


function xoaBaoLoi(){
	elementName.style.border = "black 1px solid";
	elementErro.innerHTML = "";
}

//Cac ham kiem tra rieng le
function kiemTraChieuDai(item, lengthSt){
	if( item.length <= lengthSt) {
		return true
	} else {
		return false
	}
}

//Check password strengh
var input_pass = document.querySelector(".password .pass1");
var elementWarning = document.querySelector(".password .inforRetypePass1")

input_pass.addEventListener("blur",warningPass);
input_pass.addEventListener("focus",xoaBaoLoiPass);

function xoaBaoLoiPass(){
	input_pass.style.border = "black 1px solid";
	elementWarning.innerHTML = "";
}

function warningPass(){
	var pass = input_pass.value;
	var scorePass = checkPassStrength(pass);
	// elementName.style.border = "red 1px solid";
	if (pass ==""){
		input_pass.style.border = "red 1px solid";
		elementWarning.innerHTML = "Bạn không được bỏ trống";
	} else {
		elementWarning.innerHTML = scorePass;
	}
	
}


function checkPassStrength(pass) {
    var score = scorePassword(pass);
    if (score > 80)
        return "Mật khẩu rất tốt!";
    if (score > 60)
        return "Mật khẩu tạm ổn!";
    if (score >= 30)
        return "Mật khẩu yếu!";
    if (score < 30)
        return "Không nên sử dụng mật khẩu này!";

    return "";
}

function scorePassword(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
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

//Check nhập lại mật khẩu.

var input_pass2 = document.querySelector(".password .pass2");
var inforRetypePass = document.querySelector(".password .inforRetypePass2")

input_pass2.addEventListener("keyup",kiemTraTrungLap);
// input_pass.addEventListener("focus",xoaBaoLoiPass);
function kiemTraTrungLap(){
	var valuePass1 = input_pass.value;
	var valuePass2 = input_pass2.value;
	console.log("-Mat khau 1: "+valuePass1+"-Mat khau 2: "+valuePass2);
	if(valuePass1 != valuePass2) {
		inforRetypePass.innerHTML = "Mật khẩu không khớp!"
	} else {
		inforRetypePass.innerHTML ="";
	}
}

// -------------------
var formone = document.getElementById("formone");
var guifrom = document.getElementById("guiform");
guifrom.addEventListener("click", checkAndSubmit);

function checkAndSubmit(){
	var username = formone.username.value;
	var usergmail = formone.usergmail.value;
	var userpass1 = formone.userpass1.value;
	var userpass2 = formone.userpass2.value;
	var resultCheck = checkAll(username,usergmail, userpass1, userpass2);
	if (!resultCheck) {
		alert("Bạn không thể gửi form. Vui lòng chỉnh sửa lại các trường thông tin");
		return;
	};
	formone.submit();
	getThongBaoLoi();
}

function checkAll(username,usergmail, userpass1, userpass2){
	if ( !kiemTraChieuDai(username, 20) || username==""){
		return false;
	};
	if (usergmail.indexOf("@gmail.com") == -1){
		return false;
	};
	if ( scorePassword(userpass1) < 30 ){
		return false;
	};
	if (  userpass1 !== userpass2){
		return false;
	};
	return true;
};


function getThongBaoLoi (){
	var url = "http://localhost:3000/user/dangky"; // url nhận dữ liệu trả về.
	var xhr = new XMLHttpRequest(); // Khởi tạo một object XMLHttpRequest để nhận dữ liệu
	xhr.onreadystatechange = function (){
	// onreadystatechange method này dùng để bắt giá trị của xhr mỗi trạng thái thay đổi. Mỗi thay đổi sẽ gọi đến hàm "hamKiemTraThayDoi"
	if (xhr.readyState === XMLHttpRequest.DONE) {
		// xhr.readyState -> Bắt lấy giá trị thay đổi tại thời điểm hiện tại.
		// XMLHttpRequest.DONE -> Giá trị xhr khi trả dữ liệu về thành công
		var giaTriTraVe = xhr.responseText;  // Gán kết quả trả về vào biến
		console.log(JSON.parse(giaTriTraVe.error));  // Sử dụng kết quả trả về. In ra màn hình console.
	}
	};  
	xhr.open('POST', url);  // Mở cổng yêu cầu GET đến url khai báo từ trước
	xhr.send(); // Gởi yêu cầu đến url
}
