import observables, { Chat } from "./observable-objects";

const chats: Chat[] = [
  { id: "1", name: "ali" },
  { id: "2", name: "reza" },
];

export function getChats() {
  return chats;
}

export function updateTest() {
  const chat = chats[1];
  chat.name = "Hasan";
  observables.chat.emit("Update", chat);
}
