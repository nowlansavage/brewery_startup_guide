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

function dropDownMap(sampleData){
	sampleData.forEach(name=>{
		var states = name['state']
		var newItem = d3.select('#selDatasetMap').append('option');
		newItem.text(states);
		newItem.property('value', states)
	});
};

function dropDownBeer(sampleData){
	sampleData.forEach(name=>{
		var beer= name['Style']
		var newItem = d3.select('#selDatasetBeer').append('option');
		newItem.text(beer);
		newItem.property('value', beer)
	});
};