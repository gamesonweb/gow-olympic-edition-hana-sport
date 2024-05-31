# Kart Clash

## Equipe

M2 MIAGE, Sophia Antipolis

- Sébastien AGLAE (sebastienaglae) sebastien.aglae@etu.unice.fr
- Mike CHIAPPE (Mimi8298) mike.chiappe@etu.unice.fr

## Installation

Pour installer le jeu:

```bash
cd game
npm install
```

Pour installer le serveur:

```bash
cd server
```

## Lancement

Pour lancer le jeu:

```bash
cd game
npm run start
```

Pour lancer le serveur:

```bash
cd server
```

---

## Informations
- Le jeu est disponible sur https://assets.atrasis.net/kartclash/index.html
- La vidéo de présentation est disponible sur https://assets.atrasis.net/kartclash/video.mp4
  </br>
  Nous vous recommendons d'utiliser Google Chrome pour jouer au jeu car il supporte officiellement **WebGPU** ! Sinon, vous serez redirigé vers WebGl. (WebGPU est plus performant que WebGl :))

## Justification des choix

Le karting électrique est le thème idéal pour notre jeu dans le theme "Olympics Edition" car il incarne les valeurs de durabilité et d'innovation des Jeux Olympiques. Avec zéro émission de carbone, il sensibilise aux technologies vertes tout en offrant une expérience de jeu passionnante. De plus, les circuits de karting électrique sont petits et facilement aménageables, ce qui rend le jeu accessible et diversifié. L'historique des sports mécaniques aux JO et les FIA Motorsport Games confèrent une légitimité au karting. Sa popularité chez les jeunes attire une nouvelle génération de joueurs, favorisant la diversité et l'inclusion. En somme, ce thème modernise le jeu en alignant innovation, durabilité et accessibilité avec les idéaux olympiques.

## Description du jeu

C'est un jeu de karting offrant un **mode solo** et un **mode en ligne**. Vous pourrez choisir parmi plusieurs **véhicules** disponibles et jouer sur des **circuits** remplis de surprises !

## Comment jouer

Le jeu prend en charge les claviers **AZERTY** et **QWERTY**.

- Lorsque vous lancez le jeu pour la première fois, vous devrez entrer un pseudo et choisir le type de clavier que vous utilisez.

- **Mode solo** : Vous pouvez choisir un circuit et un véhicule, puis vous devrez terminer la course en un temps record.

- **Mode en ligne** : Vous entrerez alors dans une salle d'attente. Lorsque qu'il y au moins 2 joueurs, la course commencera. Vous pourrez alors vous affronter en ligne.

- **Classement** : Un classement des meilleurs temps sera disponible pour chaque circuit a la fin de chaque course.

</br>

Azerty / Qwerty :

- **Z** / **W** : Accélérer
- **S** : Freiner
- **Q** / **A** : Gauche
- **D** : Droite

## Autres

L'interface du jeu a été conçue avec Figma, mais pour son implémentation dans le jeu, nous avons rencontré des limitations avec le plugin Figma to BabylonJS, qui n'étant pas open source, nous a empêchés d'ajouter certaines fonctionnalités essentielles pour l'exportations.
https://www.figma.com/design/g7iOd4V6zGwgySe5UnGnWP/GOW2024?node-id=0-1&t=4IBVqLceXu0L8BZx-1

---

## Technologies utilisées

Nous avons opté pour BabylonJS 7.9.0 et React pour notre projet, combinant ainsi la puissance de la bibliothèque de rendu 3D de BabylonJS avec la flexibilité et la facilité de développement de l'interface utilisateur offerte par React. Nous avons une API en Go et un serveur de jeu en websocket.

## Phase de développement

Nous avons entamé le projet BabylonJS le 30 mai. En tant que fondateurs d'un studio de jeux vidéo (Hana Games), nous consacrons tout notre temps libre au développement de Gang Stars, un jeu mobile. Pour cette dernière édition, après trois participations, nous avons décidé de créer un jeu dans les délais impartis.
Nous utilisons Unity comme un intermédiaire dans notre processus de développement. Nous concevons nos mondes et éléments de jeu dans Unity, puis nous les exportons vers BabylonJS à l'aide de l'outil "UnityGLTF" de KhronosGroup. Cette approche nous permet de bénéficier des avantages de Unity en matière de conception et de flux de travail, tout en exploitant les fonctionnalités et les performances de BabylonJS pour le rendu 3D dans notre jeu. Notre structure de code suit également celle d'Unity, avec l'utilisation de composants dans des gameobjects. Cela facilite la transition et la collaboration entre les membres de l'équipe, car nous utilisons une méthode familière et efficace pour organiser notre code et nos ressources.

## Capture d'écran
