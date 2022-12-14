import { Redirect, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";


function SingleSpot (){
    const dispatch = useDispatch()
    const {id} = useParams()
    // const spotsDetails = useSelector(state => state.spots.spotDetails[id])
    // const spot = Object.values(spotsDetails).find(spot=> spot.id === +id)
    // console.log(spotsDetails)
    // console.log(spot)

    // useEffect(()=>{
    //     dispatch(getOneSpot(id))
    // },[dispatch])

    // if(!id || id < 1 || isNaN(id)) return <Redirect to="/"/>
    return (
        <> Henlow</>
    )
}

export default SingleSpot;
