ERDDAP Real Time Web app
========================

A mobile web app that allows users to explore real time sensor data available on an ERDDAP install.  This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


Screenshots and breakdown of intended functionality
---------------------------------------------------


Search

- Simple endless scroll text search that leverages ERDDAP search API
- Station results link in to station page
- Dropdown menu that lists all avaiable variables for filtering on
    - Variable list to come from ERDDAP API

<img src="images/preview.jpg" style="max-width:100%" />


Station page

- Display station name and metadata
    - Metadata retrieved based on station id, using ERDDAP API
- Display time series chart of each avaialble variable for a short time period (default most recent 30 days)
    - Time series data retrieved based on station/variable ids, using ERDDAP API [example observable notebook](https://observablehq.com/@akbstone/test-from-erddap)
- Allow user to mark station as 'favorite'


[SCREENSHOT]


Favorites


History





Getting started
---------------

Requirements

- NPM > 10

Install it

### `git clone ....`
### `npm install`

Run it

### `npm start`


Build



Test



