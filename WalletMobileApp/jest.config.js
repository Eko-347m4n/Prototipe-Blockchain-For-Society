module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|react-native-keychain|@walletconnect/react-native-compat|react-native-url-polyfill)/)',
  ],
  setupFiles: ['./jest.setup.js'],
};