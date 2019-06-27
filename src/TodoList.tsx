import React from 'react';
import { db, firebase } from './firebase';
import styled from 'styled-components';
import { useUser } from './context/auth-context';
import TodoItem from './TodoItem';
const Container = styled.div`
	display: flex;
	flex-direction: column;
`;
type Collection = {
	id: string;
	task: string;
	due_date?: string;
	completed: boolean;
	priority?: 'red' | 'blue' | 'green';
}[];
var Calendar = firebase.functions().httpsCallable('Calendar');

type priority = 'red' | 'blue' | 'green';
function useCollection(path: string, where = []): Collection {
	const [docs, setDocs] = React.useState([]);
	const [queryField, queryOperator, queryValue] = where;
	React.useEffect(() => {
		let collection: any = db.collection(path);
		// if (queryField) {
		// 	collection = collection.where(queryField, queryOperator, queryValue);
		// }
		return collection.onSnapshot(snapshot => {
			const docs: any = [];
			snapshot.forEach(doc => {
				docs.push({
					...doc.data(),
					id: doc.id,
				});
			});
			let filtered = docs.filter(d => d.completed === false);
			setDocs(filtered);
		});
	}, [path, queryField, queryOperator, queryValue]);
	return docs;
}
const TodoList = (props: any) => {
	const [pri, setPri] = React.useState<priority | null | string>(null);
	const [task, setTask] = React.useState('');
	const { user } = useUser();
	function callCalendar() {
		return Calendar()
			.then(function(result) {
				// Read result of the Cloud Function.
				console.log(result);
				// ...
			})
			.catch(err => {
				console.log(err);
			});
	}
	function createTask(event) {
		event.preventDefault();
		const note = {
			task,
			completed: false,
			due_date: Date.now(),
			priority: pri ? pri : null,
		};
		return db
			.collection(`users/${user.uid}/tasks`)
			.add({ ...note })
			.then(ref => ref.get())
			.then(doc => ({ ...doc.data(), id: doc.id }));
	}

	let tasks = useCollection(`users/${user.uid}/tasks`, [
		'completed',
		'===',
		'true',
	]);

	if (tasks.length === 0) {
		return (
			<>
				<p>Loading your view...</p>
				<button onClick={createTask}>Create</button>
			</>
		);
	}
	return (
		<Container>
			{tasks &&
				tasks.map(t => {
					return (
						<div key={t.id}>
							<TodoItem task={t} />
						</div>
					);
				})}
			<form onSubmit={createTask}>
				<label htmlFor="task" />
				<input id="task" value={task} onChange={e => setTask(e.target.value)} />
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
			<button onClick={callCalendar}>Here goes Nothing!</button>
		</Container>
	);
};

export default TodoList;
