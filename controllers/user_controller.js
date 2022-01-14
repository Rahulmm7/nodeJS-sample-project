let User_service = require('../services/user_services'); //requiring user service for database operation
let responseFile = require('../response'); //requiring responsefile for custom response
const User = require('../model/user_model');

//create  a user

exports.create = async (req, res) => {

    try {
        let response = await User_service.user_create(req.body, res);
        if (response) {
            responseFile.successResponse(res, response, "Created a new user")
            return
        }

    }
    catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Invalid username or password !", 400);
    }
};


// user email verify page
exports.user_emailVerify = async (req, res) => {
    const { email, onetp } = req.body;

    try {
        client.get(email, async (err, data) => {
            if (err) {
                console.log("error", err);
            };

            if (data == onetp) {
                User.updateOne({ email: email }, { isEmailVerified: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        return responseFile.successResponse(res, " ", "email verified sucessfully");
                    }
                });
            }
            else {
                return responseFile.errorResponse(res, "Invalid otp", 401)
            };
        })

    } catch (error) {
        return responseFile.errorResponse(res, "server Error", 500);
    }
}


// user Phone number  verify page
exports.user_PhoneVerify = async (req, res) => {
    const { email, number, onetp } = req.body;

    try {
        client.get(number, async (err, data) => {
            if (err) {
                console.log("error", err);
                return responseFile.errorResponse(res, "Invalid number", 401)
            };

            if (data == onetp) {
                User.updateOne({ email: email }, { isPhoneVerified: true }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        return responseFile.successResponse(res, "", "Phone number  verified sucessfully");
                    }
                });
            }
            else {
                return responseFile.errorResponse(res, "Invalid otp", 401);
            };
        })

    } catch (error) {
        return responseFile.errorResponse(res, "server Error", 500);
    }
}

//login page

exports.login = async (req, res) => {

    try {
        let response = await User_service.user_login(req.body, res);
        if (response) {
            responseFile.successResponse(res, response)
            return
        }
        else {
            console.log(" no response from function user_login ");
        }

    } catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Invalid username or password !", 401);
    }
};



//Reading all the entries in collection or entry with specific value( _id)

exports.find = async (req, res) => {
    try {
        let response = await User_service.user_find(req.query);

        if (response) {
            if (response.length == 0) {
                return responseFile.errorResponse(res, "No user found", 404);
            }
            else {
                responseFile.successResponse(res, response, "List of users")
                return
            }
        }

    } catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Something went wrong", 400);
    }
};


//updating user details 

exports.update = async (req, res) => {

    try {
        let response = await User_service.user_update(req.body);
        if (response) {
            responseFile.successResponse(res, response, "User data updated")
            return
        }
        else {
            console.log(" no return from  function user_update ");
        }

    } catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Invalid username ", 401);
    }
};



//Deleting user provided with _id

exports.del = async (req, res) => {
    try {

        let response = await User_service.user_delete(req.params);
        if (response) {
            responseFile.successResponse(res, response, "User deleted")
            return
        }
        else {
            return responseFile.errorResponse(res, "No user found with given id", 400);
        }

    } catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Invalid credentials", 400);

    }
}

