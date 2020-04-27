const db = wx.cloud.database()
const _ = db.command

Page({
  data:{
    okr:[],
    todo_id:''
  },
  onLoad:function(e){
    this.setData({todo_id:e.id})
    
  },
  onShow:function(){
    let todo_id = this.data.todo_id
    wx.cloud.callFunction({
      name:'todoKeyresylt',
      data:{todo_id:todo_id},
      success:res => {
        console.log(res)
        this.setData({okr: res.result.okr})
      }
    })
   
    // let objective =[]
    // let keyresult = []
    // db.collection('objective').get({
    //   success:res => {
    //     objective.push(res.data)
    //     let id = objective[0].map(data => data._id)
    //     db.collection('keyresult').where({objective_id:_.in(id)}).get({
    //       success:res => {
    //         keyresult.push(res.data)
    //         let okr = []
    //         objective[0].forEach((data,index)=>{
    //           data.keyresult = []
    //           okr[index] = data
    //           keyresult[0].forEach(data =>{
    //             data.active = false
    //             if(objective[0][index]._id === data.objective_id){
    //               okr[index].keyresult.push(data)
    //             }
    //           })
    //         })
    //         this.setData({okr})
    //       }
    //     })
    //   }
    // })
  },
  handUpdate:function(e){
    let todo_id = this.data.todo_id
    let active = e.currentTarget.dataset.active
    let keyresult_id = e.currentTarget.dataset.keyresult_id

    wx.cloud.callFunction({
      name:'todoKrUpdate',
      data:{active,keyresult_id,todo_id},
      success:res => {
        this.onShow()
      }
    })
  }
})