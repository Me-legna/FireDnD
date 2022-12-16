import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createNewSpot } from "../../store/spots";
import "./SingleSpot.css";
import { useHistory } from "react-router-dom";

function CreateSpotFormModal() {
    const dispatch = useDispatch();
    const history = useHistory()
    const [address, setAddress] = useState('1555 Short St')
    const [city, setCity] = useState('New Orleans')
    const [state, setState] = useState('LA')
    const [country, setCountry] = useState('USA')
    const [name, setName] = useState('Just a Spot I Call Home')
    const [description, setDescription] = useState('What a lovely, cozy, incredible home! You will love living inside this beautiful home!')
    const [price, setPrice] = useState('100')
    const [previewUrl, setPreviewUrl] = useState('https://a0.muscache.com/im/pictures/miso/Hosting-46695796/original/d01dc3d2-9597-4d88-92f7-3e15a1c0d604.jpeg?im_w=480')
    const [errors, setErrors] = useState([]);
    const user = useSelector(state => state.session.user)
    const usa = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY']
    const { closeModal } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        const newSpot = {
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


        await dispatch(createNewSpot(newSpot, user, previewUrl))
        .then((res)=>history.push(`/spots/${res.id}`))
        .then(closeModal)
        .catch(async res => {
            const data = await res.json()

            if(data && data.errors) setErrors(Object.values(data.errors))
        })

    };

    return (
        <>
            <h1>fireDnD your Spot 😏</h1>
            <form onSubmit={handleSubmit} className='spot-form flex-column'>
                <ul>
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <label>
                    <input
                        className="flex form-input"
                        type="url"
                        placeholder="Preview Image Url"
                        value={previewUrl}
                        onChange={(e) => setPreviewUrl(e.target.value)}
                        required
                    />
                </label>
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
                <button className="select-input" type="submit">Create Spot</button>
            </form>
        </>
    );
}

export default CreateSpotFormModal;
