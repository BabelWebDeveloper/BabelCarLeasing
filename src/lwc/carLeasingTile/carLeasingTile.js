import {api, LightningElement} from 'lwc';

export default class CarLeasingTile extends LightningElement {

    @api
    car;
    @api
    selectedCarId;

    selectCar() {
        this.selectedCarId = this.car.Product2Id;
        const carselect = new CustomEvent('carselect', {
            detail: {
                carId: this.selectedCarId
            }
        });
        this.dispatchEvent(carselect);
        window.location.href = '/bcl/car-details?recordId=' + this.selectedCarId;
    }
}