import {api, LightningElement, track} from 'lwc';
import createDiscount from '@salesforce/apex/CarLeasingDiscountController.CreatePricebook';
import getAllPriceBooks from '@salesforce/apex/CarLeasingDiscountController.GetAllPriceBooks';
import getAllProducts from '@salesforce/apex/CarLeasingDiscountController.getAllProducts';
import getAssignPricebookToProduct from '@salesforce/apex/CarLeasingDiscountController.AssignPricebookToProduct';

const columns = [
    {label: 'PriceBook Name', fieldName: 'Name'},
];

const productColumns = [
    {label: 'Manufacturer', fieldName: 'Manufacturer__c'},
    {label: 'Model', fieldName: 'Model__c'},
]

export default class CarLeasingDiscountManager extends LightningElement {
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
                console.log(this.products);
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
            .then(result => {
                console.log(result)
            })
    }
}