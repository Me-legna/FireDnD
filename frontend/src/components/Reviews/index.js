import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getSpotReviews } from '../../store/reviews'
import AllSingleReviews from './AllSingleReviews'
import './Reviews.css'


function Reviews() {
    const dispatch = useDispatch()
    const history = useHistory()
    const {id} = useParams()
    const spotReviews = useSelector(state => state.reviews.spot)
    console.log('spotReviews', spotReviews)

    useEffect(() => {
        dispatch(getSpotReviews(id))

    }, [dispatch, id])

    return (
        <div>
            <div>
                <h1 >Henlow </h1>
                <AllSingleReviews />
            </div>
        </div>
    )
}

export default Reviews
