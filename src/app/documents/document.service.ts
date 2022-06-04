import { EventEmitter, Injectable } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  maxDocumentId: number;

  documentListChangedEvent = new Subject<Document[]>();

  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getDocument(id:string): Document {
    return this.documents.find((document) => document.id == id);
  }

  getDocuments(): Document[] {
    return this.documents.sort((a,b) => a.name > b.name ? 1: b.name > a.name ? -1 : 0).slice();
  }

  deleteDocument(document: Document) {
    if (!document) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    this.documentChangedEvent.emit(this.documents.slice());
 }

 getMaxId(): number {
   let maxId = 0;

   this.documents.forEach((doc,i) => {
     let currentId = parseInt(doc.id);
     if (currentId > maxId){
       maxId = currentId;
     }
   })

   return maxId;
 }

 addDocument(newDocument:Document){
   if (!newDocument){
     return;
   }
   this.maxDocumentId++
   newDocument.id = this.maxDocumentId.toString();

   this.documents.push(newDocument);

   const documentsListClone = this.documents.slice();

   this.documentListChangedEvent.next(documentsListClone);
 }

 updateDocument(originalDocument: Document, newDocument: Document){
   if ((!originalDocument) || (!newDocument)){
     return;
   }

   const pos = this.documents.indexOf(originalDocument);

   if (pos < 0){
     return;
   }

   newDocument.id = originalDocument.id;
   this.documents[pos] = newDocument;
   const documentsListClone = this.documents.slice();
   this.documentListChangedEvent.next(documentsListClone);
 }

}
