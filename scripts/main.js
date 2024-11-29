const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
const ALL_POKE_URL = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const IMG_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const POKEMON_CARDS_SECTION = document.getElementById("pokemon-cards-section");
const SEARCH_INPUT = document.getElementById("search-bar");
const SEARCH_INFO = document.getElementById("search-info");
const LOADING_SPINNER_CONTAINER = document.getElementById("loading-spinner-container");
const BODY = document.getElementById("body");
const OVERLAY = document.getElementById("overlay");

let pokemonTypes = [];
let loadedPokemons = [];
let allPokemons = [];
let searchedPokemons = [];
let helperArray = [];
let abilities = [];
let evolutionPokemonNames = [];
let evolutionImgUrls = [];
let currentResult = {};
let currentPokemon = {};
let pokemonForImgUrl = {};
let clickedPokemon = {};
let pokemonId = "";
let firstLoad = true;
let isDrawn = false;

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
    const typeToClassMap = {
        1: "normal",
        2: "fighting",
        3: "flying",
        4: "poison",
        5: "ground",
        6: "rock",
        7: "bug",
        8: "ghost",
        9: "steel",
        10: "fire",
        11: "water",
        12: "grass",
        13: "electric",
        14: "psychic",
        15: "ice",
        16: "dragon",
        17: "dark",
        18: "fairy",
        19: "stellar",
    };
    return typeToClassMap[parseInt(typeNumber)] || "def-bg";
}

function addClassToElement(element, className) {
    element.classList.add(className);
}

function extractTypeNumber(string) {
    let removeUrlFromString = string.substring(31);
    let removeBackslashFromString = removeUrlFromString.replace("/", "");
    return removeBackslashFromString;
}

function extractPokemonId(string) {
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
    try {
        for (let i = 0; i < array.length; i++) {
            loadedPokemons.push(array[i]);
            currentPokemon = await getOnePokemon(array[i].url);
            pokemonId = await extractPokemonId(array[i].url);
            POKEMON_CARDS_SECTION.innerHTML += renderPreviewCard(array[i], pokemonId, getCorrectImgUrl(pokemonId));
            getTypesOfPokemon(currentPokemon);
            let pokeImgContainer = document.getElementById(`poke-img-container${pokemonId - 1}`);
            addClassToElement(pokeImgContainer, setBackgroundColor(pokemonTypes[0]));
            let pokeTypeContainer = document.getElementById(`poke-type-container${pokemonId - 1}`);
            drawTypesFromArray(pokemonTypes, pokeTypeContainer);
        }
    } catch {
        pokeImgContainer.innerHTML += renderImageFailMessage();
    }
    isDrawn = true;
    return isDrawn;
}

async function getPokemons(url = "") {
    showLoadingSpinner(event);
    if (firstLoad) {
        getAllPokemons();
    }
    if (url == "") {
        url = BASE_URL;
    }
    let pokemons = await fetch(url);
    let jsonPokemons = await pokemons.json();
    currentResult = jsonPokemons;
    if (drawPreviewCards(jsonPokemons.results)) {
        hideLoadingSpinner();
    }
}

function loadMorePokemon() {
    let nextUrl = currentResult.next;
    getPokemons(nextUrl);
}

async function openDetails(pokeName) {
    BODY.style.overflowY = "hidden";
    clickedPokemon = await findPokemonInArray(allPokemons, pokeName);
    currentPokeId = await extractPokemonId(clickedPokemon.url);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    helperArray.push(clickedPokemon);
    OVERLAY.classList.remove("d_none");
    OVERLAY.innerHTML = renderDetailsCard(pokeName);
    document.getElementById(`pokemon-info-container(${pokeName})`).innerHTML = renderPreviewCard(helperArray[0], currentPokeId, getCorrectImgUrl(currentPokeId));
    getTypesOfPokemon(currentPokemon);
    let pokeImgContainer = document.getElementById(`poke-img-container${currentPokeId - 1}`);
    addClassToElement(pokeImgContainer, setBackgroundColor(pokemonTypes[0]));
    let pokeTypeContainer = document.getElementById(`poke-type-container${currentPokeId - 1}`);
    drawTypesFromArray(pokemonTypes, pokeTypeContainer);
    openMainDetails(event, pokeName);
}

