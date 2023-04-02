import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserBookings } from '../../store/bookings';
import './Bookings.css'

function AllUserBookings (){
    const userBookings = useSelector(state => state.bookings.user)
    const bookingsArr = Object.values(userBookings)
    const dispatch = useDispatch()

    console.log('userBookings',userBookings)
    
    return (
        <div>
            <h1>Your bookings</h1>

        </div>
    )
}
export default AllUserBookings;
