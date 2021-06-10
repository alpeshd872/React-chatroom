 
import React, { useRef, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA6oluTSincrAMTVywoIm7JFDruIv_mUsE",
    authDomain: "chat-app-b942a.firebaseapp.com",
    projectId: "chat-app-b942a",
    storageBucket: "chat-app-b942a.appspot.com",
    messagingSenderId: "371639673816",
    appId: "1:371639673816:web:45e1514f02c5305990c8ad",
    measurementId: "G-2D62GCDMZ7"

})
const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header className="App-header">
      <SignOut/>
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}
const SignIn =()=>{
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <>
    <button  onClick={signInWithGoogle} className="sign-in"><i className="fab fa-google"></i></button>
    </>
  )
}
const SignOut = ()=>{
  return auth.currentUser &&(
    <button onClick= {()=>auth.signOut()} className="sign-out">
      <i className="fas fa-sign-out-alt"></i>
    </button>
  )
}
const ChatRoom =()=>{
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query,{idField:'id'});
  const[formValue,setFormvalue] = useState('');
  const sendMessage = async(e) =>{
    e.preventDefault();
    const {uid,photoURL} = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    setFormvalue('');
    dummy.current.scrollIntoView({behaviour:'smooth'})
  }
return(
<>
<main>
{messages && messages.map(msg =><ChatMessage key={msg.id} message={msg}/>)}
<span ref={dummy}></span>
</main>
<form onSubmit={sendMessage}>
  <input value={formValue} onChange={(e) => setFormvalue(e.target.value)} placeholder="say something nice"/>
  <button type="Submit" ><i className="far fa-paper-plane"></i></button>

</form>
</>
)

}
const ChatMessage =(props)=>{
  const {text,uid,photoURL} = props.message;
  const messsageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  return (
    <div className={`message ${messsageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt=""/>
      <p>{text}</p>
    </div>
  )
}
export default App;
