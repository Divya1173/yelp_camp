var mongoose   = require("mongoose");
var Campground = require("./models/campground");
var Comment    = require("./models/comment");
var data=[
    {
        name:"Paradise Peace",
        image:"https://www.photosforclass.com/download/flickr-7121865553",
        description:"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name:"Blue Sky",
        image:"https://www.photosforclass.com/download/flickr-1342367857",
        description:"blah blah blah"
    },
    {
        name:"Thirst junction",
        image:"https://www.photosforclass.com/download/flickr-2164766085",
        description:"blah blah blah"
    }
    ]

function seedDB(){
    Campground.remove({},function(err){
        if(err)
        {
            console.log(err);
        }
        data.forEach(function(seed){
            Campground.create(seed,function(err,campground){
                if(err)
                {
                    console.log(err);
                }
                else{
                    Comment.create(
                        {
                            text:"This place is great, but i wish there was internet",
                            author:"Homer"
                        },function(err,comment){
                            if(err)
                            {
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                            }
                        });
                }
            });
        });    
    });
}

module.exports=seedDB;