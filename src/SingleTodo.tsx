import React from 'react';
import { useUser } from './context/auth-context';
import { Link } from '@reach/router';
import { db } from './firebase';

function useDoc(path) {
	const [doc, setDoc] = React.useState(null);
	React.useEffect(() => {
		return db.doc(path).onSnapshot(doc => {
			setDoc({
				...doc.data(),
				id: doc.id,
			});
		});
	}, [path]);
	return doc;
}
// completed: false
// due_date: "1323"
// id: "sP4OFhTO74qe4ip837Te"
// priority: "red"
// task: "delete thi
const SingleTodo = (props: any) => {
	const [editing, setEditing] = React.useState(false);

	const { user } = useUser();
	const task = useDoc(`users/${user.uid}/tasks/${props.taskId}`);
	function update(e) {
		e.persist();
		db.collection('users')
			.doc(user.uid)
			.collection('tasks')
			.doc(task.id)
			.update({ task: e.target.previousSibling.value });
	}
	if (!user || !task) {
		return <p>...</p>;
	}
	return (
		<>
			<Link to="/tasks">Go Back</Link>
			<div>{task.task}</div>
			<button onClick={() => setEditing(true)}>Edit</button>
			{editing && (
				<>
					<label htmlFor="task" />
					<input defaultValue={task.task} id="task" />
					<button onClick={update}>Update</button>
				</>
			)}
		</>
	);
};

export default SingleTodo;
