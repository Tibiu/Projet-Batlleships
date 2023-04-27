# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
# Grille d'éval :

- le smart-contract compile correctement avec "npx hardhat compile" **1pt** :heavy_check_mark:
- le smart-contract est testé par la commande "npx hardhat test" (min 5 tests significatifs) **1pt** :heavy_check_mark:
- le test du smart-contract permet de tester le déploiement du contrat (deux joueurs obligatoires) **1pt** :heavy_check_mark:
- le test du smart-contract permet de tester l'ajout correct d'un bateau sur sa grille **1pt** :heavy_check_mark:
- le test du smart-contract permet de tester l'ajout incorrect d'un bateau sur sa grille **1pt** :x:
- le test du smart-contract permet de tester une tentative correcte sur la grille de l'adversaire **1pt** :heavy_check_mark:
- le test du smart-contract permet de tester une tentative incorrecte sur la grille de l'adversaire **1pt** :x:
- le test du smart-contract permet de tester une tentative correcte mais par le mauvais joueur sur la grille de l'adversaire **1pt** :x:
- le test du smart-contract permet de tester si la partie est terminée **1pt** :heavy_check_mark:
- le test du smart-contract permet de tester qui est vainqueur. **1pt** :heavy_check_mark:
- l'appli react permet de démarrer une partie (on saisit à la main l'adresse de l'adversaire) **2pts** :x:
- l'appli react permet de jouer la partie **3pts** :x:

# Bonus
- le test du smart-contract permet de tester l'envoi d'un hash de la position des bateaux en début de partie **2pts** :x:
- le test du smart-contract permet de tester la confirmation d'une tentative de l'adversaire **2pts** :x:
- le test du smart-contract permet de tester l'envoi de la position des bateaux en fin de partie **2pts** :x:
