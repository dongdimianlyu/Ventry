module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {},
        'preset-react': {},
        'transform-runtime': {},
        'styled-jsx': {},
        'class-properties': {},
      },
    ],
  ],
  plugins: [
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-private-property-in-object',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-class-static-block',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-do-expressions',
  ],
  // Process specific node modules that need transformation
  overrides: [
    {
      test: /node_modules[\/\\](@firebase|firebase|undici)[\/\\].+\.m?js$/,
      plugins: [
        '@babel/plugin-transform-private-methods',
        '@babel/plugin-transform-private-property-in-object',
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-class-static-block',
      ]
    }
  ],
  compact: true,
  sourceMaps: false,
}; 