var middlewareObj={};
var Comment =require("../models/comment");
var Campground =require("../models/campground");

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                req.flash("error","Comment Not Found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You are not authorized !!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to Login!!");
        res.redirect("back");
    }
};

middlewareObj.checkOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                req.flash("error","Campground not found!!");
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error","You are not authorized !!");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error","You need to Login!!");
        res.redirect("back");
        
    }
};
middlewareObj.isLogged=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to Login!!");
    res.redirect("/login");
}

module.exports= middlewareObj