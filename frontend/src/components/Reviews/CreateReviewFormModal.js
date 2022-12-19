import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviews";
import solidStar from '../../images/spotImages/star-solid.svg'

function CreateReviewFormModal() {
    const dispatch = useDispatch();
    const [review, setReview] = useState('')
    const [stars, setStars] = useState(3)

    const { closeModal } = useModal();
    const [errors, setErrors] = useState([]);
    const User = useSelector(state => state.session.user)
    const ReviewImages = []
    const spotId = useSelector(state => state.spots.singleSpot.id)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newReview = {
            review,
            stars
        }

        const reviewInfo = {
            User,
            ReviewImages
        }


        await dispatch(createReview(newReview, spotId, reviewInfo))
            .then(closeModal)
            .catch(async res => {
                const data = await res.json()

                if (data && data.errors) setErrors(Object.values(data.errors));
            })

    };

    return (
        <div>
            <div className="modal-header">
                <h1>Leave a Review 🙏</h1>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label className="modal-label">
                    <textarea
                        className="flex form-input"
                        placeholder="Write a review..."
                        rows={6}
                        cols={50}
                        style={{ resize: "none" }}
                        maxLength={300}
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        required
                    />
                </label>
                <label className="modal-label">
                    <div className="flex-align">
                        <input
                            className="flex form-input"
                            type="range"
                            min={1}
                            max={5}
                            placeholder="Star Rating"
                            value={stars}
                            onChange={(e) => setStars(e.target.value)}
                            required
                        />
                        <img className="solid-star" src={solidStar} alt="solid-black-star" />
                        <output>{stars}</output>
                    </div>
                </label>
                <button className="submit clickable" type="submit">Submit Review 🥳</button>
            </form>
        </div>
    );
}

export default CreateReviewFormModal
