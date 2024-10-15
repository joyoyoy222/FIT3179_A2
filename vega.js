document.addEventListener('DOMContentLoaded', function () {
    const csvFilePath = 'cleaned_data_by_industry.csv';

    // Load CSV data dynamically
    vega.loader()
        .load(csvFilePath)
        .then(csvData => {
            // Parse the CSV data into JSON
            const parsedData = vega.read(csvData, { type: 'csv' });

            // Create the bar chart with Male and Female earnings comparison
            const earningsChart = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "description": "Average weekly earnings by industry.",
                "data": {
                    "values": parsedData
                },
                "mark": {
                    "type": "bar",
                    "tooltip": true,
                    "size": 10  // Keep the thinner bars
                },
                "width": 800,  // Increase the width of the chart (longer)
                "height": 400,  // Reduce the height of the chart (shorter)
                "encoding": {
                    "x": {
                        "field": "value",
                        "type": "quantitative",
                        "axis": {"title": "Earnings ($)"}
                    },
                    "y": {
                        "field": "Industry",
                        "type": "nominal",
                        "axis": {
                            "title": "Industry", 
                            "labelLimit": 400,  // Ensure full labels are displayed
                            "labelFontSize": 12,
                            "labelPadding": 10  // Add padding to space out the labels
                        },
                        // Sorting by the average income or one of the earnings in descending order
                        "sort": {
                            "field": "value",
                            "order": "descending"
                        }
                    },
                    "color": {
                        "field": "Gender",
                        "type": "nominal",
                        "scale": {
                            "domain": ["Males", "Females"],
                            "range": ["#1f77b4", "#ff7f0e"]
                        }
                    },
                    "yOffset": {
                        "field": "Gender",
                        "type": "nominal"
                    }
                },
                "transform": [
                    { "fold": ["Males", "Females"], "as": ["Gender", "value"] }
                ],
                "config": {
                    "view": {"stroke": "transparent"},
                    "facet": {"spacing": 15},
                    "axis": {
                        "labelFontSize": 12
                    }
                }
            };

            // Embed the chart into the div with id earnings-chart
            vegaEmbed('#earnings-chart', earningsChart);
        })
        .catch(error => console.error(error));
});

document.addEventListener('DOMContentLoaded', function () {
    const csvFilePath = 'cleaned_data_by_time.csv'; 

   // Load CSV data dynamically
   vega.loader()
   .load(csvFilePath)
   .then(csvData => {
       // Parse the CSV data into JSON
       const parsedData = vega.read(csvData, { type: 'csv' });

       // Create the line chart with tooltip
       const lineChart = {
           "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
           "description": "Average weekly cash earnings for males and females over time.",
           "width": 800,  // Adjust the width here
           "height": 300,  // Adjust the height here
           "data": {
               "values": parsedData
           },
           "mark": {
               "type": "line",
               "point": {"filled": true, "fill": "white"},  // Adds a point for better tooltip interaction
               "tooltip": true  // Enable tooltip on hover
           },
           "encoding": {
               "x": {
                   "field": "Time",  // Time on the x-axis
                   "type": "ordinal",  // Use ordinal for discrete time points
                   "axis": {
                    "title": "Time",
                    "labelAngle": -45
                   },
                   "sort":null
               },
               "y": {
                   "field": "value",  // Earnings data on the y-axis
                   "type": "quantitative",
                   "axis": {"title": "Earnings (AUD)"}
               },
               "color": {
                   "field": "Gender",  // Color by gender
                   "type": "nominal",
                   "scale": {
                       "domain": ["Males", "Females"],
                       "range": ["#1f77b4", "#ff7f0e"]
                   },
                   "legend": {"title": "Gender"}  // Add a legend
               },
               "tooltip": [
                   {"field": "Time", "type": "ordinal", "title": "Time"},  // Show time on hover
                   {"field": "Gender", "type": "nominal", "title": "Gender"},  // Show gender
                   {
                       "field": "value", 
                       "type": "quantitative", 
                       "title": "Earnings (AUD)",
                       "format": "$,.2f"  // Add dollar sign and format to 2 decimal places
                   }
               ]
           },
           "transform": [
               {
                   "fold": ["Males", "Females"],  // Fold male and female columns
                   "as": ["Gender", "value"]
               }
           ],
           "config": {
               "view": {"stroke": "transparent"}
           }
       };

       // Embed the chart into the div with id line-chart
       vegaEmbed('#line-chart', lineChart).catch(console.error);
   })
   .catch(error => console.error(error));
});


document.addEventListener('DOMContentLoaded', function () {
    const csvFilePath = 'cleaned_data_by_state.csv';

    vega.loader()
        .load(csvFilePath)
        .then(csvData => {
            const stateNameMapping = {
                "NSW": "New South Wales",
                "Vic.": "Victoria",
                "Qld": "Queensland",
                "SA": "South Australia",
                "WA": "Western Australia",
                "Tas.": "Tasmania",
                "NT": "Northern Territory",
                "ACT": "Australian Capital Territory"
            };

            const parsedData = vega.read(csvData, { type: 'csv' }).map(row => {
                row.State = stateNameMapping[row.State] || row.State;
                return row;
            });

            console.log(parsedData);  // Log parsed CSV data to check if state names match

            const australiaMap = {
                "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
                "title": "Average Income Weekly in Australia",
                "width": 800,
                "height": 450,

                "data": {
                    "url": "australian-states.min.geojson",
                    "format": {
                        "type": "json",  
                        "property": "features"  
                    }
                },
                "transform": [
                    {
                        "lookup": "properties.STATE_NAME",  
                        "from": {
                            "data": {
                                "values": parsedData
                            },
                            "key": "State",  
                            "fields": ["Average Income"]  
                        }
                    }
                ],
                "projection": {
                    "type": "EqualEarth",
                    "center": [132, -28],  // Center over Australia
                    "rotate": [0, 0, 0],
                    "scale": 800  // Adjust the scale
                },
                "mark": "geoshape",
                "encoding": {
                    "color": {
                        "field": "Average Income",
                        "type": "quantitative",
                        "scale": {"scheme": "blues"},
                        "legend": {"title": "Average Income"}
                    },
                    "tooltip": [
                        {"field": "properties.STATE_NAME", "type": "nominal", "title": "State"},  // Tooltip for state name
                        {"field": "Average Income", "type": "quantitative", "title": "Income"}  // Tooltip for income
                    ]
                },
                "config": {
                    "view": {"stroke": "transparent"}
                }
            };

            vegaEmbed('#map-container', australiaMap);
        })
        .catch(error => console.error(error));
});
