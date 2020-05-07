import React, {useState} from 'react';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import throttle from 'lodash/throttle';
import keyBy from 'lodash/keyBy';
import rp from 'request-promise';

import FormControl from '@material-ui/core/FormControl';

import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';


import {erddapParser} from 'erddap-parser';




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

export default function Search(){

  let active_request = null;

  const searchService = function(uri,callback){
    return rp.get({
      uri:uri
  }).then(callback)


  }

  const getStations = (searchFor,callback)=>{
    return new Promise((resolve,reject)=>{
        

    
      let ob = erddapParser.getSearchTableDapOb({
        constraints: {
          searchFor:searchFor
        },
        server:process.env.REACT_APP_ERDDAP_URL || 'https://erddap.sensors.axds.co/erddap'
      })

      if(active_request){
        active_request.cancel();
      }

      active_request = rp.get({
        uri:erddapParser.createErddapURLPath(ob) + '?' + erddapParser.createErddapQueryString(ob)
      }).then((result)=>{
        result = erddapParser.parseTabledapSearchSesults(erddapParser.parseCSV(result),ob);
        active_request = null;
        callback(result);
      })

    })

      /*  */
  }

  const classes = useStyles()
  const [inputValue, setInputValue] = React.useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [busy, setBusy] = useState(false);
  React.useEffect(() => {
    updateSearchResults();
    }, [inputValue, fetch]
  );

  const updateSearchResults  = () => {
    if (inputValue === '') {
      setSearchResults([]);
      return undefined;
    }
    updateResults(inputValue)
  }


  const updateResults = React.useMemo(
    () =>
    
        throttle((searchFor) => {
          setBusy(true);
          getStations(searchFor,(results)=>{
            results = results.map((r,k)=>{
              return {
                ...r,
                ...{
                  key:k+1,
                  result_url:'./station/' + r['Dataset ID']
                }
              }
            })
            setSearchResults(results);
      
            setBusy(false);
      
          });
        }, 200),
        [],
    );


  const handleSearchChange = function(e){
    setInputValue(e.target.value);
  }

  const handleStationLink = function(e){
    return <Redirect push to={e.link} />;
  }

  return (
    <>
      <FormControl variant="outlined" size="small" className={classes.formControl} fullWidth>
        <TextField
            id="filled-name"
            fullWidth={true}
            placeholder="Station search"
            className={classes.textField}
            onChange={handleSearchChange}
            margin="normal"
            variant="outlined"
            size="small"
            value={inputValue}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => setInputValue('')} size="small">
                  <ClearIcon />
                </IconButton>
              )
            }}

          />
      </FormControl>
    
      <div style={{position:'relative'}}>
      {busy === true &&
        <CircularProgress style={{position:'absolute',left:'50%',top:'50px'}} />
      }


      <List>
        {!((searchResults || []).length) && 
          <p><em>Enter a search term</em></p>
        }
        {(searchResults || []).map((item,index) => item ? (


        
        
          <ListItem key={index} divider>
              <Link href={item.result_url} onClick={(e)=> handleStationLink({...e,...{link:item.result_url}})}>
              <ListItemText primary={item.Title} secondary={item.Institution} />
                </Link>
                <Divider />
              </ListItem>
            

          ) : '')}
        </List>
        </div>

    </>
  )
}