module.exports ={
  verbose: true, // Usando o preset babel-jest
  testEnvironment: 'jsdom', // Ambiente de teste para testes no navegador
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Usando babel para transformar arquivos JS/JSX/TS/TSX
  },
  setupFiles: ['<rootDir>/setupTests.js'], // Arquivo de configuração adicional
};


  