import React from 'react';
import './App.css';
import { useUser } from './context/auth-context';
import AuthenticatedApp from './authenticated-app';
import UnAuthenticatedApp from './unauthenticated-app';
const App: React.FC = () => {
	const { user } = useUser();
	return user ? <AuthenticatedApp /> : <UnAuthenticatedApp />;
};

export default App;
