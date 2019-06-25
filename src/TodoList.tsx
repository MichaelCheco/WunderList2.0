import React from 'react';
import { db } from './firebase';
import { useUser } from './context/auth-context';
import TodoItem from './TodoItem';
type Collection = {
	id: string;
	task: string;
	due_date?: string;
	completed: boolean;
	priority?: 'red' | 'blue' | 'green';
}[];
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
			console.log(docs, 'docs');
			let filtered = docs.filter(d => d.completed == false);
			setDocs(filtered);
		});
	}, [path, queryField, queryOperator, queryValue]);
	return docs;
}
const TodoList = (props: any) => {
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
		return db
			.collection(`users/${user.uid}/tasks`)
			.add({ ...note })
			.then(ref => ref.get())
			.then(doc => ({ ...doc.data(), id: doc.id }));
	}

	let tasks = useCollection(`users/${user.uid}/tasks`, [
		'completed',
		'==',
		'true',
	]);
	React.useEffect(() => {
		function filterCompleted() {
			console.log('fired');
			let newTasks = tasks.filter(t => t.completed !== true);
			console.log(newTasks, 'newTasks');
			tasks = newTasks;
			return newTasks;
		}
		filterCompleted();
	}, [tasks]);

	if (tasks.length == 0) {
		return (
			<>
				<p>Loading your view...</p>
				<button onClick={createTask}>Create</button>
			</>
		);
	}
	return (
		<>
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
		</>
	);
};

export default TodoList;
