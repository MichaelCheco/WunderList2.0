import React from 'react';
import { db, auth, firebase } from '../firebase';
// type Action = { type: 'increment' } | { type: 'decrement' };
interface User {
	displayName: string;
	photoURL: string;
	uid: string;
}
type UserProviderProps = { children: React.ReactNode };
const UserContext = React.createContext<
	User | object | null | undefined | any | Promise<void>
>(undefined);

export function UserProvider(props: UserProviderProps) {
	const user = useAuth();
	const handleSignIn = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			await firebase.auth().signInWithPopup(provider);
		} catch (error) {
			console.log(error);
		}
	};
	return <UserContext.Provider value={{ user, handleSignIn }} {...props} />;
}

export function useUser() {
	const context = React.useContext(UserContext);
	if (context === undefined) {
		throw new Error(`useUser must be rendered within a UserProvider`);
	}
	return context;
}
// @ts-ignore
const storedUser: any = JSON.parse(localStorage.getItem('user'));
function useAuth() {
	const [user, setUser] = React.useState<User | undefined | null>(storedUser);
	React.useEffect(() => {
		return auth().onAuthStateChanged((auth: any) => {
			if (auth) {
				const { displayName, photoURL, uid } = auth;
				const user = {
					displayName,
					photoURL,
					uid,
				};
				localStorage.setItem('user', JSON.stringify(user));
				setUser(user);
				db.collection('users')
					.doc(user.uid)
					.set(user, { merge: true });
			} else {
				setUser(null);
			}
		});
	}, []);
	return user;
}
