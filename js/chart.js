
d3.json("http://localhost:5000/Brewers_Association").then(function(data){
    console.log(data);
    dropDownMap(data);
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
			title: {text: 'Beer Rating vs ABV'},
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
		var filter10=data.filter(x=>(x['ABV']*100)>=10).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x10 = filter10.map(x=>x['SCORE']);
		var y10 = x10.map((x,index)=>(index+1)/x10.length);
		//9-10 ABV
		var filter9=data.filter(x=>(x['ABV']*100)>=9 && (x['ABV']*100)<10).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x9 = filter9.map(x=>x['SCORE']);
		var y9 = x9.map((x,index)=>(index+1)/x9.length);
		//8-9 ABV
		var filter8=data.filter(x=>(x['ABV']*100)>=8 && (x['ABV']*100)<9).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x8 = filter8.map(x=>x['SCORE']);
		var y8 = x8.map((x,index)=>(index+1)/x8.length);
		// 7-8 ABV
		var filter7=data.filter(x=>(x['ABV']*100)>=7 && (x['ABV']*100)<8).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x7 = filter7.map(x=>x['SCORE']);
		var y7 = x7.map((x,index)=>(index+1)/x7.length);
		//6-7 ABV
		var filter6=data.filter(x=>(x['ABV']*100)>=6 && (x['ABV']*100)<7).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x6 = filter6.map(x=>x['SCORE']);
		var y6 = x6.map((x,index)=>(index+1)/x6.length);
		//5-6 ABV
		var filter5=data.filter(x=>(x['ABV']*100)>=5 && (x['ABV']*100)<6).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x5 = filter5.map(x=>x['SCORE']);
		var y5 = x5.map((x,index)=>(index+1)/x5.length);
		//4-5 ABV
		var filter4=data.filter(x=>(x['ABV']*100)>=4 && (x['ABV']*100)<5).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x4 = filter4.map(x=>x['SCORE']);
		var y4 = x4.map((x,index)=>(index+1)/x4.length);
		//3-4
		var filter3=data.filter(x=>(x['ABV']*100)>=3 && (x['ABV']*100)<4).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x3 = filter3.map(x=>x['SCORE']);
		var y3 = x3.map((x,index)=>(index+1)/x3.length);
		//under 3
		var filter2=data.filter(x=>(x['ABV']*100)<3).sort((a,b)=> (a.ABV > b.ABV) ? 1 : -1).sort((a,b)=> (a.SCORE > b.SCORE) ? 1 : -1);
		var x2 = filter2.map(x=>x['SCORE']);
		var y2 = x2.map((x,index)=>(index+1)/x2.length);

		//chart map data
		var ABV10={
			x: x10,
			y: y10,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 10%+'
		};

		var ABV9={
			x: x9,
			y: y9,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 9-10%'
		};
		var ABV8={
			x: x8,
			y: y8,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 8-9%'
		};

		var ABV7={
			x: x7,
			y: y7,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 7-8%'
		};

		var ABV6={
			x: x6,
			y: y6,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 6-7%'
		};
		var ABV5={
			x: x5,
			y: y5,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 5-6%'
		};
		var ABV4={
			x: x4,
			y: y4,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 4-5%'
		};
		var ABV3={
			x: x3,
			y: y3,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV 3-4%'
		};
		var ABV2={
			x: x2,
			y: y2,
			mode: 'markers',
			type: 'scatter',
			name: 'ABV <3%'
		};
		var data =[ABV10, ABV9, ABV8, ABV7, ABV6, ABV5, ABV4, ABV3, ABV2];
		var layout ={
			title: { text: "Distribution of Beer Ratings as a Function of ABV"},
			xaxis: { title: "Rating" },
			yaxis: { title: 'Distribution'}
			
		};
		Plotly.newPlot('abv-chart-distribute', data, layout);
	});
};

makeChart_distribution();

