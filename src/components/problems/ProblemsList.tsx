import { useState, useEffect, BaseSyntheticEvent } from 'react';
import 'firebase/firestore';
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import '../../styles/Problems.css'
import { db } from '../../config/Firebase';
import Problem, { ProblemInterface } from './Problem';
import Image from './Image';
import ProblemsMap from './ProblemsMap';

const ProblemsList = () => {
  const [problems, setProblems] = useState<ProblemInterface[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<ProblemInterface[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<ProblemInterface | null>(null);
  const [answer, setAnswer] = useState('');
  const [odgovor, setOdgovor] = useState<any>(null);
  const [solvedIsChecked, setSolvedIsChecked] = useState(false);
  const [notSolvedIsChecked, setNotSolvedIsChecked] = useState(true);
  const [search, setSearch] = useState('');
  const [screen, setScreen] = useState('problems');
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'problems'), (snapshot) => {
      const problemsList: ProblemInterface[] = snapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()}));

      problemsList.sort((a: ProblemInterface, b: ProblemInterface) => {
        if(a.imageName.substring(5, 24) < b.imageName.substring(5, 24)){
          return 1;
        }
        return -1;
      })
      setProblems(problemsList);
    });
    return () => {unsubscribe();};
  }, []);

  useEffect(() => {
    setFilteredProblems(problems.filter(filterFunction));
  }, [problems]);

  useEffect(() => {
    filter();
  }, [search, solvedIsChecked, notSolvedIsChecked]);

  useEffect(() => {
    setPage(1);
    setMaxPage(Math.ceil(filteredProblems.length / 15));
  }, [filteredProblems]);

  const filterFunction = (problem: any) => {
    if(solvedIsChecked && notSolvedIsChecked)
      return true;
    else if(notSolvedIsChecked)
      return !problem.solved;
    else if(solvedIsChecked)
      return problem.solved;
    else
      return false;
  }

  const filter = () => {
    if(search.length > 0){
      setFilteredProblems(problems.filter((problem: any) => filterFunction(problem) && (problem.title.toLowerCase().includes(search.toLowerCase()) || problem.description.toLowerCase().includes(search.toLowerCase()))));
    } else{
      setFilteredProblems(problems.filter(filterFunction));
    }
  }

  const selectProblem = (problem: ProblemInterface) => { 
    setSelectedProblem(problem);
    if(problem.solved){
      getDoc(doc(db, 'answers', problem.answerID)).then((doc) => setOdgovor(doc.data()?.response))
    }
  }

  const unselectProblem = () => { 
    setSelectedProblem(null); 
    setOdgovor(null);
  }

  const dateToString = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  }

  const odgovori = async () => {
    if(answer.length > 3 && answer.length <= 100 && selectedProblem){
      addDoc(collection(db, 'answers'), {
        problemID: selectedProblem.id,
        response: answer,
        timeOfResponse: dateToString(new Date()),
        userID: selectedProblem.uid
      });
      updateDoc(doc(db, 'problems', selectedProblem.id), {
        solved: true
      });
      setSelectedProblem(null);
    }
  }

  const changeSolvedIsChecked = () => {
    setSolvedIsChecked((checked) => !checked);
  }

  const changeNotSolvedIsChecked = () => {
    setNotSolvedIsChecked((checked) => !checked);
  }

  const pageBack = () => {
    setPage((page) => page - 1);
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
  const pageForward = () => {
    setPage((page) => page + 1);
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }

  return (
    <div>
      <button onClick={() => {setSearch(''); setScreen('problems');}}>Problems</button>
      <button onClick={() => {setSearch(''); setScreen('map');}}>Map</button>
      <label>
        <input
          type="checkbox"
          key={solvedIsChecked.toString()}
          checked={solvedIsChecked}
          onChange={() => changeSolvedIsChecked()}
        />
        Solved problems
      </label>
      <label>
        <input
          type="checkbox"
          key={notSolvedIsChecked.toString()}
          checked={notSolvedIsChecked}
          onChange={() => changeNotSolvedIsChecked()}
        />
        Not solved problems
      </label>

      {
        screen == 'problems' ?
        <>
        <input type="text" placeholder='Search...' className="form-control" id='problemListSearchBar' onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)} />
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
          selectedProblem != null ?
          <>
            <div id='grayedOut' onClick={unselectProblem} />
            <div id='popup'>
              <Image img={selectedProblem.imageName} className='popupImage'/>
              <div className="popupContent">
                <h1 className="card__header">{selectedProblem.title}</h1>
                <p className="card__date">{selectedProblem.imageName.substring(5, 24).replace('_', ' ')}</p>
                <p className="card__text">{selectedProblem.description}</p>
                {
                  selectedProblem.solved ? <p>{odgovor}</p> :
                  <>
                    <textarea className="form-control" rows={3} onChange={(e: BaseSyntheticEvent) => setAnswer(e.target.value)} />
                    <button className="card__btn" onClick={odgovori} >Odgovori <span>&rarr;</span></button>
                  </>
                }
                
              </div>
            </div>
          </> : null
        }
        </> :
        <ProblemsMap key={JSON.stringify(filteredProblems)} problems={filteredProblems} />
      }
    </div>
  )
};

export default ProblemsList;