import {LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingExperienceCloudController.getActivePricebook';
import userOrder from '@salesforce/apex/CarLeasingExperienceCloudController.getUserOrder';
import userAccountId from '@salesforce/apex/CarLeasingExperienceCloudController.getUserAccountId';
import createOrderAndOrderItem from '@salesforce/apex/CarLeasingExperienceCloudController.createOrderItem';
import {subscribe, MessageContext} from 'lightning/messageService';
import sendProductChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';

export default class CarLeasingCart extends LightningElement {
    subscription = null;

    @track
    userId;
    order;
    activePricebook;
    userAccount;
    carId;

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
        console.log('userId: ' + Id);
        this.userId = Id;
        activePricebookId()
            .then((result) => {
                this.activePricebook = result;
                console.log('activePricebookId: ' + result);
            })
            .catch((error) => {
                this.error = error;
                console.log('Error is', this.error);
            });
        this.subscribeFromMessageChannel();
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
        console.log(this.carId);
        console.log(this.manufacturer);
        console.log(this.model);
        console.log(this.picture);
        console.log(this.totalMonthlyPayment);
        console.log(this.carsQuantity);
        console.log(this.contractPeriod);
        console.log(this.startFee);
        console.log(this.unitPrice);
        this.createOrderItem();
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data !== undefined) {
            this.order = result.data.Id;
            console.log('order: ' + result.data.Id);
        }
    }

    @wire(userAccountId, {userId: '$userId'})
    wiredPricebook(result) {
        if (result.data !== undefined) {
            this.userAccount = result.data;
            console.log('user account id: ' + result.data);
            console.log('order: ' + this.order);
        }
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
                console.log(result);
            })
            .catch((error) => {
                this.error = error;
            });
    }
}