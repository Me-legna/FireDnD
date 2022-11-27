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
        } else {
            const reviewId = review.id;
            const { url } = req.body;
            const newReviewImage = await ReviewImage.create({ reviewId, url })

            res.json({ id: newReviewImage.id, url: newReviewImage.url })
        }
    }
})


//GET reviews of Current User
router.get('/current', requireAuth, async (req, res, next) => {
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'User'
            },
            {
                model: Spot,
                attributes: {
                    exclude: ['description', 'createdAt', 'updatedAt'],
                },
                as: 'Spot'
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ],
    })

    if (!reviews) {
        const err = {};
        err.status = 404;
        err.message = "You have not yet made a review";
        next(err)
    } else {
        const reviewObjs = []
        for(let review of reviews){
            const rawReview = review.toJSON()
            const preview = await SpotImage.findOne({where:{spotId: rawReview.Spot.id, preview: true}})

            rawReview.Spot.previewImage = preview.url

            reviewObjs.push(rawReview)
        }
        // const myReviews = reviews.toJSON()

        res.json({Reviews: reviewObjs})
    }
})

module.exports = router;
