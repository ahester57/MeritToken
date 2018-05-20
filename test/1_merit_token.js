const MeritToken = artifacts.require('MeritToken');

contract("MeritToken", async function(accounts) {
  var app;
  MeritToken.deployed().then((i) => {
  	app = i;	
  })
  
  it('should mint a new token', async function() {
    var receipt = await app.mint(accounts[0], "Qma1fNLFKJc3UYpDTXYdeqn5wQUvf7C7njczimdAA1vxFj");	
    console.log(receipt);
  });

});