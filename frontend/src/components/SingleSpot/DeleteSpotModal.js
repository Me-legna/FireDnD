import React, { useState } from "react";
// import * as sessionActions from "../../store/session";
import { useHistory } from 'react-router-dom'
import { useDispatch} from "react-redux";
import { useModal } from "../../context/Modal";
import "./SingleSpot.css";
import { deleteSpot } from "../../store/spots";

function DeleteSpotModal({ spot }) {
    const dispatch = useDispatch();
    const history = useHistory()
    const {closeModal} = useModal()
    const [checked, setChecked] = useState(false)
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        await dispatch(deleteSpot(spot.id))
        .then(closeModal)
        .catch(
            async (res) => {
                const data = await res.json();

                if (data && data.message) setErrors([data.message]);
                if (data && data.errors) setErrors(Object.values(data.errors));
            }
            );

            history.push('/')
    };

    return (
        <>
            <h1>Delete this Spot? {checked ? '😳' : '🤔'}</h1>
            <form onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <div>
                    <label>
                        No
                        <input
                            type="radio"
                            name="choice-radio"
                            onChange={(e) => setChecked(false)}
                            checked={checked ? false : true}
                        />
                    </label>
                    <label>
                        Yes
                        <input
                            type="radio"
                            name="choice-radio"
                            onChange={(e) => setChecked(true)}
                            checked={checked}
                        />
                    </label>
                </div>
                {/* <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label> */}
                {checked && (<button type="submit" className="form-input" disabled={!checked}>Delete Spot</button>)}
            </form>
        </>
    );
}

export default DeleteSpotModal;
