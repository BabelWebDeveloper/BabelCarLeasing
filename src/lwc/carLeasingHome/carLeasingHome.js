import {LightningElement} from 'lwc';
import carLeasingLogoTransparent from '@salesforce/resourceUrl/cllogo';
import backgroundUrl from '@salesforce/resourceUrl/clbgcbmw';
import Find_your_perfect_lease from '@salesforce/label/c.Find_your_perfect_lease';
import For_companies_and_customers  from '@salesforce/label/c.For_companies_and_customers';
import Flexible_financing  from '@salesforce/label/c.Flexible_financing';
import Extra_benefits  from '@salesforce/label/c.Extra_benefits';
import Find_your_car  from '@salesforce/label/c.Find_your_car';

export default class CarLeasingHome extends LightningElement {
    get backgroundStyle() {
        return `height:50rem;background-image:url(${backgroundUrl})`;
    }

    label = {
        carLeasingLogoTransparent,
        Find_your_perfect_lease,
        For_companies_and_customers,
        Flexible_financing,
        Extra_benefits,
        Find_your_car
    };
}