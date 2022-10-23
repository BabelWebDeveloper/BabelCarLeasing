import {LightningElement, track, wire} from 'lwc';
import userOrderItems from '@salesforce/apex/CarLeasingExperienceCloudController.getOrderItems';
import createOrder from '@salesforce/apex/CarLeasingExperienceCloudController.setActiveOrder';
import Cart_items from '@salesforce/label/c.Cart_items';
import Quantity from '@salesforce/label/c.Quantity';
import Your_cart_is_empty from '@salesforce/label/c.Your_cart_is_empty';
import Piece from '@salesforce/label/c.Piece';
import Summary from '@salesforce/label/c.Summary';
import Total_cost from '@salesforce/label/c.Total_cost';
import LightningAlert from 'lightning/alert';

export default class CarLeasingCartItems extends LightningElement {
    @track
    orderId;
    orderItems;
    totalCost = 0;
    checkoutItems = [];
    message = '';
    showConnectedMessage = false;

    billingStreet = '';
    billingCity = '';
    billingStateProvince = '';
    billingCountry = '';
    billingZipPostalCode = '';

    label = {
        Cart_items,
        Quantity,
        Your_cart_is_empty,
        Piece,
        Summary,
        Total_cost
    }

    connectedCallback() {
        let record = this.getOrderId();
        this.orderId = record.recordId;
    }

    getOrderId() {
        let params = {};
        let search = location.search.substring(1);

        if (search) {
            params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
                return key === "" ? value : decodeURIComponent(value)
            });
        }

        return params;
    }

    @wire(userOrderItems, {orderId: '$orderId'})
    wiredOrderItems(result) {
        console.log(result.data.length);
        if (result.data.length !== 0){
            this.showConnectedMessage = true;
        } else {
            this.showConnectedMessage = false;
        }
        this.orderItems = result.data;
        this.calculateTotalCost();
    }

    calculateTotalCost() {
        let cartItem;
        for (let i = 0; i < this.orderItems.length; i++) {
            let totalCostOfOneItem = this.orderItems[i].Quantity * this.orderItems[i].UnitPrice;
            this.totalCost += totalCostOfOneItem;
            cartItem = {
                cartItemQuantity: this.orderItems[i].Quantity,
                cartItemUnitPrice: this.orderItems[i].UnitPrice,
                cartItemManufacturer: this.orderItems[i].Product2.Manufacturer__c,
                cartItemModel: this.orderItems[i].Product2.Model__c,
                cartItemCostItem: totalCostOfOneItem,
                cartItemId: this.orderItems[i].Product2.Id
            }
            this.checkoutItems.push(cartItem);
        }
        this.totalCost = this.totalCost.toFixed(2);
    }

    handleBilling() {
        this.billingStreet = event.target.value;
    }
    handleCity() {
        this.billingCity = event.target.value;
    }
    handleStateProvince() {
        this.billingStateProvince = event.target.value;
    }
    handleCountry() {
        this.billingCountry = event.target.value;
    }
    handleZipPostalCode() {
        this.billingZipPostalCode = event.target.value;
    }

    checkout() {
        this.isLoading = true;
        if (
            this.billingStreet === "" ||
            this.billingCity === "" ||
            this.billingStateProvince === "" ||
            this.billingCountry === "" ||
            this.billingZipPostalCode === ""
        ) {
            this.message = 'Please fill all empty fields.'
        }
        else {
            this.message = '';
            this.createActiveOrder();
        }
    }

    createActiveOrder(){
        createOrder({
            billingStreet: this.billingStreet,
            billingCity: this.billingCity,
            billingStateProvince: this.billingStateProvince,
            billingCountry: this.billingCountry,
            billingZipPostalCode: this.billingZipPostalCode,
            orderId: this.orderId
        })
            .then(() => {
                this.showCheckoutMessage()
                    .then(()=> {
                        this.orderItems = false;
                    })
                    .then(() => {
                        this.isLoading = false;
                    })
                    .then(() => {
                        window.location.href = "/bcl/";
                    })
                    .catch((error) => {
                        this.error = error;
                    });
            })
            .catch((error) => {
                this.error = error;
            });
    }
    async showDeleteMessage() {
        await LightningAlert.open({
            message: 'Product has been deleted from your cart.',
            theme: 'default'
        })
            .then(() => {
                window.location.reload();
            })
    }

    async showCheckoutMessage() {
        await LightningAlert.open({
            message: 'Thank you. Your order is being prepared.',
            theme: 'default'
        })
            .then(() => {
                window.location.reload();
            })
    }
}