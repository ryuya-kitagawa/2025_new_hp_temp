module.exports = {
  plugins: [
    require('autoprefixer')({
      cascade: false,
    }),
    require('css-mqpacker')({
      sort: true,
    }),
  ],
};

