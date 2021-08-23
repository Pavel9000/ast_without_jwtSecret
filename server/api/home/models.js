// var ObjectID = require('mongodb').ObjectID
var db = require('../../db')


exports.get = (id) => {
  try {
    return db.get().collection('home').findOne({ id: id })
  } catch (e) {
    return null
  }
}

exports.update = (id, newFormData) => {
  // return db.get().collection('home').insertOne({"id":"0","descr": "[]", "video":""})
  try {
    return db.get().collection('home').updateOne(
      { id: id },
      newFormData
    )
  } catch (e) {
    return null
  }
}

