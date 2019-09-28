import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue'


const primary = blue;
primary.main = blue[900];

const theme = createMuiTheme({
  palette: {
    primary: primary,
    secondary: red,
  },
  status: {
    danger: 'orange',
  },
});

export default theme;