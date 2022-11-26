const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, SpotImage } = require('../../db/models');

const router = express.Router();


//GET all Spots
router.get('/', async (req, res, next) => {
    const spots = await Spot.findAll({ raw: true });

    const resSpots = [];

    for (let spot of spots) {
        let starSum = 0;
        const reviews = await Review.findAll({
            where: { spotId: spot.id },
            attributes: ['stars'],
            raw: true,
        })
        reviews.forEach(review => starSum += review.stars);
        const starAvg = starSum / reviews.length;
        spot.avgRating = starAvg;

        const previewImg = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true },
            attributes: ['url'],
            raw: true
        })
        spot.previewImage = previewImg.url

        resSpots.push(spot)
    }

    res.json({ Spots: resSpots })
});

const validateCreateSpot = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal()
        .withMessage('Latitude is not valid'),
    check('lng')
        .isDecimal()
        .withMessage('Longitude is not valid'),
    check('name')
        .isLength({max: 50})
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isInt({min: 1})
        .withMessage('Price per day is required and cannot be zero'),
    handleValidationErrors
];

//CREATE a spot
router.post('/', requireAuth,validateCreateSpot, async (req, res, next) => {

    // const { address, city, state, country, lat, lng, name, description, price } = req.body;
    // const ownerId = req.user.id;
    req.body.ownerId = req.user.id
    const newSpot = await Spot.create(req.body)
        // {
        // ownerId,
        // ...req.body
        // address,
        // city,
        // state,
        // country,
        // lat,
        // lng,
        // name,
        // description,
        // price
    // })

    res.json(newSpot)
})

module.exports = router;
