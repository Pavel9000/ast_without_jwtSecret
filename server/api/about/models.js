// var ObjectID = require('mongodb').ObjectID
var db = require('../../db')


exports.all = (_start, _limit) => {
  try {
      //  console.log(req.query)
    return db.get().collection('about').find().sort({_id:-1}).skip(Number(_start)).limit(Number(_limit)).toArray()
    // return db.get().collection('about').find(  ).sort({_id:-1}).toArray()
  } catch (e) {
    return null
  }
}

exports.update = async (id, newFormData) => {
  // await db.get().collection('about').insertOne({"id":"certificate", "descr": "[]", "isPreview": "", "amountFiles": "0", "title": "" })
  // await db.get().collection('about').insertOne({"id":"photo", "descr": "[]", "isPreview": "", "amountFiles": "0", "title": ""})
  // return db.get().collection('about').insertOne({"id":"0"})
  try {
    return db.get().collection('about').updateOne(
      { id: id },
      newFormData
    )
  } catch (e) {
    return null
  }
}
