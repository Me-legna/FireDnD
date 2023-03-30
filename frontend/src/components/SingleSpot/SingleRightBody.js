import { useState } from "react";
import { useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";
import EditSpotFormModal from "./EditSpotFormModal";
import solidStar from "../../images/spotImages/star-solid.svg";
import ReviewAvgData from "./right_body/ReviewAvgData";
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css'

function SingleRightBody({ spot }) {
	const user = useSelector((state) => state.session.user);
	const [numNights, setNumNights] = useState(1);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(null);
		const onChange = (dates) => {
			const [start, end] = dates;
			setStartDate(start);
			setEndDate(end);
		};

	return (
		<div className="single-right-main">
			<ReviewAvgData />
			<DatePicker
				selected={startDate}
				onChange={onChange}
				startDate={startDate}
				endDate={endDate}
				selectsRange
				inline
			/>
		</div>
	);
}

export default SingleRightBody;

/* {user ? (
    <></>
) : (
    <div className="flex-column">
        <input
            className="clickable"
            type="number"
            value={numNights}
            onChange={(e) => setNumNights(e.target.value)}
            min="1"
        ></input>
        <div>{`$${spot.price} x ${numNights} ${
            numNights < 2 ? "night" : "nights"
        } = $${spot.price * numNights}`}</div>
    </div>
)} */
