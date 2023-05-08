import { useEffect, useState } from 'react';
import './styles/App.css';
import Login from './components/login/Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './config/Firebase';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import VerticalNav from './components/verticalNav/VerticalNav';
import EditUsers from './components/users/EditUsers';
import { useJsApiLoader } from '@react-google-maps/api';
import MarkerMap from './components/markers/MarkerMap';
import EventsList from './components/events/EventsList';
import ProblemsList from './components/problems/ProblemsList';

const libraries = ['visualization'];

function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeComponent, setActiveComponent] = useState("Problems");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        updateDoc(doc(db, 'webUsers', user.uid), {lastActive: serverTimestamp()});
        getDoc(doc(db, 'webUsers', user.uid))
        .then((doc) => {setCurrentUser({id: doc.id, ...doc.data()});})
      }
    })
  }, []);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_API_KEY,
    libraries: libraries as ('visualization')[]
  });

  const signOut = () => {
    auth.signOut().then(() => {
      setActiveComponent("Problems")
      setCurrentUser(null);
    }).catch((e) => {
      console.log(e);
    });
  };

  const renderComponent = (component: string) => {
    setActiveComponent(component);
  }

  const showComponent = () =>{
    switch(activeComponent) {
      case 'EditUsers':
        return <EditUsers currentUser={currentUser} />;
      case 'Events':
        return <EventsList />;
      case 'Map':
        return (isLoaded ? <MarkerMap /> : <p>Loading...</p>);
      case 'Problems':
        return (isLoaded ? <ProblemsList /> : <p>Loading...</p>);
      default:
        return null;
    }
  }

  return (
    <div className='main'>
      {
        currentUser ?
        <div id='mainScreen'>
          <VerticalNav renderComponent={renderComponent} signOut={signOut} />
          <div id='content'>{showComponent()}</div>
        </div> : <Login />
      }
    </div>
  );
}

export default App;
