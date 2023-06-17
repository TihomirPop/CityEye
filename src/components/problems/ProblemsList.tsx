import { useState, useEffect, BaseSyntheticEvent } from 'react';
import 'firebase/firestore';
import { collection, onSnapshot } from 'firebase/firestore';
import '../../styles/Problems.css'
import { db } from '../../config/Firebase';
import Problem, { ProblemInterface } from './Problem';
import Image from './Image';
import ProblemsMap from './ProblemsMap';
import ProblemsDropdown from './ProblemsDropdown';
import SelectedProblem from './SelectedProblem';
import { WebUser } from '../users/User';
import Multiselect from 'multiselect-react-dropdown';
import Stats from './Stats';

interface Props{
  currentUser: WebUser;
}

const ProblemsList = ({currentUser}: Props) => {
  const [problems, setProblems] = useState<ProblemInterface[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemInterface[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<ProblemInterface | null>(null);
  const [search, setSearch] = useState('');
  const [screen, setScreen] = useState('problems');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [sendingAnswer, setSendingAnswer] = useState(false);
  const [selectedProblemType, setSelectedProblemType] = useState('Not solved problems');
  const [mapCentar, setMapCentar] = useState<google.maps.LatLng | google.maps.LatLngLiteral | undefined>({lat: 45.811225, lng: 15.979138});
  const [mapZoom, setMapZoom] = useState<number | undefined>(13);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<object[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'problems'), (snapshot) => {
      const problemsList: ProblemInterface[] = snapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()})).filter((problem) => problem.title != null);


      problemsList.sort((a: ProblemInterface, b: ProblemInterface) => {
        if(a.epoch < b.epoch){
          return 1;
        }
        return -1;
      })
      setProblems(problemsList);
    });
    return () => {unsubscribe();};
  }, []);

  useEffect(() => {
    setFilteredProblems(problems.filter(solvedFilterFunction));
    setSendingAnswer(false);
  }, [problems]);

  useEffect(() => {
    filter();
  }, [search, selectedProblemType, selectedOptions]);

  useEffect(() => {
    setPage(1);
    setMaxPage(Math.ceil(filteredProblems.length / 15));
  }, [filteredProblems]);

  const solvedFilterFunction = (problem: ProblemInterface) => {
    switch (selectedProblemType) {
      case 'Not solved problems':
        return !problem.solved;
      case 'Solved problems':
        return problem.solved;
      case 'All problems':
        return true;
    }
  }

  const categoryFilterFunction = (problem: ProblemInterface) => {
    if(selectedOptions.length == 0)
      return true;
    
    if(problem.category == null){
      if(selectedOptions.some((option: any) => option.name == 'Other'))
        return true;
      return false;
    }

    return selectedOptions.some((option: any) => option.name == problem.category);
  }

  const filter = () => {
    if(search.length > 0){
      setFilteredProblems(problems.filter((problem) => solvedFilterFunction(problem) && categoryFilterFunction(problem) && (problem.title.toLowerCase().includes(search.toLowerCase()) || problem.description.toLowerCase().includes(search.toLowerCase()))));
    } else{
      setFilteredProblems(problems.filter((problem) => solvedFilterFunction(problem) && categoryFilterFunction(problem)));
    }
  }

  const selectProblem = (problem: ProblemInterface, showMessages: boolean) => { 
    setSelectedProblem(problem);
    setShowMessages(showMessages);

  }

  const unselectProblem = () => { 
    setSelectedProblem(null); 
  }

  const pageBack = () => {
    setPage((page) => page - 1);
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  const pageForward = () => {
    setPage((page) => page + 1);
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }

  const setMapCenterAndZoom = (mapCentar: google.maps.LatLng | google.maps.LatLngLiteral | undefined, mapZoom: number | undefined) => {
    setMapCentar(mapCentar); 
    setMapZoom(mapZoom);
  }

  const options = [
    { id: 1, name: 'Traffic' },
    { id: 2, name: 'Junk' },
    { id: 3, name: 'Damaged item' },
    { id: 4, name: 'Other' },
  ];

  const onSelect = (selectedList: []) => {
    setSelectedOptions(selectedList);
  };

  const onRemove = (selectedList: []) => {
    setSelectedOptions(selectedList);
  };

  const getScreen = () => {
    switch (screen) {
      case 'problems':
        return (
          <>
          <div className="grid">
            {filteredProblems.slice((page - 1) * 15, page * 15).map((problem: ProblemInterface) => (
              <Problem problem={problem} key={problem.answerID ? problem.id + problem.answerID : problem.id} selectProblem={selectProblem} />
            ))}
          </div>
          <div id='pages'>
            {
              maxPage == 0 ? <p id='noProblemsParagraph'>No problems...</p> :
              <>
                {page != 1 ? <button className='pageButtonOn' onClick={() => pageBack()}><i className="fa-solid fa-arrow-left" /></button> : <button className='pageButtonOff'><i className="fa-solid fa-arrow-left" /></button>}
                {page + '/' + maxPage}
                {page < maxPage ? <button className='pageButtonOn' onClick={() => pageForward()}><i className="fa-solid fa-arrow-right" /></button> : <button className='pageButtonOff'><i className="fa-solid fa-arrow-right" /></button>}
              </>
            }
          </div>
          {
            selectedProblem != null &&
            <>
              <div id='grayedOut' onClick={sendingAnswer ? void 0 : unselectProblem} />
              <SelectedProblem problem={selectedProblem} currentUser={currentUser} showMessages={showMessages} setSelectedImage={(img) => setSelectedImage(img)} />
              {
                selectedImage.length > 0 &&
                <>
                  <div id='imageBackground' onClick={() => setSelectedImage('')} />
                  <Image onClick={() => void 0} img={selectedImage} className='bigImage' />
                </>
              }
            </>
          }
          </>
        );
      case 'map':
        return <ProblemsMap mapCentar={mapCentar} mapZoom={mapZoom} setMapCenterAndZoom={setMapCenterAndZoom} key={JSON.stringify(filteredProblems)} problems={filteredProblems} problemType={selectedProblemType} selectProblemsFunction={problemType => setSelectedProblemType(problemType)} />;
      case 'stats':
        return <Stats filteredProblems={filteredProblems} problems={problems} search={search} categories={selectedOptions} />
    }
  }

  return (
    <div>
      <div className='problemsTabs'>
        <div className='problemsTabWrapper'>
          <button className={screen == 'problems' ? 'problemsTabButton' : 'problemsTabButton notSelectedProblemsTabButton'} onClick={() => setScreen('problems')}>Problems</button>
          {screen == 'problems' && <div className='problemsTabBorder' />}
        </div>
        <div className='problemsTabWrapper'>
          <button className={screen == 'map' ? 'problemsTabButton' : 'problemsTabButton notSelectedProblemsTabButton'} onClick={() => setScreen('map')}>Map</button>
          {screen == 'map' && <div className='problemsTabBorder' />}
        </div>
        <div className='problemsTabWrapper'>
          <button className={screen == 'stats' ? 'problemsTabButton' : 'problemsTabButton notSelectedProblemsTabButton'} onClick={() => setScreen('stats')}>Stats</button>
          {screen == 'stats' && <div className='problemsTabBorder' />}
        </div>
      </div>

      <div className='problemsFilters'>
        <input autoComplete='off' type="text" placeholder='Search...' className="form-control" id='problemListSearchBar' onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)} />
        <ProblemsDropdown selectedProblems={selectedProblemType} selectProblemsFunction={problemType => setSelectedProblemType(problemType)} />
        
        <Multiselect
        options={options}
        displayValue="name"
        selectedValues={selectedOptions}
        onSelect={onSelect}
        onRemove={onRemove}
        />
      </div>

      { getScreen() }

    </div>
  )
};

export default ProblemsList;