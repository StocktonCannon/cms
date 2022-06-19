import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  maxContactId: number;

  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id == id);
  } 

  getContacts() {
    this.http.get("https://wdd430-1771d-default-rtdb.firebaseio.com/contacts.json")
    .subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
        this.maxContactId = this.getMaxId();

        this.contacts.sort((a,b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        this.contactListChangedEvent.next(this.contacts.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
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
    
    this.storeContacts();
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

  this.storeContacts();
}

storeContacts() {
  let contacts = JSON.stringify(this.contacts);
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  this.http.put("https://wdd430-1771d-default-rtdb.firebaseio.com/contacts.json", contacts, {
    headers: headers,
  }).subscribe(() => {
    this.contactListChangedEvent.next(this.contacts.slice());
  });
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
  this.storeContacts();
}

}
