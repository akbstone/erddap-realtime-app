import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import HistoryIcon from '@material-ui/icons/History';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
  	position:'fixed',
  	left:0,
  	right:0,
  	bottom:0,
  },
});



export default function BottomNav() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Search" icon={<SearchIcon />} component={Link} to="/search" />
      <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} component={Link} to="/favorites" />
      <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} component={Link} to="/nearby" />
      <BottomNavigationAction label="History" icon={<HistoryIcon />} component={Link} to="/history" />
    </BottomNavigation>
  );
}