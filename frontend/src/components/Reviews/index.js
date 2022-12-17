import { useDeferredValue, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getSpotReviews } from '../../store/reviews'
import OpenModalButton from '../OpenModalButton'
import AllSingleReviews from './AllSingleReviews'
import CreateReviewFormModal from './CreateReviewFormModal'
import DeleteReviewModal from './DeleteReviewModal'
import './Reviews.css'


function Reviews() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const user = useSelector(state => state.session.user)
    const spotReviews = useSelector(state => state.reviews.spot)
    const userReview = Object.values(spotReviews).find(review => review?.userId === user?.id)
    console.log('spotReviews', userReview)

    useEffect(() => {
        dispatch(getSpotReviews(id))

    }, [dispatch, id])

    return (
        <div>
            <div>
                <h1 >Henlow </h1>
                {user ? !userReview
                    ? (
                        <OpenModalButton
                            buttonText='Create Review'
                            modalComponent={<CreateReviewFormModal />}
                        />
                    )
                    : (
                        <OpenModalButton
                            buttonText='Delete Review'
                            modalComponent={<DeleteReviewModal />}
                        />
                    )
                    : (
                        <div>Log in to create a Review</div>
                    )
                }
                <AllSingleReviews />
            </div>
        </div>
    )
}

export default Reviews
