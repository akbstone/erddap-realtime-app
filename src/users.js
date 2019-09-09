import React from 'react'
import { Route } from 'react-router-dom'
import { Link, Paper } from '@material-ui/core'

class Users extends React.Component {
  render() {
  	const User = ({match}) => <p>{match.params.id}</p>
    return <Paper>

        <h1>Users</h1>
        <strong>select a user</strong>
        <ul>
          <li>
            <Link to="/users/1">User 1 </Link>
          </li>
          <li>
            <Link to="/users/2">User 2 </Link>
          </li>
          <li>
            <Link to="/users/3">User 3 </Link>
          </li>
        </ul>
        <Route path="/users/:id" component={User} />

    </Paper>
  }
}
export default Users