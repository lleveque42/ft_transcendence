import React from "react";
import { MessageModel } from "../../entities/entities";

// Destructuring props in the function arguments.
export default function Message ({ allMessages, username, content }: {allMessages: MessageModel[]; username :string; content:string}){
  
    // const handleRemove = () => {
    // const filteredPlayers = allMessages.filter((message:any) => message.username !== username);
    // removeMessages(filteredPlayers);
//   };
  
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