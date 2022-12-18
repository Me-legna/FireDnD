import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getUserReviews } from "../../store/reviews"
import solidStar from '../../images/spotImages/star-solid.svg'
import { useModal } from "../../context/Modal"


function AllUserReviews() {
    const dispatch = useDispatch()
    const userReviews = useSelector(state => state.reviews.user)
    const userReviewsList = Object.values(userReviews)
    const { closeModal } = useModal()
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setErrors([]);
        dispatch(getUserReviews())
            .catch(
                async (res) => {
                    const data = await res.json();

                    if (data && data.message) setErrors(["You haven't made any reviews! 🙄"]);
                    // if (data && data.message) setErrors([data.message]);
                }
            )
    }, [dispatch])


    return (
        <div>
            <h3>AllUserReviews</h3>
            <ul>
                {errors.map((error, idx) => (
                    <div key={idx}>{error}</div>
                ))}
            </ul>
            <div>
                <ul>
                    {!!userReviewsList.length ? userReviewsList.map(review => (
                        <div key={review.id} className='flex-column'>
                            <Link to={`/spots/${review.spotId}`} onClick={closeModal}>{review.Spot.name}</Link>
                            <div className="flex">
                                <div>{review.review}</div>
                                <div className="spot-avg-rating">
                                    <img className="solid-star" src={solidStar} alt="solid-black-star" />
                                    <span>{review.stars}</span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div></div>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default AllUserReviews
