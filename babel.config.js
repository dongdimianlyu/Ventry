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
  // Aggressive approach to isolate problematic modules
  overrides: [
    // Process firebase auth modules with all transforms
    {
      include: /node_modules[\\/](@firebase|firebase)[\\/].*\.m?js$/,
      plugins: [
        '@babel/plugin-transform-private-methods',
        '@babel/plugin-transform-private-property-in-object',
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-class-static-block',
      ]
    },
    // Process undici with all transforms
    {
      include: /node_modules[\\/]undici[\\/].*\.m?js$/,
      plugins: [
        '@babel/plugin-transform-private-methods',
        '@babel/plugin-transform-private-property-in-object',
        '@babel/plugin-transform-class-properties',
        '@babel/plugin-transform-class-static-block',
      ]
    }
  ],
  // Exclude all node_modules except the ones we need to transform
  ignore: [
    /node_modules[\\/](?!(@firebase|firebase|undici))/
  ],
  compact: true,
  sourceMaps: false,
}; 