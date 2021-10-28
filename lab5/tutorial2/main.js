// **** Copy and paste the code from the wiki here ****
var letter = d3.select('svg').selectAll('.letter').data(['A', 'B', 'C']);
// select all svg elements with a classname of letter in the SVG


var letterEnter = letter.enter()
        .append('g')
        .attr('class', 'letter')
        .attr('transform', function(d,i) {
            return 'translate('+[i * 30 + 50, 50]+')';
        });

letterEnter.append('circle')
        .attr('r', 10);

        letterEnter.append('text')
        .attr('y', 30)
        .text(function(d) {
            return d;
        });
