import React, { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import useAuth from './hooks/useAuth';
import 'firebase/auth';
import 'firebase/firestore';
import './App.css';
import Logo from './images/chat.svg';
import Send from './images/send.svg';

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
    <div className="contenedor-principal">
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function ChatRoom() {
  const messageRef = firestore.collection('messages');
  const dummy = useRef();
  const query = messageRef.orderBy('createdAt').limitToLast(30);
  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;
    await messageRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setFormValue('');

  }
  return (
    <div>
      <main>
        <header className="logout">
          <h1>Sofka chat</h1>
          <SignOut />
        </header>
        <br />
        <hr />
        <br />
        <div>
          {messages && messages.map(msn => <ChatMessage key={msn.id} message={msn} />)}
        </div>
        <br />
        <div className="form">
          <form onSubmit={sendMessage}>
            <input value={formValue} onChange={e => {
              setFormValue(e.target.value);
            }} placeholder="Escribe tu mensaje" />
            <button className="btn-submit" type="submit" disabled={!formValue}>
              <img src={Send} alt="" />
            </button>
          </form>
        </div>

        <span ref={dummy}></span>
      </main>
    </div>

  );
}

function ChatMessage({ message }) {
  let { text, uid, photoURL, displayName, createdAt } = message;
  console.log(createdAt);

  const messageOrderClass = uid === auth.currentUser.uid ? 'send' : 'recived';
  return (
    <div className={`message ${messageOrderClass}`}>
      <img src={photoURL} alt='photo' />
      <div>
        <small>{displayName}: </small>
        <p>{text}</p>
      </div>
    </div>
  );
}


export function SignIn() {
  console.log(useAuth());
  const { signIn } = useAuth();
  return (
    <div className="container-signin">
      <header>
        <h1>Sofka chat</h1>
        <img src={Logo} alt="logo" />
        <SignOut />
      </header>
      <br />
      <br />
      <div className="container-text-signin">
        <p className="text-signin">Ingresa a Sofka Chat con tu cuenta de Google</p>
        <button className="bnt-sign-in" data-testid="btn-signin" onClick={() => signIn()}>Ingresar</button>
      </div>
    </div>
  );
}

function SignOut() {
  return auth.currentUser && (
    <button className="btn-sign-out" onClick={
      () => {
        auth.signOut();
      }
    }>Salir</button>
  );
}

export default App;
