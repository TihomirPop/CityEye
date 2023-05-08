import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import '../../styles/Users.css'
import  { useState } from 'react';
//import { getFunctions, httpsCallable } from 'firebase/functions';
import { db } from '../../config/Firebase';
import Dropdown from './Dropdown';
import AreYouSure from '../confirmation/AreYouSure';

export interface WebUser{
    id: string;
    email: string;
    ime: string;
    prezime: string;
    lastActive: Date;
    role: string
}

interface Props{
    user: WebUser;
    index: number;
    currentUser: WebUser;
}

function User({user, index, currentUser}: Props) {
    const [popup, setPopup] = useState(false);
    const [editRole, setEditRole] = useState(false);
    const [role, setRole] = useState('');

    //const deleteUserFunction = httpsCallable(getFunctions(), 'deleteUser');

    const dateToString = (date: Date) => {
        const myDate = date;
        const day = myDate.getDate();
        const month = myDate.getMonth() + 1;
        const year = myDate.getFullYear();
        return `${day}.${month}.${year}.`;
    }

    const deleteUser = () => {
        /*deleteUserFunction({uid: user.id})
            .then(result => { console.log(result.data); })
            .catch(error => { console.error(error); });*/
        deleteDoc(doc(db, 'webUsers', user.id));
        setPopup(false);
    }

    const updateRole = () => {
        updateDoc(doc(db, 'webUsers', user.id), {role: role})
        setEditRole(false);
    }

    const isUserAdmin = () =>{
        if(currentUser.role == 'admin'){
            if(currentUser.id == user.id)
                return (
                <>
                    <div className='userElements small' />
                    <div className='userElements small' />
                </>);
            return (
            <>
                <div className='userElements small' onClick={() => editRole ? updateRole() : setEditRole(true)} >{ editRole ? <i className='fa-solid fa-check userButtons' /> : <i className='fa-solid fa-pen-to-square userButtons' />}</div>
                <div className='userElements small' onClick={() => editRole ? setEditRole(false) : setPopup(true)}>{editRole ? <i className='fa-solid fa-x userButtons' /> : <i className='fa-solid fa-trash-can userButtons' />}</div>
            </>);
        }
    }

    return (
        <>
        <li className='userRow'>
            <div className='small userElements'>{index + 1}</div>
            <div className='large userElements'>{user.ime + ' ' + user.prezime}</div>
            <div className='large userElements'>{user.email}</div>
            <div className='medium userElements'>
                {editRole ? <Dropdown userRole={user.role} setRoleFunction={(role: string) => setRole(role)}/> : user.role}
            </div>
            <div className='userElements medium'>{dateToString(user.lastActive)}</div>
            {isUserAdmin()}
        </li>
        { popup ? <AreYouSure onYes={deleteUser} onNo={() => setPopup(false)} /> : null }
        </>
    );
}

export default User;