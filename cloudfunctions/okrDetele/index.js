// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let id = event.id
    const objective = await db.collection('objective').where({_id:id}).remove()
    const keyresult = await db.collection('keyresult').where({objective_id:id}).remove()
    return {objective,keyresult}
  }catch(e){
    return {e}
  }
}