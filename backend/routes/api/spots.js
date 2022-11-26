const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, SpotImage, sequelize } = require('../../db/models');

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
        .isLength({ max: 50 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Price per day is required and cannot be zero'),
    handleValidationErrors
];

//CREATE a spot
router.post('/', requireAuth, validateCreateSpot, async (req, res, next) => {

    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;
    // req.body.ownerId = req.user.id
    const newSpot = await Spot.create(//req.body)
        {
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    res.json(newSpot)
    // ...req.body

})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res, next) => { //use update method to make only one preview
    // console.log(req.params.spotId)
    // res.send('success')
    const spot = await Spot.findByPk(req.params.spotId, { raw: true })
    console.log(spot)
    const { url, preview } = req.body
    if (spot) {
        const userId = +spot.ownerId;
        const spotId = +spot.id;
        const newSpotImage = await SpotImage.create({ userId, spotId, url, preview });
        const spotImg = await SpotImage.scope('defaultScope').findByPk(newSpotImage.id)
        res.json(spotImg)
    } else {
        const err = {};
        err.status = 404,
        err.message = "Spot couldn't be found"
        next(err)
        // res.statusCode = 404
        // res.json({
        //     message: "Spot couldn't be found",
        //     statusCode: 404
        // })
    }
})

//GET spots of Current User
router.get('/current', requireAuth,  async (req, res, next) => {
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
    const mySpots = resSpots.filter(spot => spot.ownerId === req.user.id)
    res.json({ Spots: mySpots })
})

//GET details of a Spot from an id
router.get('/:spotId', async (req,res,next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        attributes: {
            include:[
                [sequelize.fn("COUNT", sequelize.col("Reviews.id")),"numReviews"],
                [sequelize.fn("AVG", sequelize.col("Reviews.stars")),"avgStarRating"],
            ]
        },
        include: [
            {
                model:Review,
                attributes:[],
            },
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                as: "Owner",
                attributes: ['id', 'firstName', 'lastName']
            },
        ]
    })

    if(!spot || spot.id === null){
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    }else{
        res.json(spot)
    }
})

module.exports = router;
