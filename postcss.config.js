module.exports = {
  plugins: [
    require("autoprefixer")({
      overrideBrowserslist: [
        "> 1%",
        "last 3 versions",
        "ios >= 8",
        "android >= 4",
        "safari >= 6",
        "chrome >= 34",
      ],
    }),
    require("stylelint")({
      config: {
        rules: {
          "declaration-no-important": true,
        },
      },
    }),
  ],
};
