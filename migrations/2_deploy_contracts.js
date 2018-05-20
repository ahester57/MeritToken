var MeritToken = artifacts.require("./MeritToken.sol");

module.exports = function(deployer) {
  deployer.deploy(MeritToken, "MeritToken", "MRT");
};
