let admin_service = require('../services/admin_services'); //requiring user service for database operation
let responseFile = require('../response'); //requiring responsefile for custom response


//create  a user

exports.create = async (req, res) => {

    try {
        let response = await admin_service.admin_create(req.body);
        if (response) {
            responseFile.successResponse(res, response, "Created a new user")// code 201
            return
        }
    }
    catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Invalid username or password !", 400);
    }
};

//admin login page
exports.adminLogin = async (req, res) => {
    try {
        let response = await admin_service.admin_login(req.body, res);
        if (response) {
            responseFile.successResponse(res, response, "token")
            return
        }
        else {
            console.log(" no response from function user_login !!!");
        }

    } catch (error) {
        return responseFile.errorResponse(res, error, 400);

    }
}

//admin view details page 

exports.getUserData = async (req, res) => {
    try {
        let response = await admin_service.get_userData(req.body, res);

    } catch (error) {
        return responseFile.errorResponse(res, "currently no data available !!!")

    }
}


//updating user status 

exports.updateUserStatus = async (req, res) => {

    try {

        let response = await admin_service.update_userStatus(req.body, res);
        if (response) {
            responseFile.successResponse(res, response, "user status updated !!!")
            return
        }
        else {
            return responseFile.errorResponse(res, "Invalid email !!! ", 400);
        }


    } catch (error) {
        console.log("error", error);
        return responseFile.errorResponse(res, "Server eror !!! ", 500);
    }
};

