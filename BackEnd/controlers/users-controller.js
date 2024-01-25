import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import HttpError from '../routes/Modals/http-error.js';
// import Places from '../routes/Modals/places.js';
import Users from '../routes/Modals/users.js';


export const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await Users.find({}, '-password')
    } catch (error) {
        const err = new HttpError(
            'Fetching users failed ,please try again later.',
            500
        )
        return next(err)
    }
    res.json({ users: users.map(user => user.toObject({ getters: true })) });
}

export const signUp = async (req, res, next) => {
    const erro = validationResult(req)
    if (!erro.isEmpty()) {
        console.log(erro)
        return next(new HttpError('Invalid Inputs passed, please check your data', 422));
    }

    const { name, email, password } = req.body
    let identifiedUser;
    try {
        identifiedUser = await Users.findOne({ email: email })
        if (identifiedUser) {
            return next(new HttpError('User already exists, please login instead', 422));
        }
    } catch (error) {
        const err = new HttpError('Signing Up failed, Please try again later', 500)
        return next(err)
    }
    let hashedPassword;
    try {
        hashedPassword = await bcryptjs.hash(password, 12)
    } catch (err) {
        const error = new HttpError('could not create user, please try again', 500)
        return next(error)
    }
    const NewUser = new Users({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    })

    try {
        await NewUser.save();
    } catch (error) {
        const err = new HttpError('Signing up failed, Please try again', 500)
        return next(err)
    }
    let token;
    try {
        token = jwt.sign({ userId: NewUser.id, email: NewUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
    } catch (error) {
        const err = new HttpError('Signing up failed, Please try again', 500)
        return next(err)
    }

    res.status(201).json({ userId: NewUser.id, email: NewUser.email, token: token })
}
export const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    let identifiedUser;
    try {
        identifiedUser = await Users.findOne({ email: email })
    } catch (error) {
        const err = new HttpError('loging in failed, Please try again later', 500)
        return next(err)
    }
    if (!identifiedUser) {
        return next(new HttpError(`Invalid credentials,Could not log you in`, 403));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcryptjs.compare(password, identifiedUser.password)
    } catch (error) {
        return next(new HttpError(`Could not log you in,Please check your credentials and try again`, 500));
    }

    if (!isValidPassword) {
        return next(new HttpError(`Invalid credentials,Could not log you in`, 403));
    }

    let token;
    try {
        token = jwt.sign({ userId: identifiedUser.id, email: identifiedUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
    } catch (error) {
        const err = new HttpError('Logging in failed, Please try again', 500)
        return next(err)
    }

    res.status(201).json({ userId: identifiedUser.id, email: identifiedUser.email, token: token })
}
