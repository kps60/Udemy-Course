import express from "express"
import { check } from "express-validator";
import { getPlaceById, getPlacesByUserId, deletePlace, updatePlace, createPlace } from "../controlers/places-controller.js";
import fileUpload from "../middlewares/file-upload.js";
import checkAuth from "../middlewares/check-auth.js";


const router = express.Router();


router.get('/:pid', getPlaceById);

router.get('/user/:uid', getPlacesByUserId);

router.use(checkAuth)

router.post('/',
    fileUpload.single('image'),
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 }),
        check('address')
            .not()
            .isEmpty()
    ], createPlace);

router.patch('/:pid',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({ min: 5 })
    ], updatePlace)

router.delete('/:pid', deletePlace)

export default router