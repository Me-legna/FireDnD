import { csrfFetch } from "./csrf";

const LOAD_ALL = 'spots/ALL';
const LOAD_ONE = 'spots/ONE';
const CREATE = 'spots/CREATE';

const loadAllSpots = (spots) => ({
    type: LOAD_ALL,
    spots
})

const loadOneSpot = (spot) => ({
    type: LOAD_ONE,
    spot
})

const createSpot = (newSpot) => ({
    type: CREATE,
    newSpot
})


export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spotsList = await response.json();
        dispatch(loadAllSpots(spotsList.Spots))
    }
}

export const getOneSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOneSpot(spot))
        return spot
    }
}

export const createNewSpot = (newSpot, owner, previewUrl) => async dispatch => {
    // const { address, city, state, country, lat, lng, name, description, price } = newSpot
    // console.log('THUNK RUNNING', newSpot)
    const spotResponse = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(newSpot)
    })
    // console.log('spotResponse', spotResponse)
    if (spotResponse.ok) {
        const newSpot = await spotResponse.json()
        // console.log('newSpot', newSpot)
        const imgResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            body: JSON.stringify({
                url: previewUrl,
                preview: true,
            })
        })
        // console.log('imgResponse',imgResponse)

        if (imgResponse.ok) {
            const newSpotPreview = await imgResponse.json()
            // console.log('newSpotPreview', newSpotPreview)
            newSpot.Owner = owner;
            newSpot.SpotImages = [newSpotPreview]
            dispatch(createSpot(newSpot))
            return newSpot
        }
    }
    return spotResponse
}

export const updateSpot = () => async dispatch => {

    const updateResponse = await csrfFetch(``)
}


const initialState = {
    allSpots: {},
    singleSpot: {},
}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL: {
            const newState = { allSpots: {}, singleSpot: {}, };

            action.spots.forEach(spot => newState.allSpots[spot.id] = spot);

            return newState
        }
        case LOAD_ONE: {
            const newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.spot

            return newState
        }
        case CREATE: {
            const newState = { ...state, singleSpot: {} }
            newState.singleSpot = action.newSpot
            // console.log('newState', newState)

            return newState;
        }
        default:
            return state
    }

}

export default spotsReducer
