import React, { useEffect, useState, useRef } from 'react'
import firebase from 'firebase/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
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

const messageRef = firestore.collection('messages');
function ChatRoom() {
  const dummy = useRef();
  const query = messageRef.orderBy('createdAt').limitToLast(30);
  const [messages] = useCollectionData(query, { idField: "id" });
  console.log(messages)
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  });

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
          <form >
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
  console.log(message);

  const messageOrderClass = uid === auth.currentUser.uid ? 'send' : 'recived';
  return (
    <div className={`message ${messageOrderClass}`} onClick={async ()=>{
      await messageRef.doc("QOGSLNEkVNx8Y6bvLKVv").update({text: "UN PENE", uid:"3J9z1Tl7hNZJ5h0Eyjvyc7ZZP4m2", displayName: "Jacobo Garcés", photoURL: "https://lh3.googleusercontent.com/a-/AOh14GgjLeLoBtTqoiJ9UIiZNdG0oEhjGSxSEvR9fs7O3A=s96-c", respuestas: [{name:"penesote"}, {name:"penesito"}]})
    }}>
      <img src={photoURL} alt='photo' />
      <div>
        <small>{displayName}: </small>
        <p>{text}</p>
      </div>
    </div>
  );
}


export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
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
        <button className="bnt-sign-in" data-testid="btn-signin" onClick={signInWithGoogle}>Ingresar</button>
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
