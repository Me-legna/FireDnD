import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";
import SingleHeader from "./SingleHeader.js";
import SingleImages from "./SingleImages.js";
import SingleLeftBody from "./SingleLeftBody";
import SingleRightBody from "./SingleRightBody";



function SingleSpot() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const spot = useSelector(state => state.spots.singleSpot)
    console.log('spot', spot)

    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if (!spot.id) return null
    return (
        <div className="flex-column flex-center">
            <SingleHeader spot={spot} />
            <SingleImages spot={spot} />
            <div className="flex-around">
                <SingleLeftBody spot={spot} />
                <SingleRightBody spot={spot} />
            </div>
        </div>
    )
}
export default SingleSpot;
