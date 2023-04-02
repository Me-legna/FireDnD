import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../../store/bookings';
import logo from '../../images/fireDnD-logo.png'
import './Bookings.css'

function AllUserBookings (){
    const userBookings = useSelector(state => state.bookings.user)
    const bookingsArr = Object.values(userBookings)
    const dispatch = useDispatch()

    console.log('userBookings',userBookings)

    const addDefaultSrc = (e) => {
			e.target.onerror = null; // prevents looping
			e.target.src = logo;
		};

    return (
			<div>
				<h1>Your bookings</h1>
				{bookingsArr.map((booking) => (
					<div key={booking.id} className="user-booking">
						<div className="preview-ctn">
							<img
								style={{ width: "100%" }}
								onError={addDefaultSrc}
								src={booking.Spot.previewImage}
								alt="Spot Preview"
							/>
						</div>
					</div>
				))}
			</div>
		);
}
export default AllUserBookings;
