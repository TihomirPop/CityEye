import '../../styles/Users.css'
import { useEffect, useState } from 'react';

interface Props{
  userRole: string;
  setRoleFunction: (role: string) => void;
}

function Dropdown({userRole, setRoleFunction}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(userRole);

  useEffect(() => {
    setRoleFunction(userRole);
  }, []);

  const toggleDropdown = () => {
    setIsOpen((open) => !open);
  };

  const adminClick = () => {
    setRole('admin');
    setRoleFunction('admin');
    toggleDropdown();
  };

  const userClick = () => {
    setRole('user');
    setRoleFunction('user');
    toggleDropdown();
  };

  return (
    <div className='user-dropdown'>
      <button onClick={toggleDropdown}>
        <p>{role}</p>
        <i className='fa-solid fa-chevron-down' />
      </button>
      {isOpen && (
        <div className='user-dropdown-menu'>
            <div className='dropdown-first-element' />
            <div className='dropdown-element' onClick={adminClick}>admin</div>
            <div className='dropdown-element' onClick={userClick}>user</div>
        </div>
      )}
    </div>
  );
}

export default Dropdown;