import React from "react";
import { NavLink } from "react-router-dom";

// Destructuring props in the function arguments.
export default function Message ({ allMessages, username, content,removeMessages }: {allMessages: any; username :any; content:any, removeMessages:any}){
  
    const handleRemove = () => {
    const filteredPlayers = allMessages.filter((message:any) => message.username !== username);
    removeMessages(filteredPlayers);
  };
  
  return (
    <>
    {/* <NavLink to={`/chat/direct_messages/${username}`}> */}
        <span>
        {(username && content ? `${username} : ${content} ` : "Empty")}
        </span>
    {/* </NavLink>
        <button onClick={handleRemove}>Delete</button> */}
    </>
    );
};