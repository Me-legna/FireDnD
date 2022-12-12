
const LOAD_ALL = 'spots/ALL';

const loadAllSpots = (spots) => ({
    type: LOAD_ALL,
    spots
})

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots')
    console.log('response', response)

    if(response.ok) {
        const spotsList = await response.json();
        dispatch(loadAllSpots(spotsList))
    }
}
const initialState = {allSpots:[]}
const spotsReducer = (state = initialState, action) => {
    switch (action.type){
        case LOAD_ALL:

        return {...state,allSpots:[...action.spots.Spots]}
        default:
            return state
    }

}

export default spotsReducer
