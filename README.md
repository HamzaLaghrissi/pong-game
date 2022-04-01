# Pong game

### Introduction

C'est une version simplifiée de l'historique jeu Pong. Le jeu est inspiré du tennis de table en vue de dessus, et chaque joueur s'affronte en déplaçant la raquette virtuelle de haut en bas. Le joueur peut changer la direction de la balle en fonction de l'endroit où celle-ci tape sur la raquette

### Comment ça marche

- Une partie ne peut commencer que lorsque deux joueurs sont connectés au serveur
- Si un troisième client tente de se connecter, il sera refusé et notifié de ce refus
- Si un client se déconnecte en cours de partie, alors l'autre joueur en est informé et il est alors déconnecté lui aussi
- Pour chaque joueur, sa raquette est toujours celle de gauche
- Le but du joueur est alors d'empêcher la balle de toucher le mur gauche du terrain de jeu
- Si cela arrive, la balle s'arrête et le joueur peut relancer une nouvelle balle par un appui de la barre *espace*

### Ce que j'ai appris de ce projet

- Gérer à la fois le développement côté client et côté serveur
- Utiliser Node.js et Webpack pour gérer le code client
- Utiliser un serveur web réaliser avec Node.js
- Utiliser socket.io pour gérer des communications bi-directionnelles entre le client et le serveur et ainsi permettre le jeu en réseau.

### Mise en route

#### Prérequis

- <img src="https://icon-library.com/images/nodejs-icon/nodejs-icon-7.jpg" width="25">  Node.js - an open source development platform for executing JavaScript code server-side
- <img src="https://seeklogo.com/images/N/npm-logo-01B8642EDD-seeklogo.com.png" width="25">  NPM - the default package manager for the JavaScript runtime environment Node. js

#### Installation

1. Récupérer le projet en lançant la commande suivante:

```bash
  git clone https://github.com/HamzaLaghrissi/pong-game.git
```

2. Installer les paquets *Node.js* :

  - D'aprés la répertoire *client*, lancez les commandes suivantes

    ```bash
      npm install
    ```
    ```bash
      npm run build
    ```

  - D'aprés la répertoire *server*, lancez les commandes suivantes

    ```bash
      npm install
    ```
    ```bash
      npm run start
    ```

3. Maintenant le serveur est lancé sur le port 8080

4. Vous pouvez jouer en chargeant la page du serveur :)   

    ***http://localhost:8080/public/dist/index.html***

   - Soit en local depuis plusieur onglets 
   - Soit en réseau depuis plusieurs postes, pour cela, Lancez le serveur sur une machine, ainsi qu'un client. Récupérez son adresse IP et sur le second poste utilisez cette adresse pour charger la page du serveur dans un second client.