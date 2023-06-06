import '../../styles/Problems.css'
import { useState, useEffect, BaseSyntheticEvent, useRef } from 'react';
import { ProblemInterface } from './Problem';
import { addDoc, collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import ChatMessage, { Message } from './ChatMessage';
import { WebUser } from '../users/User';
import Image from './Image';

interface Props{
    problem: ProblemInterface;
    currentUser: WebUser;
    showMessages: boolean;
    setSelectedImage: (image: string) => void;
}

function SelectedProblem({problem, currentUser, showMessages, setSelectedImage}: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [formValue, setFormValue] = useState('');
    const [showChat, setShowChat] = useState(showMessages);
    const scroll = useRef<HTMLSpanElement>(null);

    const coll = collection(db, 'messages', problem.id, 'problemMessages');
    
    useEffect(() => {
        const unsubscribe = onSnapshot(query(coll, orderBy('time')), (snapshot) => {
          setMessages(snapshot.docs.map((doc: any) => ({id: doc.id, ...doc.data()})));
        });
        return () => {unsubscribe();};
      }, []);

    useEffect(() => {
        if(scroll.current)
            scroll.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showChat])

    const sendMessage = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
    
        await addDoc(coll, {
            name: currentUser.name,
            text: formValue,
            time: Math.round(Date.now() / 1000),
            userID: currentUser.id
        });

        setFormValue('');
    }

    const renderMessages = () => {
        const components = [];
        let previousMessageDate = new Date(0);

        for(let i = 0; i < messages.length; i++){
            const message = messages[i];
            const date = new Date(message.time * 1000);
            
            if(previousMessageDate.getFullYear() + previousMessageDate.getMonth() + previousMessageDate.getDate() != date.getFullYear() + date.getMonth() + date.getDate())
                components.push(<div className='messageDate' key={date.toDateString()}>{date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + '.'}</div>);
            previousMessageDate = date;

            components.push(<ChatMessage key={message.id} message={message} currentUser={currentUser} />)
        }

        return components;
    }

    return (
        <div id='popup'>
            {
                showChat ? 
                <>
                    <div className='messages'>
                        {renderMessages()}
                        <span ref={scroll} />
                    </div>

                    <form className='sendMessage' onSubmit={sendMessage}>
                        <input className='form-control' value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message..." />
                        <button type="submit" className='btn btn-primary' disabled={!formValue}>Send</button>
                    </form>
                </> :
                <>
                    <Image onClick={() => setSelectedImage(problem.imageName)} img={problem.imageName} className='popupImage'/>
                    <div className="popupContent">
                        <div>
                            <h1 className="card__header">{problem.title}</h1>
                            <p className="card__date">{problem.imageName.substring(5, 24).replace('_', ' ')}</p>
                            <p className='card__address'>{problem.address}</p>
                        </div>
                        
                        <p className="card__text">{problem.description}</p>
                        <button className='btn btn-primary chatButton' style={{display: 'flex'}} onClick={() => setShowChat(true)}>Chat <i className="fa-regular fa-comment-dots" /></button>
                    </div>
                </>
            }
        </div>
    );
}

export default SelectedProblem;