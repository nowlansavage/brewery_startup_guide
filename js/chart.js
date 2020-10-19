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

//makes bubble map
function makeChart(sample){
	d3.json("http://localhost:5000/Rate_Beer").then(function(data){
		var selectedSamples =data.filter(beer=>beer['Style'] ==sample);
		//bubble map data by id
		// var currentSample =selectedSamples[0];
		//bubble map data
		var traceBeer={
			x: currentSample.map(x=>x['ABV']),
			y: currentSample.map(y=>y['SCORE']),
			text: currentSample.map(x=>x['NAME']),
		};
		var data =[traceBeer];
		var layout ={
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'}
			
		};
		Plotly.newPlot('abv-chart', data, layout);
	});
};