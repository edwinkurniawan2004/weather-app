import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const api_key = "ff11321279236eb467bb3685a28a52d1";

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/", async (req, res) => {
    let location = req.body.city;
    try{
        const result = await axios.post(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${api_key}`)
        const temperatureInCelsius = result.data.main.temp - 273.15;
        const formattedTemperature = temperatureInCelsius.toFixed(2)
        res.render("index.ejs", { 
            weather: result.data.weather[0].description, 
            deg: formattedTemperature + "°C",
            city: result.data.name,
            weatherMain: result.data.weather[0].main, 
        })
        console.log(result.data.weather[0].main)
    }catch(error){
        console.log(error.response.data);
        res.render("index.ejs", {errors: error.response.data.message})
        res.status(400);
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})