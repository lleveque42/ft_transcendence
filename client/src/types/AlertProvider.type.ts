import { ReactNode } from "react";
import { Socket } from "socket.io-client";

export type AlertType = "success" | "error" | "info" | "warning";

export type AlertProviderProps = {
	children: ReactNode;
};

export type AlertProps = {
	type: AlertType;
	message: string;
};

export type InviteProps = {
	senderId: number;
	senderUserName: string;
	invitedId: number;
	invitedUserName: string;
	socket: Socket | null;
};

export type AlertContextType = {
	showAlert: (type: AlertType, message: string) => void;
	showInvite: (props: InviteProps) => void;
};
