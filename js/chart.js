d3.json("http://localhost:5000/Beer_Advocate").then(function(data){
    console.log(data);
});

d3.json("http://localhost:5000/Brewers_Association").then(function(data){
    console.log(data);
});

d3.json("http://localhost:5000/City_Pop_Brew_Count").then(function(data){
    console.log(data);
});

d3.json("http://localhost:5000/Rate_Beer").then(function(data){
    console.log(data);
});