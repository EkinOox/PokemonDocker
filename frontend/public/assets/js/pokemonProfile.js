const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const profile = document.getElementById('profile');

document.addEventListener('DOMContentLoaded', function () {
    fetch(`https://tyradex.vercel.app/api/v1/pokemon/${urlParams.get('pokemonId')}`)
        .then(response => response.json())
        .then(data => {

            profile.innerHTML = '';

            const pokemonName = `<div class="bg-gray-400 shadow-lg rounded-lg border-l-emerald-950 text-2xl">${data.name.fr}</div>`;
            
            profile.innerHTML += pokemonName;
        }).catch(error => console.error('Erreur lors du chargement du Pokémon:', error));
});