const error = require('../error.js');

module.exports = function(err, req, res, next){
    if (err instanceof error){
        return res.status(err.status).json({data: err.message});
    }
    console.log(err);
    return res.status(500).json({data: "Непредвиденная ошибка сервера"});
}