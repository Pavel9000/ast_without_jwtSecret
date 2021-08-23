const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const Auth = require('./models');

const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      
  exports.register = async function (req, res) {
    return res.json({ "message": "error register" })

    try {
      if (!req.body.email 
          || !req.body.pass 
          || !re.test(req.body.email)
          || req.body.pass.length < 8
      ) {
        return res.send('error register')
      }
      const candidate = await Auth.findUserByEmail(req.body.email)
      if (candidate) { 
        return res.status(400).json({message: "This user already exist"})
      }
      const hashedPass = await bcrypt.hash(req.body.pass, 5)
      const dataUser = {
        id: Date.now()+'_'+Math.round(Math.random()*1e9),
        email: req.body.email,
        hashedPass: hashedPass,
        timeCreatedPass: Date.now()
      }
      const candidateRegistered = await Auth.register(dataUser)
      if (!candidateRegistered) {
        return res.json({ "message": "error register" })
      }
      const token = jwt.sign(
        { 
          id: candidateRegistered.ops[0].id, 
          timeCreatedPass: candidateRegistered.ops[0].timeCreatedPass
        },
        config.get('jwtSecret'),
        { expiresIn: '36500 days' }
      )
      return res.json({ token })
    } catch (e) {
      console.log(e)
      return res.sendStatus(500)
    }

  }

  exports.login = async (req, res) => {
    // console.log(5)
    try {
      if (!req.body.email 
          || !req.body.pass 
          || !re.test(req.body.email)
          || req.body.pass.length < 8
      ) {
        return res.send('error auth')
      }
      const user = await Auth.findUserByEmail(req.body.email)
      // console.log(user)
      if (!user) {
        return res.status(400).json({message: 'Error authorization'})
      }
      const isMatch = await bcrypt.compare(req.body.pass, user.hashedPass)
      if (!isMatch) {
        return res.status(400).json({ message: "Error authorization"})
      }
      let jwtBody = {
        userId: user.id,
        timeCreatedPass: user.timeCreatedPass
      }
      if (user.rights === 'superAdmin') {
        jwtBody.rights = 'superAdmin'
      }
      const token = jwt.sign(
        jwtBody,
        config.get('jwtSecret'),
        { expiresIn: '36500 days' }
      )
      return res.json({ token })
    } catch (e) {
      console.log(e)
      return res.status(400).json({ message: "Error authorization"})
    }

}
