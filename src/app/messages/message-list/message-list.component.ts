import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {

  subscription: Subscription;

  messages: Message[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.subscription = this.messageService.messageListChangedEvent
    .subscribe(
      (messageList: Message[]) => {
        this.messages = messageList;
      });
    this.messageService.getMessages();
  }

  // onAddMessage(message: Message){
  //   this.messages.push(message);
  // }

}
