let mongoose = require('mongoose');
Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/chat');

var user_schema = new Schema({
    _id:String,
    first_name:String,
    last_name:String,
    timezone:String,
    locale:String,
    profile_pic:String,
    state:Boolean
});

user_model = mongoose.model('user',user_schema,'users');

module.exports={
    create:(data,callback)=>{
        var item={
            _id:data._id,
            first_name:data.first_name,
            last_name:data.last_name,
            timezone:data.timezone,
            locale: data.locale,
            profile_pic:data.profile_pic,
            state: data.state
        };
        if (data.state=='No'){
            item.state=false;
        }else if(data.state=='Si'){
            item.state=true;
        }else{
            console.log("no se ha podido setear el boolean")
        }
        console.log(item);
        var nuevo = new user_model(item).save();
        callback(item);
    },
    show:(callback)=>{
        user_model.find({},(error,items)=>{
            if(!error){
                callback(JSON.stringify(items));
            }else{
                return console.log(error);
            }
        })
    },
    update: (data,callback)=>{
        console.log(data);
        user_model.findOne({_id:data._id},(error,item)=>{
            item.first_name =data.first_name;
            item.last_name= data.last_name;
            item.timezone=data.timezone;
            item.locale=data.locale;
            item.profile_pic=data.profile_pic;
            item.save();
            callback(item);
        });
    },
    delete:(_id,callback)=>{
        user_model.findOne({_id:_id},(error,post)=>{
           post.remove();
           callback(_id);
        });
    }
};