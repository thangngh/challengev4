module.exports = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@context': './src/context',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@pages': './src/pages',
            '@store': './src/store',
            '@styles': './src/styles',
            '@utils': './src/utils',
            '@lib': './src/lib',
          },
        },
      ],
    ],
  };
