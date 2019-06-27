import React from 'react';
import { db, firebase } from './firebase';
import styled from 'styled-components';
import { useUser } from './context/auth-context';
import TodoItem from './TodoItem';
const Container = styled.div`
	/* border: 1px solid black; */
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

	let tasks = useCollection(`users/${user.uid}/tasks`, [
		'completed',
		'===',
		'true',
	]);

	if (tasks.length === 0) {
		return (
			<>
				<p>Loading your view...</p>
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
		</Container>
	);
};

export default TodoList;
