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
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import "react-datepicker/dist/react-datepicker.css";
import { createBooking, updateBooking } from "../../store/bookings";
import { useEffect } from "react";

function SingleRightBody({ spot }) {
	const user = useSelector((state) => state.session.user);
	const spotBookings = useSelector((state) => state.bookings.spot);
	const userBookings = useSelector((state) => state.bookings.user);
	const spotBookingsArr = Object.values(spotBookings);
	const userBookingsArr = Object.values(userBookings);
	const booking = userBookingsArr.find((booking) => booking.spotId === spot.id);
	const userBookingsIds = Object.keys(userBookings).map((id) => +id);
	const dispatch = useDispatch();
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [numNights, setNumNights] = useState(0);
	const [errors, setErrors] = useState([]);

	const highlightDates = [];
	const excludeDates = [
		{ start: subDays(new Date(), 99999999), end: addDays(new Date(), 0) },
	];

	spotBookingsArr.forEach((booking) => {
		if (userBookingsIds.includes(booking.id)) {
			const highlight = {
				"react-datepicker__day--highlighted-custom-3": eachDayOfInterval({
					start: subDays(new Date(booking.startDate), 0),
					end: addDays(new Date(booking.endDate), 0),
				}),
			};
			highlightDates.push(highlight);
		} else {
			const exclude = {
				start: subDays(new Date(booking.startDate), 0),
				end: addDays(new Date(booking.endDate), 1),
			};
			excludeDates.push(exclude);
		}
	});

	const handleBook = async (e) => {
		e.preventDefault();

		const newBooking = {
			startDate: startDate?.toISOString().split("T")[0],
			endDate: endDate?.toISOString().split("T")[0],
		};
		if (isEditing) {
			await dispatch(updateBooking(newBooking, booking.id)).catch(
				async (res) => {
					const data = await res.json();

					if (data && data.message) setErrors([data.message]);
					if (data && data.errors) setErrors(Object.values(data.errors));
				}
			);
			setIsEditing(false);
		} else {
			await dispatch(createBooking(newBooking, spot.id)).catch(async (res) => {
				const data = await res.json();

				if (data && data.message) setErrors([data.message]);
				if (data && data.errors) setErrors(Object.values(data.errors));
			});
		}
		setStartDate(null);
		setEndDate(null);
	};

	const handleOpen = (e) => {
		if (e) {
			e.preventDefault();
		}
		setIsOpen(!isOpen);
	};

	const onChange = (dates) => {
		const [start, end] = dates;
		setStartDate(start);
		setEndDate(end);
		if (start && end) handleOpen();
	};
	const clearDates = (e) => {
		e.preventDefault();

		setStartDate(null);
		setEndDate(null);
	};
	const editBooking = (e) => {
		e.preventDefault();
		setStartDate(new Date(booking.startDate));
		setEndDate(new Date(booking.endDate));
		setIsEditing(true);
	};

	useEffect(() => {}, [userBookings]);
	useEffect(() => {
		if (startDate && endDate)
			setNumNights(differenceInDays(endDate, startDate));
	}, [startDate, endDate]);

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
					highlightDates={highlightDates}
					selectsRange
					monthsShown={2}
					// inline
				>
					{/* <p> gdfg</p> */}
					<span className="color-id1">F</span>
					<span>- Your active booking</span>
					<br/>
					<br/>
					<span className="color-id2">U</span>
					<span>- Selected Dates</span>
					<div>
						<button className="clear-dates-btn" onClick={clearDates}>
							Clear Dates
						</button>
						<button className="clear-dates-btn" onClick={editBooking}>
							Edit a booking
						</button>
					</div>
				</DatePicker>
				{isEditing ? (
					<button
						onClick={handleBook}
						className="open-modal-button reserve-btn"
					>
						Edit Booking
					</button>
				) : startDate && endDate ? (
					<button
						onClick={handleBook}
						className="open-modal-button reserve-btn"
					>
						Reserve
					</button>
				) : (
					<button
						onClick={handleOpen}
						className="open-modal-button reserve-btn"
					>
						Check Availability
					</button>
				)}

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
