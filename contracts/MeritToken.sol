pragma solidity ^0.4.23;

import "./ERC721Token.sol";
import "./SafeMath.sol";

contract MeritToken is ERC721Token { 

  mapping(uint256 => string) public transcripts;

	
  constructor(string _name, string _symbol)
    ERC721Token(_name, _symbol) public {

  }

  function mint(address _to, string _transcriptHash) public {
  	uint256 tokenId = totalSupply();
    super._mint(_to, tokenId);
  	transcripts[tokenId] = _transcriptHash;
  }

}
