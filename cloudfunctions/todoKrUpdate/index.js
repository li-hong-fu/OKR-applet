// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let todo_id = event.todo_id
    let active = event.active
    let keyresult_id = event.keyresult_id
    // await db.collection('keyresult').where({_id:keyresult_id}).update({
    //   data:{
    //     active:!active
    //   }
    // })

    if(!active){
      await db.collection('todo_keyresult').add({
        data:{todo_id,keyresult_id}
      })
    }else{
      await db.collection('todo_keyresult').where({keyresult_id:keyresult_id}).remove()
    }

    return {todo_id}
  }catch(e){
    return {e}
  }
}