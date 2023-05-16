import React from "react";
import styles from "./ChatNav.module.scss";

import {
    NavLink,
  } from 'react-router-dom';

export default function ChatNav(){

    return (
        <>
        <div className={`${styles.navContainer}  d-flex flex-row justify-content mt-20`}>
            <NavLink className={`${styles.navLink} p-20`}  to='/chat/direct_messages' >
              My messages
            </NavLink>
            <NavLink className={`${styles.navLink} p-20`}  to='/chat/channels' >
              My channels
            </NavLink>
        </div>
      </>
    );
  };
    
  