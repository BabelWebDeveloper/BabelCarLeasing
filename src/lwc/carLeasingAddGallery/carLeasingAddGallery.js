import {LightningElement, track} from 'lwc';
import {refreshApex} from "@salesforce/apex";
import {ShowToastEvent} from "lightning/platformShowToastEvent";

export default class CarLeasingAddGallery extends LightningElement {

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
        console.log(this.contentDocumentIds);
    }
}