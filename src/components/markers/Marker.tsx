import  { useState } from 'react';
import AreYouSure from '../confirmation/AreYouSure';

type LatLngLiteral = google.maps.LatLngLiteral;

export interface MarkerInterface{
    latLng: LatLngLiteral;
    type: string;
    id: string;
    address: string;
}

interface Props{
    marker: MarkerInterface;
    index: number;
    removeMarker: (index: number, id: string) => void;
}

function Marker({marker, index, removeMarker}: Props) {
    const [popup, setPopup] = useState(false);

    const deleteMarker = () => {
        removeMarker(index, marker.id);
        setPopup(false);
    }

    return (
        <>
        <li className='markerRow' style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>{index + 1}.</div>
            <div>{marker.type}</div>
            <div>{marker.address}</div>
            <div>{<i onClick={() => setPopup(true)} className='fa-solid fa-trash-can userButtons' />}</div>
        </li>
        { popup ? <AreYouSure onYes={deleteMarker} onNo={() => setPopup(false)} /> : null }
        </>
    );
}

export default Marker;