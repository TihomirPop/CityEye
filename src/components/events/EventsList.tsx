import { useState, useEffect } from 'react';
import 'firebase/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AddEvent from './AddEvent';
import { db } from '../../config/Firebase';
import Event, { EventInterface } from './Event';
import { WebUser } from '../users/User';

interface Props{
  currentUser: WebUser;
}

const EventsList = ({currentUser}: Props) => {
  const [events, setEvents] = useState<EventInterface[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'events'), where('city', '==', currentUser.city)) , (snapshot) => {
      const eventsList: EventInterface[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          imageUrl: doc.data().imageUrl,
          epochStart: doc.data().epochStart,
          epochEnd: doc.data().epochEnd,
          city: doc.data().city,
          location: doc.data().location,
          locationAddress: doc.data().locationAddress,
          price: doc.data().price
      }));
      eventsList.sort((a: EventInterface, b: EventInterface) => a.epochStart - b.epochStart);
      setEvents(eventsList);
    });
    return unsubscribe;
  }, []);

  return (
    <div>
      <AddEvent currentUser={currentUser} />    
      <br />
      <br />
    <ul>
      {events.map((event: EventInterface) => (
        <Event event={event} key={event.id} />
      ))}
    </ul>
    </div>
  );
};

export default EventsList;
