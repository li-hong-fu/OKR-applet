const App = getApp()

Page({
  data:{
    userInfo:{}
  },
  onLoad:function(){
    App.getUserInfo().then(res =>{
      if(res.nickName){
        wx.switchTab({url:'/pages/todo/todo'})
      }
    })
  },
  onGetUserInfo:function(e){
    if(e.detail.userInfo){
      wx.switchTab({url:'/pages/todo/todo'})
    }
  }
})