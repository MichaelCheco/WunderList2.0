import React from 'react';
import { Link } from '@reach/router';
import moment from 'moment-timezone';
import { db } from './firebase';
import { useUser } from './context/auth-context';
export type Doc = {
	id: string;
	task: string;
	due_date?: string;
	completed: boolean;
	priority?: 'red' | 'blue' | 'green';
};
const TodoItem = ({ task }: Doc | any) => {
	const { user } = useUser();
	function handleCompleted(e) {
		e.preventDefault();
		db.collection(`users`)
			.doc(user.uid)
			.collection(`tasks`)
			.doc(task.id)
			.update({
				completed: !task.completed,
			});
	}
	return (
		<div>
			{task.task}
			{task.completed ? 'Completed' : 'Not Completed'}
			<Link to={`${task.id}`} id={task.id}>
				Item
			</Link>
			<label>
				<input
					type="checkbox"
					checked={task.completed}
					onChange={handleCompleted}
				/>
				<p>{moment(task.due_date).format('ddd')}</p>
			</label>
		</div>
	);
};
export default TodoItem;
