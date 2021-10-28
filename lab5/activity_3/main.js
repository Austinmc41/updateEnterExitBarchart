// Global function called when select element is changed

var letters = [];
var cutoff = document.getElementById('cutoff');
var main = document.getElementById('main');
d3.select(main)
        .append('p')
        .append('button')
        .style("border", "1px solid black")
        .text('Filter Data')
        .on('click', function() {
            // Add code here
            var select = d3.select('#categorySelect').node();
             // Get current value of select element
            var category = select.options[select.selectedIndex].value;
            updateChart(category, cutoff.value)

        });

function onCategoryChanged() {
    var select = d3.select('#categorySelect').node();
    // Get current value of select element
    var category = select.options[select.selectedIndex].value;
    // Update chart with the selected category of letters
    updateChart(category, 0);
}

// recall that when data is loaded into memory, numbers are loaded as strings
// this function helps convert numbers into string during data preprocessing
function dataPreprocessor(row) {
    return {
        letter: row.letter,
        frequency: +row.frequency
    };
}

var svg = d3.select('svg');

// Get layout parameters
var svgWidth = +svg.attr('width');
var svgHeight = +svg.attr('height');

var padding = {t: 60, r: 40, b: 30, l: 40};

// Compute chart dimensions
var chartWidth = svgWidth - padding.l - padding.r;
var chartHeight = svgHeight - padding.t - padding.b;
console.log(chartHeight)
// Compute the spacing for bar bands based on all 26 letters
var barBand = chartHeight / 26;
var barHeight = barBand * 0.7;

// Create a group element for appending chart elements
var chartG = svg.append('g')
    .attr('transform', 'translate('+[padding.l, padding.t]+')');

// A map with arrays for each category of letter sets
var lettersMap = {
    'all-letters': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    'only-consonants': 'BCDFGHJKLMNPQRSTVWXZ'.split(''),
    'only-vowels': 'AEIOUY'.split('')
};

var xScale;

d3.csv('letter_freq.csv', dataPreprocessor).then(function(dataset) {
    // Create global variables here and intialize the chart
    letters = dataset;


   

    // **** Your JavaScript code goes here ****
    // scale for mapping data to the width of svg chart 
    xScale = d3.scaleLinear().domain([0,12.702]).range([0, chartWidth]);

    chartG.append('text')
        .text("Letter Frequency %")
        .attr('transform', 'translate('+[(chartWidth / 2 -55), -35]+')');

    // creating bottom x axis
    var xAxis = d3.axisBottom(xScale).ticks(6).tickFormat(function(d){  
        return d + "%"});
    
    // creating top x axis 
    var xAxis2 = d3.axisTop(xScale).ticks(6).tickFormat(function(d){  
        return d + "%"});
    
    chartG.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + chartHeight + ')')
        .call(xAxis);
    
    chartG.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, ' + -5 + ')')
        .call(xAxis2);


    // Update the chart for all letters to initialize
    updateChart('all-letters', 0);

    
});


function updateChart(filterKey, cutOffValue) {




    // Create a filtered array of letters based on the filterKey
    var filteredLetters = letters.filter(function(d){
        return  lettersMap[filterKey].indexOf(d.letter) >= 0
        && d.frequency >= cutOffValue;
    });


    // var filteredLetters = letters.filter(function(d){
    //     return lettersMap[filterKey].indexOf(d.letter) >= 0;
    // });

    // **** Draw and Update your chart here ****
// **** Draw and Update your chart here ****
var letter = chartG.selectAll('.bar')
    .data(filteredLetters, function(d) {return d.letter});

    var letterEnter = letter.enter()
        .append('g')
        .attr('class', 'bar');
        
    
    
    letter.merge(letterEnter)
          .attr('transform', function(d, i) {
            return 'translate(0, ' + barBand  * i  + ')'});  
    
    
    var barRect = letterEnter
        .append('rect')
        .attr('height', barHeight)
        .attr('width', function(d) { 
            return xScale(d.frequency*100); });



    var barText = letterEnter
        .append('text')
        .text(function(d) {
            return d.letter;
        })
        .attr('x', -20)
        .attr('y', 12);
    
    letter.exit().remove();
               

}




// Remember code outside of the data callback function will run before the data loads