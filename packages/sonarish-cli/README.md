# sonarish-cli

`sonarish` measures your code quality.

WIP

```
npm install -g sonarish-cli
```

You can use `sonarish` and `sonarish-server` commands.

## How to use

```
$ cd your-project
$ sonarish . # Show sonarish stats
```

Using your `.sonarishrc.json`

```json
{
  "eslintOptions": {
    "parser": "babel-eslint",
    "useEslintrc": true
  },
  "extends": ["sonarish-ruleset/recommended"],
  "prefer": "sonarish|eslint",
  "scoreRules": {
    "code-quality": [
      {
        "rule": "prefer-arrow-callback",
        "priority": 2
      }
    ]
  }
}
```

## sonarish-server

```
$ sonarish-server init
$ sonarish-server add https://github.com/recruit-tech/sonarish.git
$ sonarish-server gen-stats
$ sonarish-server start -p 5000
```

Open your browser
