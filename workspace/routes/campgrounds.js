var express = require("express");
var router  = express.Router();
var Campground =require("../models/campground");

router.get("/campgrounds",function(req, res){
    Campground.find({},function(err,allCampgrounds){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds,currentUser:req.user});
        }
    });
});

router.post("/campgrounds",isLogged,function(req, res) {
    var name=req.body.name;
    var image=req.body.image;
    var description=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground={name:name,image:image,description:description,author:author};
    Campground.create(newCampground,function(err,newlyCreated){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});
router.get("/campgrounds/new",isLogged,function(req, res) {
    res.render("campgrounds/new");
});
router.get("/campgrounds/:id",function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
        if(err)
        {
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground:foundCamp});
        }
    });
});
// Edit campground route 
router.get("/campgrounds/:id/edit",checkOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground:foundCampground});            
        }
    });

});
// Update campground route
router.put("/campgrounds/:id",checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/campgrounds/:id",checkOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});
function checkOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err){
                res.redirect("back");
            }else{
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

function isLogged(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports=router;