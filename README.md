# Sonarish

WIP

Opinionated code metrics reporter based on eslint

## How to dev

```sh
git clone git@github.com:recruit-tech/sonarish.git
cd sonarish
npm install
lerna bootstrap
npm start
```

## Architecture

```
- core : Scoring
- cli <- core : Download modules via fs and git and generate results of core's score
- web : Read score dump and display
- eslint-plugin-sonarish : Advanced eslint rules

```

## License

MIT
