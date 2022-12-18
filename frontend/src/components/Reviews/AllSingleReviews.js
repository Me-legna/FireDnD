
function AllSingleReviews({ spotReviews }) {

    return (
        <div>
            <div>
                {!!spotReviews.length
                    ? spotReviews.map(review => (
                        <div key={review.id}>
                            <div>
                                <div>
                                    <i className="fas fa-user-circle" />
                                    <div>{review.User.firstName}</div>
                                </div>
                                <div>
                                    {review.review}
                                </div>

                            </div>
                        </div>
                    ))
                    : (
                        <div>{'No reviews (yet) 🥹'}</div>
                    )
                }
            </div>
        </div>
    )
}

export default AllSingleReviews
