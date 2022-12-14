
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

const initialState = {
    allSpots: {optionalOrderedList: [],},
    singleSpot: {},}

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ALL:

            const allState = {...state};
            // console.log('action', action)

            action.spots.Spots.forEach(spot => allState.allSpots[spot.id] = spot);
            // console.log('allstate', allState)

            return allState

        case LOAD_ONE:
            // const id = action.spot.id
            const oneState = {...state, singleSpot: action.spot}
            // oneState.spotDetails[id] = action.spot
            console.log('action', action)
            console.log('oneState', oneState)
            return oneState
        default:
            return state
    }

}

export default spotsReducer
