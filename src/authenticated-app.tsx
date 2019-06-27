import React from 'react';
import { Router, Redirect } from '@reach/router';
import TodoList from './TodoList';
import SingleTodo from './SingleTodo';
import styled from 'styled-components';
const Div = styled.div`
	height: 50px;
	background-color: palegoldenrod;
`;
function Nav() {
	return (
		<Div>
			<h1>Welcome!</h1>
		</Div>
	);
}
const AuthenticatedApp = () => {
	return (
		<>
			<Nav />
			<Routes />
		</>
	);
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
