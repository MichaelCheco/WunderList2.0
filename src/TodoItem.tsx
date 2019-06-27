import React from 'react';
import { Link } from '@reach/router';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { db } from './firebase';
import { useUser } from './context/auth-context';
const Container = styled.div`
	display: flex;
	width: 100%;
	border: 1px solid black;
	justify-content: space-evenly;
`;

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
			if (y[0].toLowerCase() === 'next') {
				let num = daysOfWeek[y[1]];
				let val = 7 + num;
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
			.add(date, 'days')
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
		<Container>
			<Div>
				<label>
					<Input
						type="checkbox"
						checked={task.completed}
						onChange={handleCompleted}
					/>
				</label>
				<Link to={`${task.id}`} id={task.id}>
					<h4>{task.task}</h4>
				</Link>
			</Div>
			<Date>
				<label htmlFor="date" />
				<Input
					type="text"
					id="date"
					value={date}
					onChange={e => setDate(e.target.value)}
					placeholder="add a due date"
				/>
				<Button onClick={setDueDate}>date</Button>
			</Date>
		</Container>
	);
};
export default TodoItem;
const Date = styled.div`
	width: 30%;
	display: flex;
	/* flex-direction: column; */
	align-items: center;
	justify-content: center;
`;
const Div = styled.div`
	width: 70%;
	display: flex;
	h4 {
		font-family: 'Roboto';
		font-size: 1.3rem;
		color: #999999;
		text-decoration: none;
	}
	a {
		color: #999999;
		text-decoration: none;
	}
`;
const Input = styled.input`
	width: 100px;
	border-radius: 4px;
	outline: 0;
	color: #999999;
	/* margin: 5px 0; */
	padding-left: 12px;
	padding: 7px;
	font-size: 14px;
	background-color: rgba(0, 0, 0, 0.0001);
	border: 1px solid #999999;
	&::placeholder {
		color: #999999;
		/* padding-left: 12px; */
		font-size: 14px;
	}
`;
const Button = styled.button`
	width: 72px;
	height: 37px;
	background-color: #f14b39;
	color: white;
	border-radius: 5px;
	font-size: 13px;
	transition: all 0.4s ease;
	outline: 0;
	margin-left: 4px;
	/* margin-top: 15px; */
	&:hover {
		background-color: #ffffff;
		color: #ff6f61;
		border: 1px solid #f14b39;
		cursor: pointer;
		transition: all 0.4s ease;
		box-shadow: 0 0 11px rgba(33, 33, 33, 0.2);
	}
`;
