import { useState } from "react";
import { useSelector } from "react-redux";
import solidStar from "../../images/spotImages/star-solid.svg";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";
import EditSpotFormModal from "./EditSpotFormModal";
import logo from "../../images/fireDnD-logo.png";
import "./SingleSpot.css";

function SingleHeader({ spot }) {
	const user = useSelector((state) => state.session.user);
	const [numNights, setNumNights] = useState();

	const addDefaultSrc = (e) => {
		e.target.onerror = null; // prevents looping
		e.target.src = logo;
	};

	return (
		<div id="single-spot-header-container">
			<div id="single-spot-header">
				<div id="single-spot-prefix">
					<div>
						<h1 id="single-spot-title">{spot.name}</h1>
						<div className="single-spot-prefix-div">
							<span id="single-spot-review-location">
								<span id="star-icon-container">
									<img
										className="solid-star"
										src={solidStar}
										onError={addDefaultSrc}
										alt="solid-black-star"
									/>
								</span>
								<span id="single-spot-avg-star">
									{isNaN(spot.avgStarRating) ? "New" : spot.avgStarRating}
								</span>
								{spot.numReviews < 1 ? (
									<div></div>
								) : (
									<>
										<span className="dot-space"> · </span>
										<span id="num-reviews-button-container">
											<div>
												{spot.numReviews}{" "}
												{spot.numReviews === 1 ? "review" : "reviews"}
											</div>
										</span>
									</>
								)}
							</span>

							{/* <span className="dot-space"> · </span> */}

							<span className="flex">
								{/* <span id="medal-container">
                                <div>medal-icon</div>
                            </span>
                            <span id="is-superhost">Superhost</span> */}
							</span>

							<span className="dot-space"> · </span>

							<span id="location-button-container">
								<div id="location-button">
									{spot.city}, {spot.state}, {spot.country}
								</div>
							</span>
						</div>
					</div>
					<div className="single-spot-prefix-div">
						{user && user.id === spot.Owner.id ? (
							<div>
								<OpenModalButton
									buttonText="Edit Spot"
									modalComponent={<EditSpotFormModal spot={spot} />}
								/>
								<OpenModalButton
									buttonText="Delete Spot"
									modalComponent={<DeleteSpotModal spot={spot} />}
								/>
							</div>
						) : (
							<></>
						)}
						{/* <div className="flex">
                            <span id="share-button-container">
                                <button className="share-save-button">share-icon Share</button>
                            </span>
                        </div>
                        <div className="flex">
                            <span id="save-button-container">
                                <button className="share-save-button">heart-icon Save</button>
                            </span>
                        </div> */}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SingleHeader;
