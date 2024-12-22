console.log('inscription.js chargé');
document.getElementById('form-inscription').addEventListener('submit', function (e) {
    e.preventDefault(); // Empéche le formulaire de recharger la page

    const formData = new FormData(this); // Récupére les données du formulaire
    const messageBox = document.getElementById('message-inscription'); // Zone d'affichage des messages

    fetch('./controller/inscription.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.text()) // On attend une réponse en texte
        .then(data => {
            // Affiche le message reéu
            messageBox.innerHTML = data;
            messageBox.style.color = data.includes('réussie') ? 'green' : 'red'; // Colore le message
        })
        .catch(error => {
            console.error('Erreur:', error);
            messageBox.innerHTML = "Une erreur est survenue, veuillez réessayer.";
        });
});
