const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/",function(req,res){
    var city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=USER API KEY HERE`;
    https.get(url,function(resource){
        resource.on('data',function(data){
            const WeatherData = JSON.parse(data);
            const temp = (WeatherData.main.temp - 273.15).toFixed(0);
            const description = (WeatherData.weather[0].description).toUpperCase();
            const icon = WeatherData && WeatherData.weather && WeatherData.weather[0] && WeatherData.weather[0].icon;
            const imageurl = icon
              ? `https://openweathermap.org/img/wn/${icon}@2x.png`
              : 'https://example.com/default-weather-icon.png'; // You can replace this with a default icon URL.
            city = city.toUpperCase();
            const outputText = `
                <div style="text-align: center; font-size: 24px;">
                  THE WEATHER OF ${city} IS CURRENTLY <span style="color: #007BFF;">${temp} DEGREE CELSIUS</span>
                </div>
                <div style="text-align: center; font-size: 20px; margin-top: 10px;">
                  THE WEATHER IS CURRENTLY ${description}
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <img src="${imageurl}" style="max-width: 300px; border-radius: 8px;" alt="Weather Icon">
                </div>
                <div style="text-align: center; margin-top: 20px;">
                  <a href="/" style="text-decoration: none; background-color: #007BFF; color: #fff; padding: 10px 20px; border-radius: 5px;">Go Back</a>
                </div>
              `;
            res.write(outputText);
            res.send();
        })
    })
})

app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})