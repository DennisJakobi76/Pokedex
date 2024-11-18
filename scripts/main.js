const BASE_URL = "https://pokeapi.co/api/v2/";
const IMG_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
const TYPE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";
let pokeId = document.getElementById("poke-id");
let pokeName = document.getElementById("poke-name");
let pokeImgContainer = document.getElementById("poke-img-container");
let pokeTypeContainer = document.getElementById("poke-type-container");
let pokeStatsContainer = document.getElementById("poke-stats-container");
let pokemonTypes = [];

async function getOnePokemon() {
    let pokemon = await fetch(`${BASE_URL}pokemon/3`);
    let pokemonAsJson = await pokemon.json();
    getTypesOfPokemon(pokemonAsJson);

    // console.log(pokemonAsJson);

    pokeId.innerText = `#${pokemonAsJson.id}`;
    pokeName.innerText = pokemonAsJson.name;
    pokeImgContainer.innerHTML = `<img src="${IMG_BASE_URL}${pokemonAsJson.id}.svg" alt="Bild eines ${pokemonAsJson.name}"/>`;

    for (let j = 0; j < pokemonTypes.length; j++) {
        pokeTypeContainer.innerHTML += `<img src="${TYPE_BASE_URL}${pokemonTypes[j]}.png" alt="Typsymbol des Pokemons"/>`;
    }

    getStatsOfPokemon(pokemonAsJson);
}

function getStatsOfPokemon(pokemonAsJson) {
    for (let i = 0; i < pokemonAsJson.stats.length; i++) {
        pokeStatsContainer.innerHTML += `<p>${pokemonAsJson.stats[i].stat.name}</p>`;
        pokeStatsContainer.innerHTML += `<input type="range" min="0" max="100" value="${pokemonAsJson.stats[i].base_stat}" step="0"/>`;
    }
}

function getTypesOfPokemon(pokemonAsJson) {
    for (let i = 0; i < pokemonAsJson.types.length; i++) {
        let urlToType = pokemonAsJson.types[i].type.url;
        pokemonTypes.push(extractTypeNumber(urlToType));
    }
}

function extractTypeNumber(string) {
    // 31 stellen
    let removeUrlFromString = string.substring(31);
    let removeBackslashFromString = removeUrlFromString.replace("/", "");
    return removeBackslashFromString;
}
