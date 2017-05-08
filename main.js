//Based on:
//https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
//http://bl.ocks.org/weiglemc/6185069


var nodes = [];
//Load the data
d3.csv("iris.csv", function(d) {
  return {
    xVal : +d["Sepal.Length"],
    yVal: +d["Sepal.Width"],
    data1: +d["Petal.Length"],
    data2: +d["Petal.Width"],
    type : d.Species
    
    
  };
}, function(data) {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// set the canvas
var svg = d3.select("body").append("svg")
    .attr("width", width + 200 + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 10)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//X-axis
var x = d3.scaleLinear().range([10, (width-10)])
                .domain([
                        d3.min(data,function (d) { return d.xVal; }),
                        d3.max(data,function (d) { return d.xVal; })
                        ]),
    xMap = function(d) { return x(d.xVal);};      
// gridlines in x axis function
function xAxis() {		
    return d3.axisBottom(x)
        //.ticks(10)
        
}

  // add the X gridlines
  svg.append("g")			
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis()
          .tickSize(-height)
          .tickFormat("")
      );
      

// add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + (height + 5) + ")")
      .call(d3.axisBottom(x)
            .ticks(10,",")
      );
     
    
 // text label for the x axis
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + margin.top + 15) + ")")
      .style("text-anchor", "middle")
      .text("X-axis");
      
      
//Y-axis
var y = d3.scaleLog().range([height, 0])
        .domain([
                d3.min(data,function (d) { return d.yVal; }),
                d3.max(data,function (d) { return d.yVal; })
                        ]),
    
    yMap = function(d) { return y(d.yVal);}    

// gridlines in y axis function
function yAxis() {		
    return d3.axisLeft(y)
        //.ticks(10,",")
}

// add the Y gridlines
  svg.append("g")			
      .attr("class", "grid")
      .call(yAxis()
          .tickSize(-width)
          .tickFormat("")
      )

// add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y)
            .ticks(10,",")
      );
      
      
//label for y axis

svg.append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", -80)
      .attr("x",-height/2)
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Y-axis");  
      
      
// setup fill color
var cValue = function(d) { return d.type;},
    color = d3.scaleOrdinal(d3.schemeCategory20);
    
// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var legendText = d3.select("body").append("div")
                .attr("class","legendTitle")
                .style("left", (width + 114 + "px"))
                .style("top", (40 + "px"))
                .html("Types (click to show/hide)");


// draw dots


//function init(){
  
      // draw legend
  var types = d3.map(data, function(d){return d.type;}).keys()
  


  var legend = svg.selectAll(".legend")
    .data(types)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(0," + (40+i * 23) +")"; })
    .on("click", function (e) {
        updateNodes(e);
        //d3.select(this).style("opacity", 0.8);
    });
  
  // draw legend colored rectangles
  legend.append("rect")
      .attr("x", width+2)
      .attr("width", 17)
      .attr("height", 17)
      .style("fill", color)
      .style("cursor","pointer");

  // draw legend text
  legend.append("text")
      .attr("x", width + 30)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("cursor","pointer")      
      .text(function(d) { return d;});
     
    
//}
  
function updateNodes(type){  
  console.log(type);
  var extracted = nodes.filter(function(d) {return d.type!=type;});
  
  
  if(extracted.length != nodes.length){
    nodes = extracted;  
  }else{  
        var toAdd = data.filter(function(d) { return d.type==type;});  
      toAdd.forEach(function(d){
      nodes.push(d)
        });        
         //console.log(toAdd);
  }
  
  var dots = svg.selectAll(".dot").data(nodes);
  dots.exit().remove();
  
  dots = dots
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));})
        .merge(dots)
        
        
        dots.on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html(d.data1 + "<br\>"+ d.data2 + "<br\>"+ d.type)
               .style("left", (xMap(d) + 120) + "px")
               .style("top", (yMap(d)) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0);
    });
}    
}); 
