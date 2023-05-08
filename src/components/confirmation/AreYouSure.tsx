import '../../styles/Confirmation.css';

interface Props{
    onYes: () => void;
    onNo: () => void
}

function AreYouSure({onYes, onNo}: Props) {
    return (
        <>
            <div className='areYouSureGrayedOut' />
            <div className='areYouSurePopup'>
                <p>Are you sure?</p>
                <button className='btn btn-primary' onClick={() => onYes()}>Yes</button>
                <button className='btn btn-primary' onClick={() => onNo()}>No</button>
            </div>
        </>);
}

export default AreYouSure;