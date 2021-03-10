const web3 = require("web3");
const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function token(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm;

    before(async () => {
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfer all Dapp token to te farm(1 Million)
        await dappToken.transfer(tokenFarm.address, token('1000000'));

        // Transfer Investor Tokens
        await daiToken.transfer(investor, '100000000000000000000', { from: owner });
    })

    describe('Mock Dai Deployment', async () => {
       it('has a name', async () => {
           let daiToken = await DaiToken.new();
           const name = await daiToken.name();
           assert.equal(name, 'Mock DAI Token');
       })
    })

    describe('Dapp Token Deployment', async () => {
        it('has a name', async () => {
            const name = await dappToken.name();
            assert.equal(name, 'DApp Token');
        })
    })

    describe('Token Farm Deployment', async () => {
        it('has a name', async () => {
            const name = await tokenFarm.name();
            assert.equal(name, 'Dapp Token Farm');
        })
        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address);
            assert.equal(balance.toString(), token('1000000'));
        })
    })
})
