import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {}

  addMessage(message:Message){
    this.messages.push(message);
    this.storeMessages();
    
  }

  getMessage(id: string):Message{
    return this.messages.find((message)=>message.id == id)
  }

  getMessages() {
    this.http.get<{message: String, messages: Message[]}>("http://localhost:3000/messages")
  .subscribe(
    (messageData) => {
      this.messages = messageData.messages;
      this.messageListChangedEvent.next(this.messages.slice());
    },
    (error: any) => {
      console.log(error);
    
    }
  )  }

  storeMessages(){
    let messages = JSON.stringify(this.messages);
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.http.put("http://localhost:3000/messages/", messages, {
    headers: headers,  
  }).subscribe(() => {
    this.messageListChangedEvent.next(this.messages.slice());
  });
}
  


}
