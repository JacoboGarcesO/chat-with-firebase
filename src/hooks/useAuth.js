import firebase from 'firebase/app';
import 'firebase/auth';

export default function () {
    const signIn=() => {
        const auth = firebase.auth();
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider);
    }
    return {signIn}
}
