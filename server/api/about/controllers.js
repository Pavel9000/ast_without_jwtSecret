const Model = require('./models')
// const deleteRecursive = require('../../middleware/deleteRecursive')

exports.all = async function (req, res) {
  try {
    const list = await Model.all(req.query._start, req.query._limit)
    if (!list) { 
      return res.status(500).json({message: "Posts not found"})
    }
    return res.json(list)
  } catch (e) {
    return res.status(500).json({message: "Posts not found"})
  }
}

exports.update = async function (req, res) {
  try {
    const newFormData = {
      $set: req.body
    }
    const one = await Model.update(req.params.id, newFormData)
    if (!one) { 
      return res.status(500).json({message: "Post not updated"})
    }
    return res.json({message: "ok"})
  } catch (e) {
    return res.status(500).json({message: "Post not updated"})
  }
}

