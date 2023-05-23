import "./reviewCard.css";

// TODO: (Nirav) - Fix this to properly show reviews
export function ReviewCard(props) {
    return (<div className='wrapper'>
        Review Id: {props.e.reviewId}{' '}
        <p>Review Comment: {props.e.reviewComments}</p>
    </div>);
}
