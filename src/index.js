import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import App from './App'
import Favorites from './components/favorites'
import Nearby from './components/nearby'
import Notfound from './components/notfound'
import Station from './components/station_display/station'
import SearchAppBar from './components/search_app_bar'
import Search from './components/search'
import History from './components/history'
import BottomNav from './components/bottom_nav'
import { Container } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import theme from './theme'


const routing = (
  <Router>
    <ThemeProvider theme={theme}>
  	<SearchAppBar />
    <Container>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/search" component={Search} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/nearby" component={Nearby} />
        <Route path="/history" component={History} />
        <Route path="/station/:id" component={Station} />
        <Route component={Notfound} />
      </Switch>
    </Container>
    </ThemeProvider>
    <BottomNav />
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))