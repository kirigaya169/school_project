const jwt = require('jsonwebtoken');
const chalk = require('chalk');

module.exports = function(roles){
    return function(req, res, next){
        if (req.method == "OPTIONS"){
            next();
        }
        try{
            const token = req.headers.authorization.split(' ')[1];
            if (!token){
                return res.status(403).json({message: "Пользователь не авторизован"});
            }
            const user = jwt.verify(token, process.env.TOKEN_KEY);
            var userRoles = user.roles;
            var hasRole = false;
            console.log(userRoles);
            userRoles.forEach(role => {
                if (roles.includes(role)){
                    hasRole = true;
                }
            })
            if (!hasRole){
                return res.status(403).json({message: "У вас нет доступа"});
            }
            req.user = user;
            next();
        }catch(e){
            console.log(chalk.red(e));
            return res.status(403).json({message: "Пользователь не авторизован"});
        }
    }
}