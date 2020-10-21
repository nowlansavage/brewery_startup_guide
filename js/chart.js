d3.json("http://localhost:5000/Beer_Advocate").then(function(data){
    console.log(data);
});

d3.json("http://localhost:5000/Brewers_Association").then(function(data){
    console.log(data);
    dropDownMap(data);
   });

d3.json("http://localhost:5000/City_Pop_Brew_Count").then(function(data){
    console.log(data);

});

d3.json("http://localhost:5000/Rate_Beer").then(function(data){
    console.log(data);
    dropDownBeer(data);
});

//creat unique function to return only unique values of an array
Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
};

//create states drop down menu
function dropDownMap(sampleData){
	//change arrat of dict to be an array of states
	var states = sampleData.map(x=>x['state']);
	states.sort();
	//get nique values only
	var uniqueStates = states.unique();
	uniqueStates.forEach(name=>{
		var newItem = d3.select('#selDatasetMap').append('option');
		newItem.text(name);
		newItem.property('value', name)
	});
};
//create beer styles dropdown menu
function dropDownBeer(sampleData){
	//change array of dict to be array of beer styles
	var beer = sampleData.map(x=>x['Style']);
	//get unique values only
	var uniqueBeer = beer.unique();
	uniqueBeer.forEach(name=>{
		var newItem = d3.select('#selDatasetBeer').append('option');
		newItem.text(name);
		newItem.property('value', name)
	});
};

function optionChangedBeer(selected){
	makeChart(selected);
	//makeBeerTable(selected);
};

// function optionChangedMap(selected){
// 	makeMap(selected);
// 	makeMapTable(selected);
// };

// function makeBeerTable(sample){
// 	d3.json(file_path).then(function(data){
// 		var samples =data['metadata'];
// 		var selectedSamples =samples.filter(bug=>bug['id'] ==sample);
// 		var currentSample =selectedSamples[0];
// 		console.log(Object.entries(currentSample));
		
// 		//appends existing elements
// 		d3.select('#sample-metadata').selectAll('.panel-body')
// 			.data(Object.entries(currentSample))
// 			.text(function(d) {
// 				console.log(d);
// 				return `${d[0]}: ${d[1]}`
// 			});
// 		//creates new elements
// 		d3.select('#sample-metadata').selectAll('div')
// 			.data(Object.entries(currentSample))
// 			.enter()
// 			.append('div')
// 			.classed('panel-body', true)
// 			.text(function(d) {
// 				console.log(d);
// 				return `${d[0]}: ${d[1]}`
// 			});

//makes  abv cross plot
function makeChart(sample){
	d3.json("http://localhost:5000/Rate_Beer").then(function(data){
		var selectedSamples =data.filter(beer=>beer['Style'] ==sample);
		console.log(selectedSamples);
		//bubble map data by id
		// var currentSample =selectedSamples[0];
		//bubble map data
		var traceBeer={
			x: selectedSamples.map(x=>x['ABV']),
			y: selectedSamples.map(y=>y['SCORE']),
			text: selectedSamples.map(x=>x['NAME']),
			mode: 'markers',
			type: 'scatter'
		};
		var data =[traceBeer];
		var layout ={
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'}
			
		};
		Plotly.newPlot('abv-chart', data, layout);
	});
};

function makeChart_first(){
	d3.json("http://localhost:5000/Rate_Beer").then(function(data){
		
		//chart map data
		var traceBeer={
			x: data.map(x=>x['ABV']),
			y: data.map(y=>y['SCORE']),
			text: data.map(x=>x['NAME']),
			mode: 'markers',
			type: 'scatter'
		};
		var data =[traceBeer];
		var layout ={
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'}
			
		};
		Plotly.newPlot('abv-chart', data, layout);
	});
};
//make initial chart
makeChart_first();

//distribution of abv beers
function makeChart_distribution(){
	d3.json("http://localhost:5000/Rate_Beer").then(function(data){
		//chart map data
		var trace1={
			x: new ten = data.map(x=>x['ABV'] >=10),
			y: data.map(y=>y['SCORE']),
			text: data.map(x=>x['NAME']),
			mode: 'markers',
			type: 'scatter'
		};
		var data =[trace1];
		var layout ={
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'}
			
		};
		Plotly.newPlot('abv-chart-distribute', data, layout);
	});
};

