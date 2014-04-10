/*  
  Uses the given container to draw a bar chart with the given dataset.
*/
function barChart(container, control, dataset_barchart, title, xaxis_label,
                  yaxis_label, chart_width) {
	//Set svg attribute
    var margin = {top: 20, right: 20, bottom: 50, left: 40},
    	width = chart_width - margin.left - margin.right,
    	height = chart_width - margin.top - margin.bottom - 32,
	    scaleXrange = 0.4;
	
	var x = d3.scale.ordinal()
	                .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
			 	    .domain([0, d3.max(dataset_barchart,
                                       function(d) { return d[1]; })*1.2])
			 	    .range([height, margin.top*1.8]);
	
	var xAxis = d3.svg.axis()
	    			  .scale(x)
	    			  .orient("bottom");
	
	var yAxis = d3.svg.axis()
	    			  .scale(y)
	    			  .orient("left")
                      .ticks(5)
		  			  .tickFormat(d3.format("d"));

	var svg_bar = d3.select(container)
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                          "translate(" + margin.left + "," + margin.top + ")");
			
	//Domain of x axis
    x.domain(dataset_barchart.map(function(d) { return d[0]; }));
	
	//Trasition time			
	var duration_bar = function(d, i) {
        return 100+(d[1] * 750 /d3.max(dataset_barchart,
                                       function(d) { return d[1]; }));
    };
	
	//Create bars
    svg_bar.selectAll(".bar")
           .data(dataset_barchart)
           .enter()
           .append("a")
           .attr("xlink:href", function(d) {return "/rental"})
           .append("rect")
           .attr("class", "bar")
           .attr("x", function(d) {
                        return x(d[0])+(x.rangeBand()*((1-scaleXrange)/2));})
           .attr("width", x.rangeBand()*scaleXrange)
           .attr("y", height)
           .attr("height", 0)
           .transition()
           .attr("height", function(d) { return (height - y(d[1])); })
           .attr("y", function(d) { return y(d[1]); })
           .duration(duration_bar)
           .delay(750)
           .style("stroke","gray" )
           .style("stroke-width","0.3");
	
	//Create X axis 
	svg_bar.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0," + height + ")")
           .call(xAxis)
           .selectAll("text")
           .attr("class","x text")
           .style("text-anchor", "end")
           .attr("transform", "translate(0,0) rotate(-30)")
           .attr("display", "none");
	
	//Create Y axis   
	svg_bar.append("g")
           .attr("class", "axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", 0.3*margin.left)
           .style("text-anchor", "end")
           .text(yaxis_label);
	   
	//Create Title   
	svg_bar.append("a")
           .attr("xlink:href", function(d) {return "/movie"})
           .append("text")
	       .attr("font-size", "16px")
           .attr("x", (width / 2))
           .attr("y", 0)
           .attr("text-anchor", "middle")
           .text(title);
           
    //Sort Value
    d3.select(control).on("click", change);


    var sortTimeout = setTimeout(function() {
                                    d3.select(control).
                                        property("checked", false).
                                        each(change);},
                                2000);

    function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(dataset_barchart.sort(this.checked
          ? function(a, b) { return b[1] - a[1]; }
          : function(a, b) { return d3.ascending(a[2], b[2]);})
          .map(function(d) { return d[0]; }))
          .copy();

        var transition = svg_bar.transition().duration(750),
          delay = function(d, i) { return i * 50; };

        transition.selectAll(".bar")
                  .delay(delay)
                  .attr("x", function(d) {
                                return x0(d[0])
                                    +(x.rangeBand()*((1-scaleXrange)/2)); });

        svg_bar.selectAll(".x.axis")
               .call(xAxis);

        svg_bar.selectAll(".x.axis")
               .selectAll("text")
               .style("text-anchor", "end")
               .transition()
               .delay(delay)
               .attr("display", "inline")
               .attr("transform", "translate(0,0) rotate(-30)");
    }

} // end barChart function
