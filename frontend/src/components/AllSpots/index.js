import React, { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
function AllSpots() {
    const dispatch = useDispatch()
    const allSpots = useSelector(state => state.spots.allSpots)
    console.log('allSpots', allSpots)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <div className="all-spots-list">
            {allSpots.map(spot => (
                <ul key={spot.id}>
                    <NavLink to={`/spots/${spot.id}`}>
                        <img className="spot-img" src={spot.previewImage} alt={`spot#${spot.id}`} />
                        <div className="spot-details">
                            <li className="spot-location">{`${spot.city}, ${spot.state}`}</li>
                            <li className="spot-avg-rating">{spot.avgRating}</li>
                        </div>
                        <li className="spot-price">{`$${spot.price} night`}</li>
                    </NavLink>
                </ul>
            ))}
        </div>
    )
}
export default AllSpots
