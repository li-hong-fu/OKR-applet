// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id
  let state = event.state
  try{
    return await db.collection('todo').where({ _id:id }).update({
      data:{
        state:state
      }
    })
  }catch(e){
    console.error(e)
  }
}