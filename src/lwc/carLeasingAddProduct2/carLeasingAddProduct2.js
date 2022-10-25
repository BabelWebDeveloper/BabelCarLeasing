import {LightningElement, wire, track} from 'lwc';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import PRODUCT2_OBJECT from '@salesforce/schema/Product2';
import ENGINE_TYPE from '@salesforce/schema/Product2.Engine_Type__c';
import GEARBOX_TYPE from '@salesforce/schema/Product2.Gearbox__c';
import BODY_TYPE from '@salesforce/schema/Product2.Body_Type__c';
import saveCar from '@salesforce/apex/CarLeasingAdminController.saveCarLwc';
import getPictureUrl from '@salesforce/apex/CarLeasingAdminController.getPictureUrl';
import updateContentVersion from '@salesforce/apex/CarLeasingAdminController.updateContentVersion';
import {refreshApex} from "@salesforce/apex";
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class CarLeasingAddProduct2 extends LightningElement {
    @track
    isImageModalOpen = false;
    newCarId;

    manufacturer;
    model;
    horsepower;
    productionYear;
    review;
    price;
    numberOfSeats;
    acceleration;
    averageFuelConsumption;
    engineCapacity;
    height;
    width;
    length;
    theSizeOfTheWheels;
    pictureUrl;
    bodyType = '';
    gearbox = '';
    engineType = '';

    @wire(getObjectInfo, {objectApiName: PRODUCT2_OBJECT})
    accountMetadata;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId',
            fieldApiName: ENGINE_TYPE
        }
    )
    engineTypePicklist;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId',
            fieldApiName: GEARBOX_TYPE
        }
    )
    gearboxTypePicklist;

    @wire(getPicklistValues,
        {
            recordTypeId: '$accountMetadata.data.defaultRecordTypeId',
            fieldApiName: BODY_TYPE
        }
    )
    bodyTypePicklist;

    handleManufacturer(event) {
        this.manufacturer = event.target.value;
    }

    handleModel(event) {
        this.model = event.target.value;
    }

    handleHorsepower(event) {
        this.horsepower = event.target.value;
    }

    handleProductionYear(event) {
        this.productionYear = event.target.value;
    }

    handleReview(event) {
        this.review = event.target.value;
    }

    handlePrice(event) {
        this.price = event.target.value;
    }

    handleNumberOfSeats(event) {
        this.numberOfSeats = event.target.value
    }

    handleAcceleration(event) {
        this.acceleration = event.target.value
    }

    handleAverageFuelConsumption(event) {
        this.averageFuelConsumption = event.target.value
    }

    handleEngineCapacity(event) {
        this.engineCapacity = event.target.value
    }

    handleHeight(event) {
        this.height = event.target.value;
    }

    handleWidth(event) {
        this.width = event.target.value;
    }

    handleLength(event) {
        this.length = event.target.value;
    }

    handleTheSizeOfTheWheels(event) {
        this.theSizeOfTheWheels = event.target.value;
    }

    handleEngineType(event) {
        this.engineType = event.target.value;
    }

    handleGearboxType(event) {
        this.gearbox = event.target.value;
    }

    handleBodyType(event) {
        this.bodyType = event.target.value;
    }

    saveCar() {
        const wrapper = {
            pictureUrl: this.pictureUrl,
            manufacturer: this.manufacturer,
            model: this.model,
            horsepower: this.horsepower,
            productionYear: this.productionYear,
            review: this.review,
            price: this.price,
            bodyType: this.bodyType,
            gearbox: this.gearbox,
            engineType: this.engineType,
            numberOfSeats: this.numberOfSeats,
            acceleration: this.acceleration,
            averageFuelConsumption: this.averageFuelConsumption,
            engineCapacity: this.engineCapacity,
            carHeight: this.height,
            carWidth: this.width,
            carLength: this.length,
            theSizeOfTheWheels: this.theSizeOfTheWheels
        }
        console.log(wrapper);
        saveCar({carWrapper: wrapper})
            .then((result) => {
                this.newCarId = result;
            })
            .then(() => {
                this.isImageModalOpen = true;
            })
            .catch((error) => {
                this.error = error;
            });

    }

    closeModal() {
        this.isImageModalOpen = false;
    }
    assignPictureToCar() {
        updateContentVersion({
            productId: this.newCarId,
            contentDocumentIds: this.contentDocumentIds
        })
            .then(() => {
                this.isImageModalOpen = false;
            })
    }

    get acceptedFormats() {
        return [".pdf", ".png", ".jpg", ".jpeg"];
    }

    @track
    contentDocumentIds = [];

    handleUploadFinished(event) {
        const uploadedFiles = event.detail.files;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: uploadedFiles.length + " Files Uploaded Successfully.",
                variant: "success"
            })
        );
        uploadedFiles.forEach(file => this.contentDocumentIds.push(file.documentId));
    }

    handleUploadProfileFinished(event) {
        const uploadedFiles = event.detail.files;
        let uploadImageId;
        refreshApex(this.wiredActivities);
        this.dispatchEvent(
            new ShowToastEvent({
                title: "Success!",
                message: uploadedFiles.length + " Files Uploaded Successfully.",
                variant: "success"
            })
        );
        uploadedFiles.forEach(file => uploadImageId = file.documentId);
        getPictureUrl({
            id: uploadImageId
        })
            .then((result) => {
                this.pictureUrl = result;
            })
    }
}