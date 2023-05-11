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
                name: doc.data().name,
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
                    <div className="smallUser userElements">#</div>
                    <div className="largeUser userElements">Name</div>
                    <div className="largeUser userElements">E-mail</div>
                    <div className="mediumUser userElements">Role</div>
                    <div className="userElements mediumUser">Last active</div>
                    {
                        currentUser.role == 'admin' &&
                        <>
                        <div className="userElements smallUser"></div>
                        <div className="userElements smallUser"></div>
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
  