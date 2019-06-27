import React from 'react';
import { Router, Redirect } from '@reach/router';
import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import TodoList from './TodoList';
import SingleTodo from './SingleTodo';
import styled from 'styled-components';
import { useUser } from './context/auth-context';
import { db } from './firebase';
type priority = 'red' | 'blue' | 'green';
const ShowContext = React.createContext<boolean | undefined | any>(undefined);
function ShowProvider(props) {
	const [show, setShow] = React.useState(false);
	return <ShowContext.Provider value={{ show, setShow }} {...props} />;
}
const useShow = () => {
	const context = React.useContext(ShowContext);
	return context;
};
function Modal({ button, children }) {
	const { show, setShow } = useShow();
	return (
		<>
			{React.cloneElement(button, { onClick: () => setShow(true) })}
			<Dialog isOpen={show} onDismiss={() => setShow(!show)}>
				<button className="close-button" onClick={() => setShow(!show)}>
					<VisuallyHidden>Close</VisuallyHidden>
					<span aria-hidden>×</span>
				</button>
				{children}
			</Dialog>
		</>
	);
}
function Nav() {
	const { show, setShow } = useShow();
	const [pri, setPri] = React.useState<priority | null | string>(null);

	const [task, setTask] = React.useState('');
	const { user } = useUser();
	function createTask(event) {
		event.preventDefault();
		const note = {
			task,
			completed: false,
			due_date: Date.now(),
			priority: pri ? pri : null,
		};
		setShow(!show);
		setTask('');
		return db
			.collection(`users/${user.uid}/tasks`)
			.add({ ...note })
			.then(ref => ref.get())
			.then(doc => ({ ...doc.data(), id: doc.id }));
	}
	return (
		<Div>
			<H1>WunderList 2.0</H1>
			<Modal button={<P>+</P>}>
				<form onSubmit={createTask}>
					<label htmlFor="task" />
					<input
						id="task"
						value={task}
						onChange={e => setTask(e.target.value)}
					/>
					prioirty:
					<select onChange={e => setPri(e.target.value)}>
						<option value="red">red</option>
						<option value="blue">blue</option>
						<option value="green">green</option>
					</select>
					<button type="submit" onClick={createTask}>
						Create
					</button>
				</form>
			</Modal>
		</Div>
	);
}
const AuthenticatedApp = () => {
	return (
		<Container>
			<ShowProvider>
				<Nav />
			</ShowProvider>
			<Routes />
		</Container>
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
const Container = styled.div`
	margin: 0 auto;
	max-width: 880px;
	width: 100%;
	display: grid;
	grid-template-rows: 80px repeat(auto-fit, 80px);
	/* grid-template-rows: 1fr auto; */
	grid-gap: 1em;
`;
const Div = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	position: sticky;
	background-color: #f14b39;
`;
const H1 = styled.h1`
	color: white;
	margin-left: 5px;
`;
const P = styled.button`
	color: white;
	font-size: 4rem;
	cursor: pointer;
	margin-right: 9px;
	margin-bottom: 10px;
	background-color: #f14b39;
	border: none;
`;
