import jwt from 'jsonwebtoken';

import HttpError from '../routes/Modals/http-error.js';

const checkAuth = (req, res, next) => {
    if (req.method == 'OPTIONS') {
        return next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if (!token) {
            throw new Error('Authentication failed!');
        }
        const secret = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, secret);
        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403);
        return next(error);
    }
};
export default checkAuth
