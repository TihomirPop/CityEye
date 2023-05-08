import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import '../../styles/Problems.css'
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { db } from '../../config/Firebase';
import Image from './Image';

import LoadingGif from '../assets/loading.gif';

export interface ProblemInterface{
    id: string;
    address: string;
    answerID: string;
    comments: string;
    description: string;
    epoch: number;
    imageName: string;
    location_lat: string;
    location_lon: string;
    problemID: string;
    solved: boolean;
    title: string;
    uid: string;
    userName: string;
}

interface Props{
    problem: ProblemInterface,
    selectProblem: (problem: ProblemInterface) => void
}

function Problem({problem, selectProblem}: Props) {
    const [answer, setAnswer] = useState('');
    const [sendingAnswer, setSendingAnswer] = useState(false);
    const [odgovor, setOdgovor] = useState<any>(null);

    useEffect(() => {
        if(problem.solved){
            getDoc(doc(db, 'answers', problem.answerID)).then((doc) => {
                setOdgovor(doc.data()?.response);
            });
        }
    }, [])

    const dateToString = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}.${month}.${year}.`;
    }
    
    const odgovori = async () => {
        if(answer.length > 3){
            addDoc(collection(db, 'answers'), {
                problemID: problem.id,
                response: answer,
                timeOfResponse: dateToString(new Date()),
                userID: problem.uid
            });
            setSendingAnswer(true);
        }
    }

    return (
    <div className="grid__item">
        {
            sendingAnswer ? <img className='card__sending' alt='sending...' src={LoadingGif} /> :
            <>
                <Image img={problem.imageName} className='card__img' />
                <div className="card__content">
                    <h1 className="card__header" onClick={() => selectProblem(problem)}>{problem.title}</h1>
                    <p className="card__date">{problem.imageName.substr(5, 19).replace('_', ' ')}</p>
                    <p className="card__text">{problem.description}</p>
                    { problem.solved ? <p>{odgovor}</p> :
                    <>
                        <input type="text" className="form-control" onChange={(e: BaseSyntheticEvent) => setAnswer(e.target.value)} />
                        <button className="card__btn" onClick={odgovori}>Odgovori <span>&rarr;</span></button>
                    </>
                    }
                </div>
            </>
        }
    </div>
    );
}

export default Problem;