module.exports = function(req,res,next){
    // req.user
    //this function executes after auth 
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');




    next();
}