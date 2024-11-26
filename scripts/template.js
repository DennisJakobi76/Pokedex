const TYPE_BASE_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-viii/sword-shield/";

function renderPreviewCard(pokemon, pId, imgUrl) {
    return `<div id="pokemon-container${pId - 1}" class="pokemon-container" onclick="openDetails('${pokemon.name}')">
                    <a href="#title-img">
                        <div class="id-and-name-container">
                            <span id="poke-id${pId - 1}" class="poke-id">#${pId}</span>
                            <span id="poke-name${pId - 1}" class="poke-name">${pokemon.name}</span>
                        </div>
                        <div id="poke-img-container${pId - 1}" class="poke-img-container">
                            <img src="${imgUrl}" alt="Bild eines ${pokemon.name}" id="poke-img${pId - 1}" class="poke-img"/>
                        </div>
                        <div id="poke-type-container${pId - 1}" class="poke-type-container"></div>
                    </a>
                </div>`;
}

function renderTypes(typeId) {
    return `<img src="${TYPE_BASE_URL}${typeId}.png" alt="Typsymbol des Pokemons"/>`;
}

function renderDetailsCard(pokeName) {
    return `<div
                        id="pokemon-detail-card("${pokeName})"
                        class="pokemon-detail-card"
                    >
                        <div
                            id="pokemon-info-container(${pokeName})"
                            class="pokemon-info-container"
                        ></div>
                        <div class="pokemon-info-nav-container">
                            <button
                                id="poke-main-nav(${pokeName})"
                                class="poke-info-nav-section"
                                onclick="openMainDetails(event,'${pokeName}')"
                            >
                                main
                            </button>
                            <button
                                id="poke-stats-nav(${pokeName})"
                                class="poke-info-nav-section"
                                onclick="openStatsDetails(event,'${pokeName}')"
                            >
                                stats
                            </button>
                            <button
                                id="poke-evochain-nav(${pokeName})"
                                class="poke-info-nav-section"
                                onclick="openEvoDetails(event,'${pokeName}')"
                            >
                                evo chain
                            </button>
                        </div>
                        <div
                            id="poke-info-detail-container(${pokeName})"
                            class="poke-info-detail-container"
                        ></div>
                        <div class="pokemon-arrow-nav-container">
                            <button class="pokemon-nav-arrow" onclick="getPreviousPokemon(event,'${pokeName}')">&lt;</button>
                            <button class="pokemon-nav-arrow" onclick="getNextPokemon(event,'${pokeName}')">&gt;</button>
                        </div>
                    </div>`;
}

function renderMainDetails() {
    return `<table class="main-details-tbl">
                <tr>
                    <td>Height</td>
                    <td id="main-height">: die Höhe</td>
                </tr>
                <tr>
                    <td>Weight</td>
                    <td id="main-weight">: das Gewicht</td>
                </tr>
                <tr>
                    <td>Base Experience</td>
                    <td id="main-exp">: die Erfahrung</td>
                </tr>
                <tr>
                    <td>Abilities</td>
                    <td id="main-abilities">: die Fähigkeiten</td>
                </tr>
            </table>`;
}

function renderEvoChain(imgUrl, id) {
    return `<div id="evo-img${id}" class="evo-img-container">
                <h5>${id + 1}.</h5>
                <img class="evo-img" src="${imgUrl}" alt="Bild der ${id + 1}. Evolutionsstufe"/>
            </div>`;
}
