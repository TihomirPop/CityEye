import '../../styles/Problems.css'
import { useState } from 'react';

interface Props{
  selectedCategory: string;
  selectCategory: (selectedCategory: string) => void;
}

function CategoryDropdown({selectedCategory, selectCategory}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedCategory);

  const toggleDropdown = () => {
    setIsOpen((open) => !open);
  };

  const trafficClick = () => {
    setSelected('Traffic');
    selectCategory('Traffic');
    toggleDropdown();
  };

  const junkClick = () => {
    setSelected('Junk');
    selectCategory('Junk');
    toggleDropdown();
  };

  const damagedItemClick = () => {
    setSelected('Damaged item');
    selectCategory('Damaged item');
    toggleDropdown();
  };

  const otherClick = () => {
    setSelected('Other');
    selectCategory('Other');
    toggleDropdown();
  };

  const allClick = () => {
    setSelected('All categories');
    selectCategory('All categories');
    toggleDropdown();
  };

  return (
    <div className='problem-dropdown'>
      <button onClick={toggleDropdown}>
        <p>{selected}</p>
        <i className='fa-solid fa-chevron-down' />
      </button>
      {isOpen && (
        <div className='problem-dropdown-menu'>
            <div className='problem-dropdown-first-element' />
            <div className='problem-dropdown-element' onClick={allClick}>All categories</div>
            <div className='problem-dropdown-element' onClick={trafficClick}>Traffic</div>
            <div className='problem-dropdown-element' onClick={junkClick}>Junk</div>
            <div className='problem-dropdown-element' onClick={damagedItemClick}>Damaged Item</div>
            <div className='problem-dropdown-element' onClick={otherClick}>Other</div>
        </div>
      )}
    </div>
  );
}

export default CategoryDropdown;