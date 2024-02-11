// URL 
const jsonURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// create dropdown container
const dropdown = d3.select("#selDataset");
const chartContainer = d3.select("#bar"); 

// fetch the URL
d3.json(jsonURL).then(function(data) {

    // populate the dropdown menu with sample names
    const sampleNames = data.names;
    sampleNames.forEach((sample) => {
        dropdown
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    const initialSample = sampleNames[0];
    buildChart(initialSample);
});

function buildChart(sampleID) {
    d3.json(jsonURL).then(function(data) {

        // filter the data by array of ids
        const selectedSample = data.samples.find((sample) => sample.id === sampleID);

        // bar chart
        const barTrace = {
            type: "bar",
            orientation: "h", //horizontal
            x: selectedSample.sample_values.slice(0, 10).reverse(),
            y: selectedSample.otu_ids.slice(0, 10).reverse().map((id) => `OTU ${id}`),
            text: selectedSample.otu_labels.slice(0, 10).reverse()
        };

        const barLayout = {
            title: `Top 10 OTUs for Sample ${sampleID}`,
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" },
        };

        // bubble chart
        const bubbleTrace = {
            type: "scatter",
            mode: "markers",
            x: selectedSample.otu_ids,
            y: selectedSample.sample_values,
            marker: {
                size: selectedSample.sample_values,
                color: selectedSample.otu_ids,
                colorscale: "Earth"
            },
            text: selectedSample.otu_labels
        };

        const bubbleLayout = {
            title: `OTU Bubble Chart for Sample ${sampleID}`,
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Sample Values" }
        };

        const barData = [barTrace];
        const bubbleData = [bubbleTrace];

        // clear charts and create new ones when user changes dropdown
        chartContainer.html("");
        Plotly.newPlot("bar", barData, barLayout);
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

        // weekly washing frequency
        const selectedMetadata = data.metadata.find((metadata) => metadata.id === parseInt(sampleID)); //finds the selected ID in the metadata and parses it
        const weeklyWashingFrequency = selectedMetadata.wfreq;


        const gaugeData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: weeklyWashingFrequency,
                title: { text: "Weekly Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] },
                    steps: [
                        { range: [0, 1], color: "rgba(255,0,0,0.2)" },
                        { range: [1, 2], color: "rgba(255,50,0,0.2)" },
                        { range: [2, 3], color: "rgba(255,100,0,0.2)" },
                        { range: [3, 4], color: "rgba(255,150,0,0.2)" },
                        { range: [4, 5], color: "rgba(255,200,0,0.2)" },
                        { range: [5, 6], color: "rgba(255,255,0,0.2)" },
                        { range: [6, 7], color: "rgba(200,255,0,0.2)" },
                        { range: [7, 8], color: "rgba(150,255,0,0.2)" },
                        { range: [8, 9], color: "rgba(100,255,0,0.2)" }
                    ],
                    threshold: {
                        line: { color: "red", width: 4 },
                        thickness: 0.75,
                        value: weeklyWashingFrequency
                    }
                }
            }
        ];

        const gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };

        // clear existing chart and create a new one
        Plotly.newPlot("gauge", gaugeData, gaugeLayout);

        // display metadata
        const metadataContainer = d3.select("#sample-metadata");
        metadataContainer.html(""); // clear previous metadata

        // display each pair from the metadata
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataContainer.append("p").text(`${key}: ${value}`);


        });
    });
}

// drop down function 
dropdown.on("change", function() {
    const selectedSampleID = d3.select("#selDataset").property("value");
    buildChart(selectedSampleID);
});

init();

