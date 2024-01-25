import express from "express"
import { check } from "express-validator";
import { logIn, signUp, getUsers } from "../controlers/users-controller.js";
import fileUpload from "../middlewares/file-upload.js";
const router = express.Router();
router.get('/', getUsers);

router.post(
    '/signup',
    fileUpload.single('image'),
    [check('name').isLength({ min: 3 }),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })],
    signUp
)

router.post('/login', logIn)

export default router;