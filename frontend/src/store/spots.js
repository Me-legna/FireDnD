
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
        dispatch(loadAllSpots(spotsList))
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


const spotsReducer = (state = {}, action) => {
    switch (action.type) {
        case LOAD_ALL:
            const allState = {};

            action.spots.Spots.forEach(spot => allState[spot.id] = spot);

            return allState

        case LOAD_ONE:
            const oneState = {...state}
            const id = action.spot.id
            oneState[`spot#${id}`] = action.spot
            console.log('action', action)
            console.log('oneState', oneState)
            return oneState
        default:
            return state
    }

}

export default spotsReducer
