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
    searchedPokemons = searchedPokemons.filter((p) => p.name.includes(SEARCH_INPUT.value.toLowerCase()));
    POKEMON_CARDS_SECTION.innerHTML = "";

    drawPreviewCards(searchedPokemons);
}

async function getAllPokemons() {
    let result = await fetch(ALL_POKE_URL);
    let resultAsJson = await result.json();

    for (let i = 0; i < resultAsJson.results.length; i++) {
        allPokemons.push(resultAsJson.results[i]);
    }
    firstLoad = false;
}

async function drawPreviewCards(array) {
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

async function getPokemons(url = "") {
    showLoadingSpinner();

    if (firstLoad) {
        getAllPokemons();
    }

    if (url == "") {
        url = BASE_URL;
    }
    let pokemons = await fetch(url);

    let jsonPokemons = await pokemons.json();
    currentResult = jsonPokemons;

    drawPreviewCards(jsonPokemons.results);

    hideLoadingSpinner();
}

function loadMorePokemon() {
    let nextUrl = currentResult.next;
    getPokemons(nextUrl);
}

async function openDetails(pokeName) {
    let overlay = document.getElementById("overlay");
    let clickedPokemon = await allPokemons.find(({ name }) => name === pokeName);
    let currentPokeId = await extractPokemonId(clickedPokemon.url);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let helperArray = [];
    helperArray.push(clickedPokemon);

    overlay.classList.remove("d_none");
    overlay.innerHTML = renderDetailsCard(pokeName);
    document.getElementById(`pokemon-info-container(${pokeName})`).innerHTML = renderPreviewCard(helperArray[0], currentPokeId, getCorrectImgUrl(currentPokeId));
    getTypesOfPokemon(currentPokemon);

    let pokeImgContainer = document.getElementById(`poke-img-container${currentPokeId - 1}`);
    addClassToElement(pokeImgContainer, setBackgroundColor(pokemonTypes[0]));

    let pokeTypeContainer = document.getElementById(`poke-type-container${currentPokeId - 1}`);

    for (let j = 0; j < pokemonTypes.length; j++) {
        pokeTypeContainer.innerHTML += renderTypes(pokemonTypes[j]);
    }

    openMainDetails(event, pokeName);
}

async function openMainDetails(event, pokeName) {
    if (event != undefined) {
        event.stopPropagation();
    }

    let clickedPokemon = {};
    let abilities = [];
    let currentId = "";
    clickedPokemon = await allPokemons.find(({ name }) => name === pokeName);
    currentId = await extractPokemonId(clickedPokemon.url);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);

    let height = currentPokemon.height;
    let heightInMeters = (height / 10).toFixed(2).toLocaleString("de-DE").replace(".", ",") + " m";
    let weight = currentPokemon.weight;
    let weightInKilograms = (weight / 10).toFixed(2).toLocaleString("de-DE") + " kg";
    let experience = currentPokemon.base_experience;

    detailContainer.innerHTML = "";
    detailContainer.innerHTML = renderMainDetails();
    let tdAbilities = document.getElementById("main-abilities");
    tdAbilities.innerText = `: `;
    document.getElementById("main-height").innerText = `: ${heightInMeters}`;
    document.getElementById("main-weight").innerText = `: ${weightInKilograms}`;
    document.getElementById("main-exp").innerText = `: ${experience}`;

    for (let i = 0; i < currentPokemon.abilities.length; i++) {
        abilities.push(currentPokemon.abilities[i].ability.name);
        tdAbilities.innerText += ` ${abilities[i]};`;
    }
}

async function openStatsDetails(event, pokeName) {
    event.stopPropagation();
    let clickedPokemon = {};
    clickedPokemon = await allPokemons.find(({ name }) => name === pokeName);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);
    detailContainer.innerHTML = "";

    for (let i = 0; i < currentPokemon.stats.length; i++) {
        detailContainer.innerHTML += `<p>${currentPokemon.stats[i].stat.name}</p>`;
        detailContainer.innerHTML += `<input type="range" min="0" max="100" value="${currentPokemon.stats[i].base_stat}" step="0"/>`;
    }
}

async function openEvoDetails(event, pokeName) {
    event.stopPropagation();
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);
    let clickedPokemon = {};
    let evolutionPokemonNames = [];
    let evolutionImgUrls = [];
    let pokemonForImgUrl = {};
    clickedPokemon = await allPokemons.find(({ name }) => name === pokeName);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let species = await fetch(currentPokemon.species.url);
    let speciesAsJson = await species.json();
    let evoChain = await fetch(speciesAsJson.evolution_chain.url);
    let evoChainAsJson = await evoChain.json();

    if (evoChainAsJson.chain.evolves_to.length > 0) {
        evolutionPokemonNames.push(evoChainAsJson.chain.species.name);
        pokemonForImgUrl = await allPokemons.find(({ name }) => name === evoChainAsJson.chain.species.name);
        let id = await extractPokemonId(pokemonForImgUrl.url);
        evolutionImgUrls.push(getCorrectImgUrl(id));
    }

    if (evoChainAsJson.chain.evolves_to.length > 0) {
        evolutionPokemonNames.push(evoChainAsJson.chain.evolves_to[0].species.name);
        pokemonForImgUrl = await allPokemons.find(({ name }) => name === evoChainAsJson.chain.evolves_to[0].species.name);
        let id = await extractPokemonId(pokemonForImgUrl.url);
        evolutionImgUrls.push(getCorrectImgUrl(id));
    }

    if (evoChainAsJson.chain.evolves_to[0].evolves_to.length > 0) {
        evolutionPokemonNames.push(evoChainAsJson.chain.evolves_to[0].evolves_to[0].species.name);
        pokemonForImgUrl = await allPokemons.find(({ name }) => name === evoChainAsJson.chain.evolves_to[0].evolves_to[0].species.name);
        let id = await extractPokemonId(pokemonForImgUrl.url);
        evolutionImgUrls.push(getCorrectImgUrl(id));
    }

    detailContainer.innerHTML = "";

    for (let i = 0; i < evolutionPokemonNames.length; i++) {
        detailContainer.innerHTML += renderEvoChain(evolutionImgUrls[i], i);
    }
}

async function getNextPokemon(event, pokeName) {
    event.stopPropagation();
    let currentId = allPokemons.map((pokemonObj) => pokemonObj.name).indexOf(pokeName);
    let nextId = currentId + 1;

    if (nextId == allPokemons.length) {
        nextId = 0;
    }

    let nextPokeName = allPokemons[nextId].name;

    openDetails(nextPokeName);
}

async function getPreviousPokemon(event, pokeName) {
    event.stopPropagation();
    let currentId = allPokemons.map((pokemonObj) => pokemonObj.name).indexOf(pokeName);
    let nextId = currentId - 1;

    if (nextId <= 0) {
        nextId = allPokemons.length - 1;
    }

    let nextPokeName = allPokemons[nextId].name;

    openDetails(nextPokeName);
}

function showLoadingSpinner() {
    document.getElementById("loading-spinner-container").classList.remove("d_none");
}

function hideLoadingSpinner() {
    setTimeout(function () {
        document.getElementById("loading-spinner-container").classList.add("d_none");
    }, 1200);
}

function addDNone() {
    document.getElementById("overlay").classList.add("d_none");
}
