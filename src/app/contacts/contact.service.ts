import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  maxContactId: number;

  contactListChangedEvent = new Subject<Contact[]>();

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();


  constructor() {
    this.contacts = MOCKCONTACTS;
   }

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id == id);
  } 

  getContacts(): Contact[] {
    return this.contacts.sort((a,b) => a.name > b.name ? 1: b.name > a.name ? -1 : 0).slice();
  }
  
  deleteContact(contact: Contact) {
    if (!contact) {
       return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
       return;
    }
    this.contacts.splice(pos, 1);
    this.contactChangedEvent.emit(this.contacts.slice());
 }

 getMaxId(): number {
  let maxId = 0;

  this.contacts.forEach((doc,i) => {
    let currentId = parseInt(doc.id);
    if (currentId > maxId){
      maxId = currentId;
    }
  })

  return maxId;
}

addContact(newContact:Contact){
  if (!newContact){
    return;
  }
  this.maxContactId++
  newContact.id = this.maxContactId.toString();

  this.contacts.push(newContact);

  const contactsListClone = this.contacts.slice();

  this.contactListChangedEvent.next(contactsListClone);
}

updateContact(originalContact: Contact, newContact: Contact){
  if ((!originalContact) || (!newContact)){
    return;
  }

  const pos = this.contacts.indexOf(originalContact);

  if (pos < 0){
    return;
  }

  newContact.id = originalContact.id;
  this.contacts[pos] = newContact;
  const contactsListClone = this.contacts.slice();
  this.contactListChangedEvent.next(contactsListClone);
}

}
