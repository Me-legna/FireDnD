const express = require('express');

const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth.js');
const { Spot, User, Booking, Review, ReviewImage, SpotImage} = require('../../db/models');

const router = express.Router();

//DELETE Spot Image
router.delete('/:imageId', requireAuth, async (req, res, next) =>{
    const spotImage = await SpotImage.findOne({
        where:{id: req.params.imageId},
        include:{
            model: Spot,
            attributes: [],
            where: {
                ownerId: req.user.id
            }
        }
    })

    if(!spotImage){
        const err = {};
        err.message = "Spot Image couldn't be found";
        err.status = 404;
        next(err)
    }else {
        await spotImage.destroy()

        res.json({
            message: "Successfully deleted",
            statusCode: 200
        })
    }
})
module.exports = router;
