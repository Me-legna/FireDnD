
function AllSingleReviews({ spotReviews }) {

    return (
        <div>
            <div className="all-reviews">
                {!!spotReviews.length
                    ? spotReviews.map(review => (
                        <div key={review.id} className='each-review'>
                            <div>
                                <div className="review-user">
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
