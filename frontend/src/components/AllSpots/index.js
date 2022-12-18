import React, { useEffect } from "react";
import { getAllSpots } from "../../store/spots";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import solidStar from '../../images/spotImages/star-solid.svg'
import './AllSpots.css'


function AllSpots() {
    const dispatch = useDispatch()
    const history = useHistory()
    const allSpotsObj = useSelector(state => state.spots.allSpots)

    const allSpots = Object.values(allSpotsObj)

    useEffect(() => {
        dispatch(getAllSpots())
    }, [dispatch])

    return (
        <section className="big-all-spots flex-center">
            <div id="all-spots">
                {allSpots.map(spot => ( //consider reusable components when refactoring
                    <div key={spot.id} className="spot" onClick={() => history.push(`/spots/${spot.id}`)}>
                        <div>
                            <div className="spot-img-div">
                                <img className="card-img" src={spot.previewImage} alt={`spot#${spot.id}`} />
                            </div>
                            <div className="spot-details">
                                <div className="flex-column">
                                    <div className="spot-location">{`${spot.city}, ${spot.state}`}</div>
                                    <div className="spot-distance">GeoLocation Pending...</div>
                                    <div className="spot-avail-dates">Dates Pending...</div>
                                    <div className="spot-price">{`$${spot.price} night`}</div>
                                </div>
                                <div className="flex-column">
                                    <div className="spot-avg-rating">
                                        <img className="solid-star" src={solidStar} alt="solid-black-star" />
                                        <span>{isNaN(spot.avgRating) ? 'New' : spot.avgRating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
export default AllSpots
