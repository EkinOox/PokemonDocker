const container = document.getElementById('allPokemon');

document.addEventListener('DOMContentLoaded', function () {
    fetch(`https://tyradex.vercel.app/api/v1/pokemon`)
        .then(response => response.json())
        .then(data => {
            // Vider le conteneur
            container.innerHTML = '';

            // Créer un fragment pour améliorer les performances
            const fragment = document.createDocumentFragment();

            // Parcourir chaque Pokémon sauf le premier
            data.slice(1).forEach(pokemon => {

                const firstType = pokemon.types?.[0]?.name?.toLowerCase();

                // Vérifier que `types` et `sprites` existent
                const typesHTML = (pokemon.types || [])
                    .map(type => `
                       <img src="${type.image}" alt="${type.name}" title="${type.name}" class="ml-2 w-7 h-7" style="background-image: url('./assets/image/fond/${firstType}.jpg');"/>
                    `).join('');
    
                const pokemonCard = document.createElement('div');
                pokemonCard.className = 'bg-white shadow-lg rounded-lg m-12';

                // Générer le HTML
                pokemonCard.innerHTML = `
                    <img 
                        src="${pokemon.sprites?.regular || 'https://via.placeholder.com/150'}" 
                        alt="${pokemon.name?.fr || 'Inconnu'}" 
                        style="background-image: url('./assets/image/fond/${firstType}.jpg'); background-size: cover;"
                        class="rounded-t-lg"
                        onmouseover="this.src='${pokemon.sprites?.shiny || pokemon.sprites?.regular || ''}'" 
                        onmouseout="this.src='${pokemon.sprites?.regular || ''}'"
                    >
                    <div class="p-4 rounded-b-md">
                        <div class="flex mb-5">
                            <h3 class="text-2xl">${pokemon.name?.fr || 'Inconnu'}</h3>
                            <p class="mt-1 ml-auto text-lg font-medium text-gray-900 text-right flex justify-center">
                                ${typesHTML || '<span>Aucun type</span>'}
                            </p>
                        </div>
                        <a href="./pokemon-profile.html?pokemonId=${pokemon.pokedex_id}" class="inline-flex items-center justify-between px-5 py-1 shadow-sm font-medium rounded-md bg-red-600 hover:bg-red-800">
                            <span class="text-gray-100 text-lg">Voir plus</span>
                        </a>
                    </div>
                `;

                // Ajouter la carte au fragment
                fragment.appendChild(pokemonCard);
            });

            // Ajouter toutes les cartes au conteneur
            container.appendChild(fragment);
        })
        .catch(error => console.error('Erreur lors du chargement des Pokémon :', error));
});
