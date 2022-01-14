const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require("../redis");
const otp = require("../otp")
const responseFile = require("../response")


//db querry to create new user / sign up
exports.admin_create = async (param) => {
    const email = param.email;
    let user = await User.findOne({ email });
    if (user)
        return responseFile.errorResponse(res, "User Already Exit", 403);

    const user1 = new User(
        {
            name: param.name,
            email: param.email,
            password: param.password,
            isEmailVerified: false,
            isPhoneVerified: false,
            isAdmin: true
        }
    );

    //password hashing
    const salt = await bcrypt.genSalt(10);
    user1.password = await bcrypt.hash(param.password, salt);
    await user1.save();

    //create a payload for token generation
    const payload = {
        user: {
            id: user1.id
        }
    };

    //token generation using payload
    let token = jwt.sign(payload, "randomString", { expiresIn: 10000 }, { algorithm: 'RS256' });

    //storing email id in redis using  jwt token as keyword
    let redisDetails = await client.set(
        token, email, 'EX', 3600
    );

    //sending mail and getting otp
    const mailer = require("../email");
    const sms = require("../twiliosms");

    //storing otp in redis using  email as keyword for email verification
    let redisEmail = await client.set(
        email, otp, 'EX', 86400
    );

    let number = param.number;
    //storing otp in redis using  mobile number as keyword for phone number verification
    let redismobile = await client.set(
        number, otp, 'EX', 86400
    );
    return token
};

//admin login page
exports.admin_login = async (req, res) => {
    const { email, password } = req;

    try {
        let user = await User.findOne({ email });

        if (!user)
            return responseFile.errorResponse(res, "No user found", 404);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch)
            return responseFile.errorResponse(res, "Invalid  password", 401);

        if (!user.isAdmin) {
            return responseFile.errorResponse(res, "You are not admin !", 403);
        }
        if (!user.isEmailVerified) {
            return responseFile.errorResponse(res, "Email not verified !", 403);
        }
        if (!user.isPhoneVerified) {
            return responseFile.errorResponse(res, "Phone number not verified !", 403);
        }
        if (user.status === "Blocked") {
            return responseFile.errorResponse(res, "Your account is blocked !", 403);
        }


        //creating payload
        const payload = {
            user: {
                id: user.id
            }
        };
        //generating token using payload
        let token = await jwt.sign(payload, "randomString", { expiresIn: 3600 }, { algorithm: 'RS256' });

        //storing email in redis using jwt token as keyword
        let redisDetails = await client.set(
            token, email, 'EX', 3600
        );

        return token

    } catch (e) {
        console.log(e)
        responseFile.errorResponse(res, "Server Error", 400);
    }
};

//db querry of admin page to view user data

exports.get_userData = async (req, res) => {

    try {

        const { status } = req;
        if (!status) {
            let userList = await User.find({}, { password: 0, __v: 0 });
            responseFile.successResponse(res, userList, "list of all users");
        }
        else {
            let userList = await User.find({ status: status }, { _id: 1 });
            responseFile.successResponse(res, userList, `list of  ${status} users`);
        }

    } catch (error) {
        responseFile.errorResponse(res, "error in fetching user", 400);
    }
}


//db querry to update the user  status  with given email
exports.update_userStatus = async (req, res) => {
    let status = req.status;
    let userUpdateResult = await User.updateOne({ email: req.email }, { status: status });
    if (userUpdateResult.matchedCount) {
        return true
    }
    else {
        return false
    }



};