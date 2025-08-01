import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import { readFile } from 'fs/promises';

// Create a server
const app = express();
const port = 3000;

// Set up Middle-ware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Get the Pokemon names and API urls
const data = await readFile('./data/pokemonList.json', 'utf-8');
const pokemonList = JSON.parse(data);

// Handle Requests
app.get("/", (req, res) => {
    res.render("index.ejs", {pokemonList: pokemonList});
});

// Get the pokemon details
app.post("/pokemon", async (req, res) => {
    const details = pokemonList.find(p => p.name === req.body.pokemon);
    if (!details) {
        console.log(`Pokemon: ${req.body.pokemon} Not found!`);
    }
    const API_URL = details.url;
    // Request all pokemon information
    try {
        const response = await axios.get(API_URL);
        const pokemonData = response.data;
        const pokemonGif = pokemonData.sprites.other.showdown.front_default;
        const stats = pokemonData.stats;
        const hp = stats[0];
        // Only keep Attack, Defense and Speed
        const filteredStats = stats.filter(stat => {
            return stat.stat.name !== 'special-attack' &&
                   stat.stat.name !== 'special-defense' &&
                   stat.stat.name !== 'hp';
        });
        const type = pokemonData.types[0].type.name;;
        res.render("index.ejs", {image: pokemonGif, hp: hp, stats: filteredStats,
                                 name: details.name, type: type,
                                 pokemonList: pokemonList});
    } catch (error) {
        console.log(error.response.data);
        res.status(500);
    }
})

// Start Server
app.listen(port, () => {
    console.log(`Server is running in http://localhost:${port}`);
});
