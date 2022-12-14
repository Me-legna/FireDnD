import { useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";
import './SingleSpot.css'


function SingleHeader() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const spot = useSelector(state => state.spots.singleSpot, shallowEqual)
    console.log('spot', spot)

    useEffect(() => {
        dispatch(getOneSpot(id))
    }, [dispatch, id])

    if (!spot) return null
    return (
        <div id="single-spot-header-container">
            < div id="single-spot-header">
                <h1 id="single-spot-title">Adjective "{spot.name}" More Adjectives</h1>
                <div id='single-spot-prefix'>
                    <div className="single-spot-prefix-div">
                        <span id='single-spot-review-location'>
                            <span id="star-icon-container">
                                <div>star-icon</div>
                            </span>
                            <span id="single-spot-avg-star">{isNaN(spot.avgStarRating) ? 'N/A' : spot.avgStarRating}</span>
                            <span className="dot-space"> · </span>
                            <span id="num-reviews-button-container">
                                <button id="num-reviews-button">{spot.numReviews}</button>
                            </span>
                        </span>

                        <span className="dot-space"> · </span>

                        <span className="flex">
                            <span id="medal-container">
                                <div>medal-icon</div>
                            </span>
                            <span id="is-superhost">Superhost</span>
                        </span>

                        <span className="dot-space"> · </span>

                        <span id="location-button-container">
                            <button id="location-button">{spot.city}, {spot.state}, {spot.country}</button>
                        </span>
                    </div>
                    <div className="single-spot-prefix-div">
                        <div className="flex">
                            <span id="share-button-container">
                                <button className="share-save-button">share-icon Share</button>
                            </span>
                        </div>
                        <div className="flex">
                            <span id="save-button-container">
                                <button className="share-save-button">heart-icon Save</button>
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default SingleHeader;
