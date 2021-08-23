// var ObjectID = require('mongodb').ObjectID
var db = require('../../db')


exports.get = (id) => {
  try {
    return db.get().collection('contacts').findOne({ id: id })
  } catch (e) {
    return null
  }
}

exports.update = (id, newFormData) => {
  // return db.get().collection('contacts').insertOne({"id":"0","contacts": "[]"})
  try {
    return db.get().collection('contacts').updateOne(
      { id: id },
      newFormData
    )
  } catch (e) {
    return null
  }
}

