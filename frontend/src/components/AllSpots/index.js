import React, { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const onlySpots = (allSpots) => {
    for(let key in allSpots) {

    }
}
function AllSpots() {
    const dispatch = useDispatch()
    const allSpotsObj = useSelector(state => state.spots.allSpots, shallowEqual)
    // console.log('allSpotsObj', allSpotsObj)

    const allSpots = Object.values(allSpotsObj).filter(value => !Array.isArray(value))
    console.log('allSpots', allSpots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div id="all-spots">
            {allSpots.map(spot => (
                <NavLink key={spot.id} to={`/spots/${spot.id}`}>
                        <div  className="spot">
                            <img className="spot-img" src={spot.previewImage} alt={`spot#${spot.id}`} />
                            <div className="spot-details">
                                <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
                                <div className="spot-avg-rating">{spot.avgRating}</div>
                            </div>
                            <div className="spot-price">{`$${spot.price} night`}</div>
                        </div>
                </NavLink>
            ))}
        </div>
    )
}
export default AllSpots
