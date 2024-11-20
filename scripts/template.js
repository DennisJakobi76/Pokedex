const TYPE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";

function renderPreviewCard(pokemon, pId, imgUrl) {
    return `<div id="pokemon-container${pId - 1}" class="pokemon-container" onclick="openDetails(${pId})">
                    <div class="id-and-name-container">
                        <span id="poke-id${pId - 1}" class="poke-id">#${pId}</span>
                        <span id="poke-name${pId - 1}" class="poke-name">${pokemon.name}</span>
                    </div>
                    <div id="poke-img-container${pId - 1}" class="poke-img-container">
						<img src="${imgUrl}" alt="Bild eines ${pokemon.name}" id="poke-img${pId - 1}" class="poke-img"/>
					</div>
                    <div id="poke-type-container${pId - 1}" class="poke-type-container"></div>
                </div>`;
}

function renderTypes(typeId) {
    return `<img src="${TYPE_BASE_URL}${typeId}.png" alt="Typsymbol des Pokemons"/>`;
}
