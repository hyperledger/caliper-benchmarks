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

let colors = ['blue', 'red', 'green', 'yellow', 'black', 'purple', 'white', 'violet', 'indigo', 'brown'];
let makes = ['Toyota', 'Ford', 'Hyundai', 'Volkswagen', 'Tesla', 'Peugeot', 'Chery', 'Fiat', 'Tata', 'Holden'];
let models = ['Prius', 'Mustang', 'Tucson', 'Passat', 'S', '205', 'S22L', 'Punto', 'Nano', 'Barina'];
let owners = ['Tomoko', 'Brad', 'Jin Soo', 'Max', 'Adrianna', 'Michel', 'Aarav', 'Pari', 'Valeria', 'Shotaro'];

let carNumber;
let txIndex = 0;

module.exports.createCar = async function (bc, workerIndex, args) {

    while (txIndex < args.assets) {
        txIndex++;
        carNumber = 'Client' + workerIndex + '_CAR' + txIndex.toString();
        color = colors[Math.floor(Math.random() * colors.length)];
        make = makes[Math.floor(Math.random() * makes.length)];
        model = models[Math.floor(Math.random() * models.length)];
        owner = owners[Math.floor(Math.random() * owners.length)];

        let myArgs = {
            contractId: 'fabcar',
            contractVersion: 'v1',
            contractFunction: 'createCar',
            contractArguments: [carNumber, make, model, color, owner],
            timeout: 30
        };

        await bc.sendRequests(myArgs);
    }

};
