'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

class SimpleState {
    constructor(workerIndex, moneyToTransfer, accounts = 0) {
        this.accountsGenerated = accounts;
        this.moneyToTransfer = moneyToTransfer;
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
            target: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            amount: this.moneyToTransfer
        };
    }
}

module.exports = SimpleState;
