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
import differenceInDays from "date-fns/differenceInDays";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking } from "../../store/bookings";
import { useEffect } from "react";

function SingleRightBody({ spot }) {
	const user = useSelector((state) => state.session.user);
	const spotBookings = useSelector((state) => state.bookings.spot);
	const spotBookingsArr = Object.values(spotBookings);
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [numNights, setNumNights] = useState(0);
	const [errors, setErrors] = useState([]);
	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
	};

	const excludeDates = [
		{ start: subDays(new Date(), 99999999), end: addDays(new Date(), 0) },
	];

	spotBookingsArr.forEach((booking) => {
		const exclude = {
			start: subDays(new Date(booking.startDate), 0),
			end: addDays(new Date(booking.endDate), 1),
		};
		excludeDates.push(exclude);
	});

	const handleBook = async (e) => {
		e.preventDefault();

		const newBooking = {
			startDate: startDate?.toISOString().split("T")[0],
			endDate: endDate?.toISOString().split("T")[0],
		};
		await dispatch(createBooking(newBooking, spot.id)).catch(async (res) => {
			const data = await res.json();

			if (data && data.message) setErrors([data.message]);
			if (data && data.errors) setErrors(Object.values(data.errors));
		});

		setStartDate(null);
		setEndDate(null);
	};

	const clearDates = (e) => {
		e.preventDefault();

		setStartDate(null);
		setEndDate(null);
	};
	const handleOpen = (e) => {
		if(e){
			e.preventDefault();
		}
		setIsOpen(!isOpen)
	};

	useEffect(() => {
		if (startDate && endDate)
			setNumNights(differenceInDays(endDate, startDate));
	}, [startDate, endDate]);

	// console.log("startDate", startDate);
	// console.log("endDate", endDate);
	// console.log('numNights', numNights)
	// console.log('diff in days', differenceInDays(startDate, endDate))
	// console.log("spotBookingsArr", spotBookingsArr);
	// console.log("excludeDates", excludeDates);
	console.log("isOpen", isOpen);


	return (
		<div className="single-right-main">
			<ReviewAvgData />
			<div className="date-ctn">
				<ul>
					{errors.map((error, idx) => (
						<li key={idx}>{error}</li>
					))}
				</ul>
				<div className="date-headers">
					<p>{"Start Date - End Date"}</p>
				</div>
				<DatePicker
					dateFormat="MM/dd/yyyy"
					selected={startDate}
					onChange={onChange}
					startDate={startDate}
					endDate={endDate}
					minDate={startDate ? startDate : null}
					open={isOpen}
					onClickOutside={handleOpen}
					onInputClick={handleOpen}
					maxDate={
						startDate
							? excludeDates.find((dateRange) => dateRange?.start > startDate)
									?.start
							: null
					}
					// disabled={disabled}
					excludeDateIntervals={excludeDates}
					selectsRange
					monthsShown={2}
					// inline
				>
					<button className="clear-dates-btn" onClick={clearDates}>
						Clear Dates
					</button>
				</DatePicker>
				{startDate && endDate
				?
				<button style={{width:'70%'}} onClick={handleBook} className="open-modal-button">
					Reserve
				</button>
				:
				<button style={{width:'70%'}} onClick={handleOpen} className="open-modal-button">
					Check Availability
				</button>
				}

				{numNights < 1 ? (
					<></>
				) : (
					<div
						style={{ marginTop: "20px", width: "100%" }}
						className="flex-column"
					>
						<div className="flex-around">
							{" "}
							<>
								<div>{`$${spot.price} x ${numNights} ${
									numNights < 2 ? "night" : "nights"
								}`}</div>
								<div>{`$${spot.price * numNights}`}</div>
							</>
						</div>
						<div className="spacer"></div>
						<div className="flex-around">
							<div>Total before taxes</div>
							<div>{`$${spot.price * numNights}`}</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default SingleRightBody;
