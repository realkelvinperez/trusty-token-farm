const web3 = require("web3");
const TokenFarm = artifacts.require("TokenFarm");
const DaiToken = artifacts.require("DaiToken");
const DappToken = artifacts.require("DappToken");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    // Helper function to convert ints to wei
    return web3.utils.toWei(n, 'ether');
}

contract('TokenFarm', ([owner, investor]) => {
    let daiToken, dappToken, tokenFarm;

    before(async () => {
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);

        // Transfer all Dapp token to te farm(1 Million)
        await dappToken.transfer(tokenFarm.address, tokens('1000000'));

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
            assert.equal(balance.toString(), tokens('1000000'));
        })
    })

    describe('Farming Tokens', async () => {
        it('Rewards investors for staking mDai tokens', async () => {
            let result;
            // Check investor balance before staking
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('100'), 'investor Mock DAI wallet balance correct before staking')
            // Stake Mock DAI Tokens

            // Approve
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: investor })
            // Stake
            await tokenFarm.stakeTokens(tokens('100'), { from: investor })

            // Check Staking Result
            result = await daiToken.balanceOf(investor);
            assert.equal(result.toString(), tokens('0'), 'investor Mock DAI wallet balance correct after staking')

            // Check TokenFarm has recived the staked mDai
            result = await daiToken.balanceOf(tokenFarm.address);
            assert.equal(result.toString(), tokens('100'), 'Token Farm Mock Dai Balance Correct After Staking')

            // Check if investor received dApp Tokens
            result = await tokenFarm.stakingBalance(investor);
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct after staking')

            // Check investor Staking status
            result = await tokenFarm.isStaking(investor);
            assert.equal(result.toString(), 'true', 'investor staking status correct after staking')
        })
    })
})
