import axios from "axios";
import fs from 'fs';

/**
 * This function will only be run once.
 * It is used to gather all available Pokemon names and the corresponding
 * API url to be used to gather all other important information
 */
async function fetchPokemonList() {
    try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100000');
        const data = response.data.results;
        // Save results to a file
        fs.writeFileSync('./data/pokemonList.json', JSON.stringify(data, null, 2));
        console.log('Pokemon list saved locally');
    } catch (error) {
        console.error('Error fetching Pokemon list ', error.message);
    }
}

fetchPokemonList();
