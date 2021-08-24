const chalk = require('chalk');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    if (req.method == "OPTIONS"){
        next();
    }
    try{
        const token = req.headers.authorization.split(' ')[1];
        if (!token){
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
        var key = process.env.TOKEN_KEY || "1a2b-3c4d-5e6f-7g8h";
        const decodedData = jwt.verify(token, key);
        req.user = decodedData;
        next();
    }catch(e){
        console.log(chalk.red(e));
        return res.status(403).json({message: "Пользователь не авторизован"});
    }
}