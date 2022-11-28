const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const router = express.Router();

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res, next)=>{
    const reviewImage = await ReviewImage.findOne({
        where:{id: req.params.imageId},
        include:{
            model: Review,
            attributes: [],
            where: {
                userId: req.user.id
            }
        }
    })

    if(!reviewImage){
        const err = {};
        err.message = "Review Image couldn't be found";
        err.status = 404;
        next(err)
    }else{
        await reviewImage.destroy()

        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})

module.exports = router;
