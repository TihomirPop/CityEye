import { useState } from 'react';
import { GoogleMap, HeatmapLayerF} from "@react-google-maps/api";
import '../../styles/Problems.css'
import { ProblemInterface } from './Problem';


interface Props{
  problems: ProblemInterface[];
  problemType: string;
  mapCentar: google.maps.LatLng | google.maps.LatLngLiteral | undefined;
  mapZoom: number | undefined;
  setMapCenterAndZoom: (centar: google.maps.LatLng | google.maps.LatLngLiteral | undefined, zoom: number | undefined) => void;
  selectProblemsFunction: (problemType: string) => void;
}

const mapOptions = { 
  zoomControl: false, fullscreenControl: false, 
  streetViewControl: false, 
  styles: 
  [{elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }], },
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
  },],};

const ProblemsMap = ({problems, mapCentar, mapZoom, setMapCenterAndZoom}: Props) => {
  const [map, setMap] = useState<google.maps.Map>();
  const getHeadmapData = () => {
    return problems.map((problem) => new google.maps.LatLng(parseFloat(problem.location_lat), parseFloat(problem.location_lon)));
  };

  const mapContainerStyle = {
    height: "600px",
    width: "calc(100% - 60px)",
    margin: "20px auto"
  }
  
  const onCenterChange = () => {
    if(map)
      setMapCenterAndZoom(map.getCenter(), map.getZoom());
  }

  return (
    <>
      <GoogleMap
      id="problemsMap"
      mapContainerStyle={mapContainerStyle}
      zoom={mapZoom}
      center={mapCentar}
      onLoad={(map: google.maps.Map) => setMap(map)}
      onDragEnd={onCenterChange}
      onZoomChanged={onCenterChange}
      options={mapOptions}>
        <HeatmapLayerF data={getHeadmapData()} options={{radius: 40, dissipating: true}}/>
      </GoogleMap>
    </>
  );
};

export default ProblemsMap;