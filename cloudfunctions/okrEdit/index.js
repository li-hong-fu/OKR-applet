// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let objective_id = event.id
  let title = event.objective
  let keyresult = event.keyresult
  let date_display = event.date_display
  let finished_time = event.finished_time
  let state = event.state
  let createTime = event.createTime
  
  try{
    let objective = await db.collection('objective')
      .where({_id:objective_id})
      .update({data:{
        title:title
      }})

    let keyresults = await Promise.all(keyresult.map(async(data) => {
      if(data._id){
        return await db.collection('keyresult').where({_id:data._id}).update({
          data:{
            title:data.title
          }
        })
      }else{
        return await db.collection('keyresult').add({
          data:{
            objective_id,title:data.title,date_display,finished_time,state,createTime
          }
        })
      }
    }))

    return {objective,keyresults}
  }catch(e){
    return {e}
  }
}