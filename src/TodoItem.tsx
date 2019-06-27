import React from 'react';
import { Link } from '@reach/router';
import moment from 'moment-timezone';
import { db } from './firebase';
import { useUser } from './context/auth-context';
let daysOfWeek = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};
export type Doc = {
	id: string;
	task: string;
	due_date?: string;
	completed: boolean;
	priority?: 'red' | 'blue' | 'green';
};
const TodoItem = ({ task }: Doc | any) => {
	const [date, setDate] = React.useState<string | number>('');
	const { user } = useUser();
	function setDueDate() {
		if (typeof date === 'string') {
			let y = date.split(' ');
			console.log(y);
			if (y[0].toLowerCase() === 'next') {
				let num = daysOfWeek[y[1]];
				let val = 7 + num;
				console.log(val, 'val');
				setDate(val);
				let dateToSet = new moment()
					.add(val, 'days')
					.startOf('day')
					.format('MMM Do');
				setDate('');
				db.collection(`users`)
					.doc(user.uid)
					.collection('tasks')
					.doc(task.id)
					.update({
						due_date: dateToSet,
					});
				return;
			}
		}
		// var fourDaysForward = new moment().add(4, 'day');
		let date_lower;
		if (daysOfWeek[date]) {
			let num = daysOfWeek[date];
			setDate(num);
			console.log(num);
		}
		if (typeof date === 'string') {
			date_lower = date.toLowerCase();
			if (date_lower === 'tomorrow') {
				setDate(1);
			}
			if (date_lower === 'today') {
				setDate(0);
			}
		}
		let dateToSet = new moment()
			.add(date, 'days') // Add one day (ie set moment instance to tomorrow)
			.startOf('day') // Set the time to midnight
			.format('MMM Do');
		console.log(dateToSet);
		setDate('');
		db.collection(`users`)
			.doc(user.uid)
			.collection('tasks')
			.doc(task.id)
			.update({
				due_date: dateToSet,
			});
		// let date_arr: string[] = [...date];

		// console.log(date_arr);
	}
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
				<p>{task.due_date}</p>
			</label>
			<label htmlFor="date" />
			<input
				type="text"
				id="date"
				value={date}
				onChange={e => setDate(e.target.value)}
				placeholder="add a due date"
			/>
			<button onClick={setDueDate}>date</button>
		</div>
	);
};
export default TodoItem;
