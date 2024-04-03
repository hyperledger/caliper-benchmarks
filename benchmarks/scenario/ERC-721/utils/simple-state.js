'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

class SimpleState {
    constructor(workerIndex, tokenId = 101, accounts = 0) {
        this.accountsGenerated = accounts;
        this.tokenId = tokenId;
        this.accountPrefix = this._get26Num(workerIndex);
    }

    _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    getTransferArguments() {
        const args = {
            from: "0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09",
            to: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            tokenId: this.tokenId
        };
        this.tokenId++;
        return args;
    }

    getMintArguments() {
        const args = {
            to: "0xD1cf9D73a91DE6630c2bb068Ba5fDdF9F0DEac09",
            tokenId: this.tokenId
        };
        this.tokenId++;
        return args;
    }
}

module.exports = SimpleState;
