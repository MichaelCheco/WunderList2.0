import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyAo5i2tnbbBOxfFd8A_u-NaJtMmswM9ayM',
	authDomain: 'wunderlist-mc.firebaseapp.com',
	databaseURL: 'https://wunderlist-mc.firebaseio.com',
	projectId: 'wunderlist-mc',
	storageBucket: 'wunderlist-mc.appspot.com',
	messagingSenderId: '299536780849',
	appId: '1:299536780849:web:26ef8ff616017b08',
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = () => firebase.auth();

export { db, firebase, auth };
