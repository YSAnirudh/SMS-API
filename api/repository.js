const UserSchema = require('./models/user');
const bc = require('bcrypt')
exports.addItem = async function (user) {
    hashedPass = await bc.hash(user.password, 10)
    const newItem = await UserSchema.create({
        username : user.username,
        password : hashedPass
    });
    return newItem
}