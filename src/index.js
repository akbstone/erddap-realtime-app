import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import App from './App'
import Users from './users'
import Contact from './contact'
import Notfound from './notfound'
import SearchAppBar from './SearchAppBar'
import Search from './search'
import BottomNav from './bottom_nav'
import { Container } from '@material-ui/core'


const routing = (
  <Router>
  	<SearchAppBar />
    <Container>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/search" component={Search} />
        <Route path="/users" component={Users} />
        <Route path="/contact" component={Contact} />
        <Route component={Notfound} />
      </Switch>
    </Container>
    <BottomNav />
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))