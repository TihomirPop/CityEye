import { useState } from "react";
import AreYouSure from "../confirmation/AreYouSure";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../config/Firebase";
import '../../styles/Events.css';
import { deleteObject, ref } from "firebase/storage";

export interface EventInterface{
    id: string;
    title: string;
    description: string;
    epochStart: number;
    epochEnd: number;
    imageUrl: string;
    city: string;
    location: string;
    locationAddress: string;
    price: number;
}

interface Props{
    event: EventInterface;
    index: number;
}

const Event = ({event, index}: Props) => {
    const [popup, setPopup] = useState(false);

    const deleteUser = () => {
        deleteDoc(doc(db, 'events', event.id));
        deleteObject(ref(storage, 'eventImages/' + event.imageUrl));
        setPopup(false);
    }

    return(
        <li className='eventRow'>
            <div className='eventElement eventSmall'>{index + 1}.</div>
            <div className='eventElement eventMedium'>{event.title}</div>
            <div className='eventElement eventLarge'>{event.description}</div>
            <div className='eventElement eventMedium'>{new Date(event.epochStart * 1000).toLocaleString()}</div>
            <div className='eventElement eventMedium'>{new Date(event.epochEnd * 1000).toLocaleString()}</div>
            <div className='eventElement eventSmall'>{<i onClick={() => setPopup(true)} className='fa-solid fa-trash-can userButtons' />}</div>
            { popup ? <AreYouSure onYes={deleteUser} onNo={() => setPopup(false)} /> : null }
        </li>
    )
};

export default Event;
