$(function () {
  // luckyNum为每次抽几人
  // luckyResult为抽奖结果的集合（数组）
  // luckyNum为5那么luckyResult的length也为5
  var personArray = new Array // 存所有已签到用户
  var lotteryList = [] // 抽奖结果的集合
  var Obj = {}
  Obj.luckyResult = []
  Obj.luckyList = []
  Obj.luckyNum = parseInt(localStorage.getItem('lucky_number'))
  var randomList = []
  var curId = localStorage.getItem('curId') ? parseInt(localStorage.getItem('curId')) : null

  // 两个对象的值是否相同
  function isObjectValueEqual (a, b) {
    var aProps = Object.getOwnPropertyNames(a)
    var bProps = Object.getOwnPropertyNames(b)
    if (aProps.length != bProps.length) {
      return false
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]
      if (a[propName] !== b[propName]) {
        return false
      }
    }
    return true
  }

  // 筛选出已中奖的数据
  function filterData (arr1, arr2) {
    var result = []
    if (arr1.length > 0) {
      if (arr2.length > 0) {
        for (var i = 0; i < arr1.length; i++) {
          var obj = arr1[i]
          var isExist = false
          for (var j = 0; j < arr2.length; j++) {
            var aj = arr2[j]
            if (isObjectValueEqual(aj, obj)) {
              isExist = true
              break
            }
          }
          if (!isExist) {
            result.push(obj)
          }
        }
      } else {
        result = arr1
      }
    }
    return result
  }

  // 图片预加载
  function loadImage (arr, callback) {
    var loadImageLen = 1
    var arrLen = arr.length
    $('.all_number').html("/" + arrLen)
    for (var i = 0; i < arrLen; i++) {
      var img = new Image() //创建一个Image对象，实现图片的预下载
      img.onload = function () {
        img.onload = null
        ++loadImageLen
        $('.current_number').html(loadImageLen)
        if (loadImageLen == arrLen) {
          callback(img) //所有图片加载成功回调
        }
      }
      img.src = arr[i].avatar_url
    }
  }

  // 中奖人员展示效果 传入当前中奖数组中单个的key
  function showLuckyPeople (num) {
    setTimeout(function () {
      var $luckyEle = $('<img class="lucky_icon" />')
      var $userName = $('<p class="lucky_userName"></p>')
      var $userTel = $('<p class="lucky_userTel"></p>')
      var $fragEle = $('<div class="lucky_userInfo"></div>')
      $fragEle.append($luckyEle, $userName, $userTel)
      $('.mask').append($fragEle)
      $(".mask").fadeIn(200)
      $luckyEle.attr('src', randomList[Obj.luckyResult[num]].avatar_url)
      $userName.text(randomList[Obj.luckyResult[num]].nick_name)
      $userTel.text(randomList[Obj.luckyResult[num]].mobile.replace(/^(\d{3})\d*(\d{4})$/,'$1****$2'))
      $fragEle.animate({
        'left': '50%',
        'top': '50%',
        'height': '16vw',
        'width': '16vw',
        'margin-left': '-8vw',
        'margin-top': '-8vw'
      }, 1000, function () {
        setTimeout(function () {
          $fragEle.animate({
            'height': '16vw',
            'width': '16vw',
            'margin-left': '8vw',
            'margin-top': '-4vw'
          }, 400, function () {
            $(".mask").fadeOut(0)
            $luckyEle.attr('class', 'lpl_userImage').attr('style', '')
            $userName.attr('class', 'lpl_userName').attr('style', '')
            $userTel.attr('class', 'lpl_userTel').attr('style', '')
            $fragEle.attr('class', 'lpl_userInfo').attr('style', '')
            $('.winner-list').append($fragEle)
          })
        }, 1000)
      })
    }, num * 2500)
    setTimeout(function () {
      $('.container').hide()
      $('.winners').show()
      $('.winner-img').show()
    }, 2500)
  }

  // 停止按钮事件函数
  $('#stop').click(function () {
    Obj.M.stop()
    $(".container").hide()
    $(this).hide()
    localStorage.setItem('start', false)
    var sessList = JSON.parse(localStorage.getItem('lotteryList')) || []
    randomList = filterData(personArray, sessList) || []
    if (Obj.luckyResult.length > 0) {
      $('.container').html('')
    }
    for (var i = 0; i < Obj.luckyResult.length; i++) {
      lotteryList.push(randomList[Obj.luckyResult[i]])
    }
    Obj.luckyList = sessList.concat(lotteryList)
    localStorage.setItem('lotteryList', JSON.stringify(Obj.luckyList))
    for (var i = 0; i < Obj.luckyResult.length; i++) {
      showLuckyPeople(i)
    }
  })

  // 前端写中奖随机数
  function randomLuckyArr () {
    // 已获奖数
    var sessList = localStorage.getItem('lotteryList') ? JSON.parse(localStorage.getItem('lotteryList')) : []
    // 筛选掉已获奖数
    randomList = filterData(personArray, sessList)
    Obj.luckyResult = []
    if (randomList.length > parseInt(Obj.luckyNum)) {
      for (var i = 0; i < Obj.luckyNum; i++) {
        var random = randomNum(randomList.length - 1, 0);
        if (Obj.luckyResult.indexOf(random) == -1) {
          Obj.luckyResult.push(random)
        } else {
          i--;
        }
      }
    } else {
      for (var j = 0; j < randomList.length; j++) {
        Obj.luckyResult.push(j)
      }
    }
  }

  // 生成[min,max]的随机数
  function randomNum (max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  //此为人工写入获奖结果
  if (localStorage.getItem('start') === 'true') {
    personArray = localStorage.getItem('personArray') ? JSON.parse(localStorage.getItem('personArray')) : []
    if (personArray.length > 0) {
      //执行图片预加载并关闭加载试图
      loadImage(personArray, function (img) {
        $('.loader_file').hide()
      })
      Obj.M = $('.container').lucky({
        row: 7, //每排显示个数  必须为奇数
        col: 5, //每列显示个数  必须为奇数
        depth: 14, //纵深度
        iconW: 30, //图片的宽
        iconH: 30, //图片的高
        iconRadius: 8, //图片的圆角
        data: personArray, //数据的地址数组
      })
      randomLuckyArr()
      if (randomList.length > 0) {
        if (randomList.length >= parseInt(Obj.luckyNum)) {
          Obj.M.open()
          setTimeout(function () {
            $("#stop").show(500)
          }, 1000)
          //人工获奖结果结束
        } else {
          alert('中奖人数已经少于抽奖个数了~')
        }
      } else {
        alert('已经全部中过奖了~')
      }
    }
  }

  $('#goLottery').click(function () {
    // window.location.href = "http://127.0.0.1:5500/views/lottery.html?id=" + curId
    window.location.href = "C:/WorkPlace/annual/2020/annual-meeting-lottery/views/lottery.html?id=" + curId
  })

  $('#goIndex').click(function () {
    // window.location.href = "http://127.0.0.1:5500/views/index.html?id=" + curId
    window.location.href = "C:/WorkPlace/annual/2020/annual-meeting-lottery/views/index.html?id=" + curId
  })

  // 防止误刷新中奖名单消失
  if (Obj.luckyNum > 0 && $('.lpl_userInfo').length === 0 && localStorage.getItem('start') === 'false') {
    let curArr = localStorage.getItem('lotteryList') ? JSON.parse(localStorage.getItem('lotteryList')) : []
    if (curArr.length > 0) {
      curArr = curArr.slice(curArr.length - Obj.luckyNum, curArr.length)
    }
    for (var i = 0; i < curArr.length; i++) {
      var $luckyEle = $('<img class="lucky_icon" />')
      var $userName = $('<p class="lucky_userName"></p>')
      var $userTel = $('<p class="lucky_userTel"></p>')
      var $fragEle = $('<div class="lucky_userInfo"></div>')
      $fragEle.append($luckyEle, $userName, $userTel)
      $luckyEle.attr('src', curArr[i].avatar_url)
      $userName.text(curArr[i].nick_name)
      $userTel.text(curArr[i].mobile)
      $luckyEle.attr('class', 'lpl_userImage').attr('style', '')
      $userName.attr('class', 'lpl_userName').attr('style', '')
      $userTel.attr('class', 'lpl_userTel').attr('style', '')
      $fragEle.attr('class', 'lpl_userInfo').attr('style', '')
      $('.winner-list').append($fragEle)
    }
    $('.container').hide()
    $('.winners').show()
    $('.winner-img').show()
  }

  $('.winner-btn').click(function () {
    var newLottery = []
    for (var j = 0; j < lotteryList.length; j++) {
      newLottery.push({
        nick_name: lotteryList[j].nick_name,
        avatar_url: lotteryList[j].avatar_url,
        mobile: lotteryList[j].mobile
      })
    }
    $.ajax({
      type: "post",
      url: "https://nianhui.cloudmas.cn/winning/users/" + curId,
      data: JSON.stringify(newLottery),
      timeout: 10000, //超时时间：10秒
      contentType: "application/json; charset=utf-8",
      async: true,
      traditional: true, //默认false
      success: function (res) {
        // 成功
      },
      error: function (err) {
        // 失败
      }
    })
  })
})
