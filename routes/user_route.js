const express = require("express");
const router = express.Router();

const { create, find, del, update, login, user_PhoneVerify, user_emailVerify } = require("../controllers/user_controller"); //requiring controller modules
const { me } = require("../services/user_services");
let { validateUserCreate, validateUserLogin, validateUserUpdate, validateUserFind } = require('../validator/validator') //requiring validation middleware
const auth = require('../authincation/authenication'); //requiring authenication using jwt token middleware

router.post("/signup", validateUserCreate, create);
router.post("/login", validateUserLogin, login);
router.post("/verify", user_emailVerify);
router.post("/verifyPhone", user_PhoneVerify);
router.get("/", auth, validateUserFind, auth, find);
router.put("/", validateUserUpdate, auth, update);
router.delete("/:id", auth, del);
router.get("/me", auth, me);

module.exports = router;