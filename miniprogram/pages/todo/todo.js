const db = wx.cloud.database()
const App = getApp()
import { formatTime } from '../../utils/date'

Page({
  data:{
    todoList:{},
    content:'',
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
          console.log(this.data.todoList)
        }
      })
    })
  },
  getInput:function(e){
    let value = e.detail.value
    this.setData({
      content:value
    })
  },
  addTodo:function(e){
    let openid = this.data.openid
    let content = this.data.content
    let userInfo = App.globalData.userInfo
    let date_display = formatTime(new Date())
    let state = 0
    let createTime = db.serverDate();
    
    if(!content){
      wx.showToast({
        icon:'none',
        title:'缺少内容'
      })
      return
    }

    db.collection('todo').add({
      data:{
        openid,content,userInfo,date_display,state,createTime
      },
      success:res => {
        let todoList = this.data.todoList
        wx.showToast({
          icon:'none',
          title:'添加成功!'
        })
        this.setData({ 
          todoList:todoList,
          content:''
        })
        this.onShow()
      }
    })
  },
  handActionSheet:function(e){
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    wx.showActionSheet({
      itemList:['关联','完成','删除'],
      success:res => {
        switch(res.tapIndex){
          case 0:
            wx.navigateTo({url:'/pages/todo_keyresult/todo_keyresult?id='+id})
            break
          case 1:
            this.todoUpdate(id,index)
            break
          case 2:
            this.todoDelete(id,index)
            break
        }
      }
    })
  },
  todoUpdate:function(id,index){
    let state = 1
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