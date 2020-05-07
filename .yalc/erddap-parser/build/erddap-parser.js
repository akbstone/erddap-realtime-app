(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.d3 = global.d3 || {}));
}(this, function (exports) { 'use strict';

  var EOL = {},
      EOF = {},
      QUOTE = 34,
      NEWLINE = 10,
      RETURN = 13;

  function objectConverter(columns) {
    return new Function("d", "return {" + columns.map(function(name, i) {
      return JSON.stringify(name) + ": d[" + i + "] || \"\"";
    }).join(",") + "}");
  }

  function customConverter(columns, f) {
    var object = objectConverter(columns);
    return function(row, i) {
      return f(object(row), i, columns);
    };
  }

  // Compute unique columns in order of discovery.
  function inferColumns(rows) {
    var columnSet = Object.create(null),
        columns = [];

    rows.forEach(function(row) {
      for (var column in row) {
        if (!(column in columnSet)) {
          columns.push(columnSet[column] = column);
        }
      }
    });

    return columns;
  }

  function pad(value, width) {
    var s = value + "", length = s.length;
    return length < width ? new Array(width - length + 1).join(0) + s : s;
  }

  function formatYear(year) {
    return year < 0 ? "-" + pad(-year, 6)
      : year > 9999 ? "+" + pad(year, 6)
      : pad(year, 4);
  }

  function formatDate(date) {
    var hours = date.getUTCHours(),
        minutes = date.getUTCMinutes(),
        seconds = date.getUTCSeconds(),
        milliseconds = date.getUTCMilliseconds();
    return isNaN(date) ? "Invalid Date"
        : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
        + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
        : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
        : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
        : "");
  }

  function dsvFormat(delimiter) {
    var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),
        DELIMITER = delimiter.charCodeAt(0);

    function parse(text, f) {
      var convert, columns, rows = parseRows(text, function(row, i) {
        if (convert) return convert(row, i - 1);
        columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
      });
      rows.columns = columns || [];
      return rows;
    }

    function parseRows(text, f) {
      var rows = [], // output rows
          N = text.length,
          I = 0, // current character index
          n = 0, // current line number
          t, // current token
          eof = N <= 0, // current token followed by EOF?
          eol = false; // current token followed by EOL?

      // Strip the trailing newline.
      if (text.charCodeAt(N - 1) === NEWLINE) --N;
      if (text.charCodeAt(N - 1) === RETURN) --N;

      function token() {
        if (eof) return EOF;
        if (eol) return eol = false, EOL;

        // Unescape quotes.
        var i, j = I, c;
        if (text.charCodeAt(j) === QUOTE) {
          while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
          if ((i = I) >= N) eof = true;
          else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          return text.slice(j + 1, i - 1).replace(/""/g, "\"");
        }

        // Find next delimiter or newline.
        while (I < N) {
          if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
          else if (c === RETURN) { eol = true; if (text.charCodeAt(I) === NEWLINE) ++I; }
          else if (c !== DELIMITER) continue;
          return text.slice(j, i);
        }

        // Return last token before EOF.
        return eof = true, text.slice(j, N);
      }

      while ((t = token()) !== EOF) {
        var row = [];
        while (t !== EOL && t !== EOF) row.push(t), t = token();
        if (f && (row = f(row, n++)) == null) continue;
        rows.push(row);
      }

      return rows;
    }

    function preformatBody(rows, columns) {
      return rows.map(function(row) {
        return columns.map(function(column) {
          return formatValue(row[column]);
        }).join(delimiter);
      });
    }

    function format(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return [columns.map(formatValue).join(delimiter)].concat(preformatBody(rows, columns)).join("\n");
    }

    function formatBody(rows, columns) {
      if (columns == null) columns = inferColumns(rows);
      return preformatBody(rows, columns).join("\n");
    }

    function formatRows(rows) {
      return rows.map(formatRow).join("\n");
    }

    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }

    function formatValue(value) {
      return value == null ? ""
          : value instanceof Date ? formatDate(value)
          : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
          : value;
    }

    return {
      parse: parse,
      parseRows: parseRows,
      format: format,
      formatBody: formatBody,
      formatRows: formatRows,
      formatRow: formatRow,
      formatValue: formatValue
    };
  }

  var csv = dsvFormat(",");

  var csvParse = csv.parse;

  var tsv = dsvFormat("\t");

  // https://github.com/d3/d3-dsv/issues/45
  var fixtz = new Date("2019-01-01T00:00").getHours() || new Date("2019-07-01T00:00").getHours();

  function responseText(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.text();
  }

  function text(input, init) {
    return fetch(input, init).then(responseText);
  }

  function dsvParse(parse) {
    return function(input, init, row) {
      if (arguments.length === 2 && typeof init === "function") row = init, init = undefined;
      return text(input, init).then(function(response) {
        return parse(response, row);
      });
    };
  }

  var csv$1 = dsvParse(csvParse);

  function responseJson(response) {
    if (!response.ok) throw new Error(response.status + " " + response.statusText);
    return response.json();
  }

  function json(input, init) {
    return fetch(input, init).then(responseJson);
  }

  var erddapParser = {
    _validateResponse: function (r) {
      return r === 'csv' || r === 'json' || r === 'graph';
    },
    _validateRequest: function (r) {
      return r === 'data' || r === 'info' || r === 'search' || r === 'tabledap';
    },

    /**
     * Generate an ERDDAP URL from the given constraints
     * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
     * @param {string} ob.server - the base URL of the ERDDAP server
     * @param {string} ob.protocol - the ERDDAP protocol: griddap or tabledap
     * @param {string} ob.request - the type of request: data or metadata (or info)
     * @param {string} ob.dataset_id - the dataset identifier (the part after the server and protocol)
     * @param {array} ob.constraints - the values (e.g., min max) the constrain the request
     * @param {array} ob.variables - the variables requested
     * @param {string} ob.response - the type of response requested (default: csv)
     */
    createErddapUrl: function (ob) {
      ob = ob || {};
      let url_path = this.createErddapURLPath(ob),
          query_format = 'string',
          query_string = this.createErddapQueryString({ ...ob,
        query_format
      });
      return url_path + '?' + query_string;
    },

    /**
     * Generate an ERDDAP QUERY string from the given constraints
     * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
     * @param {array} ob.constraints - the values (e.g., min max) the constrain the request
     * @param {array} ob.variables - the variables requested
     * @param {string} ob.query_format - string(default)|object
     */
    createErddapQueryString: function (ob) {
      let constraints = ob.constraints || {},
          variables = ob.variables || [],
          constraint_filters = [],
          constraint_keys = Object.keys(constraints || []);
      constraint_keys.forEach(k => {
        constraint_filters.push(k.replace('>', '%3E').replace('<', '%3C') + ((k.match(/=|>|</) ? '' : '=') + (constraints[k] instanceof Date ? constraints[k].toISOString() : constraints[k])));
      });
      return ob.query_format === 'object' ? {
        variables: variables,
        constraint_filters: constraint_filters
      } : [variables ? variables.join('%2C') : null, constraint_filters ? constraint_filters.join('&') : null].filter(d => d).join('&');
    },

    /**
     * Generate an ERDDAP URL path from the given constraints
     * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
     * @param {string} ob.protocol - the ERDDAP protocol: griddap or tabledap
     * @param {string} ob.request - the type of request: data or metadata (or info)
     * @param {string} ob.dataset_id - the dataset identifier (the part after the server and protocol)
     * @param {string} ob.response - the type of response requested (default: csv)
     */
    createErddapURLPath: function (ob) {
      if (!ob.server) {
        throw new Error('Must define server');
      }

      let erddap_srv = ob.server,
          protocol = ob.protocol,
          request = ob.request === 'metadata' ? 'info' : ob.request || 'data',
          //default to data
      dataset_id = ob.dataset_id,
          response = ob.response || 'csv',
          path = request === 'info' || request == 'search' ? 'index' : '';

      if (!this._validateRequest(request)) {
        throw new Error('Invalid request type (' + request + ')');
      }

      if (!this._validateResponse(response)) {
        throw new Error('Invalid response type (' + response + ')');
      }

      if (request !== 'search' && !dataset_id) {
        throw new Error('Must define dataset_id for info and data requests');
      }

      return erddap_srv + (protocol ? '/' + protocol : '') + (request === 'data' ? '' : '/' + request) + (dataset_id ? '/' + dataset_id : '') + (path ? '/' + path : '') + '.' + response;
    },

    /**
     * Make an ERDDAP request using given constraints and parameters
     * @param {Object} ob - an object passed from input specifying the parameters of the ERDDAP URL
     */
    getErddapData: async function (ob) {
      let url = this.createErddapUrl(ob),
          response = ob.response || 'csv',
          parseType = response.match(/csv/) ? 'csv' : response.match(/json/) ? 'json' : 'text',
          fns = {
        json: json,
        csv: csv$1
      },
          fn = fns[parseType];
      return new Promise((resolve, reject) => {
        fn(url).then(response => {
          resolve(response);
        }).catch(e => {
          console.log('Error');
          console.log(e); //throw new Error('unable to fetch')

          reject(e);
        });
      });
    },
    getTabledapData: async function (ob) {
      ob.request = 'data';
      ob.protocol = 'tabledap';
      ob.response = 'csv';
      let data = await this.getErddapData(ob);
      return this.parseTabledapData(data, ob);
    },
    getDatasetMetadataOb: function (ob) {
      return { ...ob,
        ...{
          request: 'info',
          response: 'csv'
        }
      };
    },
    getDatasetMetadata: async function (ob) {
      ob = this.getDatasetMetadataOb(ob);
      let metadataCsv = await this.getErddapData(ob);
      return this.parseDatasetMetadata(metadataCsv);
    },
    getSearchTableDapOb: function (ob) {
      return { ...ob,
        ...{
          constraints: { ...{
              'itemsPerPage': 20,
              'page': 1,
              'protocol': 'tabledap'
            },
            ...ob.constraints
          },
          request: 'search',
          response: 'csv'
        }
      };
    },
    searchTabledap: async function (ob) {
      ob = this.getSearchTableDapOb(ob);

      if (!ob.constraints.searchFor) {
        return this.parseTabledapSearchSesults([]);
      }

      let searchCsv = await this.getErddapData(ob);
      return this.parseTabledapSearchSesults(searchCsv);
    },
    parseCSV: function (csvString) {
      return csvParse(csvString);
    },
    parseTabledapData: function (dataCsv = [], ob = {}) {
      let variable_names = ob.variable_names || {},
          variables = (ob.variables || Object.keys(dataCsv && dataCsv.length ? dataCsv[0] : {})).map(v => {
        return {
          key: variable_names[v] || v,
          value: v
        };
      });
      dataCsv.shift();
      dataCsv = dataCsv.slice().map(function (d) {
        let o = {};
        variables.forEach(v => {
          o[v.key] = v.key.match(/time|date/) ? new Date(d[v.value]) : +d[v.value];
        });
        return o;
      });
      return dataCsv;
    },
    parseTabledapSearchSesults: function (searchCsv) {
      return searchCsv;
    },
    _combineAttributesWithVariable: function (variable_row, csv) {
      var attributes = csv.filter(r => r['Variable Name'] == variable_row['Variable Name'] && r['Row Type'] == 'attribute');
      attributes.forEach(function (a) {
        variable_row[a['Attribute Name']] = a['Value'];
        variable_row[a['Attribute Name'].toLowerCase().replace(/\s+/g, '_')] = a['Value'];
      });
      return variable_row;
    },
    parseDatasetMetadata: function (metadataCsv) {
      let variable_rows = metadataCsv.filter(d => d['Row Type'] == 'variable').map(r => {
        return this._combineAttributesWithVariable(r, metadataCsv);
      }),
          variables = variable_rows.filter(d => !d.axis && d['Data Type'] === 'double'),
          dimensions = variable_rows.filter(d => d.axis),
          variables_map = {},
          dimensions_map = {},
          axis_map = {};

      variables.forEach(r => {
        variables_map[r['Variable Name']] = r;
      });
      dimensions.forEach(d => {
        if (!axis_map[d.axis]) {
          axis_map[d.axis] = [];
        }

        axis_map[d.axis].push(d);
        dimensions_map[d['Variable Name']] = d;
      });
      let attribute_rows = metadataCsv.filter(d => d['Row Type'] === 'attribute' && !variables_map[d['Attribute Name']] && !dimensions_map[d['Attribute Name']]),
          attributes_map = {};
      attribute_rows.forEach(r => {
        attributes_map[r['Attribute Name']] = r;
      });
      let spatial = {};

      if (attributes_map.geospatial_lon_min && attributes_map.geospatial_lon_max && attributes_map.geospatial_lat_min && attributes_map.geospatial_lat_max) {
        if (attributes_map.geospatial_lon_min['Value'] === attributes_map.geospatial_lon_max['Value'] && attributes_map.geospatial_lat_min['Value'] === attributes_map.geospatial_lat_max['Value']) {
          spatial.point = [attributes_map.geospatial_lon_min, attributes_map.geospatial_lat_min];
        } else {
          spatial.bounds = [[attributes_map.geospatial_lon_min['Value'], attributes_map.geospatial_lat_min['Value']], [attributes_map.geospatial_lon_max['Value'], attributes_map.geospatial_lat_max['Value']]];
        }
      }

      return {
        title: attributes_map.title ? attributes_map.title['Value'] : null,
        variables: variables,
        variables_map: variables_map,
        attributes: attribute_rows,
        attributes_map: attributes_map,
        dimensions: dimensions,
        dimensions_map: dimensions_map,
        spatial: spatial
      };
    }
  };

  exports.erddapParser = erddapParser;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
