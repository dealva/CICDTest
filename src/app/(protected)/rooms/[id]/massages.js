'use client';
import BackToDashboardButton from "@/components/common/BackToDashboardButton";
import { useSocket } from "@/contexts/websocket/client";
import { use, useCallback, useEffect ,useState, useRef } from "react";
import TextInput from "@/components/common/form/TextInput";
import SubmitButton from "@/components/common/form/SubmitButton";


export default function MessagesPage({ roomId, user }) {
    const socket = useSocket(); 
    const [ messages, setMessages ] = useState([]); // State to hold the message input value
    const [ message, setMessage ] = useState(''); // State to hold the message input value
    const messageEndRef = useRef(null);
    useEffect(() => {
        socket.emit("joinRoom", { roomId, userId:user.id }); // Join the room when the component mounts

        return () => {
            socket.emit("leaveRoom", { roomId, userId:user.id }); // Leave the room when the component unmounts
        };
    }, [socket, roomId]);

    useEffect(()=> {        
      socket.on("receiveMessage", (receiveData) => {
      setMessages([...messages, receiveData]); // Update the messages state with the received message
    }); // Listen for incoming messages
    }, [messages]); // Add dependency array to avoid memory leaks

    useEffect(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);

    const sendMassage= useCallback((e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        const newMessage = {
          text: message,
          userId: user.id,
          userName: user.name
        };
        setMessages([...messages, newMessage]); // Update the messages state with the new message
        socket.emit("sendMessage", newMessage); // Emit the message to the server
        setMessage('');
        

    },[messages, message]);

  return (
  <div className="flex flex-col h-screen">

  <div className="flex items-center justify-between px-6 py-4 border-b">
    <h1 className="text-2xl font-bold">Room {roomId}</h1>
    <span className="text-gray-500">User: {user.name}</span>
    <BackToDashboardButton />
  </div>

  {/* Scrollable message list */}
  <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col-reverse gap-2">
    <div ref={messageEndRef} />
    {[...messages].reverse().map((msg, index) => (
      <div
        key={index}
        className={`p-2 rounded-md w-auto max-w-[70%] ${
          msg.userId==user.id ? 'self-end bg-blue-400':'self-start bg-blue-100'
        }`}
      >
        <div className="text-sm font-semibold mb-1">
          {msg.userId==user.id ? 'You' : msg.userName}
        </div>
        <p>{msg.text}</p>
      </div>
    ))}
  </div>

  {/* Form - stays at bottom */}
  <form
    onSubmit={sendMassage}
    className="px-6 py-4 bg-white border-t space-y-2"
  >
    <TextInput
      label="Message"
      name="message"
      value={message}
      onChange={({ target: { value } }) => setMessage(value)}
      required
    />
    <SubmitButton text="Send" loading={false} />
  </form>
  </div>
  );
} 