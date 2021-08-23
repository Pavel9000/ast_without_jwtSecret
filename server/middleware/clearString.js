
module.exports = async (req, res, next) => {

  // console.log(typeof req.body)
  // console.log(req.body)

  let body = req.body
  req.body = {}
  for (let keyReqBody in body) {
    let keyBodyStr = await escape(typeof keyReqBody === 'string' ? keyReqBody : JSON.stringify(keyReqBody) )
    let valBodyStr = await escape(typeof body[keyReqBody] === 'string' ? body[keyReqBody] : JSON.stringify(body[keyReqBody]))
    req.body[keyBodyStr] = valBodyStr
  }

  // console.log(typeof req.body)
  // console.log(req.body.descrArr)
  // console.log(JSON.parse(req.body.descrArr))
  
// замена спецсимволов
    function escape(string) {
      var htmlEscapes = {
          // '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          // '`': '&acute;',
          // '"': '&quot;',
          // "'": '&prime;'
      };  
      // return string.replace(/[&<>`"']/g, function(match) {
      return string.replace(/[<>]/g, function(match) {
          return htmlEscapes[match];
      });
  };


      next()
}
