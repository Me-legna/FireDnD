
const LOAD_ALL = 'spots/ALL';
const LOAD_ONE = 'spots/ONE'

const loadAllSpots = (spots) => ({
    type: LOAD_ALL,
    spots
})

const loadOneSpot = (spot) => ({
    type: LOAD_ONE,
    spot
})


export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const spotsList = await response.json();
        dispatch(loadAllSpots(spotsList.Spots))
    }
}

export const getOneSpot = (id) => async dispatch => {
    const response = await fetch(`/api/spots/${id}`)

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadOneSpot(spot))
        return spot
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
        default:
            return state
    }

}

export default spotsReducer
