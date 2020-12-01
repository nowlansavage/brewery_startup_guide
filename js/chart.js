// Creates layer groups for Breweries and brewerys/capita
var Brewcapcity = new L.layerGroup();
var Breweries = new L.layerGroup();

// Creates background image for page using Multiple.js library
var multiple = new Multiple({
  selector: '.container',
  background: 'url(brewery.jpg)'
});

// On change to the DOM, call optionChangedMap()
d3.selectAll("#selDatasetMap").on("change", optionChangedMap);

function optionChangedMap(){
	Brewcapcity.clearLayers();
	Breweries.clearLayers();
	d3.json("https://brewery-guide.herokuapp.com/City_Pop_Brew_Count").then(function(data){

	  var dropdownMenu = d3.select("#selDatasetMap");
	  // Assign the value of the dropdown menu option to a variable
	  var chosen = dropdownMenu.property("value");
	  for(var i = 0; i<data.length; i++){
		// console.log(parseInt(data[i]['2019_pop'].replace(/,/g,"")));
		if (data[i]['latitude']&& data[i]['State_Abrv']==chosen){
		  createCircleMarker(data[i]).bindPopup("<h3>" + data[i]['cityState'] + "</h3>").addTo(Brewcapcity);
		}
	  };
   
	d3.json("https://brewery-guide.herokuapp.com/Brewers_Association").then(function(data){
		dropDownMap(data);
		
		  var dropdownMenu = d3.select("#selDatasetMap");
		  // Assign the value of the dropdown menu option to a variable
		  var chosen = dropdownMenu.property("value");
		  var symbol = L.icon({
			iconUrl:'beer_symbol.jpg',
			iconSize:     [5, 10], // size of the icon
			iconAnchor:   [2.5, 5],
			fillOpacity: 0.7
		  });
		  for(var i = 0; i<data.length; i++){
			if (data[i]['latitude'] && data[i]['state']==chosen){
			  L.marker([data[i]['latitude'],data[i]['longitue']], {icon: symbol})
			  .bindPopup("<h3>" + data[i]['name'] + "</h3>").addTo(Breweries);
			}
		  };
		})
  
  });
  
  };
  

d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
    // console.log(data);
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
		if (name!="AA"){
		var newItem = d3.select('#selDatasetMap').append('option');
		newItem.text(name);
		newItem.property('value', name)
		}
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
	makeTable(selected);
};

//updates the table with beer stats
function makeTable(sample){
	d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
		var selectedSamples =data.filter(beer=>beer['Style'] ==sample);
		var beerScores = selectedSamples.map(x=>x['SCORE']);
		var beerABV = selectedSamples.map(x=>x['ABV']);
		var beerChar = new Object();
		beerChar['Min Rating: '] = Number.parseFloat(Math.min(...beerScores)).toFixed(2);
		beerChar['Max Rating: '] = Number.parseFloat(Math.max(...beerScores)).toFixed(2);
		beerChar['Average Rating: '] = Number.parseFloat(beerScores.reduce((a,b) => a + b, 0) / beerScores.length).toFixed(2);
		beerChar['Min ABV: '] = Number.parseFloat((Math.min(...beerABV))*100).toFixed(2);
		beerChar['Max ABV: '] = Number.parseFloat((Math.max(...beerABV))*100).toFixed(2);
		beerChar['Average ABV: '] = Number.parseFloat((beerABV.reduce((a,b) => a + b, 0) / beerABV.length)*100).toFixed(2);
		//appends existing elements
		d3.select('#sample-metadata-beer').selectAll('.panel-body')
			.data(Object.entries(beerChar))
			.text(d=>d);
		//creates new elements
		d3.select('#sample-metadata-beer').selectAll('div')
			.data(Object.entries(beerChar))
			.enter()
			.append('div')
			.classed('panel-body', true)
			.text(d=>d);	
	});
};

//makes  abv cross plot
function makeChart(sample){
	d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
		var selectedSamples =data.filter(beer=>beer['Style'] ==sample);
		var beerx = selectedSamples.map(x=>(x['ABV']*100));
		//beer data
		var traceBeer={
			x: beerx,
			y: selectedSamples.map(y=>y['SCORE']),
			text: selectedSamples.map(x=>x['NAME']),
			mode: 'markers',
			type: 'scatter'
		};
		var data =[traceBeer];
		var layout ={
			title: {text: 'Beer Rating VS ABV'},
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'}
			
		};
		Plotly.newPlot('abv-chart', data, layout);
	});
};

