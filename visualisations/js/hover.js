//This code was adapted from: https://bl.ocks.org/mbostock/3887193
//Adapted on 23/03/2017
//Original code released under the GNU General Public License, version 3.
//https://opensource.org/licenses/GPL-3.0

var width = 200,
height = 200,
radius = Math.min(width, height) / 2;
var zh_map = "地图";
var zh_vis = "可视化";
var en_map = "Map";
var en_vis = "Visualisation";
var en_title = "Disaster Mapper| Floods";
var zh_title = "灾地图 | 洪水";

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
        url: "floods-2017.json",
        //force to handle it as text
        dataType: "text",
        success: function(data) {
            
            //data downloaded so we call parseJSON function 
            //and pass downloaded data
            var json = $.parseJSON(data);
          
            //now json variable contains data in json format
            for (var i = 0; i < json.length; i++) {
                var div_id = "donut" + i;
                var div_id_donut = "#side_bar_en #" + div_id;
                $('#side_bar_en').append('<div class="item"><h3>Where</h3>' + json[i].where + '<br><h3>When</h3> ' + json[i].when + '<br><h3>Term Frequency</h3><div id="'+ div_id+'" data-counts="' + json[i].counts + '"></div><br /><h3>What</h3> ' + json[i].what + '<br><h3>Source</h3><a href="' + json[i].url + '">See article</a></div>');
                
                var svg = d3.select(div_id_donut).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                createDonut(json[i].counts,svg);
            }
        }
    });

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
                var div_id_donut = "#side_bar_zh #" + div_id;
                $('#side_bar_zh').append('<div class="item"><h3>Where</h3>' + json[i].where + '<br><h3>When</h3> ' + json[i].when + '<br><h3>Term Frequency</h3><div id="'+ div_id+'" data-counts="' + json[i].counts + '"></div><br /><h3>What</h3> ' + json[i].what + '<br><h3>Source</h3><a href="' + json[i].url + '">See article</a></div>');
                
                var svg = d3.select(div_id_donut).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
                createDonut(json[i].counts,svg);
            }
        }
    });

    $('.visualisation').click(function(){
      $(this).addClass('selected');
      $('.map').removeClass('selected');
      $('.iframe-map').hide();
      if($('#en_lang').hasClass('selected')){
         showEnglishChord();
      }else{
        showChineseChord();
      }
    });

    $('.map').click(function(){
      $(this).addClass('selected');
      $('.visualisation').removeClass('selected');
      $('.chord').hide();
      if($('#en_lang').hasClass('selected')){
        showEnglishMap();
      }else{
        showChineseMap();
      }
    });

    $('#en_lang').click(function(){
      changeTabsEnglish();
      $(this).addClass('selected');
      $('#zh_lang').removeClass('selected');
      showEnglishSidebar();
      if($('.map').hasClass('selected')){
        showEnglishMap();
      }
      else{
        showEnglishChord();
      }
    });

    $('#zh_lang').click(function(){
      changeTabsChinese();
      $(this).addClass('selected');
      $('#en_lang').removeClass('selected');
      showChineseSidebar();
      if($('.map').hasClass('selected')){
        showChineseMap();
      }
      else{
        showChineseChord();
      }
    });


});

function showEnglishMap(){
  $('#iframe-en').show();
  $('#iframe-zh').hide();
}

function showChineseMap(){
  $('#iframe-zh').show();
  $('#iframe-en').hide();
}

function showEnglishChord(){
  $("#en_chord").children().remove();
  createEnglishChord("#en_chord");
  $('#zh_chord').hide();
  $('#en_chord').show();
}

function showChineseChord(){
  $("#zh_chord").children().remove();
  createChineseChord("#zh_chord");
  $('#en_chord').hide();
  $('#zh_chord').show();
}

function showEnglishSidebar(){
  $('#side_bar_en').show();
  $('#side_bar_zh').hide();
}

function showChineseSidebar(){
  $('#side_bar_zh').show();
  $('#side_bar_en').hide();
}

function changeTabsEnglish(){
   $('.map').text(en_map);
   $('.visualisation').text(en_vis);
   $('.title').text(en_title);
}

function changeTabsChinese(){
   $('.map').text(zh_map);
   $('.visualisation').text(zh_vis);
   $('.title').text(zh_title);
}


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

//This code was adapted from: http://www.delimited.io/blog/2013/12/8/chord-diagrams-in-d3
//Original code can be found here: https://gist.github.com/sghall/7859113
//Adapted on 23/03/2017

//*******************************************************************
//  CREATE MATRIX AND MAP
//*******************************************************************

