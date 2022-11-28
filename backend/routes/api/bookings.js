const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

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

//GET all Current User Bookings
router.get('/current', requireAuth, async (req, res, next) => {
    const Bookings = await Booking.findAll({
        include: {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt'],
            },
            as: 'Spot',
        },
        where: {
            userId: req.user.id
        },
    })

    if (!Bookings.length) {
        const err = {};
        err.status = 404;
        err.message = "You have not yet made any Bookings";
        next(err)
    } else {
        const bookingObjs = []
        for (let booking of Bookings) {
            const rawBooking = booking.toJSON()
            const preview = await SpotImage.findOne({ where: { spotId: rawBooking.Spot.id, preview: true } })

            rawBooking.Spot.previewImage = preview.url

            bookingObjs.push(rawBooking)
        }

        res.json({ Bookings: bookingObjs })
    }
})

//Edit a Booking
router.put('/:bookingId', requireAuth, validateBooking, async (req, res, next) => {
    const booking = await Booking.findOne({ where: { id: req.params.bookingId, userId: req.user.id } });

    if (!booking) {
        const err = {};
        err.status = 404;
        err.message = "Booking couldn't be found";
        next(err)
    }else {
        const { startDate, endDate } = req.body;
        const err = { errors: {} };

        const start = new Date(startDate).getTime()
        const end = new Date(endDate).getTime()
        const bookingStart = new Date(booking.startDate).getTime()
        const bookingEnd = new Date(booking.endDate).getTime()

        if (bookingStart < Date.now()){
            const error = {};
            error.message = "Past bookings can't be modified";
            error.status = 403;
            return next(error)
        }
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
        if (Object.keys(err.errors).length) next(err)
        else {
            booking.startDate = startDate;
            booking.endDate = endDate;

            booking.save()
            res.json(booking)
        }

    }
})


//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res, next)=>{
    const booking = await Booking.findOne({
        where:{id: req.params.bookingId},
        include: {
            model: Spot,
            attributes: ['ownerId'],
            as: 'Spot'
        },
    })
    console.log(booking)
    console.log(req.user.id)
    // console.log(req.params.bookingId)
    if(!booking || ![booking.userId, booking.Spot.ownerId].includes(req.user.id)){
        const err = {};
        err.message = "Booking couldn't be found";
        err.status = 404;
        next(err)
    }else {
        const bookingStart = new Date(booking.startDate).getTime()

        if(bookingStart > Date.now()){
            const err = {};
            err.message = "Bookings that have been started can't be deleted";
            err.status = 403;
            next(err)
        }else{
            await booking.destroy()

            res.json({
                message: "Successfully deleted",
                statusCode: 200
            })
        }
    }
})

module.exports = router;
