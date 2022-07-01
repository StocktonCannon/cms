import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { response } from 'express';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: Contact[] = [];
  // maxContactId: number;

  contactListChangedEvent = new Subject<Contact[]>();

  constructor(private http: HttpClient) {}

  getContact(id: string): Contact {
    return this.contacts.find((contact) => contact.id == id);
  } 

  getContacts() {
    this.http.get<{message: String, contacts: Contact[]}>("http://localhost:3000/contacts")
    .subscribe(
      (contactData) => {
        this.contacts = contactData.contacts;
        // this.maxContactId = this.getMaxId();

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
    this.http.delete('http://localhost:3000/contacts/'+contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.slice(pos,1);
        this.getContacts();
      }
    )
 }

//  getMaxId(): number {
//   let maxId = 0;

//   this.contacts.forEach((doc,i) => {
//     let currentId = parseInt(doc.id);
//     if (currentId > maxId){
//       maxId = currentId;
//     }
//   })

//   return maxId;
// }

addContact(newContact:Contact){
  if (!newContact){
    return;
  }
  // this.maxContactId++
  // newContact.id = this.maxContactId.toString();
  newContact.id = '';
  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  this.http.post<{message: string, contact: Contact}>('http://localhost:3000/contacts',
  newContact,
  {headers: headers})
  .subscribe(
    (responseData) => {
      this.contacts.push(responseData.contact);
      this.getContacts();
    }
  )

  // this.contacts.push(newContact);

  // this.storeContacts();
}

storeContacts() {
  let contacts = JSON.stringify(this.contacts);
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  this.http.put("http://localhost:3000/contacts", contacts, {
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
  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  this.http.put('http://localhost:3000/contacts/'+ originalContact.id, newContact, {headers: headers})
  .subscribe(
    (response: Response) => {
      this.contacts[pos] = newContact;
      this.storeContacts();
      this.getContacts();
    }
  )

  
 
}

}
