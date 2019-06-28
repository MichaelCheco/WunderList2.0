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
	const [schedule, setSchedule] = React.useState<number>(0);

	const { user } = useUser();

	function setDueDate(event) {
		console.log('fired');
		event.preventDefault();

		let curr = new Date();
		curr.setDate(curr.getDate() + Number(schedule));
		let final = moment(curr).format('MMM DD');

		console.log(curr);
		db.collection(`users`)
			.doc(user.uid)
			.collection('tasks')
			.doc(task.id)
			.update({
				due_date: final,
			});
		return;
	}

	// var fourDaysForward = new moment().add(4, 'day');
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
					<input
						type="checkbox"
						checked={task.completed}
						onChange={handleCompleted}
					/>
				</label>
				<Link to={`${task.id}`} id={task.id}>
					<h4>{task.task}</h4>
				</Link>
			</Div>
			{!task.due_date ? (
				<DateView>
					<label htmlFor="schedule" />
					<Input
						type="number"
						id="schedule"
						value={schedule}
						onChange={e => setSchedule(e.target.value)}
						placeholder="days to complete 0 for (today)"
					/>
					<Button onClick={setDueDate}>Days</Button>
				</DateView>
			) : (
				<DateView>
					<p>{task.due_date}</p>
					<Colors color={task.priority} />
				</DateView>
			)}
		</Container>
	);
};
export default TodoItem;
const Colors = styled.div`
	width: 12px;
	height: 12px;
	/* width: 12px;
	height: 5px; */
	display: relative;
	background-color: ${props => (props.color == 'blue' ? '#1DA1F1' : props.color)};
	/* border: 2px solid ${props => props.color}; */
	border-radius: 50%;
`;
const DateView = styled.div`
	width: 20%;
	display: flex;
	/* flex-direction: column; */
	align-items: center;
	justify-content: space-around;
`;
const Div = styled.div`
	width: 80%;
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
	/* label {
		width: 200px;
		position: relative;
		left: -20px;
		display: inline-block;
		vertical-align: middle;
	}
	input {
		width: 20px;
		position: relative;
		left: 200px;
		vertical-align: middle;
	} */
`;
const Input = styled.input`
	width: 60px;
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
	width: 95px;
	height: 35px;
	background-color: #f14b39;
	color: white;
	border-radius: 5px;
	font-size: 13px;
	transition: all 0.4s ease;
	outline: 0;
	margin-left: 4px;
	margin-right: 4px;
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
