import { useEffect } from 'react'
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
    const ownerId = useSelector(state => state.spots.singleSpot.ownerId)
    const user = useSelector(state => state.session.user)
    const isOwner = ownerId === user?.id
    const spotReviews = useSelector(state => state.reviews.spot)
    const userReview = Object.values(spotReviews).find(review => review?.userId === user?.id)
    // const forceUpdate = use
    console.log('ownerId', isOwner)

    useEffect(() => {
        dispatch(getSpotReviews(id))

    }, [dispatch, id])


    return (
        <div>
            <div>
                <h1 >Henlow </h1>
                <div>

                    {user
                        ? isOwner
                            ? (<div></div>)
                            : userReview
                                ? (
                                    <OpenModalButton
                                        buttonText='Delete Review'
                                        modalComponent={<DeleteReviewModal />}
                                    />
                                )
                                : (

                                    <OpenModalButton
                                        buttonText='Create Review'
                                        modalComponent={<CreateReviewFormModal />}
                                    />
                                )
                        : (
                            <div>Log in to create a Review</div>
                        )
                    }
                </div>

                <AllSingleReviews />
            </div>

        </div>
    )
}

export default Reviews
