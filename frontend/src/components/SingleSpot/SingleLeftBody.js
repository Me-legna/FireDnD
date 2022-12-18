
function SingleLeftBody({ spot }) {

    return (
        <div>
            <div>
                <div>
                    <div>
                        <h2>{`Spot hosted by ${spot.Owner.firstName}`}</h2>
                        {/* <div>User Image Feature?...</div> */}
                    </div>
                    <div>
                        <p>{spot.description}</p>
                    </div>
                </div>
                {/* <div>Booking Feature...</div> */}
            </div>
        </div>
    )
}

export default SingleLeftBody
