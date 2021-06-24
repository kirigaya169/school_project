const error = require('../error.js');

module.exports = function(err, req, res, next){
    if (err instanceof error){
        return res.status(err.status).json(err.message);
    }
    return res.status(500).json("Непредвиденная ошибка сервера");
}