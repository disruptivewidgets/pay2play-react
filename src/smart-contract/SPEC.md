# pay2play-smart-contracts

* Deploy token_ERC20.sol
* Obtain contract address after deployment [A] ("0xe1ebf9518fd31426baad9b36cca87b80096be8ef")
* Update dApp to reflect
* Update interfaces.js
* Deploy Pay2Play.sol (use [A] for tokenNode input)
* Obtain contract address [B] ("0xe018598af2954cb1717b2dff610e13a18587b044")
* Update dApp to reflect
* Update interfaces.js
* Transfer token amount from TokenContract to Registrar (500,000,000) 1,000,000,000
* transfer("0xe018598af2954cb1717b2dff610e13a18587b044", 500000000) [B]
* Verify transfer
* balanceOf ("0xe018598af2954cb1717b2dff610e13a18587b044") [B]
* set secret
