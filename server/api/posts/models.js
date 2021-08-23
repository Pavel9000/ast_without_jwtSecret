// var ObjectID = require('mongodb').ObjectID
var db = require('../../db')


exports.all = (_start, _limit) => {
  try {
      //  console.log(req.query)
    return db.get().collection('posts').find().sort({_id:-1}).skip(Number(_start)).limit(Number(_limit)).toArray()
    // return db.get().collection('posts').find(  ).sort({_id:-1}).toArray()
  } catch (e) {
    return null
  }
}

exports.findById = (id) => {
  try {
    return db.get().collection('posts').findOne({ id: id })
  } catch (e) {
    return null
  }
}

exports.create = (formData) => {
  try {
    return db.get().collection('posts').insertOne(formData)
  } catch (e) {
    return null
  }
}

exports.update = (id, newFormData) => {
  try {
    return db.get().collection('posts').updateOne(
      { id: id },
      newFormData
    )
  } catch (e) {
    return null
  }
}

exports.delete = (id) => {
  try {
    return db.get().collection('posts').deleteOne(
      { id: id }
      // { _id: ObjectID(id) }
    )
  } catch (e) {
    return null
  }
}

