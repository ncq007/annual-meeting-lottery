
var personArray = new Array // 存所有已签到用户
var curNum = 0
var curId = getQueryVariable('id')
localStorage.setItem('curId', curId)

var locaScreen = [10, 40, 70, 110, 150, 190, 230, 280]; //弹幕位置
var timer;
var timer1;
init ()
// initScreen()

// js获取url参数值的几种方式
function getQueryVariable (variable) {
  let query = window.location.search.substring(1);
  let vars = query.split("&");
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    if (pair[0] == variable) { return pair[1]; }
  }
  return (false);
}

function init () {
  timer = setInterval(function () {
    if (personArray.length >= 550) {
      return false
    }
    initScreen() //初始屏幕
    // if (personArray.length > 0) {
    //   personArray.forEach((item, index) => {
    //     $("#user").append(createScreenPraise(personArray[index].nick_name, personArray[index].avatar_url))
    //   })
    // }
  }, 1000)
}

function initScreen () { //初始化屏幕
  // 获取数据
  $.ajax({
    type: "GET",
    url: "https://nianhui.cloudmas.cn/lottery/users/" + curId,
    dataType: "json",
    async: false,
    success: function (res) {
      if (res.length > 0) {
        res.forEach((item, index) => {
          $("#user").append(createScreenPraise(res[index].nick_name, res[index].avatar_url))
        })
        personArray = personArray.concat(res)
        localStorage.setItem('personArray', JSON.stringify(personArray))
      }
    },
    error: function (err) {
      alert("请求数据失败")
    }
  })
}

//推送用户
function createScreenPraise (nick_name, avatar_url) {
  var div = document.createElement("div")
  var divContent = document.createElement("div");
  let str = '<img class="avatar" src="' + avatar_url + '"></img>' + nick_name + '<span class="color">参与成功</span>'
  divContent.className = "tanmuContent";
  divContent.innerHTML = str
  //放入到最后tanmu元素里
  div.className = "tanmu"
  div.appendChild(divContent)
  createScreen(div) //执行生成弹幕的动画
  return div
}

var olN = 0

function createScreen (elem) {
  var _top = 0;
  var _left = $(window).width();
  var lN = Math.floor(8 * Math.random());
  if (olN == lN) {
    lN++;
    if (lN > locaScreen.length - 1) {
      lN = 0;
    }
  }
  olN = lN;
  _top = locaScreen[lN];
  //初始弹幕的位置
  $(elem).css({
    position: 'absolute',
    left: _left,
    top: _top,
    color: "#fff"
  });

  //执行动画时间
  var time = 30000;

  //执行动画
  $(elem).animate({
    left: "-" + _left + "px"
  }, time, function () {
    var docum = document.getElementById("user");
    docum.removeChild(this);
  });
}

$('#goLottery').click(function () {
  window.location.href = "C:/WorkPlace/annual/2020/lottery/views/lottery.html"
})