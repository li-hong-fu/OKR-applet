const db = wx.cloud.database()
import { formatTime } from '../../utils/date'

Page({
  data:{
    objective:'',
    keyresult:[{title:''}]
  },
  handAddKeyresult:function(){
    let keyresult = this.data.keyresult
    keyresult.push({title:''})
    this.setData({
      keyresult
    })
  },
  handDeleteKeyresult:function(event){
    let index = event.currentTarget.dataset.index
    let keyresult = this.data.keyresult
    keyresult.splice(index,1)
    this.setData({keyresult})
  },
  handObjective:function(e){
    let value = e.detail.value
    this.setData({
      objective:value
    })
  },
  handKeyresult:function(e){
    let index = e.currentTarget.dataset.index
    let value = e.detail.value
    let keyresult = this.data.keyresult
    keyresult[index].title = value
    this.setData({
      keyresult
    })
  },
  handCreate:function(){
    let title = this.data.objective
    let keyresult = this.data.keyresult
    let date_display = formatTime(new Date())
    let finished_time = null
    let state = 0
    let createTime = db.serverDate();
    
    let krTitle = keyresult.every(data => data.title)

    if(!title || !krTitle){
      wx.showToast({
        icon:'none',
        title:'缺少内容'
      })
      return
    }

    db.collection('objective').add({
      data:{
        title,date_display,finished_time,state,createTime
      },
      success:res => {
        let objective_id = res._id
        keyresult.forEach(data => {
          let title = data.title
          db.collection('keyresult').add({
            data:{
              objective_id,title,date_display,finished_time,state,createTime
            },
            success:res => {
              wx.showToast({
                icon:'none',
                title:'添加成功!'
              })
              wx.switchTab({url:'/pages/okr/okr'})
            }
          })
        })
      }
    })
  }
})