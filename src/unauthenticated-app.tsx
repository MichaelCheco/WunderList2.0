import React from 'react';
import { useUser } from './context/auth-context';
const UnAuthenticatedApp: React.FC = () => {
	const { handleSignIn } = useUser();
	return <button onClick={handleSignIn}>Sign in with Google</button>;
};
export default UnAuthenticatedApp;
