var personArray = JSON.parse(localStorage.getItem('personArray')) // 存所有已签到用户
var curId = localStorage.getItem('curId')
var curNum = 0
var timer

// 一次抽几人改变事件
var commonCode = [
  { id: 3, title: '三等奖' },
  { id: 2, title: '二等奖' },
  { id: 1, title: '一等奖' },
  { id: 9, title: '特等奖' },
  { id: 5, title: '惊喜奖' },
  { id: 6, title: '惊喜奖' },
  { id: 7, title: '惊喜奖' },
  { id: 8, title: '惊喜奖' },
  { id: 2023, title: '三等奖' },
  { id: 2022, title: '二等奖' },
  { id: 2021, title: '一等奖' },
  { id: 2029, title: '特等奖' },
  { id: 2025, title: '惊喜奖' },
  { id: 2026, title: '惊喜奖' },
  { id: 2027, title: '惊喜奖' },
  { id: 2028, title: '惊喜奖' }
]

// 抽取人数
let titleArr = commonCode.filter(item => {
  return item.id === parseInt(curId)
})
var luckyNum = parseInt($(".select_lucky_number").val())
if (titleArr.length > 0) {
  $("#curTitle").html(titleArr[0].title)
} else {
  $("#curTitle").html('奖')
}

$(".select_lucky_number").bind('change', function () {
  var curNum = parseInt($(this).val())
  if (curNum >= 10) {
    $(this).val(10)
    curNum = 10
  }
  luckyNum = curNum
})

$('#goIndex').click(function () {
  // window.location.href = "http://127.0.0.1:5500/views/index.html?id=" + curId
  window.location.href = "C:/WorkPlace/annual/2020/annual-meeting-lottery/views/index.html?id=" + curId
})

$('#open').click(function () {
  if (luckyNum > 0) {
    localStorage.setItem('lucky_number', luckyNum)
    localStorage.setItem('start', true)
    clearInterval(timer)
    if (curId) {
      // window.location.href = "http://127.0.0.1:5500/views/start.html?id=" + curId
      window.location.href = "C:/WorkPlace/annual/2020/annual-meeting-lottery/views/start.html?id=" + curId
    }
  } else {
    alert('请填写抽奖人数')
  }
})

// 获取数据
function getUser () { 
  $.ajax({
    type: "GET",
    url: "https://nianhui.cloudmas.cn/lottery/users/" + curId,
    dataType: "json",
    async: false,
    global: false,
    timeout: 10000, //超时时间：10秒
    success: function (res) {
      if (res.length > 0) {
        personArray = personArray.concat(res)
        localStorage.setItem('personArray', JSON.stringify(personArray))
      }
    },
    error: function (err) {
      curNum++
      if (curNum === 5) {
        clearInterval(timer)
        curNum = 0
      }
      console.log('请求用户数据失败' + curNum)
    }
  })
}

function init () {
  timer = setInterval(function () {
    getUser()
  }, 1000)
}

if (curId) {
  init()
}
