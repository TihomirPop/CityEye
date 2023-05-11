import '../../styles/Problems.css'
import { useState } from 'react';

interface Props{
  selectedProblems: string;
  selectProblemsFunction: (selectedProblems: string) => void;
}

function ProblemsDropdown({selectedProblems, selectProblemsFunction}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(selectedProblems);

  const toggleDropdown = () => {
    setIsOpen((open) => !open);
  };

  const notSolvedClick = () => {
    setSelected('Not solved problems');
    selectProblemsFunction('Not solved problems');
    toggleDropdown();
  };

  const solvedClick = () => {
    setSelected('Solved problems');
    selectProblemsFunction('Solved problems');
    toggleDropdown();
  };

  const allClick = () => {
    setSelected('All problems');
    selectProblemsFunction('All problems');
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
            <div className='problem-dropdown-element' onClick={notSolvedClick}>Not solved problems</div>
            <div className='problem-dropdown-element' onClick={solvedClick}>Solved problems</div>
            <div className='problem-dropdown-element' onClick={allClick}>All problems</div>
        </div>
      )}
    </div>
  );
}

export default ProblemsDropdown;