import {LightningElement, wire, track} from 'lwc';
import Id from '@salesforce/user/Id';
import activePricebookId from '@salesforce/apex/CarLeasingCartController.getActivePricebook';
import userOrder from '@salesforce/apex/CarLeasingCartController.getUserOrder';
import userOrderItems from '@salesforce/apex/CarLeasingCartController.getOrderItems';
import userAccountId from '@salesforce/apex/CarLeasingCartController.getUserAccountId';
import createOrderAndOrderItem from '@salesforce/apex/CarLeasingCartController.createOrderItem';
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
        activePricebookId()
            .then((result) => {
                this.activePricebook = result;
            })
            .catch((error) => {
                this.error = error;
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
        this.cartItemsNumber = message.cartItemsNumber;
        this.createOrderItem();
    }

    @wire(userOrder, {userId: '$userId'})
    wiredOrder(result) {
        if (result.data !== undefined) {
            this.order = result.data.Id;
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
            })
            .catch((error) => {
                this.error = error;
            });
    }

    @wire(userOrderItems, {orderId: '$order'})
    wiredOrderItems(result) {
        if (result.data !== undefined) {
            this.orderItemsNumber = result.data.length;
            if (this.orderItemsNumber > 0) {
                this.showItemsNumberInCart = true;
            }
        }
    }

    label = {
        cartUrl
    }

    showOrderItems(){
        window.location.href = '/bcl/order-items?recordId=' + this.order;
    }
}