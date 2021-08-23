const config = require('config')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.json({"message": "Error authorization"})
    }
    // return res.json(req.body)
    // return console.log(req.headers.token)
    // return console.log(req.body)
    try {
      if (!req.headers.token) {
        return res.status(401).json({"message": "Error authorization"})
      }
      const decoded = await jwt.verify(req.headers.token, config.get('jwtSecret'))
      if (decoded.rights !== 'superAdmin') {
        return res.status(401).json({"message": "Error authorization"})
      }
      // console.log(decoded)
      // return res.json({"message": "ok"})
      next()
    } catch(err) {
      return res.status(401).json({"message": "Error authorization"})
    }
}
