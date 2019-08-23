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

package org.hyperledger.fabric.samples.fabcar;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

public final class CarTest {

    @Nested
    class Equality {

        @Test
        public void isReflexive() {
            Car car = new Car("Toyota", "Prius", "blue", "Tomoko");

            assertThat(car).isEqualTo(car);
        }

        @Test
        public void isSymmetric() {
            Car carA = new Car("Toyota", "Prius", "blue", "Tomoko");
            Car carB = new Car("Toyota", "Prius", "blue", "Tomoko");

            assertThat(carA).isEqualTo(carB);
            assertThat(carB).isEqualTo(carA);
        }

        @Test
        public void isTransitive() {
            Car carA = new Car("Toyota", "Prius", "blue", "Tomoko");
            Car carB = new Car("Toyota", "Prius", "blue", "Tomoko");
            Car carC = new Car("Toyota", "Prius", "blue", "Tomoko");

            assertThat(carA).isEqualTo(carB);
            assertThat(carB).isEqualTo(carC);
            assertThat(carA).isEqualTo(carC);
        }

        @Test
        public void handlesInequality() {
            Car carA = new Car("Toyota", "Prius", "blue", "Tomoko");
            Car carB = new Car("Ford", "Mustang", "red", "Brad");

            assertThat(carA).isNotEqualTo(carB);
        }

        @Test
        public void handlesOtherObjects() {
            Car carA = new Car("Toyota", "Prius", "blue", "Tomoko");
            String carB = "not a car";

            assertThat(carA).isNotEqualTo(carB);
        }

        @Test
        public void handlesNull() {
            Car car = new Car("Toyota", "Prius", "blue", "Tomoko");

            assertThat(car).isNotEqualTo(null);
        }
    }

    @Test
    public void toStringIdentifiesCar() {
        Car car = new Car("Toyota", "Prius", "blue", "Tomoko");

        assertThat(car.toString()).isEqualTo("Car@61a77e4f [make=Toyota, model=Prius, color=blue, owner=Tomoko]");
    }
}
