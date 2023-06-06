import '../../styles/Problems.css'
import { WebUser } from '../users/User';

interface Props{
    message: Message;
    currentUser: WebUser;
}

export interface Message{
    id: string;
    name: string;
    text: string;
    time: number;
    userID: string;
    photoUrl: string;
}

function ChatMessage({message, currentUser}: Props) {
    const getHourMinutes = () => {
        const date: Date = new Date(message.time * 1000);
        const hours: number = date.getHours();
        const minutes: number = date.getMinutes();

        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
    }

    return (
    <div className={`message ${message.userID == currentUser.id ? 'sent' : 'received'}`}>
      <img src={message.photoUrl || 'https://cdn.esquimaltmfrc.com/wp-content/uploads/2015/09/flat-faces-icons-circle-man-9.png'} />
      <p>{message.text} <span className='messageTime'>{getHourMinutes()}</span></p>
    </div>
    );
}

export default ChatMessage;