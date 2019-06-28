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
		console.log(collection, 'before');
		if (queryField) {
			collection = collection.where(queryField, queryOperator, queryValue);
			console.log(collection, 'after');
		}
		return collection.onSnapshot(snapshot => {
			console.log(snapshot);

			const docs: any = [];
			console.log(docs, 'docs');
			snapshot.forEach(doc => {
				docs.push({
					...doc.data(),
					id: doc.id,
				});
			});
			setDocs(docs);
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
				console.log(result);
				// ...
			})
			.catch(err => {
				console.log(err);
			});
	}

	let tasks = useCollection(`users/${user.uid}/tasks`, [
		'completed',
		'==',
		false,
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
