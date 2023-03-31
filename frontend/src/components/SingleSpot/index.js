import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";
import SingleHeader from "./SingleHeader.js";
import SingleImages from "./SingleImages.js";
import SingleLeftBody from "./SingleLeftBody";
import SingleRightBody from "./SingleRightBody";
import Reviews from "../Reviews";
import { getSpotBookings } from "../../store/bookings";



function SingleSpot() {
    const dispatch = useDispatch()
    const history = useHistory()
    const { id } = useParams()
    const spotReviews = useSelector(state => state.reviews.spot)
    const spot = useSelector(state => state.spots.singleSpot)


    useEffect(() => {
        dispatch(getOneSpot(id))
        .catch(() => history.push('/404'))
        dispatch(getSpotBookings(id))
    }, [dispatch, history, id, spotReviews])

    if (!spot.id) return null
    return (
        <div className="flex-column flex-center">
            <SingleHeader spot={spot} />
            <SingleImages spot={spot} />
            <div className="single-body">
                <SingleLeftBody spot={spot} />
                <SingleRightBody spot={spot} />
            </div>
            <Reviews/>
        </div>
    )
}
export default SingleSpot;
