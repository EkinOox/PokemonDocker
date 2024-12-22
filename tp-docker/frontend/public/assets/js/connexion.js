document.getElementById('form-connexion').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const messageBox = document.getElementById('message-connexion');
    
    fetch('./controller/connexion.php', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Redirection si la connexion est réussie
                window.location.href = './index.php';
            } else {
                // Affichage du message d'erreur
                messageBox.innerHTML = data.message;
                messageBox.style.color = 'red';
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            messageBox.innerHTML = "Une erreur est survenue, veuillez réessayer.";
        });
});