import React from "react";
import { MessageModel } from "../../entities/entities";
import { useUser } from "../../context/UserProvider";

// Destructuring props in the function arguments.
export default function Message ({ allMessages, username, content }: {allMessages: MessageModel[]; username :string; content:string}){
  
    const { user } = useUser();

    // const handleRemove = () => {
    // const filteredPlayers = allMessages.filter((message:any) => message.username !== username);
    // removeMessages(filteredPlayers);
//   };
  
  return (
    ( user.userName === username ?
        <>
            <span className="d-flex flex-column flex-end">
                {(username && content ? `me : ${content} ` : "Empty")}
            </span>
            
        </>
        :
        <>
        <span className="d-flex flex-column flex-begin">
                {(username && content ? `${username} : ${content} ` : "Empty")}
            </span>
        </>
    )
    );
};