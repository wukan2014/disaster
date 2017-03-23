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
    $.ajax({
        url: "floods-2017_zh.json",
        //force to handle it as text
        dataType: "text",
        success: function(data) {
            
            //data downloaded so we call parseJSON function 
            //and pass downloaded data
            var json = $.parseJSON(data);
          
            //now json variable contains data in json format
            for (var i = 0; i < json.length; i++) {
                var div_id = "donut" + i;
                var div_id_donut = "#" + div_id;
                $('.side_bar_wrap').append('<div class="item"><h3>Where</h3>' + json[i].where + '<br><h3>When</h3> ' + json[i].when + '<br><h3>Term Frequency</h3><div id="'+ div_id+'" data-counts="' + json[i].counts + '"></div><br /><h3>What</h3> ' + json[i].what + '<br><h3>Source</h3><a href="' + json[i].url + '">See article</a></div>');
                
                var svg = d3.select(div_id_donut).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                createDonut(json[i].counts,svg);
            }
        }
    });
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

		createDonut(csv,svg);
    }
}

function type(d) {
  d.count = +d.count;
  return d;
}
