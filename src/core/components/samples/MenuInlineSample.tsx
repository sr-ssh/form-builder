import { useView } from "../../hooks/useView";
import { getChats, updateTest } from "../../stores/chat";
import { Chat } from "../../stores/observable-objects";
import ChatItem from "./ChatItem";
import ChatItem2 from "./ChatItem2";
import MenuInlineSample2 from "./MenuInlineSample2";
import { useEffect, useState } from "react";

function MenuInlineSample() {
  const { close, openView } = useView();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const chats = getChats();
    setChats(chats);
    // setTimeout(() => {
    //   updateTest();
    // }, 3000);
  }, []);

  return (
    <div>
      {chats?.map((chat, index) => (
        <ChatItem key={index} chat={chat} />
      ))}
      {chats?.map((chat, index) => (
        <ChatItem2 key={index} chat={chat} />
      ))}
    </div>
  );
}

export default MenuInlineSample;
