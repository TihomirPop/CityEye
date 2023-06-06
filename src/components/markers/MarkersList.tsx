import '../../styles/Marker.css'
import Marker, { MarkerInterface } from './Marker';

interface Props{
    markers: MarkerInterface[];
    removeMarker: (index: number, id: string) => void;
}

const MarkersList = ({markers, removeMarker}: Props) => {

    return (
        <ul className='markerList'>
            <li className='markerRow header'>
                <div className='markerElement small'>#</div>
                <div className='markerElement medium'>Type</div>
                <div className='markerElement large'>Address</div>
                <div className='markerElement small' />
            </li>
            {
                markers.map((marker: MarkerInterface, index: number) => (<Marker marker={marker} index={index} removeMarker={removeMarker} key={marker.id} />))
            }
        </ul>
    );
};

export default MarkersList;