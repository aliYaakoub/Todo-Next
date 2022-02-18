import React, { useContext, useState, useEffect } from 'react'
import { auth } from '../firebase/config';
import { 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    updatePassword, 
    updateEmail 
} from '@firebase/auth';
import { Timestamp, collection, addDoc, deleteDoc, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, where, getDocs, query } from '@firebase/firestore';
import { projectFireStore } from '../firebase/config';
// import { ref, deleteObject } from '@firebase/storage';
import { Alert } from 'react-native';

const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({children}) {

    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true);
    const [changes, setChanges] = useState(0);

    function generateId(string){
        const randomArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%&@!?';
        let result = '';
        for(let i=0; i<20; i++){
            result += randomArray[Math.floor(Math.random()*(randomArray.length - 1))];
        }
        return `${string}_${result}`;
    }

    async function signup(email, password){
        await createUserWithEmailAndPassword(auth, email, password);
        // const connectId = generateId('user');
        await setDoc(doc(projectFireStore, 'users', auth.currentUser.uid), {
            username: auth.currentUser.email.split('@')[0],
            connects: []
        })
    }

    function getUserData(id){
        return getDoc(doc(projectFireStore, 'users', id));
    }

    async function changeUsername(id, newUsername){
        return updateDoc(doc(projectFireStore, 'users', id),{
            username: newUsername
        })
    }

    async function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return auth.signOut();
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email)
    }

    function updateEmailFunc(email){
        return updateEmail(auth.currentUser, email);
    }

    function updatePasswordFunc(password){
        return updatePassword(auth.currentUser, password)
    }

    async function sendConnectRequest(userId, receiverId){
        
        const q = query(collection(projectFireStore, "connect-requests"), where("sender", "==", userId));
        const connect = await getDocs(q);

        let newReq = true;

        connect.forEach((doc)=>{
            if(doc.data().receiver === receiverId){
                newReq = false;
                return Alert.alert('your earlier request is still pending.')
            }
        })

        if(newReq){
            const receiver = await getDoc(doc(projectFireStore, 'users', receiverId));
            // const sender = await getDoc(doc(projectFireStore, 'users', userId));
            if(receiver.exists()){
                try{
                    await setDoc(doc(projectFireStore, 'connect-requests', generateId('connect')), {
                        sender: userId,
                        receiver: receiverId,
                        timeStamp: Timestamp.now()
                    })
                    Alert.alert('request was sent successfully.')
                }
                catch(err){
                    Alert.alert('could not send connect request.')
                }
            }
            else{
                return Alert.alert('incorrect id.')
            }
        }
    }

    async function acceptConnectRequest(connectId){
        const connect = await getDoc(doc(projectFireStore, 'connect-requests', connectId));
        const senderId = connect.data().sender;
        const receiverId = connect.data().receiver;
        const senderRef = doc(projectFireStore, 'users', senderId);
        const receiverRef = doc(projectFireStore, 'users', receiverId);

        const updateSender = updateDoc(senderRef, {
            connects: arrayUnion(receiverId)
        })
        const updateReceiver = updateDoc(receiverRef, {
            connects: arrayUnion(senderId)
        })
        const deleteRequest = deleteDoc(doc(projectFireStore, 'connect-requests', connectId))
        Promise.all([updateSender, updateReceiver, deleteRequest])
            .then(()=>{
                Alert.alert('connect request accepted');
            })
            .catch(()=>{
            Alert.alert('could not accept, please try again later.');
            })
    }

    async function deleteconnectRequest(connectId){
        try{
            await deleteDoc(doc(projectFireStore, 'connect-requests', connectId))
        }
        catch(err){
            Alert.alert('an error occured while deleting, please try again later.')
        }
    }

    async function unConnectUser(userId, unConnectId){
        const userRef = doc(projectFireStore, 'users', userId);
        const unconnectRef = doc(projectFireStore, 'users', unConnectId);
        try{
            const user = updateDoc(userRef, {
                connects : arrayRemove(unConnectId)
            })
            const unconnect = updateDoc(unconnectRef, {
                connects : arrayRemove(userId)
            })
            await Promise.all([user, unconnect]);
            Alert.alert('User removed from your connect list.')
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured while deleting, please try again later.')
        }
    }

    async function createList(name, creatorId){
        try{
            await addDoc(collection(projectFireStore, 'lists'), {
                name: name,
                createdBy: creatorId,
                users: [`${creatorId}`],
                timeStamp: Timestamp.now()
            })
            Alert.alert('list created successfully.')
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.');
        }
    }
    
    async function deleteList(id){
        try{
            await deleteDoc(doc(projectFireStore, 'lists', id))
        }
        catch(err){
            Alert.alert('an error occured, please try again later.')
        }
    }

    async function addUserToList(listId, userId){
        const listRef = doc(projectFireStore, 'lists', listId);
        const list = await getDoc(listRef);
        if(list.data().users.includes(userId)){
            return Alert.alert('user is already in this list group')
        }
        try{
            await updateDoc(listRef, {
                users: arrayUnion(userId),
                timeStamp: Timestamp.now()
            })
            Alert.alert('user added.');
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
        }
    }

    async function removeUserFromList(listId, userId){
        try{
            const listRef = doc(projectFireStore, 'lists', listId);
            await updateDoc(listRef, {
                users: arrayRemove(userId),
                timeStamp: Timestamp.now()
            })
            Alert.alert('user removed.')
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.')
        }
    }

    async function addTodoItem(listId, title){
        const listRef = doc(projectFireStore, 'lists', listId);
            await updateDoc(listRef, {
                timeStamp: Timestamp.now()
            })
        try{
            await addDoc(collection(projectFireStore, 'todo-items') , {
                checked: false,
                title: title,
                list: listId,
                timeStamp: Timestamp.now()
            })
        }
        catch(err){
            console.error(err.message);
            Alert.alert('an error occured, please try again later.');
        }
    }

    async function checkItem(id){
        const item = await getDoc(doc(projectFireStore, 'todo-items', id));
        if(item.data().checked){
            await updateDoc(doc(projectFireStore, 'todo-items', id), {
                checked: false
            })
        }
        else {
            await updateDoc(doc(projectFireStore, 'todo-items', id), {
                checked: true 
            })
        }
    }

    async function deleteTodoItem(listId, id){
        const listRef = doc(projectFireStore, 'lists', listId);
            await updateDoc(listRef, {
                timeStamp: Timestamp.now()
            })
        try{
            await deleteDoc(doc(projectFireStore, 'todo-items', id));
        }
        catch(err){
            console.error(er.message);
            Alert.alert('an error occured, please try again later.')
        }
    }

    // function postContent(posterId, content){
    //     const collectionRef = collection(projectFireStore, 'posts');
    //     return addDoc(collectionRef, {posterId: posterId, content: content, timeStamp: Timestamp.now(), likes: [], comments: []})
    // }

    // async function deletePost(id, fileName){
    //     try{
    //         if(fileName){
    //             const imageRef = ref(projectStorage, `posts/${fileName}`);
    //             await deleteObject(imageRef)
    //         }
    //         await deleteDoc(doc(projectFireStore,'posts',id));
    //     }
    //     catch(err){
    //         return 'could not delete post';
    //     }
    // }

    // function generateId(num){
    //     const randomArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let result = '';
    //     for(let i=0; i<num; i++){
    //         result += randomArray[Math.floor(Math.random()*(randomArray.length - 1))];
    //     }
    //     return result;
    // }

    // function uploadComment(posterId, content, postId){
    //     const postRef = doc(projectFireStore, 'posts', postId);
    //     return updateDoc(postRef, {
    //         comments: arrayUnion({
    //             id: generateId(15),
    //             posterId, 
    //             content, 
    //             postId, 
    //             timeStamp: Timestamp.now()
    //         })
    //     })
    // }

    // async function getProfilePic(id){
    //     const doesExist = doc(projectFireStore, 'profile-pictures', id)
    //     const elem = await getDoc(doesExist);
    //     return elem.data();
    // }

    // function deleteComment(postId, commentId){
    //     // return deleteDoc(doc(projectFireStore,'comments',id));
    //     const collectionRef = doc(projectFireStore, 'posts', postId);
    //     return updateDoc(collectionRef, {
    //         comments: arrayRemove({id: commentId})
    //     })
    // }

    // async function likePost(id, postId){

    //     const collectionRef = doc(projectFireStore, 'posts', postId);
    //     const docSnap = await getDoc(collectionRef);

    //     if(docSnap.exists()){
    //         if(docSnap.data().likes.includes(id)){
    //             return updateDoc(collectionRef, {
    //                 likes: arrayRemove(id)
    //             })
    //         }
    //     }

    //     return updateDoc(collectionRef, {
    //         likes: arrayUnion(id)
    //     })
    // }

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, (currentUser)=>{
            if(currentUser){
                async function getUser(){
                    const user = await getDoc(doc(projectFireStore, 'users', currentUser.uid));
                    return setCurrentUser({id: user.id, ...user.data()});
                }
                getUser()
                setLoading(false);
            }
            else{
                setCurrentUser(null)
            }
        })
        return unsub;
    }, [changes])

    const value = {
        currentUser: loading ? null : currentUser,
        signup,
        login,
        logout,
        resetPassword,
        updateEmailFunc,
        updatePasswordFunc,
        changeUsername,
        getUserData,
        setChanges,
        // getProfilePic,
        sendConnectRequest,
        acceptConnectRequest,
        deleteconnectRequest,
        unConnectUser,
        createList,
        addUserToList,
        removeUserFromList,
        addTodoItem,
        checkItem,
        deleteTodoItem,
        deleteList
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
}
