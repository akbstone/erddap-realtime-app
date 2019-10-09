import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Results from './results';
import {erddapParser} from 'erddap-parser';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchResults:  [],
                  searchString: ""};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
     this.setState({searchString: event.target.value});
  }

 handleSubmit(event) {
    
    erddapParser.searchTabledap(this.state.searchString)
       .then(parseResults => parseResults.map(r=>Object.assign(r, {id: r['Dataset ID'], label: r.Title, index: 1}) ))
       .then(s =>   this.setState({searchResults: s}));
     event.preventDefault();
   }

  render() {
    return (
      <React.Fragment>
      <form onSubmit={this.handleSubmit}  >
        <label >
          Name:
          <input type="text"  value={this.state.station} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <Results var1="abd" searchResults={this.state.searchResults}/>
      </React.Fragment>
    );
  }
}
export default Search