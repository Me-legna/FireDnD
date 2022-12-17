import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
import { getUserReviews } from "../../store/reviews"


function AllUserReviews() {
    const dispatch = useDispatch()
    const history = useHistory()
    const user = useSelector(state => state.session.user)
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        setErrors([]);
        dispatch(getUserReviews())
            .catch(
                async (res) => {
                    const data = await res.json();

                    if (data && data.message) setErrors([data.message]);
                }
            )
    },[dispatch])


    return (
        <div>
            <h3>AllUserReviews</h3>
            <ul>
                {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                ))}
            </ul>
        </div>
    )
}

export default AllUserReviews
