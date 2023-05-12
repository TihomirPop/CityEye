import { useState, useEffect } from 'react';
import { GoogleMap, HeatmapLayerF} from "@react-google-maps/api";
import '../../styles/Problems.css'
import { ProblemInterface } from './Problem';
import ProblemsDropdown from './ProblemsDropdown';

interface Props{
  problems: ProblemInterface[];
  problemType: string;
  mapCentar: google.maps.LatLng | google.maps.LatLngLiteral | undefined;
  mapZoom: number | undefined;
  setMapCenterAndZoom: (centar: google.maps.LatLng | google.maps.LatLngLiteral | undefined, zoom: number | undefined) => void;
  selectProblemsFunction: (problemType: string) => void;
}

const ProblemsMap = ({problems, problemType, mapCentar, mapZoom, setMapCenterAndZoom, selectProblemsFunction}: Props) => {
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
      <div className='mapProblemsDropdownWrapper'>
        <ProblemsDropdown selectedProblems={problemType} selectProblemsFunction={problemType => selectProblemsFunction(problemType)} />
      </div>

      <GoogleMap
      id="marker-example"
      mapContainerStyle={mapContainerStyle}
      zoom={mapZoom}
      center={mapCentar}
      onLoad={(map: google.maps.Map) => setMap(map)}
      onDragEnd={onCenterChange}
      onZoomChanged={onCenterChange}
      options={{ styles: [{elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }],}],}}>
        <HeatmapLayerF data={getHeadmapData()} options={{radius: 40, dissipating: true}}/>
      </GoogleMap>
    </>
  );
};

export default ProblemsMap;