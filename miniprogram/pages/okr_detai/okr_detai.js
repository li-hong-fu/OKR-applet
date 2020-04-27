const db = wx.cloud.database()
const _ = db.command

Page({
  data:{
    objective:{},
    todo_keyresult:[]
  },
  onLoad:function(e){
    db.collection('objective').where({_id:e.id}).get({
      success:res => {
        this.setData({objective:res.data[0]})
      }
    })
    db.collection('keyresult').where({objective_id:e.id}).get({
      success: res =>{
        let keyresult = res.data
        let keyresult_id = res.data.map(data => data._id)

        db.collection('todo_keyresult').where({keyresult_id:_.in(keyresult_id)}).get({
          success:res => {
            let todo_keyresult = res.data
            let todo_id = res.data.map(data => data.todo_id)

            db.collection('todo').where({_id:_.in(todo_id)}).get({
              success: res => {
                let todo = res.data

                let keyresults = []
                keyresult.forEach((data,index) => {
                  data.todo = []
                  keyresults[index] = data

                  todo_keyresult.forEach(data => {
                    if(keyresult[index]._id === data.keyresult_id){
                      let todoIds = data.todo_id
                      todo.forEach(data => {
                        if(todoIds === data._id){
                          keyresults[index].todo.push(data)
                        }
                      })
                    }
                  })
                })

                this.setData({
                  todo_keyresult:keyresults
                })
                
                console.log(this.data.objective)
                console.log(this.data.todo_keyresult)
              }
            })
          }
        })
      }
    })
  }
})