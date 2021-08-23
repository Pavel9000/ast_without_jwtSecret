const Model = require('./models')
const deleteRecursive = require('../../middleware/deleteRecursive')

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

exports.findById = async function (req, res) {
  try {
    const one = await Model.findById(req.params.id)
    if (!one) { 
      return res.status(500).json({message: "Post not found"})
    }
    return res.json(one)
  } catch (e) {
    return res.status(500).json({message: "Post not found"})
  }
}

exports.create = async function (req, res) {
  try {
    const one = await Model.create(req.body)
    if (!one) { 
      return res.status(500).json({message: "Post not created"})
    }
    return res.json(one.ops[0])
  } catch (e) {
    return res.status(500).json({message: "Post not created"})
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


exports.delete = async function (req, res) {
  try {
    const one = await Model.delete(req.params.id)
    if (!one) { 
      return res.status(500).json({message: "Post not deleted"})
    }
    deleteRecursive.folderSync(req.rootDirName+'/client/public/img/'+req.pathForFiles+'/'+req.params.id)
    return res.json({message: "ok"})
  } catch (e) {
    return res.status(500).json({message: "Post not deleted"})
  }
}
