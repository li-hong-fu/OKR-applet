// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let id = event.id
    let state = event.state
    const objective = await db.collection('objective').where({_id:id}).update({
      data:{state}
    })
    const keyresult = await db.collection('keyresult').where({objective_id:id}).update({
      data:{state}
    })
    return {objective,keyresult}
  }catch(e){
    return {e}
  }
}