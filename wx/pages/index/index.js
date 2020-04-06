//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');

Page({
  data: {
    isLogin: false,
    name: '',
    dialog: false,
    message: '',
    textareaIndexTooHeight: true,
    messageList: [],
    toView: 'msg-0'
  },
  //事件处理函数
  onLoad: function () {
    var _this = this;
    try {
      const name = wx.getStorageSync('name')
      if (name) {
        this.setData({
          isLogin: true,
          name: name
        })
        this.getUserJson();
      }
    } catch (e) { }
    //开启转发
    wx.showShareMenu({
      withShareTicket: true
    })
    
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '不同设备,共享信息(小程序版)',
      path: '/page/index/index',

    }
  },

  getUserJson: function () {
    var _this = this;
    wx.request({
      url: 'https://zhangpengfan.xyz:5002/getuserjson',
      data: {
        name: this.data.name
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        var data = res.data.message
        if (data == undefined) {
          return
        }
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          let time = new Date(data[i].time);
          data[i].time = util.formatTime(time);
        }
        let len = data.length;

        _this.setData({
          messageList: data,
          toView: 'msg-' + (len - 1)
        })
      }
    })
  },
  getName: function (e) {

    this.setData({
      name: e.detail.value
    })
  },
  setName: function () {
    var _this = this
    if(!this.data.name || this.data.name.length < 3){
      wx.showToast({
        title: '名称不合规',
        icon: 'none',
        duration: 1500
      })
      return
    }
    wx.showLoading({
      title: '设置中',
    })
    wx.request({
      url: 'https://zhangpengfan.xyz:5002/setname',
      data: {
        name: this.data.name
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data == 'success') {
          try {
            wx.setStorageSync('name', _this.data.name)
          } catch (e) { }
          _this.setData({
            isLogin: true
          })
          wx.hideLoading();
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  openDialog: function () {
    this.setData({
      dialog: true,
      textareaIndexTooHeight: false
    })
  },
  closeDialog: function () {
    this.setData({
      dialog: false,
      textareaIndexTooHeight: true
    })
  },
  getTextareaValue: function (e) {

    this.setData({
      message: e.detail.value
    })

  },
  send: function () {
    var _this = this

    if (!this.data.message) {
      return
    }
    wx.request({
      url: 'https://zhangpengfan.xyz:5002/sendmessage',
      data: {
        name: this.data.name,
        message: this.data.message
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data == 'success') {
          console.log('success')
          let time = util.formatTime(new Date())
          let newMes = {
            name: _this.data.name,
            txt: _this.data.message,
            type: 'txt',
            time: time
          }
          let newMessageList = _this.data.messageList;
          newMessageList.push(newMes);
          let len = newMessageList.length;
          _this.setData({
            message: '',
            messageList: newMessageList,
            toView: 'msg-' + (len - 1)
          })
        }
      },
      fail(e) {
        console.log('失败')
      }

    })
  },
  copythis: function (e) {
    let txt = e.target.dataset.txt
    wx.setClipboardData({
      data: txt,
      success(res) {
        wx.getClipboardData({
          success(res) {

          }
        })
      }
    })
  },
  sendPic: function () {
    console.log('1')
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          url: 'https://zhangpengfan.xyz:5002/sendpic',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            name: _this.data.name
          },
        
          success(res) {
            _this.getUserJson();
            let len = _this.data.messageList.length + 1;
            _this.setData({
              dialog: false,
              toView: 'msg-' + len - 1,
              textareaIndexTooHeight: true
            })
            wx.hideLoading()

          },
          fail(e) {
            console.log(e)
          }
        })
      }
    })
  },
  savePicture: function (e) {
    let url = e.target.dataset.url;
    //授权保存至相册
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
            }
          })
        }
      }
    })
    console.log(url);
    wx.showLoading({
      title: '下载中',
    })
    wx.downloadFile({
      url: url,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.hideLoading()
          },
          fail(err) {
            console.log(err);
            wx.hideLoading();
          }
        })
      },
      fail(e) {
        console.log(e)
      }

    })
  },
})