function createEnglishChord(location){
    d3.csv('../data/matrix.csv', function (error, data) {
    console.log(data);
    var en_mpr = chordMpr(data);

    en_mpr
      .addValuesToMap('term1')
      .setFilter(function (row, a, b) {
        return (row.term1 === a.name && row.term2 === b.name)
      })
      .setAccessor(function (recs, a, b) {
        if (!recs[0]) return 0;
        return +recs[0].count;
      });
    drawChords(en_mpr.getMatrix(), en_mpr.getMap(),location,1.6,220);
  });
}

function createChineseChord(location){
    d3.csv('../data/chinese_matrix.csv', function (error, data) {
    console.log(data);
    var zh_mpr = chordMpr(data);

    zh_mpr
      .addValuesToMap('term1')
      .setFilter(function (row, a, b) {
        return (row.term1 === a.name && row.term2 === b.name)
      })
      .setAccessor(function (recs, a, b) {
        if (!recs[0]) return 0;
        return +recs[0].count;
      });
    drawChords(zh_mpr.getMatrix(), zh_mpr.getMap(),location,1.8,220);
  });
}


//*******************************************************************
//  DRAW THE CHORD DIAGRAM
//*******************************************************************
function drawChords (matrix, mmap,location,x,y) {
  var w = 730, h = 730, r1 = h / x, r0 = r1 - y;

  var fill = d3.scale.ordinal()
      .domain(d3.range(8))
      .range(["#396187", 
              "#7A3188",
              "#7A3188", 
              "#cb5e93", 
              "#4BBA95",
              "#286b55",
              "#c95f18"]); 

  var chord = d3.layout.chord()
      .padding(.02)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);

  var arc = d3.svg.arc()
      .innerRadius(r0)
      .outerRadius(r0 + 20);

  var svg = d3.select(location).append("svg:svg")
      .attr("width", w)
      .attr("height", h)
    .append("svg:g")
      .attr("id", "circle")
      .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");

      svg.append("circle")
          .attr("r", r0 + 20);

  var rdr = chordRdr(matrix, mmap);
  chord.matrix(matrix);

  var g = svg.selectAll("g.group")
      .data(chord.groups())
    .enter().append("svg:g")
      .attr("class", "group")
      .on("mouseover", mouseover)
      .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

  g.append("svg:path")
      .style("stroke", "black")
      .style("fill", function(d) { return fill(d.index); })
      .attr("d", arc);

  g.append("svg:text")
      .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", ".35em")
      .style("font-family", "helvetica, arial, sans-serif")
      .style("font-size", "10px")
      .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
      .attr("transform", function(d) {
        return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
            + "translate(" + (r0 + 26) + ")"
            + (d.angle > Math.PI ? "rotate(180)" : "");
      })
      .text(function(d) { return rdr(d).gname; });

    var chordPaths = svg.selectAll("path.chord")
          .data(chord.chords())
        .enter().append("svg:path")
          .attr("class", "chord")
          .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
          .style("fill", function(d) { return fill(d.target.index); })
          .attr("d", d3.svg.chord().radius(r0))
          .on("mouseover", function (d) {
            d3.select("#tooltip")
              .style("visibility", "visible")
              .html(chordTip(rdr(d)))
              .style("top", function () { return (d3.event.pageY - 100)+"px"})
              .style("left", function () { return (d3.event.pageX - 100)+"px";})
          })
          .on("mouseout", function (d) { d3.select("#tooltip").style("visibility", "hidden") });

    function chordTip (d) {
      var p = d3.format(".2%"), q = d3.format(",.3r")
      return "Chord Info:<br/>"
        + p(d.svalue/d.stotal) + " (" + q(d.svalue) + ") of the "
        + d.sname + " term co-occurs with  " + d.tname
        + (d.sname === d.tname ? "": ("<br/>while...<br/>"
        + p(d.tvalue/d.ttotal) + " (" + q(d.tvalue) + ") of the "
        + d.tname + " term co-occurs with " + d.sname))
    }

    function groupTip (d) {
      var p = d3.format(".1%"), q = d3.format(",.3r")
      return "Group Info:<br/>"
          + d.gname + " : " + q(d.gvalue) + "<br/>"
          + p(d.gvalue/d.mtotal) + " of Matrix Total (" + q(d.mtotal) + ")"
    }

    function mouseover(d, i) {
      d3.select("#tooltip")
        .style("visibility", "visible")
        .html(groupTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY - 80)+"px"})
        .style("left", function () { return (d3.event.pageX - 130)+"px";})

      chordPaths.classed("fade", function(p) {
        return p.source.index != i
            && p.target.index != i;
      });
    }
}
