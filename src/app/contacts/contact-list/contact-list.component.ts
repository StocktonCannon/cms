import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {Contact} from '../contact.model'
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  subscription: Subscription;
  contacts: Contact[] = [];
  term: string;

  constructor(private contactService: ContactService) { }
  ngOnInit() {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts:Contact[]) => {
        this.contacts = contacts;
      }
    );
    this.contactService.getContacts();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // onSelected(contact: Contact) {
  //   this.contactService.contactSelectedEvent.emit(contact);
  // }

  search(value:string){
    this.term = value;
  }

}
