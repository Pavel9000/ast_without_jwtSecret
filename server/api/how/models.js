// var ObjectID = require('mongodb').ObjectID
var db = require('../../db')


exports.get = (id) => {
  try {
    return db.get().collection('how').findOne({ id: id })
  } catch (e) {
    return null
  }
}

exports.update = (id, newFormData) => {
  // return db.get().collection('how').insertOne({"id":"0","descr": "[]", "video":""})
  try {
    return db.get().collection('how').updateOne(
      { id: id },
      newFormData
    )
  } catch (e) {
    return null
  }
}

