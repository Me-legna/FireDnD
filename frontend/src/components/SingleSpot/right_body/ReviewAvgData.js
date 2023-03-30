import { useSelector } from "react-redux";
import solidStar from "../../../images/spotImages/star-solid.svg";


function ReviewAvgData(){
    const spot = useSelector(state => state.spots.singleSpot)
    return (
        <div className="review-preview-ctn">
							<div>
								<span className="right-body-price">{`$${spot.price} `}</span>
								<span>night</span>
							</div>
							{isNaN(spot.avgStarRating) ? (
								<div></div>
							) : (
								<div>
									<img
										className="solid-star"
										src={solidStar}
										alt="solid-black-star"
									/>
									<span>{spot.avgStarRating}</span>
									<span className="dot-space">·</span>
									<span>
										{spot.numReviews}{" "}
										{spot.numReviews === 1 ? "review" : "reviews"}
									</span>
								</div>
							)}
						</div>
    )
}
export default ReviewAvgData;
