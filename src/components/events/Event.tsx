import { useState } from "react";
import AreYouSure from "../confirmation/AreYouSure";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/Firebase";

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
}

const Event = ({event}: Props) => {
    const [popup, setPopup] = useState(false);

    const deleteUser = () => {
        deleteDoc(doc(db, 'events', event.id));
        setPopup(false);
    }

    return(
        <li>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>Start Time: {new Date(event.epochStart * 1000).toLocaleString()}</p>
            <p>End Time: {new Date(event.epochEnd * 1000).toLocaleString()}</p>
            <button onClick={() => setPopup(true)}>X</button>
            { popup ? <AreYouSure onYes={deleteUser} onNo={() => setPopup(false)} /> : null }
            <br />
        </li>
    )
};

export default Event;
