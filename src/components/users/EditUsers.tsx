import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import 'firebase/firestore';
import '../../styles/Users.css'
import { db } from "../../config/Firebase";
import User, { WebUser } from "./User";
import AddUser from "./AddUser";


interface Props{
    currentUser: WebUser;
}

function EditUsers({currentUser}: Props) {
    const [users, setUsers] = useState<WebUser[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, 'webUsers'), where('city', '==', currentUser.city)), (snapshot) => {
            const userList: WebUser[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                email: doc.data().email,
                ime: doc.data().ime,
                prezime: doc.data().prezime,
                lastActive: doc.data().lastActive ? doc.data().lastActive.toDate() : new Date(),
                role: doc.data().role,
                city: doc.data().city
            }));
            userList.sort((a: WebUser, b: WebUser) => a.email.localeCompare(b.email));
            setUsers(userList);
        });
        return unsubscribe;
    }, []);

    return(
        <div className="listWrapper">
            <AddUser currentUser={currentUser} />
            <ul>
                <li className="userRow header" key="pocetak">
                    <div className="small userElements">#</div>
                    <div className="large userElements">Name</div>
                    <div className="large userElements">E-mail</div>
                    <div className="medium userElements">Role</div>
                    <div className="userElements medium">Last active</div>
                    {
                        currentUser.role == 'admin' &&
                        <>
                        <div className="userElements small"></div>
                        <div className="userElements small"></div>
                        </>
                    }
                </li>
            {
                users.map((user: WebUser, index) => (<User user={user} index={index} currentUser={currentUser} key={user.id} />))
            }
            </ul>
        </div>
    )
}

export default EditUsers;
  