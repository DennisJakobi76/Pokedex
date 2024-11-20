const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const ALL_POKE_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const POKEMON_CARDS_SECTION = document.getElementById("pokemon-cards-section");
const SEARCH_INPUT = document.getElementById("search-bar");
const SEARCH_INFO = document.getElementById("search-info");

let pokemonTypes = [];
let loadedPokemons = [];
let allPokemons = [];
let searchedPokemons = [];
let currentResult = {};
let currentPokemon = {};
let pokemonId = "";
let firstLoad = true;

async function getOnePokemon(url) {
    let pokemon = await fetch(url);
    let pokemonAsJson = await pokemon.json();

    return pokemonAsJson;
}

// function getStatsOfPokemon(pokemonAsJson) {
//     for (let i = 0; i < pokemonAsJson.stats.length; i++) {
//         pokeStatsContainer.innerHTML += `<p>${pokemonAsJson.stats[i].stat.name}</p>`;
//         pokeStatsContainer.innerHTML += `<input type="range" min="0" max="100" value="${pokemonAsJson.stats[i].base_stat}" step="0"/>`;
//     }
// }

function getTypesOfPokemon(pokemonAsJson) {
    pokemonTypes = [];
    for (let i = 0; i < pokemonAsJson.types.length; i++) {
        let urlToType = pokemonAsJson.types[i].type.url;
        pokemonTypes.push(extractTypeNumber(urlToType));
    }
}

function getCorrectImgUrl(pokemonId) {
    let imgUrl = `${IMG_URL}${pokemonId}.png`;

    return imgUrl;
}

function setBackgroundColor(typeNumber) {
    let number = parseInt(typeNumber);
    let bGClassName = "";

    switch (number) {
        case 1:
            bGClassName = "normal";
            break;
        case 2:
            bGClassName = "fighting";
            break;
        case 3:
            bGClassName = "flying";
            break;
        case 4:
            bGClassName = "poison";
            break;
        case 5:
            bGClassName = "ground";
            break;
        case 6:
            bGClassName = "rock";
            break;
        case 7:
            bGClassName = "bug";
            break;
        case 8:
            bGClassName = "ghost";
            break;
        case 9:
            bGClassName = "steel";
            break;
        case 10:
            bGClassName = "fire";
            break;
        case 11:
            bGClassName = "water";
            break;
        case 12:
            bGClassName = "grass";
            break;
        case 13:
            bGClassName = "electric";
            break;
        case 14:
            bGClassName = "psychic";
            break;
        case 15:
            bGClassName = "ice";
            break;
        case 16:
            bGClassName = "dragon";
            break;
        case 17:
            bGClassName = "dark";
            break;
        case 18:
            bGClassName = "fairy";
            break;
        case 19:
            bGClassName = "stellar";
            break;

        default:
            bGClassName = "def-bg";
            break;
    }

    return bGClassName;
}

function addClassToElement(element, className) {
    element.classList.add(className);
}

function extractTypeNumber(string) {
    // 31 stellen
    let removeUrlFromString = string.substring(31);
    let removeBackslashFromString = removeUrlFromString.replace("/", "");
    return removeBackslashFromString;
}

function extractPokemonId(string) {
    // 34 stellen
    let removeUrlFromString = string.substring(34);
    let removeBackslashFromString = removeUrlFromString.replace("/", "");
    return removeBackslashFromString;
}

async function searchPokemons() {
    if (SEARCH_INPUT.value.length > 0 && SEARCH_INPUT.value.length < 3) {
        SEARCH_INFO.classList.remove("d_none");
    } else if (SEARCH_INPUT.value.length >= 3) {
        SEARCH_INFO.classList.add("d_none");
        getPokemonsByName();
    } else if (SEARCH_INPUT.value.length < 1) {
        SEARCH_INFO.classList.add("d_none");
        POKEMON_CARDS_SECTION.innerHTML = "";
        getPokemons();
    }
}

function getPokemonsByName() {
    searchedPokemons = allPokemons;
    searchedPokemons = searchedPokemons.filter((p) => p.name.includes(SEARCH_INPUT.value));
    POKEMON_CARDS_SECTION.innerHTML = "";
    console.log(searchedPokemons);

    drawSearchedCards(searchedPokemons);
}

async function getAllPokemons() {
    let result = await fetch(ALL_POKE_URL);
    let resultAsJson = await result.json();

    for (let i = 0; i < resultAsJson.results.length; i++) {
        allPokemons.push(resultAsJson.results[i]);
    }
    firstLoad = false;
}

async function drawSearchedCards(array) {
    for (let i = 0; i < array.length; i++) {
        loadedPokemons.push(array[i]);
        currentPokemon = await getOnePokemon(array[i].url);
        pokemonId = await extractPokemonId(array[i].url);
        POKEMON_CARDS_SECTION.innerHTML += renderPreviewCard(array[i], pokemonId, getCorrectImgUrl(pokemonId));
        getTypesOfPokemon(currentPokemon);
        let pokeImgContainer = document.getElementById(`poke-img-container${pokemonId - 1}`);
        addClassToElement(pokeImgContainer, setBackgroundColor(pokemonTypes[0]));

        let pokeTypeContainer = document.getElementById(`poke-type-container${pokemonId - 1}`);

        for (let j = 0; j < pokemonTypes.length; j++) {
            pokeTypeContainer.innerHTML += renderTypes(pokemonTypes[j]);
        }
    }
}

async function drawPreviewCards(array) {
    for (let i = 0; i < array.results.length; i++) {
        loadedPokemons.push(array.results[i]);
        currentPokemon = await getOnePokemon(array.results[i].url);
        pokemonId = await extractPokemonId(array.results[i].url);
        POKEMON_CARDS_SECTION.innerHTML += renderPreviewCard(array.results[i], pokemonId, getCorrectImgUrl(pokemonId));
        getTypesOfPokemon(currentPokemon);
        let pokeImgContainer = document.getElementById(`poke-img-container${pokemonId - 1}`);
        addClassToElement(pokeImgContainer, setBackgroundColor(pokemonTypes[0]));

        let pokeTypeContainer = document.getElementById(`poke-type-container${pokemonId - 1}`);

        for (let j = 0; j < pokemonTypes.length; j++) {
            pokeTypeContainer.innerHTML += renderTypes(pokemonTypes[j]);
        }
    }
}

async function getPokemons(url = "") {
    if (firstLoad) {
        getAllPokemons();
    }

    if (url == "") {
        url = BASE_URL;
    }
    let pokemons = await fetch(url);

    let jsonPokemons = await pokemons.json();
    currentResult = jsonPokemons;

    drawPreviewCards(jsonPokemons);
}

function loadMorePokemon() {
    let nextUrl = currentResult.next;
    getPokemons(nextUrl);
}
