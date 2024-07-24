const {
  addDecoratorsLegacy,
  disableEsLint,
  override,
} = require("customize-cra");

// 사용자 정의 webpack 설정
module.exports = {
  webpack: override(disableEsLint(), addDecoratorsLegacy()),
};
