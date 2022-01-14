const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const client = require("../redis");
const otp = require("../otp")
const responseFile = require("../response")




//db querry to create new user / sign up
exports.user_create = async (param, res) => {
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
            isAdmin: false
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




//db querry to login users
exports.user_login = async (req, res) => {
    const { email, password } = req;
    try {

        let user = await User.findOne({ email });


        if (!user)
            return responseFile.errorResponse(res, "No user found", 404);


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)

            return responseFile.errorResponse(res, "Invalid  password !", 401);


        if (!user.isEmailVerified) {
            return responseFile.errorResponse(res, "Email not verified !", 403);
        }

        if (!user.isPhoneVerified) {
            return responseFile.errorResponse(res, "Phone number not verified !", 403);
        }
        if (user.status === "Blocked") {
            return responseFile.errorResponse(res, "Your account is blocked !", 403);
        }
        if (user.status === "Deleted") {
            return responseFile.errorResponse(res, "User unavailable.Your account may be deleted !", 403);
        }
        //creating payload for token generation
        const payload = {
            user: {
                id: user.id
            }
        };
        //creating token using payload
        let token = await jwt.sign(payload, "randomString", { expiresIn: 3600 }, { algorithm: 'RS256' });

        //storing email in redis using token as keyword
        let redisDetails = await client.set(
            token, email, 'EX', 3600
        );

        return token

    } catch (e) {
        responseFile.errorResponse(res, "Server Error", 400);

    }

};




// logedin page

exports.me = async (req, res) => {
    const loginToken = req.header("token");

    try {
        client.get(loginToken, async (err, data) => {
            if (err) {
                console.log("redis  error", err);
            }

            if (data) {
                console.log({
                    info: JSON.stringify(data),
                    message: "valid token"
                });

                // requested user is getting fetched bt user-id  after token authentication
                const user = await User.findById(req.user.id);
                res.json(user);

                if (!user)
                    return responseFile.errorResponse(res, "User Not Exist", 404);
            }
        })

    } catch (e) {
        return responseFile.errorResponse(res, "Error in Fetching user", 400);
    }
}



//db querry to find users
exports.user_find = async (param) => {
    let userList = await User.find({ _id: param }, { password: 0, __v: 0 });
    return userList;
};

//db querry to update the name of user with given email
exports.user_update = (param) => {
    User.updateOne({ email: param.email }, { name: param.name }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log("updated sucessfully");
        }
    });

};


//db querry to delete the user data with given name
exports.user_delete = async (param) => {
    let userDeleteResult = await User.deleteOne({ _id: param.id });
    if (userDeleteResult.deletedCount) {
        return true
    }
    else {
        return false
    }

};