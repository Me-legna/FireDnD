import { useState } from "react"
import { useSelector } from "react-redux"
import OpenModalButton from "../OpenModalButton"

function SingleRightBody({ spot }) {
    const user = useSelector(state => state.session.user)
    const [numNights, setNumNights] = useState(1)
    console.log('user', user)
    console.log('spot', spot)

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
                            <div>
                                <span>{spot.avgStarRating}</span>
                                <span className="dot-space">·</span>
                                <span>{spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
                            </div>
                        </div>
                        {user ? user.id === spot.Owner.id
                            ? (
                                <div>
                                    <OpenModalButton buttonText='Edit Spot'/>
                                    <OpenModalButton buttonText='Delete Spot'/>
                                </div>
                            )
                            : (
                                <div className="flex-column">
                                    <input type="number" value={numNights} onChange={(e)=>setNumNights(e.target.value)}></input>
                                    <span>{`$${spot.price} x ${numNights} = ${spot.price * numNights}`}</span>
                                </div>
                            )
                            : (
                                <div className="flex-column">
                                    <input type="number" value={numNights} onChange={(e)=>setNumNights(e.target.value)} min='1'></input>
                                    <span>{`$${spot.price} x ${numNights} = $${spot.price * numNights}`}</span>
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
