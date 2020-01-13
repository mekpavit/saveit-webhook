// babel.config.js
module.exports = {
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env'
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-transform-runtime',
    "transform-class-properties"
  ]
};