// Makes abv crossplot of all data
function makeChart_first(){
	d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
		
		//chart map data
		var traceBeer={
			x: data.map(x=>(x['ABV']*100)),
			y: data.map(y=>y['SCORE']),
			text: data.map(x=>x['NAME']),
			mode: 'markers',
			type: 'scatter',
			trendline: "ols"
		};
		var data =[traceBeer];
		var layout ={
			xaxis: { title: "ABV" },
			yaxis: { title: 'Beer Rating'},
			title: {text: 'Beer Rating VS ABV'}
		};
		Plotly.newPlot('abv-chart', data, layout);
	});
};
//include all data as default table
function makeTableFirst(){
	d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
		var beerScores = data.map(x=>x['SCORE']);
		var beerABV = data.map(x=>x['ABV']);
		var beerChar = new Object();
		beerChar['Min Rating: '] = Number.parseFloat(Math.min(...beerScores)).toFixed(2);
		beerChar['Max Rating: '] = Number.parseFloat(Math.max(...beerScores)).toFixed(2);
		beerChar['Average Rating: '] = Number.parseFloat(beerScores.reduce((a,b) => a + b, 0) / beerScores.length).toFixed(2);
		beerChar['Min ABV: '] = Number.parseFloat((Math.min(...beerABV))*100).toFixed(2);
		beerChar['Max ABV: '] = Number.parseFloat((Math.max(...beerABV))*100).toFixed(2);
		beerChar['Average ABV: '] = Number.parseFloat((beerABV.reduce((a,b) => a + b, 0) / beerABV.length)*100).toFixed(2);
		//creates new elements
		d3.select('#sample-metadata-beer').selectAll('div')
			.data(Object.entries(beerChar))
			.enter()
			.append('div')
			.classed('panel-body', true)
			.text(d=>d);	
	});
};
//make initial chart and table
makeChart_first();
makeTableFirst();

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
  })

// create darkmap tile layer
var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "dark-v10",
accessToken: API_KEY
});

// Create dictionary to be used in control
var overlayMaps = {
  "Breweries/Capita": Brewcapcity,
  "Breweries":Breweries
};

var baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
};
  // Create map and add all layers with control
  var myMap = L.map("mapid", {
    center: [39.8333,-98.583333],
    zoom: 4,
    layers: [streetmap, Brewcapcity, Breweries]
  });
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);


    
    // Set up the legend
var legend = L.control({ position: "bottomright" });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'info legend');
      div.innerHTML +=
        "<li><img src=" + "beer_symbol.jpg" + " style='height:25px;width:15px'></li>" +"Breweries<ul>";
      div.innerHTML += 
        "<li><img src=" + "circle.png" + " style='height:25px;width:25px'></li>" +"Breweries/Capita<ul>";

        // }
return div;
  }

  legend.addTo(myMap);



  // function to create circles that are sized and colored
function createCircleMarker( feature ){
    // Change the values of these options to change the symbol's appearance
    var options = {
      radius: feature['breweryCount']/parseInt(feature['2019_pop'].replace(/,/g,""))*10000*10+4,
      fillColor: getColor(feature['breweryCount']/parseInt(feature['2019_pop'].replace(/,/g,""))*10000),
      color: "black",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.7
    }
    var latlng = [feature['latitude'],feature['longitue']];
    
    return L.circleMarker(latlng, options );
   
    
  }

    // function that assigns color
function getColor(d) {
    return d > 1 ? '#800026' :
           d > .8  ? '#BD0026' :
           d > .6  ? '#E31A1C' :
           d > .2  ? '#FC4E2A' :
           d > .1   ? '#FD8D3C' :
           d > .05   ? '#FEB24C' :
                        '#FFEDA0';
  
  }
  optionChangedMap();

  //distribution of abv beers
function makeChart_distribution(){
	d3.json("https://brewery-guide.herokuapp.com/Rate_Beer").then(function(data){
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

// make chart with machine learning data
function makeMLChart(){
	Promise.all([
		d3.json("https://brewery-guide.herokuapp.com/Model_Train"),
		d3.json("https://brewery-guide.herokuapp.com/Model_Test")
	])
	.then(function(train){
		//training data
		var train_x = train[0].map((x)=>x['actual']);
		var train_y = train[0].map((x)=>x['predicted']);
		
		// testing data
		var test_x = train[1].map(x=>x['actual']);
		var test_y = train[1].map(x=>x['predicted']);
		var TrainData={
			x: train_x,
			y: train_y,
			mode: 'markers',
			type: 'scatter',
			name: 'Train Data'
		};
		var TestData={
			x: test_x,
			y: test_y,
			mode: 'markers',
			type: 'scatter',
			name: 'Test Data'
		};
		var dataML =[TrainData, TestData];
		var layoutML ={
			title: { text: "Machine Learning: IPA Reviews"},
			xaxis: { title: "Actual Rating" },
			yaxis: { title: 'Predicted Rating'}
		};
		Plotly.newPlot('machine-learning-chart', dataML, layoutML);
	});
};
makeMLChart();

function makeKeywordTable(){
	d3.json("https://brewery-guide.herokuapp.com/Model_Words").then(function(data){
		var filterData= data.filter(x=>x['index'] <= 20);
		d3.select("tbody")
		  .selectAll("tr")
		  .data(filterData)
		  .enter()
		  .append("tr")
		  .html(function(d) {
		    return `<td>${d.word}</td><td>${d.importance}</td>`;
		  });
	});
};

makeKeywordTable();