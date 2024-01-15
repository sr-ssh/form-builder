import { useObservable } from "../../hooks/useObservable";
import observables, { Chat } from "../../stores/observable-objects";

function ChatItem({ chat }: { chat: Chat }) {
  const _chat = useObservable(observables.chat, chat);

  return <h1>{_chat.name}</h1>;
}

export default ChatItem;
