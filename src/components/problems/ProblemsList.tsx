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
  const [selectedProblem, setSelectedProblem] = useState<any>(null);
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
      const problemsList: ProblemInterface[] = [];
      snapshot.docs.forEach((doc: any) => {
        problemsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
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
    setMaxPage(Math.ceil(filteredProblems.length / 20));
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
    if(answer.length > 3){
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
  }
  const pageForward = () => {
    setPage((page) => page + 1);
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
        <input type="text" className="form-control" id='problemListSearchBar' onChange={(e: BaseSyntheticEvent) => setSearch(e.target.value)} />
        <div className="grid">
          {filteredProblems.slice((page - 1) * 20, page * 20).map((problem: ProblemInterface) => (
            <Problem problem={problem} key={problem.answerID ? problem.id + problem.answerID : problem.id} selectProblem={selectProblem} />
          ))}
        </div>
        <div>
          {page != 1 && <button onClick={() => pageBack()}>{'<'}</button>}
          {page + '/' + maxPage}
          {page < maxPage && <button onClick={() => pageForward()}>{'>'}</button>}
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