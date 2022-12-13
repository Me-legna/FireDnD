import { Redirect, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getOneSpot } from "../../store/spots";


function SingleSpot (){
    const params = useParams()
    const {id} = params
    const spot = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(async ()=>{
        const spotDeets = await dispatch(getOneSpot(id))

        // if(!spotDeets)
    },[dispatch])

    if(!+id >= 1) return <Redirect to="/" />;
    return (
        <h1> hello from User #{id} </h1>
    )
}

export default SingleSpot;
