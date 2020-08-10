var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UsernameExists = require('../validators/userNameExists');
var PasswordValidate = require('../validators/passwordValidate');
const bcrypt = require("bcryptjs"); 
var userSchema = new Schema({
    username:{
        type:String, 
        trim:true,
        required:[true, 'Username is required.'],
        maxlength:[50, 'Username must be not more than 50 characters'],
        minlength:[8, 'Username must be more than 8 characters'],
    },
    password:{
        type:String,
        trim:true,
        required:[true, 'Password is required.'],
        maxlength:[50, 'Password must be not more than 50 characters'],
        minlength:[8, 'Password must be more than 8 characters'],
    },
    token:{type:String, trim:true},
    created_at:{type:Date, default:Date.now},
    updated_at:{type:Date, default:Date.now},
});
userSchema.post('validate', function(){
    var password = this.password;
    var hashedPassword = bcrypt.hashSync(password, 8);
    this.password = hashedPassword;
})
userSchema.path('username').validate(UsernameExists,'Username already exists.');
userSchema.path('password').validate(PasswordValidate, 'Password must have a captial letter and a number.');
var User = mongoose.model('User', userSchema);


module.exports = User;