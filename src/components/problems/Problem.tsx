//import { doc, getDoc } from 'firebase/firestore';
import '../../styles/Problems.css'
import { BaseSyntheticEvent } from "react";
//import { db } from '../../config/Firebase';
import Image from './Image';


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
    selectProblem: (problem: ProblemInterface, showMessages: boolean) => void
}

function Problem({problem, selectProblem}: Props) {
    //const [odgovor, setOdgovor] = useState<any>(null);

    /*useEffect(() => {
        if(problem.solved){
            getDoc(doc(db, 'answers', problem.answerID)).then((doc) => {
                setOdgovor(doc.data()?.response);
            });
        }
    }, [])*/

    const clickProblem = (e: BaseSyntheticEvent) => {
        const tagName = (e.target as HTMLElement).tagName;
        if(tagName == 'BUTTON' || tagName == 'I') {
            selectProblem(problem, true);
        } else {
            selectProblem(problem, false);
        }
    }

    return (
    <div className="grid__item" onClick={clickProblem}>
        <Image onClick={() => null} img={problem.imageName} className='card__img' />
        <div className="card__content">
            <div>
                <h1 className="card__header">{problem.title.length > 40 ? problem.title.substring(0, 40) + '...' : problem.title}</h1>
                <p className="card__date">{problem.imageName.substring(5, 24).replace('_', ' ')}</p>
            </div>
            <p className="card__text">{problem.description.length > 100 ? problem.description.substring(0, 100) + '...' : problem.description}</p>
            <button className='btn btn-primary chatButton' style={{display: 'flex'}}>Chat <i className="fa-regular fa-comment-dots" /></button>
        </div>
    </div>
    );
}

export default Problem;