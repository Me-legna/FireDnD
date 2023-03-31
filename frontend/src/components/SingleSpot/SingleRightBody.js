import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OpenModalButton from "../OpenModalButton";
import DeleteSpotModal from "./DeleteSpotModal";
import EditSpotFormModal from "./EditSpotFormModal";
import solidStar from "../../images/spotImages/star-solid.svg";
import ReviewAvgData from "./right_body/ReviewAvgData";
import DatePicker from "react-datepicker";
import subDays from "date-fns/subDays";
import addDays from "date-fns/addDays";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking } from "../../store/bookings";

function SingleRightBody({ spot }) {
	const user = useSelector((state) => state.session.user);
	const spotBookings = useSelector((state) => state.bookings.spot);
	const spotBookingsArr = Object.values(spotBookings);
    const dispatch = useDispatch()
	const [numNights, setNumNights] = useState(1);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
    const [errors, setErrors] = useState([])
	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const excludeDates = [
		{ start: subDays(new Date(), 99999999), end: addDays(new Date(), -1) }
	];

	spotBookingsArr.forEach((booking) => {
        console.log('booking', booking)
        console.log('bookingDate', new Date(booking.startDate))
		const exclude = {
			start: subDays(new Date(booking.startDate), 0),
			end: addDays(new Date(booking.endDate), 1),
		};
		excludeDates.push(exclude);
	});

    const handleBook = async (e) => {
        e.preventDefault()

        const newBooking = {
            startDate: startDate?.toISOString().split('T')[0],
            endDate: endDate?.toISOString().split('T')[0]
        }
        await dispatch(createBooking(newBooking, spot.id))
        .catch(async(res) => {
            const data = await res.json()

            if (data && data.message) setErrors([data.message]);
            if (data && data.errors) setErrors(Object.values(data.errors));
        })

        setStartDate(null)
        setEndDate(null)
    }

	console.log("spotBookingsArr", spotBookingsArr);
	console.log("startDate", startDate);
	console.log("endDate", endDate);

	return (
		<div className="single-right-main">
			<ReviewAvgData />
			<div className="date-ctn">
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<DatePicker
					dateFormat="yyyy-MM-dd"
					selected={startDate}
					onChange={onChange}
					startDate={startDate}
					endDate={endDate}
					excludeDateIntervals={excludeDates}
					selectsRange
					inline
				/>
				<button onClick={handleBook} className="open-modal-button">
					Reserve
				</button>
			</div>
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
