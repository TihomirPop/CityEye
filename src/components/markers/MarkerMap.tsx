import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF} from "@react-google-maps/api";
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import AreYouSure from '../confirmation/AreYouSure';
import { MarkerInterface } from './Marker';
import '../../styles/Marker.css'
import EVCharger from '../assets/car-charger.png';
import MobileCharger from '../assets/mobile-charger.png';
import MarkersList from './MarkersList';
import MarkersDropdown from './MarkersDropdown';

const mapOptions = { 
  zoomControl: false, 
  styles: [
    {elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }], }, 
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },], 
  fullscreenControl: false, streetViewControl: false};

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
                    options={mapOptions}>
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