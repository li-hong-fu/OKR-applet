const db = wx.cloud.database()

Page({
  data:{
    okr:[]
  },
  onShow:function(){
    db.collection('objective').get({
      success:res => {
        this.setData({
          okr:res.data
        })
        console.log(res.data)
      }
    })
  }
})