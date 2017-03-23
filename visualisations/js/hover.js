//This code was adapted from: https://bl.ocks.org/mbostock/3887193
//Adapted on 23/03/2017
//Original code released under the GNU General Public License, version 3.
//https://opensource.org/licenses/GPL-3.0

var width = 200,
height = 200,
radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
	.range(["#396187", 
              "#7A3188",
              "#7A3188", 
              "#cb5e93", 
              "#4BBA95",
              "#286b55",
              "#c95f18"]); 

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 50);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.count; });


$(document).ready(function() {
    createDonuts();
});

function createDonut(csv,svg){
	data = d3.csv.parse(csv);

	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .html(function(d) { return d.data.term + " : " + d.data.count; })
	  .direction('s')

	svg.call(tip);

	var g = svg.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class", "arc")
		.attr("d", arc)
	    .on('mouseover',tip.show)
	    .on('mouseout', tip.hide);

  	g.append("path")
		.attr("d", arc)
		.style("fill", function(d) { return color(d.data.term); });

  	g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.count; });
}

function createDonuts(){
	for(var i = 0; i < $('.donut').size(); i++){
    	csv = $($('.donut')[i]).data('counts');

		var svg = d3.select($('.donut')[i]).append("svg")
		    .attr("width", width)
		    .attr("height", height)
		  	.append("g")
		    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

		createDonut(csv,svg)
    }
}

function type(d) {
  d.count = +d.count;
  return d;
}
