const Model = require('./models')
// const deleteRecursive = require('../../middleware/deleteRecursive')

exports.get = async function (req, res) {
  try {
    let id = "0"
    const all = await Model.get(id)
    if (!all) { 
      return res.status(500).json({message: "not found"})
    }
    return res.json(all)
  } catch (e) {
    return res.status(500).json({message: "not found"})
  }
}


exports.update = async function (req, res) {
  try {
    req.body.id = "0"
    const newFormData = {
      $set: req.body
    }
    const one = await Model.update(req.body.id, newFormData)
    if (!one) { 
      return res.status(500).json({message: "not updated"})
    }
    return res.json({message: "ok"})
  } catch (e) {
    return res.status(500).json({message: "not updated"})
  }
}