async function openMainDetails(event, pokeName) {
    if (event != undefined) {
        event.stopPropagation();
    }
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);
    let height = currentPokemon.height;
    let heightInMeters = (height / 10).toFixed(2).toLocaleString("de-DE").replace(".", ",") + " m";
    let weight = currentPokemon.weight;
    let weightInKilograms = (weight / 10).toFixed(2).toLocaleString("de-DE") + " kg";
    let experience = currentPokemon.base_experience;
    drawMainInfos(detailContainer);
    document.getElementById("main-abilities").innerText = `: `;
    document.getElementById("main-height").innerText = `: ${heightInMeters}`;
    document.getElementById("main-weight").innerText = `: ${weightInKilograms}`;
    document.getElementById("main-exp").innerText = `: ${experience}`;
    drawAbilities(currentPokemon.abilities, abilities, document.getElementById("main-abilities"));
}

async function openStatsDetails(event, pokeName) {
    event.stopPropagation();
    clickedPokemon = await findPokemonInArray(allPokemons, pokeName);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);
    drawStats(currentPokemon.stats, detailContainer);
}

async function openEvoDetails(event, pokeName) {
    event.stopPropagation();
    let detailContainer = document.getElementById(`poke-info-detail-container(${pokeName})`);
    evolutionPokemonNames = [];
    evolutionImgUrls = [];
    pokemonForImgUrl = {};
    clickedPokemon = await findPokemonInArray(allPokemons, pokeName);
    currentPokemon = await getOnePokemon(clickedPokemon.url);
    let evoChainAsJson = await getEvolutionChainAsJson(currentPokemon.species.url);
    try {
        await processEvolutionChain(evoChainAsJson.chain.evolves_to, evolutionImgUrls, evoChainAsJson.chain.species.name);
        await processEvolutionChain(evoChainAsJson.chain.evolves_to, evolutionImgUrls, evoChainAsJson.chain.evolves_to[0].species.name);
        await processEvolutionChain(evoChainAsJson.chain.evolves_to[0].evolves_to, evolutionImgUrls, evoChainAsJson.chain.evolves_to[0].evolves_to[0].species.name);
        detailContainer.innerHTML = "";
        for (let i = 0; i < evolutionPokemonNames.length; i++) {
            detailContainer.innerHTML += renderEvoChain(evolutionImgUrls[i], i);
        }
    } catch {
        detailContainer.innerHTML = "";
        detailContainer.innerHTML += renderNoEvolutionMessage();
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

function showLoadingSpinner(event) {
    event.stopPropagation();
    LOADING_SPINNER_CONTAINER.classList.remove("d_none");
    BODY.style.overflowY = "hidden";
    window.scrollTo(0, 0);
}

function hideLoadingSpinner() {
    setTimeout(function () {
        LOADING_SPINNER_CONTAINER.classList.add("d_none");
        BODY.style.overflowY = "auto";
    }, 1000);
}

function addDNone() {
    document.getElementById("overlay").classList.add("d_none");
    BODY.style.overflowY = "auto";
}

async function findPokemonInArray(array, pName) {
    return await array.find(({ name }) => name === pName);
}

async function processEvolutionChain(array, imageUrlArray, speciesName) {
    if (array.length > 0) {
        evolutionPokemonNames.push(speciesName);
        pokemonForImgUrl = await findPokemonInArray(allPokemons, speciesName);
        let id = await extractPokemonId(pokemonForImgUrl.url);
        imageUrlArray.push(getCorrectImgUrl(id));
    }
}

async function getEvolutionChainAsJson(pokemonSpeciesUrl) {
    let species = await fetch(pokemonSpeciesUrl);
    let speciesAsJson = await species.json();
    let evoChain = await fetch(speciesAsJson.evolution_chain.url);
    let evoChainAsJson = await evoChain.json();

    return evoChainAsJson;
}

function drawTypesFromArray(array, targetElement) {
    if (array.length > 0) {
        for (let j = 0; j < array.length; j++) {
            targetElement.innerHTML += renderTypes(array[j]);
        }
    }
}

function drawMainInfos(targetElement) {
    targetElement.innerHTML = "";
    targetElement.innerHTML = renderMainDetails();
}

function drawAbilities(sourceArray, targetArray, targetElement) {
    for (let i = 0; i < sourceArray.length; i++) {
        targetArray.push(sourceArray[i].ability.name);
        targetElement.innerText += ` ${abilities[i]};`;
    }
}

function drawStats(array, targetElement) {
    targetElement.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        targetElement.innerHTML += `<p>${array[i].stat.name}</p>`;
        targetElement.innerHTML += `<input type="range" min="0" max="100" value="${array[i].base_stat}" step="0"/>`;
    }
}
