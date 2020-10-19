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