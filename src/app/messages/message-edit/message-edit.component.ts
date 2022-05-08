import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';

import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('msgInput') messageInputRef: ElementRef;
  @ViewChild('subject') subjectInputRef: ElementRef;
  newSubject = new EventEmitter<{Message}>();

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {

  }

  onClear() {

  }

}
