import { BaseSyntheticEvent, useEffect, useMemo, useState } from 'react';
import { GoogleMap, MarkerF, InfoWindowF} from "@react-google-maps/api";
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';

import CarCharger from '../assets/car-charger.png';
import MobileCharger from '../assets/mobile-charger.png';

type LatLngLiteral = google.maps.LatLngLiteral;

interface Marker {
    latLng: LatLngLiteral,
    type: string,
    id: string
    address: string
}

const MarkerMap = () => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [selectedOption, setSelectedOption] = useState("autoPunjac")

    useEffect(() => {
        getDocs(collection(db, 'markers')).then((results) => {
            const markersList: Marker[] = results.docs.map((doc: any) => ({
                id: doc.id,
                type: doc.data().type,
                address: doc.data().address,
                latLng: {lat: doc.data().lat, lng: doc.data().lng}
            }));
            setMarkers(markersList);
        })
    }, []);
    
    const addMarker = async (e: google.maps.MapMouseEvent) => {
        if(e.latLng){
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCUY11RGhx0bJVxMRphkwgtBbxobSDtDTo`)
                .then(response => response.json())
                .then(data => {
                    const newMarker: Marker = {latLng: {lat: lat, lng: lng}, type: selectedOption, id: (lat.toString() + lng.toString()), address: data.results[0].formatted_address};
                
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
    } 

    const handleMarkerClick = (marker: Marker) => {
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
                return CarCharger;
            case 'solarnaKlupa':
                return MobileCharger;
        }
    }

    const mapContainerStyle = {
        height: "600px",
        width: "95%",
        margin: "20px auto"
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
                Punjač za električna vozila
            </label>
            <br />
            <label>
                <input
                type="radio"
                value="solarnaKlupa"
                checked={selectedOption == 'solarnaKlupa'}
                onChange={handleOptionChange}
                />
                Solarna klupa
            </label>
        </div>

        <GoogleMap
        id="marker-example"
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={center}
        onClick={addMarker}
        options={{ styles: [{elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }],}],}}>
        {markers.map((marker: Marker, index) => (
            <MarkerF key={marker.id} position={marker.latLng} animation={google.maps.Animation.DROP} icon={mapMarkerIcon(marker.type)} onRightClick={() => removeMarker(index, marker.id)} onClick={() => handleMarkerClick(marker)}> 
                {selectedMarker == marker && (
                    <InfoWindowF onCloseClick={handleInfoWindowClose}>
                        <div>{marker.address}</div>
                    </InfoWindowF>
                )}
            </MarkerF>
        ))}
        </GoogleMap>
        </>
    );
};

export default MarkerMap;