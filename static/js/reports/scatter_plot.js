/*  
  Uses the given container to draw a scatter plot with the given dataset.
  Draws scatter plot for admin's dashboard.
*/
function scatterPlot(container, control, dataset_scatterplot, title,
                     xaxis_label, yaxis_label, chart_width) {
 	//Width and height
	var margin = {top: 20, right: 20, bottom: 20, left: 50};
	var width = chart_width - margin.left - margin.right;
	var height = chart_width - margin.top - margin.bottom - 30;
	var scaleRange = 0.4;

	var color = d3.scale.ordinal()
                        .range(["rgb(17,163,194)","rgb(20,188,224)"]);
	
	//Create scale functions
    var xScale = d3.scale.ordinal()
	                .rangeRoundBands([0, width], .1);
    xScale.domain(dataset_scatterplot.map(function(d) { return d[0]; }));

	var yScale = d3.scale.linear()
			 			 .domain([0, d3.max(dataset_scatterplot,
                                        function(d) { return d[1]; })*1.2])
			 			 .range([height, margin.top*1.8]);
	
	var rScale = d3.scale.linear()
			 			 .domain([0, d3.max(dataset_scatterplot,
                                        function(d) { return d[1]; })])
			 			 .range([2, 5]);
	
	//Define X axis
    var xAxis = d3.svg.axis()
	    			  .scale(xScale)
	    			  .orient("bottom");
	
	//Define Y axis
	var yAxis = d3.svg.axis()
		  			  .scale(yScale)
		  			  .orient("left")
		  			  .ticks(5)
		  			  .tickFormat(d3.format("d"));
	
	//Create SVG element
	var svg_scatter = d3.select(container)
				        .append("svg")
				        .attr("width", width + margin.left + margin.right)
				        .attr("height", height + margin.top + margin.bottom)
				        .attr("transform", "translate(0 ," + margin.top + ")");
	
	//Trasition time			
	var duration_scatter = function(d, i) {
                            return 100+(d[1] * 750 /d3.max(dataset_scatterplot,
                                function(d) { return d[1]; })); };
	
	//Create bars   
	svg_scatter.selectAll(".bar")
               .data(dataset_scatterplot)
               .enter()
               .append("a")
               .attr("xlink:href", function(d) {return "/inventory"})
               .append("rect")
               .attr("class", "bar")
               .attr("x", function(d) {
                            return xScale(d[0])
                                +(xScale.rangeBand()*0.55);})
               .attr("width", ((width - margin.right) /
                                dataset_scatterplot.length) * scaleRange)
               .attr("y", height)
               .attr("height", 0)
               .transition()
               .attr("height", function(d) { return height - yScale(d[1]); })
               .attr("y", function(d) { return yScale(d[1]); })
               .duration(duration_scatter)
               .delay(750)
               .style("fill", function(d) { return color(d[0]); })
               .style("stroke","gray" )
               .style("stroke-width","0.3");
	   
	//Create scatter and disappear by default 
	svg_scatter.selectAll("circle")
               .data(dataset_scatterplot)
               .enter()
               .append("a")
               .attr("xlink:href", function(d) {return "/inventory"})
               .append("circle")
               .attr("cx", function(d) {
                            return xScale(d[0])+(xScale.rangeBand()*0.78);})
               .attr("cy", function(d) { return yScale(d[1]);})
               .attr("r", 0)
               .style("fill", function(d) { return color(d[0]); })
               .style("stroke","gray" )
               .style("stroke-width","0.3");
	
	//Create labels for scatter
	svg_scatter.selectAll("text")
               .data(dataset_scatterplot)
               .enter()
               .append("text")
               .attr("class","label_scatter")
               .text(function(d) {
                        if (d[1]!=0) {return d[1];} else {return null;}
               })
               .attr("x", function(d) {
                            return xScale(d[0])-3 +(xScale.rangeBand()*0.65);})
               .attr("y", function(d) { return yScale(d[1])+3; })
               .attr("fill", "black");
	
	//scatter disappear by default   	
	svg_scatter.selectAll("text.label_scatter")
	           .attr("display", "none");
	               
	//Create X axis
	svg_scatter.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate("+ margin.left +","+ height + ")")
               .call(xAxis)
               .append("text")
               .attr("x", width)// - margin.left*0.3)
               .attr("y", -6)
               .style("text-anchor", "end")
               .attr("display", "none");

	
	//Create Y axis
	svg_scatter.append("g")
               .attr("class", "axis")
               .attr("transform", "translate(" + margin.left + ",0)")
               .call(yAxis)
               .append("text")
               .attr("transform", "rotate(-90)")
               .style("text-anchor", "end")
               .attr("y", 10)
               .attr("x", -margin.top*1.8)
               .text(yaxis_label);
	   
	//Create Title   
	svg_scatter.append("text")
			   .attr("font-size", "16px")
               .attr("x", (width + margin.left + margin.right)/2)
               .attr("y", margin.top)
               .attr("text-anchor", "middle")
               .text(title);

    //Scatter
    d3.select(control).on("click", change);


    function change() {
	  
        var value = this.checked;

        if(value)  {
            svg_scatter.selectAll("rect")
                      .transition()
                      .attr("height", 0)
                      .duration(duration_scatter)
                      .delay(10);

            svg_scatter.selectAll("circle")
                      .transition()
                      .attr("r", function(d) {return rScale(d[1]*width*0.05);})
                      .duration(duration_scatter)
                      .delay(10);

            svg_scatter.selectAll("text.label_scatter")
                      .transition()
                      .attr("display", "inline")
                      .duration(10)
                      .delay(200);
            }
            else{
            svg_scatter.selectAll("circle")
                      .transition()
                      .attr("r", "0")
                      .duration(duration_scatter)
                      .delay(10);

            svg_scatter.selectAll("text.label_scatter")
                      .transition()
                      .attr("display", "none")
                      .duration(10)
                      .delay(200);

            svg_scatter.selectAll("rect")
                      .transition()
                      .attr("height", function(d) {
                                        return (height - yScale(d[1])); })
                      .duration(duration_scatter)
                      .delay(10);
        }

    }
} // end scatterPlot function
