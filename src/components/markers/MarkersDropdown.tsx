import '../../styles/Marker.css'
import { useState } from 'react';

interface Props{
  selectedMarkers: string;
  selectMarkersFunction: (selectedMarkers: string) => void;
}

function MarkersDropdown({selectedMarkers, selectMarkersFunction}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedMarkers);

  const toggleDropdown = () => {
    setIsOpen((open) => !open);
  };

  const autoPunjacClick = () => {
    setSelected('autoPunjac');
    selectMarkersFunction('autoPunjac');
    toggleDropdown();
  };

  const solarnaKlupaClick = () => {
    setSelected('solarnaKlupa');
    selectMarkersFunction('solarnaKlupa');
    toggleDropdown();
  };

  const getMarkerType = (type: string) => {
    switch(type) {
        case 'autoPunjac':
            return 'EV charger';
        case 'solarnaKlupa':
            return 'Solar bench';
    }
}

  return (
    <div className='marker-dropdown'>
      <button onClick={toggleDropdown}>
        <p>{getMarkerType(selected)}</p>
        <i className='fa-solid fa-chevron-down' />
      </button>
      {isOpen && (
        <div className='marker-dropdown-menu'>
            <div className='marker-dropdown-first-element' />
            <div className='marker-dropdown-element' onClick={autoPunjacClick}>EV charger</div>
            <div className='marker-dropdown-element' onClick={solarnaKlupaClick}>Solar bench</div>
        </div>
      )}
    </div>
  );
}

export default MarkersDropdown;