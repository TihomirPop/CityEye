import { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF} from "@react-google-maps/api";
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import AreYouSure from '../confirmation/AreYouSure';
import Marker, { MarkerInterface } from './Marker';
import '../../styles/Marker.css'

import EVCharger from '../assets/car-charger.png';
import MobileCharger from '../assets/mobile-charger.png';

const MarkerMap = () => {
    const [markers, setMarkers] = useState<MarkerInterface[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerInterface | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedOption, setSelectedOption] = useState('autoPunjac');
    const [popup, setPopup] = useState(false);
    const [addingMarker, setAddingMarker] = useState(false);

    useEffect(() => {
        getDocs(collection(db, 'markers')).then((results) => {
            const markersList: MarkerInterface[] = results.docs.map((doc: any) => ({
                id: doc.id,
                type: doc.data().type,
                address: doc.data().address,
                latLng: {lat: doc.data().lat, lng: doc.data().lng}
            }));
            setMarkers(markersList);
        })
    }, []);
    
    const addMarker = async (e: google.maps.MapMouseEvent) => {
        if(e.latLng && addingMarker){
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            setAddingMarker(false);

            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCUY11RGhx0bJVxMRphkwgtBbxobSDtDTo`)
                .then(response => response.json())
                .then(data => {
                    const newMarker: MarkerInterface = {latLng: {lat: lat, lng: lng}, type: selectedOption, id: (lat.toString() + lng.toString()), address: data.results[0].formatted_address};
                
                    setMarkers([...markers, newMarker]);
                    setDoc(doc(db, 'markers', newMarker.id), {
                        lat: newMarker.latLng.lat,
                        lng: newMarker.latLng.lng,
                        type: newMarker.type,
                        address: newMarker.address
                    });
                })
                .catch(error => console.log(error));
        }
    }

    const removeMarker = async (index: number, id: string) => {
        setMarkers(markers.filter((_, i) => index != i));
        deleteDoc(doc(db, 'markers', id));
        setSelectedMarker(null);
        setSelectedIndex(-1);
        setPopup(false);
    } 

    const handleMarkerClick = (index: number, marker: MarkerInterface) => {
        setSelectedIndex(index);
        setSelectedMarker(marker);
    }
    
    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    }

    const handleOptionChange = (e: BaseSyntheticEvent) => {
        setSelectedOption(e.target.value);
    }

    const mapMarkerIcon = (type: string) => {
        switch(type) {
            case 'autoPunjac':
                return EVCharger;
            case 'solarnaKlupa':
                return MobileCharger;
        }
    }

    const mapContainerStyle = {
        height: "600px",
        width: "calc(100% - 60px)",
        margin: "30px auto"
    }
      
    const center = useMemo(() => ({lat: 45.811225, lng: 15.979138}), []);

    return (
        <>
        <div>
            <label>
                <input
                type="radio"
                value="autoPunjac"
                checked={selectedOption == 'autoPunjac'}
                onChange={handleOptionChange}
                />
                EV Charger
            </label>
            <br />
            <label>
                <input
                type="radio"
                value="solarnaKlupa"
                checked={selectedOption == 'solarnaKlupa'}
                onChange={handleOptionChange}
                />
                Solar Bench
            </label>
        </div>
        <button onClick={() => setAddingMarker(true)}>Add marker</button>
        <p>{addingMarker ? 'click anywhere on the map to add a marker' : <span>&nbsp;</span>}</p>

        <GoogleMap
        id="markerMap"
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onClick={addMarker}
        options={{ styles: [{elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }],}], fullscreenControl: false, streetViewControl: false}}>
        {markers.map((marker: MarkerInterface, index) => (
            <MarkerF key={marker.id} position={marker.latLng} animation={google.maps.Animation.DROP} icon={mapMarkerIcon(marker.type)}  onClick={() => handleMarkerClick(index, marker)}> 
                {selectedMarker == marker && (
                    <InfoWindowF onCloseClick={handleInfoWindowClose}>
                        <div>
                            <p>{marker.address}</p>
                            <i onClick={() => setPopup(true)} className='fa-solid fa-trash-can userButtons' style={{position: 'relative', left: '50%', transform: 'translate(-50%, 0)'}} />
                        </div>
                    </InfoWindowF>
                )}
            </MarkerF>
        ))}
        </GoogleMap>
        { popup && <AreYouSure onYes={() => selectedMarker ? removeMarker(selectedIndex, selectedMarker.id) : null} onNo={() => setPopup(false)} /> }

        <ul className='markerList'>
            <li className='markerRow header'>
                <div className='markerElement small'>#</div>
                <div className='markerElement medium'>Type</div>
                <div className='markerElement large'>Address</div>
                <div className='markerElement small' />
            </li>
            {
                markers.map((marker: MarkerInterface, index) => (<Marker marker={marker} index={index} removeMarker={removeMarker} key={marker.id} />))
            }
        </ul>
        </>
    );
};

export default MarkerMap;