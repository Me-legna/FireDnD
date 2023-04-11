import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteBooking, getUserBookings } from '../../store/bookings';
import logo from '../../images/fireDnD-logo.png'
import './Bookings.css'
import { useModal } from '../../context/Modal';
import { useHistory } from 'react-router-dom';

function AllUserBookings (){
    const userBookings = useSelector(state => state.bookings.user)
    const bookingsArr = Object.values(userBookings)
	const { closeModal } = useModal()
    const dispatch = useDispatch()
	const history = useHistory()


	const shortDateOptions = {
		month: "short",
		day: "numeric",
	};
	const fullDateOptions = {
		year: "numeric",
		month: "short",
		day: "numeric",
	};

    const addDefaultSrc = (e) => {
		e.target.onerror = null; // prevents looping
		e.target.src = logo;
	};
	const handleDelete = async (e, bookingId) => {
		e.preventDefault();

		await dispatch(deleteBooking(bookingId))
	}
	const handleSpot = (spotId) => {
		closeModal()
		history.push(`/spots/${spotId}`)
	}

	// useEffect(()=> {

	// }, [])
    return (
			<div className="user-bookings-ctn">
				<h1>Your bookings</h1>
				<div className="user-bookings-list">
					{bookingsArr.map((booking) => {
						console.log('startYear', booking.startDate.split("-")[0]);
						console.log('endYear', booking.startDate.split("-")[0]);
						const isSameYear =
							booking.startDate.split("-")[0] ===
							booking.endDate.split("-")[0];
						return (
						<div key={booking.id} className="user-booking">
							<div className="preview-ctn" onClick={() => handleSpot(booking.Spot.id)}>
								<img
									style={{ width: "100%" }}
									onError={addDefaultSrc}
									src={booking.Spot.previewImage}
									alt="Spot Preview"
								/>
							</div>
							<div>
								<h4>{booking.Spot.name}</h4>
								<p>{`${new Date(booking.startDate).toLocaleDateString(
									"en-us",
									isSameYear ? shortDateOptions : fullDateOptions
								)} - ${new Date(booking.endDate).toLocaleDateString(
									"en-us",
									fullDateOptions
								)}`}</p>
								<p>{`${booking.Spot.city}, ${booking.Spot.state}`}</p>
							</div>
							<p onClick={(e)=>handleDelete(e, booking.id)} className='delete-booking-btn'>X</p>
						</div>
					)})}
				</div>
			</div>
		);
}
export default AllUserBookings;
