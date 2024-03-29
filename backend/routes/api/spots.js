const express = require('express');

const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

const validateQuery = [
    query('page')
        .exists({ checkFalsy: true })
        .isInt({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Page must be greater than or equal to 1'),
    query('size')
        .exists({ checkFalsy: true })
        .isInt({ min: 1 })
        .optional({ nullable: true })
        .withMessage('Size must be greater than or equal to 1'),
    query('minLat')
        .isDecimal()
        .optional({ nullable: true })
        .withMessage('Minimum latitude is invalid'),
    query('maxLat')
        .isDecimal()
        .optional({ nullable: true })
        .withMessage('Maximum longitude is invalid')
        .custom((value, { req }) => {
            if (!value || value < req.query.minLat) {
                throw new Error('Maximum latitude is invalid')
            }
            return true
        }),
    query('minLng')
        .isDecimal()
        .optional({ nullable: true })
        .withMessage('Minimum longitude is invalid'),
    query('maxLng')
        .isDecimal()
        .optional({ nullable: true })
        .withMessage('Maximum longitude is invalid')
        .custom((value, { req }) => {
            if (!value || value < req.query.minLng) {
                throw new Error('Maximum longitude is invalid')
            }
            return true
        }),
    query('minPrice')
        .isInt({ min: 0 })
        .optional({ nullable: true })
        .withMessage('Minimum price must be greater than or equal to 0'),
    query('maxPrice')
        .optional({ nullable: true })
        .custom((value, { req }) => {
            if (value < 0 || value < req.query.minPrice) {
                throw new Error('Maximum price must be greater than or equal to 0 and minPrice')
            }
            return true
        }),
    handleValidationErrors
]

//GET all Spots
router.get('/', validateQuery, async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query
    if (!page) page = 1
    if (page > 10) page = 10
    if (!size) size = 20
    if (size > 20) size = 20

    const pagination = {};

    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }

    const where = {}
    if (minLat || maxLat) where.lat = {}
    if (minLat) where.lat[Op.gte] = +minLat
    if (maxLat) where.lat[Op.lte] = +maxLat

    if (minLng || maxLng) where.lng = {}
    if (minLng) where.lng[Op.gte] = +minLng
    if (maxLng) where.lng[Op.lte] = +maxLng

    if (minPrice || maxPrice) where.price = {}
    if (minPrice) where.price[Op.gte] = +minPrice
    if (maxPrice) where.price[Op.lte] = +maxPrice


    const spots = await Spot.findAll({ where, raw: true, ...pagination });

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
        if(!starAvg) spot.avgRating = 'New'
        else spot.avgRating = starAvg;

        const previewImg = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true },
            attributes: ['url'],
            raw: true
        })
        if(!previewImg) spot.previewImage = 'No preview Image Available'
        else spot.previewImage = previewImg.url

        resSpots.push(spot)
    }

    res.json({ Spots: resSpots, page, size })
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
        .isInt({ min: 0 })
        .withMessage('Price per day is required and cannot be less than zero'),
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
        if(!starAvg) spot.avgRating = 'New'
        else spot.avgRating = starAvg;

        const previewImg = await SpotImage.findOne({
            where: { spotId: spot.id, preview: true },
            attributes: ['url'],
            raw: true
        })
        if(!previewImg) spot.previewImage = 'No preview Image Available'
        else spot.previewImage = previewImg.url

        resSpots.push(spot)
    }
    const mySpots = resSpots.filter(spot => spot.ownerId === req.user.id)
    res.json({ Spots: mySpots })
})

