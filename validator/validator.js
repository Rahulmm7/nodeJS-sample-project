const { check, validationResult } = require('express-validator');

exports.validateUserCreate = [
    check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({ min: 2 })
        .withMessage('Minimum 2 characters required!')
        .bail(),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('email cannot be empty!')
        .isEmail()
        .withMessage('enter valid email')
        .bail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .isLength({ min: 6 })
        .withMessage('Minimum 2 characters required!'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.validateUserLogin = [

    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('email cannot be empty!')
        .isEmail()
        .withMessage('enter valid email')
        .bail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .isLength({ min: 6 })
        .withMessage('Minimum 2 characters required!'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.validateUserFind = [
    check('_id')
        .trim()
        .escape()
        .isAlphanumeric()
        .withMessage('User id should be alphanumeric')
        .not()
        .isEmpty()
        .withMessage('User id can not be empty!')
        .bail()

        .isLength({ min: 2 })
        .withMessage('Minimum 2 characters required!')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];



exports.validateUserUpdate = [
    check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({ min: 2 })
        .withMessage('Minimum 2 characters required!')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];

exports.validateUserDelete = [
    check('_id')
        .trim()
        .escape()
        .isAlphanumeric()
        .withMessage('User id should be alphanumeric')
        .not()
        .isEmpty()
        .withMessage('User id can not be empty!')
        .bail()

        .isLength({ min: 2 })
        .withMessage('Minimum 2 characters required!')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    },
];