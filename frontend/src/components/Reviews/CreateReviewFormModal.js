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
    const spotId = useSelector(state => state.spots.singleSpot.id)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newReview = {
            review,
            stars
        }


        await dispatch(createReview(newReview, spotId))
            .then(closeModal)
            .catch(async res => {
                const data = await res.json()

                if (data && data.errors) setErrors(Object.values(data.errors));
            })

    };

    return (
        <div>
            <h1>Leave a Review 🙏</h1>
            <form onSubmit={handleSubmit} className='spot-form flex-column'>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
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
                <label>
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
                    <div>
                        <img className="solid-star" src={solidStar} alt="solid-black-star" />
                        <output>{stars}</output>
                    </div>
                </label>
                <button className="select-input" type="submit">Submit Review 🥳</button>
            </form>
        </div>
    );
}

export default CreateReviewFormModal
