const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage, sequelize } = require('../../db/models');

const router = express.Router();

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const review = await Review.findOne({ where: { id: req.params.reviewId, userId: req.user.id } })

    if (!review) {
        const err = {};
        err.status = 404;
        err.message = "Review couldn't be found";
        next(err)
    } else {
        const reviewImages = await ReviewImage.findAll({ where: { reviewId: review.id } })
        if (reviewImages.length > 9) {
            const err = {};
            err.status = 403;
            err.message = "Maximum number of images for this resource was reached";
            next(err)
        }else{
            const reviewId = review.id;
            const { url } = req.body;
            const newReviewImage = await ReviewImage.create({ reviewId, url })

            res.json({ id: newReviewImage.id, url: newReviewImage.url })
        }
    }
})


module.exports = router;
