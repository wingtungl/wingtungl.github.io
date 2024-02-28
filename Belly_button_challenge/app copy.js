function data_plot(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Bubble Chart
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // Bar Chart
    var barData =
    {
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    }
      ;

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", [barData], barLayout);
  });
}

function init() {
  // Get the select ID 
  var selector = d3.select("#selDataset");

  // list of sample is used to names to populate the select options
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    var sampleNames = data.names;

    for (var i = 0; i < sampleNames.length; i++) {
      selector
        .append("option")
        .text(sampleNames[i])
        .property("value", sampleNames[i]);
    };

    // Use sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    data_plot(firstSample);
    buildMetadata(firstSample);



  });
};

function buildMetadata(sample) {
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {

    //demographic info
    // function buildMetadata(firstSample){
    var meta = d3.select("#sample-metadata");
    meta.html('')
    var samplemeta = data.metadata.find(sampleObj => sampleObj.id == sample);
    Object.entries(samplemeta).forEach(([key, value]) => {
      meta.append("h6").text(`${key}:${value}`);
    });
  });
}

function optionChanged(newSample) {
  // get new data each time a new sample is selected
  data_plot(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init()
