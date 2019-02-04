# @ecabuk/wp-version-bumper

## Install
```sh
yarn add -D @ecabuk/wp-version-bumper
```

## Setup

On your `gulpfile.js` file.
```js
const path = require('path');
const {task} = require('gulp');

task('version', require('@ecabuk/wp-version-bumper')([{
        file: path.resolve(__dirname, 'plugin.php'), // File path
        search: /Version: (.*)/,                     // Search RegExp
        replace: 'Version: #NEW_VERSION#'            // Replace String. #NEW_VERSION# will be replaced with the new version number.
    }]
));
```


## Usage
```sh
gulp version [--major|minor|path [version]] [--prerelease <alpha|beta|rc>]
```

---

#### Displays the current version.
```sh
gulp version
```

#### Increases the major version.
```sh
gulp version --major
```

#### Sets minor version to 12.
```sh
gulp version --minor 12
```

#### Sets version to 1.0.0.
```sh
gulp version --major 1 --minor 0 --patch 0
```

#### Sets a pre-release version.
```sh
gulp version --minor --prerelease rc
```