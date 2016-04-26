module.exports = {
    "env": {
        "node": true,
        "mocha": true,
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": 0, 
        "no-unused-vars": 1,
        "consistent-return": 0,
        'react/sort-comp': 0,
        'react/prop-types': 0,
        'react/jsx-closing-bracket-location': 0,
    }
};