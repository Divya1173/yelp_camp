var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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

router.post("/campgrounds",middleware.isLogged,function(req, res) {
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
router.get("/campgrounds/new",middleware.isLogged,function(req, res) {
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
router.get("/campgrounds/:id/edit",middleware.checkOwnership,function(req, res) {
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.render("campgrounds/edit",{campground:foundCampground});            
        }
    });

});
// Update campground route
router.put("/campgrounds/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// Destroy Campground Route
router.delete("/campgrounds/:id",middleware.checkOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});



module.exports=router;