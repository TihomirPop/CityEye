import { useState } from 'react';
import '../../styles/VerticalNav.css';

interface Props{
  renderComponent: (component: string) => void;
  signOut: () => void;
}

interface Button{
  component: string,
  icon: string
}

function VerticalNav({renderComponent, signOut}: Props) {
  const [activeComponentIndex, setActiveComponentIndex] = useState(0);

  const handleButtonClick = (component: string, index: number) => {
    setActiveComponentIndex(index);
    renderComponent(component);
  }

  const handleSignOut = () => {
    signOut();
  }

  const buttons: Button[] = [{component: 'Problems', icon: 'fa-solid fa-circle-exclamation'}, {component: 'Map', icon: 'fa-solid fa-map'}, {component: 'Events', icon: 'fa-solid fa-envelope'}, {component: 'EditUsers', icon: 'fa-solid fa-users'} ]

  return (
    <div className="vertical-nav">
      <ul className="nav-list">
        {buttons.map((button, index) => (
          <li key={index}>
            <button onClick={() => handleButtonClick(button.component, index)} className={index == activeComponentIndex ? 'selectedButton' : 'unselectedButton'}>
              <i className={button.icon} />
            </button>
          </li>
        ))}
        <li>
          <button onClick={handleSignOut} className='unselectedButton'>
            <i className="fa-solid fa-right-from-bracket" />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default VerticalNav;
