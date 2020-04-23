const db = wx.cloud.database()
import { formatTime } from '../../utils/date'

Page({
  data:{
    objective:'',
    keyresult:[{title:''}],
    objective_id:''
  },
  onLoad:function(e){
    let id = e.id
    this.setData({objective_id:id})
    db.collection('objective').where({_id:id}).get({
      success:res => {
        this.setData({objective:res.data[0].title})
        console.log(this.data.objective)
      }
    })
    db.collection('keyresult').where({objective_id:id}).get({
      success:res => {
        this.setData({keyresult:res.data})
      }
    })
  },
  handAddKeyresult:function(){
    let keyresult = this.data.keyresult
    keyresult.push({title:''})
    this.setData({
      keyresult
    })
  },
  handDeleteKeyresult:function(event){
    let id = event.currentTarget.dataset.id
    let index = event.currentTarget.dataset.index
    let keyresult = this.data.keyresult

    wx.showModal({
      title:'确定删除吗?',
      success:res => {
        if(res.confirm){
          wx.cloud.callFunction({
            name:'krDetele',
            data:{id},
            success:res => {
              keyresult.splice(index,1)
              this.setData({keyresult})
            }
          })
        }
      }
    })
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
  handEdit:function(){
    let id = this.data.objective_id
    let objective = this.data.objective
    let keyresult = this.data.keyresult
    let date_display = formatTime(new Date())
    let finished_time = null
    let state = 0
    let createTime = db.serverDate();

    let keyresults = keyresult.every(data => data.title)

    if(!objective || !keyresults){
      wx.showToast({
        icon:'none',
        title:'缺少内容'
      })
      return
    }

    wx.cloud.callFunction({
      name:'okrEdit',
      data:{
        id,objective,keyresult,date_display,finished_time,state,createTime
      },
      success:res => {
        wx.switchTab({
          url:'/pages/okr/okr'
        })
      }
    })
  }
})