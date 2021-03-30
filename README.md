<p align="center"><img src="https://paladium-pvp.fr/styles/ndzn/paladiumpvp/logo-sm.png" width="400px" height="225px" alt="paladium-pvp"></p>

<h1 align="center">Paladium Launcher</h1>

<p align="center">
    <img src="https://img.shields.io/badge/build-dev-red.svg?style=for-the-badge" alt="build">
    <img src="https://img.shields.io/badge/version-v0.0.01--d13-red.svg?style=for-the-badge" alt="version"> 
    <img src="https://img.shields.io/badge/dist-windows,%20linux,%20macos-blue.svg?style=for-the-badge" alt="distribution">
</p>

<p align="center">Paladium Launcher - Beta</p>

## Nouveauté

* Le launcher passe en Open Source ♡＾▽＾♡

Toutes les nouveautés concernant les builds du launcher se font ici!

##### Tu aimes le projet ? Alors mets une petite ⭐ pour soutenir !

## Télécharger

Toutes les versions du launcher sont disponible dans [GitHub Releases](https://github.com/Chaika9/paladiumlauncher/releases)

#### Dernière Release
[![](https://img.shields.io/badge/release-v0.0.01--d13-red.svg?style=for-the-badge)](https://github.com/Chaika9/paladiumlauncher/releases/latest)

#### Dernière Pre-Release
[![](https://img.shields.io/badge/release-v0.0.01--d13-red.svg?style=for-the-badge)](https://github.com/Chaika9/paladiumlauncher/releases/latest)

**Plateformes supportées**

| Platform | File |
| -------- | ---- |
| Windows x64 | `paladiumlauncher-setup-VERSION.exe` |
| macOS | `paladiumlauncher-VERSION.dmg` |
| Linux x64 | `paladiumlauncher-VERSION-x86_64.AppImage` |

## Contribution

Le launcher de Paladium est un projet Open-Source, initié par Chaika9, développeur sur Paladium.  
Par conséquent, il est ouvert aux contributions externes.  
Toutefois, si vous souhaitez contribuer, vous devez **impérativement** rejoindre le serveur Discord de développement: https://discord.gg/yv6gSUb  
  
Plus d'informations sont disponibles sur ce serveur, dans le channel #devenir-contributeur.

**Toute contribution provenant d'une personne n'ayant pas rejoint le serveur Discord sera automatiquement refusée.**

## Développement

**Configuration requise**

* [Node.js][nodejs] v10.x.x
* [Git][git]

---

**Cloner et installer les dépendances**

```console
> git clone https://github.com/Chaika9/paladiumlauncher.git
> cd paladiumlauncher
> npm install
```

---

**Lancer l'application**

```console
> npm start
```

**Console**

Pour ouvrir la console, utilisez le raccourci clavier suivant :

```console
ctrl + shift + i
```

---

**Installateurs**

Build pour sa plateforme :

```console
> npm run dist
```

Build pour une plateforme spécifique :

| Platform    | Command              |
| ----------- | -------------------- |
| Windows x64 | `npm run dist:win`   |
| macOS       | `npm run dist:mac`   |
| Linux x64   | `npm run dist:linux` |

---
**Aide projet**

* [HeliosLauncher](https://github.com/dscalzi/HeliosLauncher)

---
Copyright 2019 Paladium. All rights reserved.

[nodejs]: https://nodejs.org/en/ 'Node.js'
[git]: https://git-scm.com/ 'Git'
