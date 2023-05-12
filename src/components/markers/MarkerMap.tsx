import { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF} from "@react-google-maps/api";
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import AreYouSure from '../confirmation/AreYouSure';
import Marker, { MarkerInterface } from './Marker';
import '../../styles/Marker.css'

import EVCharger from '../assets/car-charger.png';
import MobileCharger from '../assets/mobile-charger.png';
import MarkersList from './MarkersList';
import MarkersDropdown from './MarkersDropdown';

const MarkerMap = () => {
    const [markers, setMarkers] = useState<MarkerInterface[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<MarkerInterface | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedOption, setSelectedOption] = useState('autoPunjac');
    const [popup, setPopup] = useState(false);
    const [addingMarker, setAddingMarker] = useState(false);
    const [screen, setScreen] = useState('map');

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
        margin: "0 auto"
    }
      
    const center = useMemo(() => ({lat: 45.811225, lng: 15.979138}), []);

    return (
        <>
            <div className='markersTabs'>
                <div className='markersTabWrapper'>
                    <button className={screen == 'map' ? 'markersTabButton' : 'markersTabButton notSelectedMarkersTabButton'} onClick={() => setScreen('map')}>Map</button>
                    {screen == 'map' && <div className='markersTabBorder' />}
                </div>
                <div className='markersTabWrapper'>
                    <button className={screen == 'markers' ? 'markersTabButton' : 'markersTabButton notSelectedMarkersTabButton'} onClick={() => setScreen('markers')}>Markers</button>
                    {screen == 'markers' && <div className='markersTabBorder' />}
                </div>
            </div>
            {
                screen == 'map' ? 
                <>
                    <div className='addMarkerWrapper'>
                        <button className='btn btn-primary markerButton' onClick={() => setAddingMarker(true)}>Add marker</button>
                        {
                            addingMarker &&
                            <>
                                <button className='btn btn-primary cancelAddingMarkerButton' onClick={() => setAddingMarker(false)}>Cancel</button>
                                <MarkersDropdown selectedMarkers={selectedOption} selectMarkersFunction={setSelectedOption} />
                                <p className='addingMarkerParagraph'>Click anywhere on the map to add a marker...</p>
                            </>
                        }
                    </div>

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
                </> :
                <MarkersList markers={markers} removeMarker={removeMarker} />
            }
            { popup && <AreYouSure onYes={() => selectedMarker ? removeMarker(selectedIndex, selectedMarker.id) : null} onNo={() => setPopup(false)} /> }
        </>
    );
};

export default MarkerMap;