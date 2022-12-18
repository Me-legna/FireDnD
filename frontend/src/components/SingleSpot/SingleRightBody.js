import { useState } from "react"
import { useSelector } from "react-redux"
import OpenModalButton from "../OpenModalButton"
import DeleteSpotModal from "./DeleteSpotModal"
import EditSpotFormModal from "./EditSpotFormModal"
import solidStar from '../../images/spotImages/star-solid.svg'

function SingleRightBody({ spot }) {
    const user = useSelector(state => state.session.user)
    const [numNights, setNumNights] = useState(1)

    return (
        <div>
            <div>
                <div>
                    <div>
                        <div>
                            <div>
                                <span className="right-body-price">{`$${spot.price} `}</span>
                                <span>night</span>
                            </div>
                            {isNaN(spot.avgStarRating)
                                ? (
                                    <div></div>
                                )
                                : (
                                    <div>
                                        <img className="solid-star" src={solidStar} alt="solid-black-star" />
                                        <span>{spot.avgStarRating}</span>
                                        <span className="dot-space">·</span>
                                        <span>{spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
                                    </div>
                                )}
                        </div>
                        {user ? user.id === spot.Owner.id
                            ? (
                                <div>
                                    <OpenModalButton buttonText='Edit Spot' modalComponent={<EditSpotFormModal spot={spot} />} />
                                    <OpenModalButton buttonText='Delete Spot' modalComponent={<DeleteSpotModal spot={spot} />} />
                                </div>
                            )
                            : (
                                <div className="flex-column">
                                    <input type="number" value={numNights} onChange={(e) => setNumNights(e.target.value)} min='1'></input>
                                    <div>{`$${spot.price} x ${numNights} ${numNights < 2 ? 'night' : 'nights'} = $${spot.price * numNights}`}</div>
                                </div>
                            )
                            : (
                                <div className="flex-column">
                                    <input type="number" value={numNights} onChange={(e) => setNumNights(e.target.value)} min='1'></input>
                                    <div>{`$${spot.price} x ${numNights} ${numNights < 2 ? 'night' : 'nights'} = $${spot.price * numNights}`}</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleRightBody
