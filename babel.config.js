module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./app'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './app',
            '@components': './app/components',
            '@screens': './app/screens',
            '@config': './app/config',
            '@utils': './app/utils',
            '@types': './app/types'
          }
        }
      ],
      'react-native-reanimated/plugin',
    ],
  };
}; 