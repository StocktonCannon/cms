import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentData = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1','name','description1','url1',null),
    new Document('2','name-two','description2','url2',null),
    new Document('3','name-three','description3','url3',null),
    new Document('4','name-four','description4','url4',null)

  ]

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentData.emit(document);
  }

}
