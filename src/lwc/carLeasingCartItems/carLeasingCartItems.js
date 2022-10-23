import {LightningElement, track, wire} from 'lwc';
import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/carLeasingSendItemsToCartItems__c';
import createOrder from '@salesforce/apex/CarLeasingExperienceCloudController.setActiveOrder';
import Cart_items from '@salesforce/label/c.Cart_items';
import Quantity from '@salesforce/label/c.Quantity';
import Your_cart_is_empty from '@salesforce/label/c.Your_cart_is_empty';
import Piece from '@salesforce/label/c.Piece';
import Summary from '@salesforce/label/c.Summary';
import Total_cost from '@salesforce/label/c.Total_cost';
import LightningAlert from 'lightning/alert';

export default class CarLeasingCartItems extends LightningElement {
    subscription = null;

    @track
    orderId;
    orderItems;
    checkoutItems = [];
    showConnectedMessage = false;
    totalCost = 0;
    isLoading;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.isLoading = true;
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                recordSelected,
                (message) => this.handleMessage(message),
                { scope: APPLICATION_SCOPE }
            );
        }
    }

    handleMessage(result) {
        console.log(result);
        this.orderItems = result.orderCart.data.OrderItems;
        this.orderId = result.orderCart.data.Id;
        this.calculateTotalCost();
    }

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
        if (this.totalCost !== 0){
            this.showConnectedMessage = true;
        }
        this.isLoading = false;
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
        console.log(this.orderId);
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
                        window.location.href = "/bcl/orders";
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