function d3waffle() {
  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      icon = "&#9632;",
      scale = 1,
      rows = 10,
      colorscale = d3.scale.category10(),
      appearancetimes = function(d, i){ return 0; },
      width = 1000,
      height = 200;
     
  function chart(selection) {
    
    selection.each(function(data) {

      /* updating data */
      data.forEach(function(d, i){
        data[i].class = slugify(d.name);
        data[i].scalevalue = Math.round(data[i].value*scale);
      });

      /* setting parameters and data */
      var idcontainer = selection[0][0].id; // I need to change thiz plz
      var total = d3.sum(data, function(d) { return d.value; });
      var totalscales = d3.sum(data, function(d){ return d.scalevalue; })

      var cols = Math.ceil(totalscales/rows);
      
      var griddata = cartesianprod(d3.range(cols), d3.range(rows));
      var detaildata = [];

      data.forEach(function(d){
        d3.range(d.scalevalue).forEach(function(e){
          detaildata.push({ name: d.name, class: d.class })
        });
      });

      detaildata.forEach(function(d, i){
        detaildata[i].col = griddata[i][0];
        detaildata[i].row = griddata[i][1];
      })
      
      var gridSize = Math.floor((height - margin.top - margin.bottom) / rows)

      /* setting the container */
      var svg = selection.append("svg")
            .attr("width", width + "px")
            .attr("height", height + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.style("cursor", "default");

      var nodes = svg.selectAll(".node")
            .data(detaildata)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + (d.col)*gridSize + "," + (rows - d.row)*gridSize  + ")"; });

      /* this is necesary, when the icons are small/thin activate mouseout */
      /*
      nodes.append("rect")
            .style("fill", "white")
            .attr('class', function(d){ return d.class; })
            .style("stroke", "white")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .transition()
            .duration(appearancetimes)
            .style("opacity", 1)
*/
      nodes.append("text")
            .style("opacity", 0)
            .html(icon)
            .attr('class', function(d){ return d.class; })
           /* .attr('font-family', 'FontAwesome')*/
            .attr("transform", function(d) { return "translate(" + gridSize/2 + "," + 5/6*gridSize  + ")"; })
            .style("text-anchor", "middle")
            .style('fill', function(d){ return colorscale(d.class); })
            .style("font-size", function(d) {
              val = 9;
              val2 = 2.55;
              textsize = Math.min(val2 * gridSize, (val2 * gridSize - val) / this.getComputedTextLength() * val);
              return textsize + "px";
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .transition()
            .duration(appearancetimes)
            .style("opacity", 1)

      function mouseover(d){
        d3.select("#" + idcontainer)
            .selectAll("rect, text")
            .style("opacity", 0.2);

        d3.select("#" + idcontainer).selectAll("." + d.class)
            .style("opacity", 1);
      }

      function mouseout(d){
        d3.select("#" + idcontainer)
            .selectAll("rect, text")
            .style("opacity", 1);
      }

    });
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.rows = function(_) {
    if (!arguments.length) return rows;
    rows = _;
    return chart;
  };

  chart.icon = function(_) {
    if (!arguments.length) return icon;
    icon = _;
    return chart;
  };

  chart.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return chart;
  };

  chart.colorscale = function(_) {
    if (!arguments.length) return colorscale;
    colorscale = _;
    return chart;
  };

chart.appearancetimes = function(_) {
    if (!arguments.length) return appearancetimes;
    appearancetimes = _;
    return chart;
  };

  return chart;

}

function slugify(text){

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .trim();                        // Trim - from end of text
}

/* http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript */
function cartesianprod(paramArray) {

  function addTo(curr, args) {

    var i, copy, 
        rest = args.slice(1),
        last = !rest.length,
        result = [];

    for (i = 0; i < args[0].length; i++) {

      copy = curr.slice();
      copy.push(args[0][i]);

      if (last) {
        result.push(copy);

      } else {
        result = result.concat(addTo(copy, rest));
      }
    }

    return result;
  }


  return addTo([], Array.prototype.slice.call(arguments));
}

/*http://stackoverflow.com/questions/12503146/create-an-array-with-same-element-repeated-multiple-times-in-javascript*/
function fillArray(value, len) {
  if (len == 0) return [];
  var a = [value];
  while (a.length * 2 <= len) a = a.concat(a);
  if (a.length < len) a = a.concat(a.slice(0, len - a.length));
  return a;
}