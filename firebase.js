import  firebase from "firebase"
import "firebase/firestore"
import "firebase/auth"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAoJTGA5gY5Hbc0mgsMf3OQuN2Swi_nEs",
  authDomain: "jess-signal.firebaseapp.com",
  projectId: "jess-signal",
  storageBucket: "jess-signal.appspot.com",
  messagingSenderId: "231085288899",
  appId: "1:231085288899:web:e90d1725727e229afee176",
  measurementId: "G-HLF4YCZHS2"
};

  let app;
  if(firebase.apps.length === 0){
      app = firebase.initializeApp(firebaseConfig)
  }else{
    app = firebase.app();
  }

const db = app.firestore();
const auth = firebase.auth();

export {db, auth }