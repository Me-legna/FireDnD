import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { updateSpot } from "../../store/spots";
// import { useHistory } from "react-router-dom";
import "./SingleSpot.css";

function EditSpotFormModal() {
    const dispatch = useDispatch();
    // const history = useHistory()
    const spot = useSelector(state => state.spots.singleSpot)
    const [address, setAddress] = useState(spot.address)
    const [city, setCity] = useState(spot.city)
    const [state, setState] = useState(spot.state)
    const [country, setCountry] = useState(spot.country)
    const [name, setName] = useState(spot.name)
    const [description, setDescription] = useState(spot.description)
    const [price, setPrice] = useState(spot.price)
    const [errors, setErrors] = useState([]);
    const usa = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const updatedSpot = {
            address,
            city,
            state,
            country,
            lat: -122.4730327,
            lng: 37.7645358,
            name,
            description,
            price
        }


        await dispatch(updateSpot(updatedSpot, spot.id, spot.SpotImages, spot.Owner))
        .then(closeModal)
        .catch(async res => {
            const data = await res.json()

            if (data && data.errors) setErrors(Object.values(data.errors));
        })

        // .then((res) => history.push(`/spots/${res.id}`))
        // setAddress(address);
        // setCity(city);
        // setState(state);
        // setCountry(country);
        // setName(name);
        // setDescription(description);
        // setPrice(price);

    };

    return (
        <>
            <h1>Edit your Spot 🤔</h1>
            <form onSubmit={handleSubmit} className='spot-form flex-column'>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    <input
                        className="flex form-input"
                        type="text"
                        minLength={5}
                        maxLength={50}
                        placeholder="Title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="flex form-input"
                        type="text"
                        placeholder="Street Address"
                        maxLength={50}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="flex form-input"
                        type="text"
                        placeholder="City"
                        maxLength={50}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <select
                        className="flex select-input"
                        type="select"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                    >
                        <option value="">Select a State</option>
                        {usa.map((state, idx) => (
                            <option key={`${state + idx}`} value={`${state}`}>{state}</option>
                        ))}
                    </select>
                </label>
                <label>
                    <input
                        className="flex form-input"
                        type="text"
                        maxLength={50}
                        minLength={3}
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="flex form-input"
                        type="text"
                        minLength={50}
                        maxLength={500}
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </label>
                <label>
                    <input
                        className="flex form-input"
                        type="number"
                        min={1}
                        placeholder="Price per night"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </label>
                <button className="select-input" type="submit">Edit Spot</button>
            </form>
        </>
    );
}

export default EditSpotFormModal;
