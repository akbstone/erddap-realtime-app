import React from 'react'
import StationStorage from './../utilities/stationStorage';
import FavoriteButton from './station_display/favoritesButton';
import {Link} from "react-router-dom";

  //get favorites from the cookie
  let getList = function(){
    return StationStorage.getList().map((d,i)=>{
      return {
        index:i + 1,
        id:d,
        isFavorite:true
      }
    }) || [];
  }

class Favorites extends React.Component {

  constructor(props){
    super(props)
    this.state = {list:getList()};
  }

  updateState(){
    this.setState({list:getList()})
  }



  
  render() {

    let _this = this;
    
    return <React.Fragment>
    <h1>Favorites</h1>
    {this.state.list.map(station =>{
      function setFavorite(){
        StationStorage.removeItem(station.id);
        _this.updateState()
        //this.setState({list:getList()});
      }

      let station_url = '/station/' + station.id;
      return <React.Fragment key={station.index}> 
        <div className="card" style={{clear: "both"}}>
          <FavoriteButton handleClick={setFavorite} favorite={station.isFavorite} />
          <Link to={station_url}>{station.id}</Link>
        </div>
        </React.Fragment>
      }
    )}
    </React.Fragment>
  }
}
export default Favorites