const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');

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

const validateSpot = [
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
router.post('/', requireAuth, validateSpot, async (req, res, next) => {

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
    // const spot = await Spot.findByPk(req.params.spotId, { raw: true })
    //if(spot.ownerId !== req.user.id){
    // const err = {};
    // err.status = 401;
    // err.message = "You are not the owner of this Spot";
    // next(err)
    // }
    const spot = await Spot.findOne({ where: { id: req.params.spotId, ownerId: req.user.id }, raw: true });

    // console.log(spot)
    const { url, preview } = req.body
    if (spot) {
        const userId = +spot.ownerId;
        const spotId = +spot.id;
        const newSpotImage = await SpotImage.create({ userId, spotId, url, preview });
        const spotImg = await SpotImage.scope('defaultScope').findByPk(newSpotImage.id)
        res.json(spotImg)
    } else {
        const err = {};
        err.status = 404
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
router.get('/current', requireAuth, async (req, res, next) => {
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
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        attributes: {
            include: [
                // [sequelize.fn("COUNT", sequelize.col("Reviews.id")), "numReviews"],
                // [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"],
                [
                    // Note the wrapping parentheses in the call below!
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM Reviews
                        WHERE
                            Reviews.spotId = Spot.id
                    )`),
                    'numReviews'
                ],
                [
                    // Note the wrapping parentheses in the call below!
                    sequelize.literal(`(
                        SELECT AVG (stars)
                        FROM Reviews
                        WHERE
                            Reviews.spotId = Spot.id
                    )`),
                    'avgStarRating'
                ],

            ]
        },
        include: [
            {
                model: Review,
                attributes: [],
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
        ],
    })

    if (!spot || spot.id === null) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else {
        res.json(spot)
        // const reviewInfo = await Review.findOne({
        //     where:{
        //         spotId:spot.id
        //     },
        //     attributes: [
        //         [sequelize.fn("COUNT", sequelize.col("id")), "numReviews"],
        //         [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"]
        //     ],
        //     raw: true
        // })
        // const {numReviews, avgStarRating} = reviewInfo
        // const spotObj = spot.toJSON()
        // spotObj.numReviews = numReviews;
        // spotObj.avgStarRating = avgStarRating;
        // res.json(spotObj)
    }
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    // const spot = await Spot.findByPk(req.params.spotId);
    //if(spot.ownerId !== req.user.id){
    // const err = {};
    // err.status = 401;
    // err.message = "You are not the owner of this Spot";
    // next(err)
    // }
    const spot = await Spot.findOne({ where: { id: req.params.spotId, ownerId: req.user.id } });
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (!spot) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else {
        if (address) spot.address = address;
        if (city) spot.city = city;
        if (state) spot.state = state;
        if (country) spot.country = country;
        if (lat) spot.lat = lat;
        if (lng) spot.lng = lng;
        if (name) spot.name = name;
        if (description) spot.description = description;
        if (price) spot.price = price;
        await spot.save();
        res.json(spot)
    }
})
const validateReview = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]

//Create a review for a spot
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const { review, stars } = req.body;

    if (!spot) { //if spot doesn't exist
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else {
        const userId = +req.user.id;
        const spotId = +spot.id;
        const userReview = await Review.findOne({ where: { userId, spotId } })

        if (userReview) { //if Review from the current user already exists for the Spot
            const err = {};
            err.status = 403;
            err.message = "User already has a review for this spot";
            return next(err)
        } else {
            const newReview = await Review.create({
                userId,
                spotId,
                review,
                stars,
            })
            res.json(newReview)
        }
    }
})

//GET Reviews by spotId
router.get('/:spotId/reviews', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else {
        const spotId = spot.id
        const Reviews = await Review.findAll({
            where: {
                spotId,
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                    as: 'User'
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        })

        res.json({ Reviews })
    }
})

const validateBooking = [
    check('startDate')
        .isDate()
        .withMessage('Must be a valid Date (YYYY-MM-DD)'),
    check('endDate')
        .isDate()
        .withMessage('Must be a valid Date (YYYY-MM-DD)'),
    check('endDate')
        .custom((value, { req }) => {
            // console.log(value)
            if (new Date(value).getTime() <= new Date(req.body.startDate).getTime()) {
                throw new Error('endDate cannot be on or before startDate')
            }
            return true
        }),
    handleValidationErrors
]
//Create a Booking by spotId
router.post('/:spotId/bookings', requireAuth, validateBooking, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)
    const userId = req.user.id;

    if (!spot) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else if (spot.ownerId === userId) {
        const err = {};
        err.status = 403;
        err.message = "You cannot create a booking for a Spot you own";
        next(err)
    } else {
        const spotId = spot.id;
        const spotBookings = await Booking.findAll({ where: { spotId } })
        const { startDate, endDate } = req.body
        const err = { errors: {} };

        for (let booking of spotBookings) {
            const start = new Date(startDate).getTime()
            const end = new Date(endDate).getTime()
            const bookingStart = new Date(booking.startDate).getTime()
            const bookingEnd = new Date(booking.endDate).getTime()

            if (start === bookingStart || start > bookingStart && start <= bookingEnd) {
                err.message = 'Sorry, this spot is already booked for the specified dates';
                err.status = 403;
                err.errors.startDate = 'Start date conflicts with an existing booking'
            }
            if (end === bookingStart || end > bookingStart && end <= bookingEnd) {
                err.message = 'Sorry, this spot is already booked for the specified dates';
                err.status = 403;
                err.errors.endDate = 'Start date conflicts with an existing booking'
            }
        }
        if (Object.keys(err.errors).length) next(err)
        else {
            const newBooking = await Booking.create({
                spotId,
                userId,
                startDate,
                endDate,
            })
            res.json(newBooking)
        }

    }

})

//GET all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId)

    if (!spot) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else if (spot.ownerId !== req.user.id) {
        const Bookings = await Booking.findAll({
            where: { spotId: spot.id },
            attributes: ['spotId', 'startDate', 'endDate']
        })
        res.json({ Bookings })
    } else if (spot.ownerId === req.user.id) {
        const Bookings = await Booking.findAll({
            where: { spotId: spot.id },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'], as: 'User' },
        })
        res.json({ Bookings })
    }
})

module.exports = router;
