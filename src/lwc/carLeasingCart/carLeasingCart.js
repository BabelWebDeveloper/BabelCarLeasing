import {LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingExperienceCloudController.getActivePricebook';
import userOrder from '@salesforce/apex/CarLeasingExperienceCloudController.getUserOrder';
import userOrderItems from '@salesforce/apex/CarLeasingExperienceCloudController.getOrderItems';
import userAccountId from '@salesforce/apex/CarLeasingExperienceCloudController.getUserAccountId';
import createOrderAndOrderItem from '@salesforce/apex/CarLeasingExperienceCloudController.createOrderItem';
import {subscribe, MessageContext} from 'lightning/messageService';
import sendProductChannel from '@salesforce/messageChannel/carLeasingSendProductChannel__c';
import cartUrl from '@salesforce/resourceUrl/clcart';


export default class CarLeasingCart extends LightningElement {
    subscription = null;

    @track
    userId;
    order;
    activePricebook;
    userAccount;
    carId;
    orderItems;
    orderItemsNumber;

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
            })
            .catch((error) => {
                this.error = error;
                console.log('Error is', this.error);
            });
        activePricebookId()
            .then((result) => {
                this.activePricebook = result;
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
        this.createOrderItem();
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data !== undefined) {
            this.order = result.data.Id;
            // console.log(result);
        }
    }

    @wire(userAccountId, {userId: '$userId'})
    wiredPricebook(result) {
        if (result.data !== undefined) {
            this.userAccount = result.data;
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
                // console.log(result);
            })
            .catch((error) => {
                this.error = error;
            });
    }

    @wire(userOrderItems, {orderId: '$order'})
    wiredOrderItems(result) {
        if (result.data !== undefined) {
            this.orderItemsNumber = result.data.length;
        }
    }

    label = {
        cartUrl
    }

    showOrderItems(){
        window.location.href = '/bcl/order-items?recordId=' + this.order;
    }
}