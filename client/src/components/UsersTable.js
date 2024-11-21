// client/src/components/UsersTable.js

import React, { useEffect, useState } from 'react';

function UsersTable() {
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
	fetch('/users')
	.then((response) => {
		if (!response.ok) {
		throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.json();
	})
	.then((data) => {
		setUsers(data);
		setLoading(false);
	})
	.catch((error) => {
		console.error('Error fetching users:', error);
		setError(error);
		setLoading(false);
	});
}, []);

if (loading) {
	return <p>Loading users...</p>;
}

if (error) {
	return <p>Error fetching users: {error.message}</p>;
}

return (
	<div style={{ padding: '20px' }}>
	<h1>Users List</h1>
	{users.length > 0 ? (
		<table border="1" cellPadding="10">
		<thead>
			<tr>
			<th>ID</th>
			<th>Username</th>
			<th>Email</th>
			<th>First Name</th>
			<th>Last Name</th>
			<th>Role</th>
			<th>Created At</th>
			</tr>
		</thead>
		<tbody>
			{users.map((user) => (
			<tr key={user.id}>
				<td>{user.id}</td>
				<td>{user.username}</td>
				<td>{user.email}</td>
				<td>{user.first_name}</td>
				<td>{user.last_name}</td>
				<td>{user.role}</td>
				<td>{new Date(user.created_at).toLocaleString()}</td>
			</tr>
			))}
		</tbody>
		</table>
	) : (
		<p>No users found.</p>
	)}
	</div>
);
}

export default UsersTable;
