import logo from "../../images/fireDnD-logo.png";

function SingleImages({ spot }) {
	const spotImages = spot.SpotImages;
	const previewImage = spotImages.find((image) => image.preview === true);

	const addDefaultSrc = (e) => {
		e.target.onerror = null; // prevents looping
		e.target.src = logo;
	};

	return (
		<div>
			<div className="flex-center single-preview">
				<img className="single-image" onError={addDefaultSrc} src={previewImage?.url} alt="preview" />
				{/* {spotImages.map(({id, url}, idx) => (idx < 5
                ? ( <img src={url} alt={`#${idx+1}`}/>)
                : idx === 5 && (<div><OpenModalButton buttonText='See all Images' modalComponent={<></>}/></div>)))} */}
			</div>
		</div>
	);
}

export default SingleImages;
