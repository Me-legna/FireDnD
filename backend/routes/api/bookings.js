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


module.exports = router;
