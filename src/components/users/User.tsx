import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../../styles/Users.css'
import  { useState } from 'react';
import { db } from '../../config/Firebase';
import Dropdown from './Dropdown';
import AreYouSure from '../confirmation/AreYouSure';
import { getFunctions, httpsCallable } from 'firebase/functions';

export interface WebUser{
    id: string;
    email: string;
    name: string;
    lastActive: Date;
    role: string,
    city: string
}

interface Props{
    user: WebUser;
    index: number;
    currentUser: WebUser;
}

function User({user, index, currentUser}: Props) {
    const [popup, setPopup] = useState(false);
    const [editing, setEditing] = useState(false);
    const [role, setRole] = useState('');
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const functions = getFunctions();
    const deleteWebUser = httpsCallable(functions, 'deleteWebUser');
    const changeWebUserEmail = httpsCallable(functions, 'changeWebUserEmail');

    const dateToString = (date: Date) => {
        const myDate = date;
        const day = myDate.getDate();
        const month = myDate.getMonth() + 1;
        const year = myDate.getFullYear();
        return `${day}.${month}.${year}.`;
    }

    const deleteUser = () => {
        console.log('deleting user: ' + user.email + ' - ' + user.id);
        deleteWebUser({id: user.id});
        deleteDoc(doc(db, 'webUsers', user.id));
        setPopup(false);
    }

    const updateUser = () => {
        if (email != user.email)
            changeWebUserEmail({id: user.id, newEmail: email});
        updateDoc(doc(db, 'webUsers', user.id), {
            role: role,
            name: name,
            email: email
        })
        setEditing(false);
    }

    const isUserAdmin = () =>{
        if(currentUser.role == 'admin'){
            if(currentUser.id == user.id)
                return (
                <>
                    <div className='userElements smallUser' />
                    <div className='userElements smallUser' />
                </>);
            return (
            <>
                <div className='userElements smallUser' onClick={() => editing ? updateUser() : setEditing(true)} >{ editing ? <i className='fa-solid fa-check userButtons' /> : <i className='fa-solid fa-pen-to-square userButtons' />}</div>
                <div className='userElements smallUser' onClick={() => editing ? setEditing(false) : setPopup(true)}>{editing ? <i className='fa-solid fa-x userButtons' /> : <i className='fa-solid fa-trash-can userButtons' />}</div>
            </>);
        }
    }

    return (
        <>
        <li className='userRow'>
            <div className='smallUser userElements'>{index + 1}</div>
            <div className='largeUser userElements'>{editing ? <input type='text' value={name} className='form-control' onChange={(event) => setName(event.target.value)} /> : user.name}</div>
            <div className='largeUser userElements'>{editing ? <input type='email' value={email} className='form-control' onChange={(event) => setEmail(event.target.value)} /> : user.email}</div>
            <div className='mediumUser userElements'>
                {editing ? <Dropdown userRole={user.role} setRoleFunction={(role: string) => setRole(role)}/> : user.role}
            </div>
            <div className='userElements mediumUser'>{dateToString(user.lastActive)}</div>
            {isUserAdmin()}
        </li>
        { popup ? <AreYouSure onYes={deleteUser} onNo={() => setPopup(false)} /> : null }
        </>
    );
}

export default User;