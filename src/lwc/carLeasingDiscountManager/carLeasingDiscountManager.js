import {api, LightningElement, track} from 'lwc';
import createDiscount from '@salesforce/apex/CarLeasingDiscountController.CreatePricebook';
import getAllPriceBooks from '@salesforce/apex/CarLeasingDiscountController.GetAllPriceBooks';
import getAllProducts from '@salesforce/apex/CarLeasingDiscountController.getAllProducts';
import getAssignPricebookToProduct from '@salesforce/apex/CarLeasingDiscountController.AssignPricebookToProduct';
import removePricebook from '@salesforce/apex/CarLeasingDiscountController.deletePricebook';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {NavigationMixin} from "lightning/navigation";

const columns = [
    {label: 'PriceBook Name', fieldName: 'Name'},
    {label: 'Percent Discount', fieldName: 'Percent_discount__c'},
    {label: 'Currency Discount', fieldName: 'Currency_discount__c'},
];

const productColumns = [
    {label: 'Manufacturer', fieldName: 'Manufacturer__c'},
    {label: 'Model', fieldName: 'Model__c'},
]

export default class CarLeasingDiscountManager extends NavigationMixin(LightningElement) {
    columns = columns;
    productColumns = productColumns;

    @track
    isNewPricebookModalOpen = false;
    newDiscount;
    isLoading;
    priceBooks;
    products;

    openPricebookModal() {
        this.isNewPricebookModalOpen = true;
    }

    closePricebookModal() {
        this.isNewPricebookModalOpen = false;
    }

    get options() {
        return [
            {label: 'Percent', value: 'Percent'},
            {label: 'Currency', value: 'Currency'},
        ];
    }

    discountType = '';
    discountValue;
    discountName = '';

    handleDiscountType(event) {
        this.discountType = event.detail.value;
    }

    handleDiscountName(event) {
        this.discountName = event.detail.value;
    }

    handleDiscountValue(event) {
        this.discountValue = event.detail.value;
    }

    createPricebook() {
        this.isLoading = true;
        let discountWrapper = {
            discountValue: this.discountValue,
            discountType: this.discountType,
            discountName: this.discountName
        }
        createDiscount({wrapper: discountWrapper})
            .then(result => {
                this.newDiscount = result;
                console.log(result);
            })
            .then(() => {
                this.getUpdatedListOfPriceBooks();
            })
            .then(() => {
                window.location.reload();
            })
            .then(() => {
                this.isNewPricebookModalOpen = false;
            })
            .catch(error => {
                this.error = error;
                console.log('Error is ' + this.error);
            });
    }

    connectedCallback() {
        this.isLoading = true;
        getAllPriceBooks()
            .then((result) => {
                this.priceBooks = result;
                console.log(result);
            })
            .then(() => {
                this.assignAllProducts();
            })
            .then(() => {
                this.isLoading = false;
            })
    }

    getUpdatedListOfPriceBooks() {
        getAllPriceBooks()
            .then((result) => {
                this.priceBooks = result;
                console.log(result);
            })
            .then(() => {
                this.isLoading = false;
            })
    }

    assignAllProducts() {
        getAllProducts()
            .then(results => {
                this.products = results;
            })
    }

    selectedDiscountId;

    getSelectedDiscount(event) {
        const selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++) {
            console.log(selectedRows[i].Id);
            this.selectedDiscountId = selectedRows[i].Id;
        }
    }

    selectedProductIdsProxy = [];

    getSelectedName(event) {
        let currentRows = event.detail.selectedRows;
        if (this.selectedProductIdsProxy.length > 0) {
            let selectedIds = currentRows.map(row => row);
            let unselectedRows = this.selectedProductIdsProxy.filter(row => !selectedIds.includes(row));
        }
        this.selectedProductIdsProxy = currentRows;
        this.fillSelectedProductIds();
    }

    selectedProductIds = [];

    fillSelectedProductIds() {
        this.selectedProductIdsProxy.forEach(product => {
            this.selectedProductIds.push(product);
        })
    }

    assignPricebookToProduct() {
        getAssignPricebookToProduct({
            product2s: this.selectedProductIds,
            pricebook2Id: this.selectedDiscountId
        })
            .then(() => {
                let toastMessage = {
                    title: 'Success!',
                    message: 'Pricebook successfully assigned to product!',
                    variant: 'success',
                }
                this.showNotification(toastMessage);
            })
            .catch((error) => {
                let errorMessage = {
                    title: 'Error',
                    message: error,
                    variant: 'error',
                }
                this.showNotification(errorMessage);
            })
    }

    removeDiscount(){
        removePricebook({pricebookId: this.selectedDiscountId})
            .then(() => {
                let toastMessage = {
                    title: 'Success!',
                    message: 'Pricebook successfully removed!',
                    variant: 'success',
                }
                this.showNotification(toastMessage);
            })
            .then(() => {
                window.location.reload();
            })
            .catch((error) => {
                let errorMessage = {
                    title: 'Error',
                    message: error,
                    variant: 'error',
                }
                this.showNotification(errorMessage);
            })
    }

    editDiscount() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.selectedDiscountId,
                objectApiName: 'Pricebook2',
                actionName: 'view'
            }
        });
    }

    showNotification(toastMessage) {
        const evt = new ShowToastEvent({
            title: toastMessage.title,
            message: toastMessage.message,
            variant: toastMessage.variant,
        });
        this.dispatchEvent(evt);
    }
}