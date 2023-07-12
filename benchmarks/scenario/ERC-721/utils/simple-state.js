'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

class SimpleState {
    constructor(workerIndex, tokenId, accounts = 0) {
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
        return {
            from: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            to: "0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef",
            tokenId: this.tokenId
        };
    }

    getMintArguments() {
        return {
            to: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            tokenId: this.tokenId
        };
    }
}

module.exports = SimpleState;