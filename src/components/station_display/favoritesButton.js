import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
    float: 'right',
    color: 'lightgray'
  },
  favorite: {
    color: 'red'
  }
}));


function FavoriteButton({favorite, handleClick}) {

    const classes = useStyles();

    const className = classNames(
      classes.button,
      {
        [classes.favorite]: favorite,
      }
    );

    return (
        <IconButton className={className} aria-label="favorite" onClick={handleClick}>
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    )
}

export default FavoriteButton;