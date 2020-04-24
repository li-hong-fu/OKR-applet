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
      }
    })
  },
  handActionSheet:function(e){
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let state = e.currentTarget.dataset.state
    wx.showActionSheet({
      itemList:['查看','编辑','标记已完成','删除'],
      success:res => {
        switch(res.tapIndex){
          case 0:
            wx.navigateTo({url:'/pages/okr_detai/okr_detai?id='+id})
            break
          case 1:
            wx.navigateTo({url:'/pages/okr_edit/okr_edit?id='+id})
            break
          case 2:
            this.okrUpdate(id,state)
            break
          case 3:
            this.okrDetele(id,index)
            break
        }
      },
      fail:err => {
        console.log(err)
      }
    })
  },
  okrUpdate:function(id,state){
    let okr = this.data.okr
    wx.cloud.callFunction({
      name:'okrUpdate',
      data:{id,state:state ? 0 : 1},
      success:res => {
        this.setData({okr})
        this.onShow()
      }
    })
  },
  okrDetele:function(id,index){
    let okr = this.data.okr
    wx.cloud.callFunction({
      name:'okrDetele',
      data:{id},
      success:res => {
        okr.splice(index,1)
        this.setData({okr})
      }
    })
  }
})