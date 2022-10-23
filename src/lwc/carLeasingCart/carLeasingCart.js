import {LightningElement, wire} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingExperienceCloudController.getActivePricebook';
import userOrder from '@salesforce/apex/CarLeasingExperienceCloudController.getUserOrder';
import userAccountId from '@salesforce/apex/CarLeasingExperienceCloudController.getUserAccountId';
import createOrderAndOrderItem from '@salesforce/apex/CarLeasingExperienceCloudController.createOrderItem';
import {
    publish,
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext
} from 'lightning/messageService';
import sendProductChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';
import recordSelected from '@salesforce/messageChannel/carLeasingSendItemsToCartItems__c';
import cartUrl from '@salesforce/resourceUrl/clcart';


export default class CarLeasingCart extends LightningElement {
    subscription = null;

    userId;
    order;
    activePricebook;
    userAccount;
    carId;
    orderItemsNumber;
    cartItemsNumber;
    showItemsNumberInCart = false;

    manufacturer;
    model;
    picture;
    totalMonthlyPayment;
    carsQuantity;
    contractPeriod;
    startFee;
    unitPrice;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.userId = Id;
        activePricebookId()
            .then((result) => {
                this.activePricebook = result;
            })
            .catch((error) => {
                this.error = error;
            });
        this.subscribeFromMessageChannel();
    }

    @wire(userAccountId, {userId: '$userId'})
    wiredPricebook(result) {
        if (result.data !== undefined) {
            this.userAccount = result.data;
        }
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data !== undefined) {
            this.order = result.data.Id;
            const payload = { orderCart: result };
            console.log('wiredOrder: ' + result.data.Id);
            publish(this.messageContext, recordSelected, payload);
        }
    }

    subscribeFromMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                sendProductChannel,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.carId = message.carId;
        this.manufacturer = message.carManufacturer;
        this.model = message.carModel;
        this.picture = message.carPicture;
        this.totalMonthlyPayment = message.totalMonthlyPayment;
        this.carsQuantity = message.carsQuantity;
        this.contractPeriod = message.contractPeriod;
        this.startFee = message.startFee;
        this.unitPrice = message.unitPrice;
        this.cartItemsNumber = message.cartItemsNumber;
        this.createOrderItem();
    }

    createOrderItem() {
        createOrderAndOrderItem({
            carId: this.carId,
            manufacturer: this.manufacturer,
            model: this.model,
            picture: this.picture,
            totalMonthlyPayment: this.totalMonthlyPayment,
            carsQuantity: this.carsQuantity,
            contractPeriod: this.contractPeriod,
            startFee: this.startFee,
            orderId: this.order,
            userAccountId: this.userAccount,
            unitPrice: this.unitPrice,
        })
            .then((result) => {
            })
            .catch((error) => {
                this.error = error;
            });
    }

    label = {
        cartUrl
    }

    // showOrderItems(){
    //     window.location.href = '/bcl/order-items?recordId=' + this.order;
    // }

    showOrderItems(){
        window.location.href = '/bcl/order-items';
    }

}