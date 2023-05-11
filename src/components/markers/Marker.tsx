import  { useState } from 'react';
import AreYouSure from '../confirmation/AreYouSure';
import '../../styles/Marker.css'

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

    const getMarkerName = () => {
        switch (marker.type) {
            case 'solarnaKlupa':
                return 'Solar Bench';
            case 'autoPunjac':
                return 'EV Charger';
        }
    }

    return (
        <>
        <li className='markerRow'>
            <div className='markerElement small'>{index + 1}.</div>
            <div className='markerElement medium'>{getMarkerName() ? getMarkerName() : marker.type}</div>
            <div className='markerElement large'>{marker.address}</div>
            <div className='markerElement small'>{<i onClick={() => setPopup(true)} className='fa-solid fa-trash-can userButtons' />}</div>
        </li>
        { popup ? <AreYouSure onYes={deleteMarker} onNo={() => setPopup(false)} /> : null }
        </>
    );
}

export default Marker;