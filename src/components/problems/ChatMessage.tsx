import '../../styles/Problems.css'
import { WebUser } from '../users/User';

interface Props{
    message: Message;
    currentUser: WebUser;
    setAnswer: (text: Message) => void;
}

export interface Message{
    id: string;
    name: string;
    text: string;
    time: number;
    userID: string;
    photoUrl: string;
    isAnswer: boolean; 
}

function ChatMessage({message, currentUser, setAnswer}: Props) {
    const getHourMinutes = () => {
        const date: Date = new Date(message.time * 1000);
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();

        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    }

    return (
    <div className={`message ${message.userID == currentUser.id ? 'sent' : 'received'}`}>
      <img src={message.photoUrl || 'https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-man-9.png'} />
      <p onContextMenu={(e) => {e.preventDefault(); setAnswer(message);}} style={message.isAnswer ? {backgroundColor: 'green'} : {}} >{message.text} <span className='messageTime'>{getHourMinutes()}</span></p>
    </div>
    );
}

export default ChatMessage;