const BASE_URL = "https://pokeapi.co/api/v2/";
const IMG_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
let imgUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";
let pokeId = document.getElementById("poke-id");
let pokeName = document.getElementById("poke-name");
let pokeImgContainer = document.getElementById("poke-img-container");

async function getOnePokemon() {
    let pokemon = await fetch(`${BASE_URL}pokemon/1`);
    let pokemonAsJson = await pokemon.json();
    console.log(pokemonAsJson);

    pokeId.innerText = pokemonAsJson.id;
    pokeName.innerText = pokemonAsJson.name;
    pokeImgContainer.innerHTML = `<img src="${IMG_BASE_URL}${pokemonAsJson.id}.svg" alt="Bild eines ${pokemonAsJson.name}"/>`;
}
