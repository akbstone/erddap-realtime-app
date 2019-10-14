import React, {useState} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import Results from './results';
import {erddapParser} from 'erddap-parser';

async function getStations(searchFor) {
    let ob = {
        constraints: {
          searchFor:searchFor
        },
        server:process.env.REACT_APP_ERDDAP_URL || 'https://erddap.sensors.axds.co/erddap'
      }
  
      //return erddapParser.searchTabledap(ob);
      return new Promise((resolve,reject)=>{
        setTimeout(()=>{
          let res = Array(searchFor.length).fill(null).map((r,i)=>{
            return {
              label:searchFor[i] + ' result'
            }
          })
          resolve(res);
        },2000)
      })
  }


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}))



function Search(){

  const classes = useStyles()
  const [searchString,setSearchString] = useState('');
  const [searchResults,setSearchResults] = useState([]);

  let busy = false;
  let pending = false;
  let loaderRef = React.createRef();

  function setBusy(_busy){
    busy = _busy;
    if(loaderRef && loaderRef.current){
      loaderRef.current.style.display = busy ? 'block' : 'none';
    }
  }

  function setPending(_pending){
    pending = _pending;
  }
  
  async function updateResults(searchFor){
    if(!busy){
      setBusy(true)
      let results = await getStations(searchFor);
      results = results.map((r,k)=>{
        return Object.assign({key:k + 1},r)
      })
      setSearchResults(results);
      setBusy(false)
      if(pending){
        let nextSearch = pending;
        setPending(false)
        updateResults(nextSearch)
      }
    }else{
      //console.log('waiting')
      setPending(searchFor);
    }
  }

  const onKeyUp = function(e){
    updateResults(e.target.value);
  }

  
  return (
    <React.Fragment>
      <form className={classes.container} noValidate autoComplete="off">
      <TextField
          id="filled-name"
          fullWidth={true}
          placeholder="Station search"
          className={classes.textField}
          onKeyUp={onKeyUp}
          margin="normal"
          variant="filled"
        />
      </form>
      <div style={{textAlign:"center",display:"none"}} ref={loaderRef}>
        <CircularProgress />
      </div>
      <div style={{marginBottom:"60px"}}>
        <Results searchResults={searchResults}/>
      </div>
    </React.Fragment>
  )
}
export default Search