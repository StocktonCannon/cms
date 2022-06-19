import { Injectable } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];
  maxDocumentId: number;

  documentListChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) {}

  getDocument(id:string): Document {
    return this.documents.find((document) => document.id == id);
  }

  getDocuments() {
    this.http.get("https://wdd430-1771d-default-rtdb.firebaseio.com/documents.json")
    .subscribe(
      (documents: Document[]) => {
        this.documents = documents;
        this.maxDocumentId = this.getMaxId();

        this.documents.sort((a,b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1: 0
        );
        this.documentListChangedEvent.next(this.documents.slice());
      },
      (error: any) => {
        console.log(error);
      }
    );
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
    // this.documentChangedEvent.emit(this.documents.slice());
    this.storeDocuments();
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

   this.storeDocuments();
 }

 storeDocuments() {
  let documents = JSON.stringify(this.documents);
  const headers = new HttpHeaders({'Content-Type': 'application/json'});
  this.http.put("https://wdd430-1771d-default-rtdb.firebaseio.com/documents.json", documents, {
    headers: headers,
  }).subscribe(() => {
    this.documentListChangedEvent.next(this.documents.slice());
  });
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
   this.storeDocuments();
 }

}
