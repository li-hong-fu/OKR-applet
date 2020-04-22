const db = wx.cloud.database()
const App = getApp()

Page({
  data:{
    todoList:{},
    openid:''
  },
  onShow:function(){
    App.getOpenid().then(res => {
      this.setData({openid:res})
      let openid = this.data.openid
      db.collection('todo').where({_openid:openid}).get({
        success:res => {
          this.setData({
            todoList:res.data
          })
        }
      })
    })
  },
  handActionSheet:function(e){
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList:['未完成','删除'],
      success:res => {
        switch(res.tapIndex){
          case 0:
            this.todoUpdate(id,index)
            break
          case 1:
            this.todoDelete(id,index)
            break
        }
      }
    })
  },
  todoUpdate:function(id,index){
    let state = 0
    wx.cloud.callFunction({
      name:'todoUpdate',
      data:{ id,state },
      success:res => {
        let todoList = this.data.todoList
        todoList.splice(index,1)
        wx.showToast({
          icon:'none',
          title:'修改成功!'
        })
        this.setData({
          todoList:todoList
        })
      },
      fail:err => {
        console.error(err)
      }
    })
  },
  todoDelete:function(id,index){
    wx.cloud.callFunction({
      name:'todoDelete',
      data:{ id },
      success:res => {
        let todoList = this.data.todoList
        todoList.splice(index,1)
        wx.showToast({
          icon:'none',
          title:'删除成功!'
        })
        this.setData({
          todoList:todoList
        })
      }
    })
  }
})