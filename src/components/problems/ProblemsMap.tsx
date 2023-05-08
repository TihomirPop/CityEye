import { useMemo } from 'react';
import { GoogleMap, HeatmapLayerF} from "@react-google-maps/api";
import '../../styles/Problems.css'
import { ProblemInterface } from './Problem';

interface Props{
  problems: ProblemInterface[];
}

const ProblemsMap = ({problems}: Props) => {
  const getHeadmapData = () => {
    return problems.filter((problem: ProblemInterface) => (problem.address.split(',')[2]).trim() === 'Zagreb').map((problem) => new google.maps.LatLng(parseFloat(problem.location_lat), parseFloat(problem.location_lon)));
  };

  const mapContainerStyle = {
    height: "600px",
    width: "95%",
    margin: "20px auto"
  }
    
  const center = useMemo(() => ({lat: 45.811225, lng: 15.979138}), []);

  return (
  <GoogleMap
  id="marker-example"
  mapContainerStyle={mapContainerStyle}
  zoom={13}
  center={center}
  options={{ styles: [{elementType: 'labels', featureType: 'poi', stylers: [{ visibility: 'off', }],}],}}>
    <HeatmapLayerF data={getHeadmapData()} options={{radius: 25, dissipating: true}}/>
  </GoogleMap>
  );
};

export default ProblemsMap;