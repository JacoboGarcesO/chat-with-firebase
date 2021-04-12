import React, { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import './App.css';

firebase.initializeApp({
  apiKey: "AIzaSyBEf_uqw3Mb-usvZuVu_BxsUACjNmP3_Po",
  authDomain: "fir-chat-83dcc.firebaseapp.com",
  projectId: "fir-chat-83dcc",
  storageBucket: "fir-chat-83dcc.appspot.com",
  messagingSenderId: "617519069405",
  appId: "1:617519069405:web:4a18d2af074f3f70488334",
  measurementId: "G-JZ5WYCK7T8"
});
const auth = firebase.auth();
const firestore = firebase.firestore();
function App() {

  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Sofka chat</h1>
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function ChatRoom() {

  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limitToLast(30);
  const [messages] = useCollectionData(query, { idField: 'id' });
  const [formValue, setFormValue] = useState('');

  const sendMessage = async e => {
    e.preventDefault();
    const { id, photoUrl } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    setFormValue('');
  }
  return (
    <main>
      <div>
        <form onSubmit={sendMessage}>
          <input value={formValue} onChange={e=>{
            setFormValue(e.target.value);
          }} placeholder="Escribe tu mensaje"/>
          <button type="submit" disabled={!formValue}>Send</button>
        </form>
      </div>
      <div>
        {messages && messages.map(msn => {
          <ChatMessage key={msn.id} message={msn} />
        })}
      </div>
    </main>
  );
}

function ChatMessage({ message }) {
  const { text, id, photoUrl } = message;

  const messageOrderClass = id = auth.currentUser.uid ? 'Send' : 'Recived';
  return (
    <div children={'message' + messageOrderClass}>
      <img src={photoUrl} alt='avatar' />
      <p>{text}</p>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle}> Sign In With Google</button>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={
      () => {
        auth.signOut();
      }
    }>Sign Out</button>
  );
}

export default App;
