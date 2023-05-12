import { useState, useEffect } from 'react';
import 'firebase/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import AddEvent from './AddEvent';
import { db } from '../../config/Firebase';
import Event, { EventInterface } from './Event';
import { WebUser } from '../users/User';
import '../../styles/Events.css';

interface Props{
  currentUser: WebUser;
}

const EventsList = ({currentUser}: Props) => {
  const [events, setEvents] = useState<EventInterface[]>([]);
  const [screen, setScreen] = useState('active');

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

  const getFilteredEvents = () => {
    if(screen == 'active')
      return events.filter((event) => event.epochEnd >= Date.now() / 1000);
    else if(screen == 'archived')
      return events.filter((event) => event.epochEnd < Date.now() / 1000);
    else
      return [];
  }

  return (
    <>
      <div className='eventsTabs'>
        <div className='eventsTabWrapper'>
          <button className={screen == 'active' ? 'eventsTabButton' : 'eventsTabButton notSelectedEventsTabButton'} onClick={() => setScreen('active')}>Active</button>
          {screen == 'active' && <div className='eventsTabBorder' />}
        </div>
        <div className='eventsTabWrapper'>
          <button className={screen == 'archived' ? 'eventsTabButton' : 'eventsTabButton notSelectedEventsTabButton'} onClick={() => setScreen('archived')}>Archived</button>
          {screen == 'archived' && <div className='eventsTabBorder' />}
        </div>
        <div className='eventsTabWrapper'>
          <button className={screen == 'add' ? 'eventsTabButton' : 'eventsTabButton notSelectedEventsTabButton'} onClick={() => setScreen('add')}>Add event</button>
          {screen == 'add' && <div className='eventsTabBorder' />}
        </div>
      </div>
      {
        screen == 'add' ? <AddEvent currentUser={currentUser} /> :
        <ul className='eventList'>
          <li className='markerRow'>
            <div className='eventElement eventSmall header'>#</div>
            <div className='eventElement eventMedium header'>Title</div>
            <div className='eventElement eventLarge header'>Description</div>
            <div className='eventElement eventMedium header'>Start time</div>
            <div className='eventElement eventMedium header'>End time</div>
            <div className='eventElement eventSmall header' />
          </li>
          {getFilteredEvents().map((event: EventInterface, index: number) => (
            <Event index={index} event={event} key={event.id} />
          ))}
        </ul>
      }  
    </>
  );
};

export default EventsList;
