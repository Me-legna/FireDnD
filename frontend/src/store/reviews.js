import { csrfFetch } from "./csrf";

const GET_SPOT = '/reviews/SPOT'
const GET_USER = '/reviews/USER'
const CREATE = '/reviews/CREATE'
const UPDATE = '/reviews/UPDATE'
const DELETE = '/reviews/DELETE'

const loadSpotReviews = (spotReviews) => ({
    type: GET_SPOT,
    spotReviews
})

export const getSpotReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(response.ok){
        const data = await response.json()
        dispatch(loadSpotReviews(data.Reviews))
    }
}

const initialState = {
    spot: {},
    user: {},
}

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_SPOT: {
            const newState = {spot: {}, user: {}}

            action.spotReviews.forEach(review => newState.spot[review.id] = review)

            return newState
        }
        default: {
            return state
        }
    }
}

export default reviewsReducer
