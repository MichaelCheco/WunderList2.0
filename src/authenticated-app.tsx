import React from 'react';
import { Router, Redirect } from '@reach/router';
import TodoList from './TodoList';
import SingleTodo from './SingleTodo';
import UnAuthenticatedApp from './unauthenticated-app';
let Home = (props: any) => <div>Home</div>;
let Dash = (props: any) => <div>Dash</div>;

const AuthenticatedApp = () => {
	return <Routes />;
};
// function Foo() {
// 	return <p>Foo</p>;
// }
function Routes() {
	return (
		<Router>
			<Redirector path="/" />
			<TodoList path="/tasks" />
			<SingleTodo path="/tasks/:taskId" />
			<NotFound default />
		</Router>
	);
}
function NotFound(props: any) {
	return <p>Not found</p>;
}
export default AuthenticatedApp;
function Redirector(props: any) {
	return <Redirect to="/tasks" />;
}
