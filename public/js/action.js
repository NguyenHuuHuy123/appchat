//hiển thị nút cài đặt
var setting = document.querySelector(".setting-botton a");
var contentSetting = document.querySelector(".box-thiet-lap");

setting.addEventListener("click", ()=>{
	var value = contentSetting.style.display;
	if (value == "block") {
		contentSetting.style.display = "none";
	} else {
		contentSetting.style.display = "block";
	}
})
