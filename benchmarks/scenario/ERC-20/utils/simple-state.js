/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

const Dictionary = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Class for managing simple account states.
 */
class SimpleState {

    /**
     * Initializes the instance.
     */
    constructor(workerIndex, moneyToTransfer, accounts = 0) {
        this.accountsGenerated = accounts;
        this.moneyToTransfer = moneyToTransfer;
        this.accountPrefix = this._get26Num(workerIndex);
    }

    /**
     * Generate string by picking characters from the dictionary variable.
     * @param {number} number Character to select.
     * @returns {string} string Generated string based on the input number.
     * @private
     */
    _get26Num(number){
        let result = '';

        while(number > 0) {
            result += Dictionary.charAt(number % Dictionary.length);
            number = parseInt(number / Dictionary.length);
        }

        return result;
    }

    /**
     * Get the arguments for transfering money between accounts.
     * @returns {object} The account arguments.
     */
    getTransferArguments() {
        return {
            target: "0xf17f52151EbEF6C7334FAD080c5704D77216b732",
            amount: this.moneyToTransfer
        };
    }
}

module.exports = SimpleState;
