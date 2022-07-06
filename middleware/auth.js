// protecting routes

module.exports = {
    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/blog/login');
        }
    },
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/blog/dashboard/' + req.user.id);
        }else{
            return next();
        }
    },
    ensureToken: function(req, res, next){
        if(req.body.token === process.env.SECRET){
            return next();
        }else{
            res.render("error")
        }
    }
}