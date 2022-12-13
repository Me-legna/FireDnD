
const LOAD_ALL = 'spots/ALL';

const loadAllSpots = (spots) => ({
    type: LOAD_ALL,
    spots
})

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')

    if (response.ok) {
        const spotsList = await response.json();
        dispatch(loadAllSpots(spotsList))
    }
}


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL:
            const newState = {};

            action.spots.Spots.forEach(spot => newState[spot.id] = spot);
            
            return newState
        default:
            return state
    }

}

export default spotsReducer
