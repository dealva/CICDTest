'use client'

import { createContext, useState, useContext } from "react"
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");  // Ensure the URL matches your server
const WebsocketContext = createContext()
export function useSocket(){
    return useContext(WebsocketContext).socket
}
export default function ClientProvider({ children }){
    const [socket] = useState(() => io())
    return (
        <WebsocketContext.Provider value={{ socket }}>
            {children}
        </WebsocketContext.Provider>
    )
}