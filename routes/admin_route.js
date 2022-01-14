const express = require("express");
const router = express.Router();

const { adminLogin, updateUserStatus, getUserData, create } = require("../controllers/admin_controller")
const { validateUserCreate, validateUserLogin, validateUserUpdate, validateUserDelete } = require('../validator/validator') //requiring validation middleware
const auth = require('../authincation/authenication'); //requiring authenication using jwt token middleware

router.post("/signup", validateUserCreate, create);
router.post("/login", validateUserLogin, adminLogin);
router.post("/getAllUsers", auth, getUserData);
router.post("/getBlockedUsers", auth, getUserData);
router.post("/getDeletedUsers", auth, getUserData);
router.put("/deleteUsers", auth, updateUserStatus);
router.put("/BlockUsers", auth, updateUserStatus);

module.exports = router;