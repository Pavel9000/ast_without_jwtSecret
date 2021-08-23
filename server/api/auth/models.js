// var ObjectID = require('mongodb').ObjectID
const db = require('../../db')


exports.findUserByEmail = email => {
  try {
    // if (email === 'eee@eee.eee') {
    //   return {
    //     "_id": `ObjectId(sfgdfg34t`,
    //     "email": "eee@eee.eee",
    //     "pass":"$2a$04$wfXSm8Tdj3jWb7fTIpE3POR/Av1tGPW1/0cLpUKoYn8LNmrmSRMSi"
    //   }
    // }
    // return null

    return db.get().collection('users').findOne({ email: email })
  } catch (e) {
    return null
  }
}

exports.register = (dataUser) => {
  try {
    return null
    // return console.log(dataUser)
    // return db.get().collection('users').insertOne(dataUser)
  } catch (e) {
    return null
  }
}


