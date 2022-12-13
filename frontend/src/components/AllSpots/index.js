import React, { useEffect, useState } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";


function AllSpots() {
    const dispatch = useDispatch()
    const allSpotsObj = useSelector(state => state.spots)
    const allSpots = Object.values(allSpotsObj)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <>
            {allSpots.map(spot => (
                <NavLink to={`/spots/${spot.id}`}>
                    <ul key={spot.id} className="spot">
                        <div>
                            <picture>
                                <img className="spot-img" src={spot.previewImage} alt={`spot#${spot.id}`} />
                            </picture>
                            <div className="spot-details">
                                <li className="spot-location">{`${spot.city}, ${spot.state}`}</li>
                                <li className="spot-avg-rating">{spot.avgRating}</li>
                            </div>
                            <li className="spot-price">{`$${spot.price} night`}</li>
                        </div>
                    </ul>
                </NavLink>
            ))}
            </>
    )
}
export default AllSpots
