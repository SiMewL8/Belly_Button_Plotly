// ID selector
function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("data/samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  })}
  
init();

function testcurrent () {
  // xs = 940
  // d3.select("#selDataset").value == 940
  // console.log(xs + "testme222");
  buildMetadata(940);
  buildCharts(940);
}

testcurrent();


// function testcurrent (xs) {
//   d3.select("#selDataset").value == xs
//   console.log(xs + "testme222");
//   buildMetadata(xs);
//   buildCharts(xs);
// }

// Base function refresh
function optionChanged (newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Script: Filling out Demographic Info
function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");
        Object.entries(result).forEach(([x,y]) => {
            PANEL.append("h6").text((x + ": "+ y).toUpperCase());
        })

        // belly button washing frequency for gauge chart
        var wfreqValue = result.wfreq;

        // gauge chart 
        var data = [
            {
              domain: { 
                x: [0,1],
                y: [0,1]
              },
              title: {
                text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
                font:{
                  color: "darkgreen"
                }
              },
              type: "indicator",
              mode: "gauge+number",
              value: wfreqValue,
              gauge: {
                shape: "angular",
                bar: {
                  color: "plum",
                  thickness: .2
                  },
                // bgcolor: "greenyellow",
                axis: {
                  range: [null,10],
                  tickmode: "linear",
                  tick0: 0,
                  dtick: 1,
                  ticklen: 8,
                  tickcolor: "red", 
                  },
                steps:[
                  {range:[0,1], color: 'rgba(14, 127, 0, .1)'},
                  {range:[1,2], color: 'rgba(14, 127, 0, .2)'},
                  {range:[2,3], color: 'rgba(14, 127, 0, .3)'},
                  {range:[3,4], color: 'rgba(14, 127, 0, .4)'},
                  {range:[4,5], color: 'rgba(14, 127, 0, .5)'},
                  {range:[5,6], color: 'rgba(14, 127, 0, .6)'},
                  {range:[6,7], color: 'rgba(14, 127, 0, .7)'},
                  {range:[7,8], color: 'rgba(14, 127, 0, .8)'},
                  {range:[8,9], color: 'rgba(14, 127, 0, .9)'},
                  {range:[9,10], color: 'rgba(14, 127, 0, 1)'}
                ],
              }
            }
          ];
                    
            var layout = { width: 500, height: 350, margin: { t: 0, b: 0 } };
        
        Plotly.newPlot('gauge', data, layout);

    })
};



function buildCharts(sample) {

    // read samples.json and then (data)
    d3.json("data/samples.json").then((data) => {
        
        // filter for data.samples.id
        var dataSamples = data.samples;
        var chosenID = dataSamples.filter(selcID => selcID.id == sample);
        
        // id from dropdown matches filtered id from samples array
        // first item in the array  selected and assigned new var
        var resultSampleID = chosenID[0];

        // assiging var so d3 can find bar chart id in html
        var TagHTML = d3.select("#bar");

        // refreshed data when another id is selected from dropdown
        TagHTML.html("");

        // variables for bar and bubble charts
        var uniqueID = resultSampleID.id;

        var sampleValues = resultSampleID.sample_values;

        var otuID = resultSampleID.otu_ids;

        var otuLables = resultSampleID.otu_labels;

        // bar chart
        var trace1 = {
            x: (Object.values((sampleValues.slice(0,10)).sort((a,b)=> a-b))
                                .map(num => parseInt(num))),
            y: (Object.values((otuID.slice(0,10)).reverse())
                                .map(str => String('OTU ' + str))),
            mode: 'markers',
            type: 'bar',
            name: 'bacterium IDs',
            text: ((otuLables.slice(0,10)).sort((a,b)=> a-b)),
            orientation:'h'
          };
          
        var data = [ trace1 ];
          
        var layout = {
            xaxis: {
              title: 'Count of Unique Bacteria',
            },
            yaxis: {
              title: 'Specific Bacteria by OTU ID',
              standoff: 60,
              type: 'category'
            },
            title:('ID '+ uniqueID +' Top Bacterial Species')
          };
          
        Plotly.newPlot('bar', data, layout);

        // bubble chart
        var trace1 = {
            x: otuID,
            y: sampleValues,
            text: otuLables,
            mode: 'markers',
            marker: {
              color: otuID,
              size: (Object.values(sampleValues.map(num => parseInt(num)))),
              sizeref: 2.0 * Math.max(...sampleValues) / (20**2),
              sizemode: 'diameter'
            }
          };
          
        var data = [trace1];
          
        var layout = {
            xaxis: {
                title: 'Bacterial Species by OTU IDs',
              },
            yaxis: {
                title: 'Amount of Bacteria',
              },
            title: ('ID ' + uniqueID + ' Relative Frequency of Bacterial Species'),
            showlegend: false,
            height: 600,
            width: 1200
          };
          
        Plotly.newPlot('bubble', data, layout);
    });
};


