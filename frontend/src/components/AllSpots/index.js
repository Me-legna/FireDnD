import React, { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './AllSpots.css'


function AllSpots() {
    const dispatch = useDispatch()
    const history = useHistory()
    const allSpotsObj = useSelector(state => state.spots.allSpots)
    // console.log('allSpotsObj', allSpotsObj)

    const allSpots = Object.values(allSpotsObj).filter(value => !Array.isArray(value))
    // console.log('allSpots', allSpots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    // useEffect(() => {
    //     (async function fetchAll (){
    //         const response = await dispatch(getAllSpots())
    //     })()
    // }, [dispatch])

    return (
        <div id="all-spots">
            {allSpots.map(spot => (
                <div key={spot.id} className="spot" onClick={() => history.push(`/spots/${spot.id}`)}>
                    <div>
                        <div className="spot-img-div">
                            <img src={spot.previewImage} alt={`spot#${spot.id}`} />
                        </div>
                        <div className="spot-details">
                            <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
                            <div className="spot-distance">GeoLocation Pending...</div>
                            <div className="spot-avail-dates">Dates Pending...</div>
                            <div className="spot-price">{`$${spot.price} night`}</div>
                            <span className="spot-avg-rating">{isNaN(spot.avgRating) ? 'N/A' : spot.avgRating}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
export default AllSpots
