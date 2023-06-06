import '../../styles/Problems.css'
import { useState, useEffect, BaseSyntheticEvent, useRef } from 'react';
import { ProblemInterface } from './Problem';
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
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
    const [locked, setLocked] = useState(problem.solved);
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
        if(messages.some((message) => message.isAnswer))
            setLocked(true);
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

        components.push(<div className='messagesDescription' key={'messagesDescription' + problem.id}><p>{problem.description}</p></div>)

        for(let i = 0; i < messages.length; i++){
            const message = messages[i];
            const date = new Date(message.time * 1000);
            
            if(previousMessageDate.getFullYear() + previousMessageDate.getMonth() + previousMessageDate.getDate() != date.getFullYear() + date.getMonth() + date.getDate())
                components.push(<div className='messageDate' key={date.toDateString()}>{date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear() + '.'}</div>);
            previousMessageDate = date;

            components.push(<ChatMessage setAnswer={answer} key={message.id} message={message} currentUser={currentUser} />);
        }

        return components;
    }

    const dateToString = (date: Date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}.${month}.${year}.`;
    }

    const answer = (message: Message) => {
        if(!problem.solved && !locked && message.userID == currentUser.id){
            addDoc(collection(db, 'answers'), {
                problemID: problem.id,
                response: message.text,
                timeOfResponse: dateToString(new Date()),
                userID: problem.uid
            });
            
            updateDoc(doc(db, 'messages', problem.id, 'problemMessages', message.id), {
                isAnswer: true
            })

            setLocked(true);
        }  
    }

    const selectDuplicate = async (e: BaseSyntheticEvent) => {
        e.preventDefault();
        duplicate('H9qx9ZrKAquNQCrEvszh');
    }
    
    const duplicate = async (anwserId: string) => {
        if(!problem.solved && !locked){
            const text: string = (await getDoc(doc(db, 'answers', anwserId))).data()!.response;

            addDoc(collection(db, 'answers'), {
                problemID: problem.id,
                response: text,
                timeOfResponse: dateToString(new Date()),
                userID: problem.uid,
                //duplicateOf: anwserId
            });

            await addDoc(collection(db, 'messages', problem.id, 'problemMessages'), {
                name: currentUser.name,
                text: 'Duplicate problem from: ' + anwserId,
                time: Math.round(Date.now() / 1000),
                userID: currentUser.id,
            });
            addDoc(collection(db, 'messages', problem.id, 'problemMessages'), {
                name: currentUser.name,
                text: text,
                time: Math.round(Date.now() / 1000),
                userID: currentUser.id,
                isAnswer: true
            });

            setLocked(true);
        }
    }

    return (
        <div id='popup'>
            {
                showChat ? 
                <>
                    <div className='messages' onContextMenu={selectDuplicate}>
                        {renderMessages()}
                        <span ref={scroll} />
                    </div>

                    <form className='sendMessage' onSubmit={sendMessage}>
                        <input className='form-control' value={formValue} disabled={locked} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message..." />
                        <button type="submit" className='btn btn-primary' disabled={!formValue || locked}>Send</button>
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