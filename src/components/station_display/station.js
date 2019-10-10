import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Sensor from './sensor';
import {erddapParser} from 'erddap-parser';
import FavoriteButton from './favoritesButton';
import StationStorage from '../../utilities/stationStorage';

const useStyles = makeStyles(theme => ({
    progressContainer: {
        textAlign: 'center'
    },
    progress: {
        margin: theme.spacing(2),
    },
}));

function Station(props) {

    const stationId = props.match.params.id;
    const classes = useStyles();
  
    const [isFavorite, setFavorite] = React.useState(StationStorage.getItem(stationId));
    const [station, setStation] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            let stationMetadata = await erddapParser.getDatasetMetadata({
                server:'https://erddap.sensors.axds.co/erddap',
                dataset_id: stationId
            });

            if(Array.isArray(stationMetadata)){
                stationMetadata = {
                    parameters:stationMetadata.slice().map(p => {
                        return Object.assign(
                            p,
                            {
                                dataset_id: stationId,
                                variable_name: p['Variable Name']
                            }
                        )
                    }),
                    label:stationId
                }
            }

            setStation(stationMetadata);
        };

        fetchData();
    },[])


    React.useEffect(() => {
        if (isFavorite) {
            StationStorage.setItem(stationId,!!isFavorite);
        } else {
            StationStorage.removeItem(stationId);
        }
    }, [isFavorite]);


    function onFavoriteClick() {
        setFavorite(!isFavorite);
    };


    let output = (
        <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
        </div>
    );

    if (station) {
        let parameters = station.parameters.slice().map((d,i) => {
            return Object.assign(
                d,
                {
                    index: i
                }
            )
        });

        output = (
            <div className="station-wrap" style={{marginBottom: "64px"}}>
                <FavoriteButton favorite={isFavorite} handleClick={onFavoriteClick} />
                <h1>Station name ({stationId})</h1>
                    {parameters.map(parameter => <Sensor key={parameter.index} parameter={parameter} height={100} />)}
            </div>
        )
    }
    return output;
  
}
export default Station
