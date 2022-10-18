import {api, track, LightningElement, wire} from 'lwc';
import carDeleteBackend from '@salesforce/apex/CarLeasingExperienceCloudController.deleteOrderItem';

export default class CarLeasingDeleteItemFromCart extends LightningElement {
    @api
    car;
    @api
    selectedCarId;
    @api
    orderId;
    @api
    itemId;

    @track
    totalQuantity;

    carDelete() {
        this.selectedCarId = this.car.Product2Id;
        this.orderId = this.car.OrderId;
        this.itemId = this.car.Id;
        this.totalQuantity = this.car.length;
        carDeleteBackend({
            orderItemId: this.car.Id
        })
            .then((result) => {
                console.log(result);
            })
            .catch((error) => {
                this.error = error;
            });
        window.location.reload();
    }
}