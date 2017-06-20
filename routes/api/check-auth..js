/**
 * Created by igorgo on 19.06.2017.
 */
var checkAuth = function(req, res, next) {
    if (req.session && req.session.user)
        return next();
    else
        req.session.afterLogin = req.originalUrl;
    return res.status(401).redirect('/login');
};

module.exports = checkAuth;