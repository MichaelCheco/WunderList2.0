import React from 'react';
import { db, auth } from '../firebase';
// type Action = { type: 'increment' } | { type: 'decrement' };
interface User {
	displayName: string;
	photoURL: string;
	uid: string;
}

type UserProviderProps = { children: React.ReactNode };
const UserContext = React.createContext<User | undefined | null>(undefined);

export function UserProvider(props: UserProviderProps) {
	const user = useAuth();

	return <UserContext.Provider value={user} {...props} />;
}

export function useUser() {
	const context = React.useContext(UserContext);
	if (context === undefined) {
		throw new Error(`useUser must be rendered within a UserProvider`);
	}
	return context;
}

function useAuth() {
	const [user, setUser] = React.useState<User | undefined | null>(null);
	React.useEffect(() => {
		return auth().onAuthStateChanged((auth: any) => {
			const { displayName, photoURL, uid } = auth;
			if (auth) {
				const user = {
					displayName,
					photoURL,
					uid,
				};
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
