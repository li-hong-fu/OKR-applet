// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"test-25fib"
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    let todo_id = event.todo_id;
    let objective = await db.collection('objective').get()
    let todokeyresult = await db.collection('todo_keyresult').where({todo_id:todo_id}).get()
    let objectiveId = objective.data.map(data => data._id)
    let keyresult =  await db.collection('keyresult').where({objective_id: _.in(objectiveId)}).get()
    let keyresult_id = todokeyresult.data.map(data => data.keyresult_id)
    let okr ={}
     objective.data.forEach(data =>{
      data.keyresult = []
      okr[data._id] = data
    })
    keyresult.data.forEach(data =>{
      data.active = keyresult_id.includes(data._id)
      okr[data.objective_id].keyresult.push(data)
    })
    return {
      okr
    }
  }catch(e){
    return {
      code:0,
      mesagee:e
    }
  }
}