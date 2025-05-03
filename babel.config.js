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
  // This ensures babel processes these problematic modules
  ignore: [
    /node_modules\/(?!(@firebase|firebase|undici))/
  ],
  compact: true,
  sourceMaps: false,
  // Explicitly enable private methods transformation for @firebase/auth modules
  overrides: [
    {
      test: /node_modules\/@firebase\/auth/,
      plugins: [
        '@babel/plugin-transform-private-methods',
        '@babel/plugin-transform-private-property-in-object',
        '@babel/plugin-transform-class-properties',
      ]
    }
  ]
}; 