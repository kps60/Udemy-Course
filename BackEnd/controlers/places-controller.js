import { validationResult } from 'express-validator';

import HttpError from '../routes/Modals/http-error.js';
import getCoordsForAddress from '../utils/location.js';
import Places from '../routes/Modals/places.js';
import User from '../routes/Modals/users.js'
import mongoose from 'mongoose';
import fs from "fs"



export const getPlaceById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;
    try {
        place = await Places.findById(placeId)

    } catch (error) {
        const err = new HttpError('somehing went wrong ,could not find a place', 500)
        return next(err)
    }
    if (!place) {
        next(new HttpError('could not find the place which is provided id', 404));
    }

    // console.log('GET a request in Place');
    res.json({ place: place.toObject({ getters: true }) });
}

export const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    // let places;
    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places')

    } catch (error) {
        const err = new HttpError('somehing went wrong ,could not find a places', 500)
        return next(err)
    }
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(
            new HttpError('could not find places for the provided user id', 404)
        );
    }
    res.json({ places: userWithPlaces.places.map(p => p.toObject({ getters: true })) });
}


export const createPlace = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log(error)
        return next(new HttpError('Invalid Inputs passed, please check your data', 422));
    }
    const { title, description, address } = req.body;

    const coordinates = getCoordsForAddress(address);

    //const title=req.body.title; //other than this statement we write a above statement
    const createdPlace = new Places({
        title,
        description,
        location: coordinates,
        address,
        image: req.file.path,
        creator:req.userData.userId
    });

    let user;

    try {
        user = await User.findById(req.userData.userId);

    } catch (error) {
        const err = new HttpError('creating place failed,please try again', 500)
        return next(err)
    }


    if (!user) {
        const error = new HttpError('could not find user for provided it', 404)
        return next(error)
    }

    try {
        const sess = await mongoose.startSession()
        sess.startTransaction()
        await createdPlace.save({ session: sess })
        user.places.push(createdPlace)
        await user.save({ session: sess })
        await sess.commitTransaction()

    } catch (error) {
        const err = new HttpError('creating place failed,please try again', 500)
        return next(err)
    }
    res.status(201).json({ place: createdPlace });
}

export const updatePlace = async (req, res, next) => {
    const error = validationResult(req)
    if (!error.isEmpty()) {
        console.log(error)
        return next(
            new HttpError('Invalid Inputs passed, please check your data', 422)
        )
    }

    const { title, description } = req.body;
    const placeId = req.params.pid;
    let place;
    try {
        place = await Places.findById(placeId)

    } catch (error) {
        const err = new HttpError(error.message, 500)
        return next(err)
    }
    if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError('you are not alloed to Edit this place', 401))
    }
    place.title = title;
    place.description = description;
    try {
        await place.save();
    } catch (error) {
        const err = new HttpError(error.message, 500)
        return next(err)
    }
    res.status(200).json({ place: place.toObject({ getters: true }) });
}
export const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Places.findById(placeId).populate('creator');
    } catch (error) {
        return next(new HttpError('Could not find the place with that id to delete', 404)); // Use 404 for "Not Found".
    }

    if (!place) {
        const error = new HttpError('Could not find the place to delete', 404); // Use 404 for "Not Found".
        return next(error);
    }
    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError('you are not alloed to delete this place', 401); 
        return next(error);
    }

    const imagePath = place.image;
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        await place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        const err = new HttpError(error.message, 500); // 500 for Internal Server Error.
        return next(err);
    }

    fs.unlink(imagePath, err => {
        console.log(err)
    })
    res.status(200).json({ message: "Place deleted successfully" })
};




