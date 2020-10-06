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

const InitialBalance = 1000000;
const CustomerNameLength = 12;
const OperationTypes = ['transact_savings','deposit_checking','send_payment','write_check', 'amalgamate'];
const Dictionary = 'ABCDEFGHIJKL MNOPQRSTUVWXYZ abcdefghij klmnopqrstuvwxyz';

/**
 * Generate a random string of given length.
 * @param {number} length The length of the string to generate.
 * @returns {string} random string from possible characters
 **/
function generateRandomString(length) {
    let text = '';

    for (let i = 0; i < length; i++) {
        text += Dictionary.charAt(Math.floor(Math.random() * Dictionary.length));
    }
    return text;
}

/**
 * Gets a random integer in the (0,max] interval.
 * @param {number} max The maximum value to generate.
 * @return {number} The generated integer.
 */
function getRandomInteger(max) {
    return Math.ceil(Math.random() * max)
}

/**
 * Class for Smallbank state management.
 */
class Smallbank{
    /**
     * Initializes the Smallbank instance.
     * @param {number} accountsGenerated The number of generated accounts.
     */
    constructor(accountsGenerated = 0) {
        this.accountsGenerated = accountsGenerated;
        this.accountSuffix = '';
    }

    /**
     * Get a random workload operation.
     * @returns {string} Name of random operation.
     **/
    static getRandomOperationName() {
        const index = Math.floor(Math.random() * OperationTypes.length);
        return OperationTypes[index];
    }

    /**
     * Get the arguments for creating an account.
     * @return {object} The arguments of the request.
     */
    getCreateAccountArguments() {
        return {
            customer_id: this._generateAccountNumber(),
            customer_name: generateRandomString(CustomerNameLength),
            initial_checking_balance: InitialBalance,
            initial_savings_balance: InitialBalance,
        };
    }

    /**
     * Get the arguments for a given operation.
     * @param {string} operation The name of the operation.
     * @return {object} The business arguments for the operation.
     */
    getRandomOperationArguments(operation) {
        switch(operation) {
            case 'transact_savings': {
                return {
                    amount: getRandomInteger(200),
                    customer_id: this._getRandomAccountKey()
                };
            }
            case 'deposit_checking': {
                return {
                    'amount': getRandomInteger(200),
                    'customer_id': this._getRandomAccountKey()
                };
            }
            case 'send_payment': {
                const accountKeys = this._getTwoDifferentRandomAccountKeys();
                return {
                    'amount': getRandomInteger(200),
                    'dest_customer_id': accountKeys.accountKey1,
                    'source_customer_id': accountKeys.accountKey2
                };
            }
            case 'write_check': {
                return {
                    'amount': getRandomInteger(200),
                    'customer_id': this._getRandomAccountKey()
                };
            }
            case 'amalgamate': {
                const accountKeys = this._getTwoDifferentRandomAccountKeys();
                return {
                    'dest_customer_id': accountKeys.accountKey1,
                    'source_customer_id': accountKeys.accountKey2
                };
            }
            default: {
                // this shouldn't happen
                throw new Error(`Invalid Smallbank operation: ${operation}`);
            }
        }
    }

    /**
     * Get the arguments for a query.
     * @return {object} The query arguments.
     */
    getQueryArguments() {
        return {
            customer_id: this._getRandomAccountKey()
        };
    }

    /**
     * Sets the account suffix for the current worker.
     * @param {number} workerIndex The index of the current worker.
     * @param {number} totalWorkers The total number of workers.
     */
    setAccountSuffix(workerIndex, totalWorkers) {
        const lengthForLastWorker = (totalWorkers - 1).toString().length;
        this.accountSuffix = workerIndex.toString().padStart(lengthForLastWorker, '0');
    }

    /**
     * Generate a unique and deterministic account number.
     * @returns {Number} The account number.
     **/
    _generateAccountNumber() {
        this.accountsGenerated++;
        return this._getAccountNumberFromIndex(this.accountsGenerated);
    }

    /**
     * Get a random account key.
     * @return {Number} The account key.
     */
    _getRandomAccountKey () {
        return this._getAccountNumberFromIndex(this._getRandomAccountIndex());
    }

    /**
     * Transform an account index to an account number.
     * @param {number} index The account index.
     * @return {number} The account number.
     * @private
     */
    _getAccountNumberFromIndex(index) {
        const accountKeyString = index.toString() + this.accountSuffix.toString();
        return parseInt(accountKeyString);
    }

    /**
     * Get two separate random account keys.
     * @return {{accountKey1:number, accountKey2: number}} The selected account keys.
     */
    _getTwoDifferentRandomAccountKeys() {
        let idx1 = this._getRandomAccountIndex();
        let idx2 = this._getRandomAccountIndex();
        if(idx2 === idx1) {
            // Cheap resolution for selecting the same index (compared to redrawing again, and again).
            // Suppose we remove the first index after selection.
            // If we draw the same index again, that actually refers to the next index in the original array.
            idx2 = (idx2 + 1) % this.accountsGenerated;
        }

        return {
            accountKey1: this._getAccountNumberFromIndex(idx1),
            accountKey2: this._getAccountNumberFromIndex(idx2)
        };
    }

    /**
     * Get a random account index.
     * @return {Number} The account index.
     */
    _getRandomAccountIndex() {
        return Math.floor(Math.random() * this.accountsGenerated);
    }
}

module.exports = Smallbank;
