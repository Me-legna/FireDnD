import { csrfFetch } from "./csrf";

const GET_SPOT = "/bookings/SPOT";
const GET_USER = "/bookings/USER";
const CREATE = "/bookings/CREATE";
const UPDATE = '/bookings/UPDATE';
const DELETE = "/bookings/DELETE";

const loadSpotBookings = (spotBookings) => ({
	type: GET_SPOT,
	spotBookings,
});

const loadUserBookings = (userBookings) => ({
	type: GET_USER,
	userBookings,
});
const create_Booking = (newBooking) => ({
	type: CREATE,
	newBooking,
});
const update_Booking = (updatedBooking) => ({
	type: UPDATE,
	updatedBooking,
});
const delete_booking = (bookingId) => ({
	type: DELETE,
	bookingId,
});

export const getSpotBookings = (spotId) => async (dispatch) => {
	const response = await csrfFetch(`/api/spots/${spotId}/bookings`);

	if (response.ok) {
		const data = await response.json();
		dispatch(loadSpotBookings(data.Bookings));
	}
};

export const getUserBookings = () => async (dispatch) => {
	const response = await csrfFetch("/api/bookings/current");

	if (response.ok) {
		const data = await response.json();
		dispatch(loadUserBookings(data.Bookings));
	}
	return response;
};

export const createBooking =
	(newBooking, spotId) => async (dispatch) => {
		const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
			method: "POST",
			body: JSON.stringify(newBooking),
		});

		if (response.ok) {
			const data = await response.json();
			// const booking = { ...data, ...bookingInfo };
			dispatch(create_Booking(data));
		}
		return response;
	};
export const updateBooking =
	(newBooking, bookingId) => async (dispatch) => {
		const response = await csrfFetch(`/api/bookings/${bookingId}`, {
			method: "PUT",
			body: JSON.stringify(newBooking),
		});

		if (response.ok) {
			const data = await response.json();
			console.log('data', data)
			// const booking = { ...data, ...bookingInfo };
			dispatch(update_Booking(data));
		}
		return response;
	};

export const deleteBooking = (bookingId) => async (dispatch) => {
	const response = await csrfFetch(`/api/bookings/${bookingId}`, {
		method: "DELETE",
	});

	if (response.ok) {
		await dispatch(delete_booking(bookingId));
	}
	return response;
};

const initialState = {
	spot: {},
	user: {},
};

const bookingsReducer = (state = initialState, action) => {
	switch (action.type) {
		case GET_SPOT: {
			const newState = {...state, spot: {} };

			action.spotBookings.forEach(
				(booking) => (newState.spot[booking.id] = booking)
			);

			return newState;
		}
		case GET_USER: {
			const newState = { ...state, user: {} };

			action.userBookings.forEach(
				(booking) => (newState.user[booking.id] = booking)
			);

			return newState;
		}
		case CREATE: {
			const newState = { spot: { ...state.spot }, user: {...state.user} };

			newState.spot[action.newBooking.id] = action.newBooking;
			newState.user[action.newBooking.id] = action.newBooking;

			return newState;
		}
		case UPDATE: {
			const newState = { spot: { ...state.spot }, user: {...state.user} };

			newState.spot[action.updatedBooking.id] = action.updatedBooking;
			newState.user[action.updatedBooking.id] = action.updatedBooking;

			return newState;
		}
		case DELETE: {
			const newState = { spot: { ...state.spot }, user: { ...state.user } };

			delete newState.spot[action.bookingId];
			delete newState.user[action.bookingId];

			return newState;
		}
		default: {
			return state;
		}
	}
};

export default bookingsReducer;
