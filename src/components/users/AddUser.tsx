import { BaseSyntheticEvent, useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../config/Firebase';
import '../../styles/Users.css'
import { WebUser } from './User';

interface Props{
  currentUser: WebUser;
}

function AddUser({currentUser}: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [addingUser, setAddingUser] = useState(false);

  const functions = getFunctions();
  const addWebUser = httpsCallable(functions, 'addWebUser');

  const handleAddWebUser = async (event: BaseSyntheticEvent) => {
    event.preventDefault();
    addWebUser({ email: email, password: password })
    .then(async result => {
    const data = result.data as any;

    if(data.success){
      await setDoc(doc(db, 'webUsers', data.user.uid), {
        email: data.user.email,
        role: 'user',
        name: name,
        lastActive: serverTimestamp(),
        city: currentUser.city
      });
      console.log('User created:', data.user);
      
      setEmail('');
      setName('');
      setPassword('');
      setAddingUser(false);
    }
    })
    .catch(error => {
      console.error('Error creating user:', error);
    });
  }

  return (
    <>
      <button className='btn btn-primary' onClick={() => setAddingUser(true)}>Add User</button>
      { addingUser ?
      <>
        <div id='addUserGrayedOut' onClick={() => setAddingUser(false)} />
        <div id='addUserPopup'>
          <form onSubmit={handleAddWebUser}>
          <label>
            Email:
            <input type='email' className='form-control' value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <br />
          <label>
            Name:
            <input type='text' className='form-control' value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <br />
          <label>
            Password:
            <input type='password' className='form-control' value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          <br />
          <button id='createUserButton' className='btn btn-primary' type='submit'>Create User</button>
          </form>
          </div>
      </> : null }
    </>
  );
}

export default AddUser;