const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
    //username or password create karane ke jarurat nhi hai kyo ki passport-local-mongoose automatically create kra dega
});

userSchema.plugin(passportLocalMongoose);//username,salting,plugin automatically create krr dega

module.exports = mongoose.model('User', userSchema);