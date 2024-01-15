import { Observable } from "./observable";

export interface Chat {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
}

class ChatObservable extends Observable<Chat> {
  getId(chat: Chat): string {
    return chat.id;
  }
}

class MessageObservable extends Observable<Message> {
  getId(message: Message): string {
    return message.id;
  }
}

const observables = {
  chat: new ChatObservable(),
  message: new MessageObservable(),
};

export default observables;
