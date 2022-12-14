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

export const createNewSpot = (newSpot, owner) => async dispatch => {
    const { address, city, state, country, name, description, price, previewImg } = newSpot
    const spotResponse = await csrfFetch('/api/spots', {
        method: 'POST',
        body: {
            address,
            city,
            state,
            country,
            lat: -122.4730327,
            lng: 37.7645358,
            name,
            description,
            price,
        }
    })

    if(spotResponse.ok){
        const newSpot = await spotResponse.json()
        const imgResponse = await csrfFetch(`/api/spots/${newSpot.id}/images`, {
            method: 'POST',
            body: {
                url: previewImg,
                preview: true,
            }
        })

        if(imgResponse.ok){
            // const newSpotPreview = await imgResponse.json()
            newSpot.Owner = owner;
            dispatch(createSpot(newSpot))
        }
        return newSpot
    }
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
        // case CREATE: {
        //     const newState = {...state}
        //     newState[action.newSpot.id] = action.newSpot;
        // }
        default:
            return state
    }

}

export default spotsReducer