//GET details of a Spot from an id
router.get('/:spotId', async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId, {

        include: [
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

        const reviewInfo = await Review.findAll({
            where: {
                spotId: spot.id
            },
            attributes: [
                [sequelize.fn("COUNT", sequelize.col("id")), "numReviews"],
                [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"]
            ],
            raw: true
        })
        const { numReviews, avgStarRating } = reviewInfo[0]

        const spotObj = spot.toJSON()
        spotObj.numReviews = numReviews;
        if(!avgStarRating) spotObj.avgStarRating = 'New'
        else spotObj.avgStarRating = avgStarRating;
        res.json(spotObj)
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
	check("owner")
        .custom(async (value, { req }) => {
            if(req.params.spotId){
                const spot = await Spot.findByPk(req.params.spotId);
                if(spot.ownerId === req.user.id){
                    throw new Error("You cannot create a booking for a Spot you own")
                }
            }
            return true;
        }),
	check("activeBookings")
        .custom(async (value, { req }) => {
            if(req.params.spotId){
                const spot = await Spot.findByPk(req.params.spotId);
                const spotBooking = await Booking.findOne({
                    where: {
                        userId: req.user.id,
                        spotId: spot.id,
                        [Op.or]: [
                            {
                                startDate: {
                                    [Op.gte]: Date.now()
                                },
                            },
                            {
                                endDate: {
                                    [Op.lte]: Date.now()
                                },
                            },
                        ],
                    },
                });
                const booking = await Booking.findOne({
                    where: {
                        userId: req.user.id,
                        [Op.or]: [
                            {
                                startDate: {
                                    [Op.gte]: req.body.startDate,
                                    [Op.lt]: req.body.endDate,
                                },
                            },
                            {
                                endDate: {
                                    [Op.gt]: req.body.startDate,
                                    [Op.lte]: req.body.endDate,
                                },
                            },
                        ],
                    },
                });

                if(booking) {
                    throw new Error("You already have an active booking for these dates.");
                }
                if(spotBooking) {
                    throw new Error("You already have a booking for this spot.");
                }
            }
            return true;
        }),
	check("startDate")
        .isDate()
        .withMessage("Check-in Date must be selected"),
        // .withMessage('Must be a valid Date (YYYY-MM-DD)'),
	check("startDate").custom(async (value, { req }) => {
        if(req.params.spotId){
            const booking = await Booking.findOne({
                where: {
                    spotId: req.params.spotId,
                    [Op.or]: [
                        {
                            startDate: {
                                [Op.gte]: req.body.startDate,
                                [Op.lt]: req.body.endDate,
                            },
                        },
                        {
                            endDate: {
                                [Op.gt]: req.body.startDate,
                                [Op.lte]: req.body.endDate,
                            },
                        },
                    ],
                },
            });
            if (booking) {
                throw new Error("Dates conflict with an existing booking");
            }

        }
		return true;
	}),
	check("endDate")
        .isDate()
        .withMessage("Checkout Date must be selected"),
        // .withMessage('Must be a valid Date (YYYY-MM-DD)'),
	check("endDate").custom((value, { req }) => {
		if (new Date(value).getTime() <= new Date(req.body.startDate).getTime()) {
			throw new Error("Checkout Date cannot be on or before Check-in Date");
		}
		return true;
	}),
	handleValidationErrors,
];
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
        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()

        if (start < Date.now()){
            const error = {};
            error.message = "We can't go back in time!";
            error.status = 403;
            return next(error)
        }

        for (let booking of spotBookings) {
            const bookingStart = new Date(booking.startDate).getTime()
            const bookingEnd = new Date(booking.endDate).getTime()

            if (start === bookingStart || start > bookingStart && start <= bookingEnd) {
                err.message = 'Sorry, this spot is already booked for the specified dates';
                err.status = 403;
                err.errors.startDate = 'Check-in date conflicts with an existing booking'
            }
            if (end === bookingStart || end > bookingStart && end <= bookingEnd) {
                err.message = 'Sorry, this spot is already booked for the specified dates';
                err.status = 403;
                err.errors.endDate = 'Check-in date conflicts with an existing booking'
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
            attributes: ['id','spotId', 'startDate', 'endDate']
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

//DELETE a Spot
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const spot = await Spot.findOne({ where: { id: req.params.spotId, ownerId: req.user.id } });

    if (!spot) {
        const err = {};
        err.status = 404;
        err.message = "Spot couldn't be found";
        next(err)
    } else {
        await spot.destroy()

        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})


module.exports = {spotsRouter: router, validateBooking}
