import { createContext, useContext, useEffect, useState } from "react";
import {
	AlertContextType,
	AlertProps,
	AlertProviderProps,
	AlertType,
	InviteProps,
} from "../types";
import { useLocation, useNavigate } from "react-router-dom";
import trimUserName from "../utils/trimUserName";

export const ALERT_TIMEOUT = 3000;
export const INVITE_TIMEOUT = 15000;

function initialAlertState() {
	const storedAlert = localStorage.getItem("alert");
	if (storedAlert) return JSON.parse(storedAlert);
	return null;
}

function initialInviteState() {
	const storedInvite = localStorage.getItem("invite"); // Not sure if it's secure
	if (storedInvite) return JSON.parse(storedInvite);
	return null;
}

const AlertContext = createContext<AlertContextType>({
	showAlert: () => {},
	showInvite: () => {},
});

export const AlertProvider = ({ children }: AlertProviderProps) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [alert, setAlert] = useState<AlertProps | null>(initialAlertState());
	const [isHiddenAlert, setIsHiddenAlert] = useState<boolean>(true);
	const [invite, setInvite] = useState<InviteProps | null>(
		initialInviteState(),
	);
	const [isHiddenInvite, setIsHiddenInvite] = useState<boolean>(true);

	const showAlert = (type: AlertType, message: string) => {
		setAlert({ type, message });
		setIsHiddenAlert(false);
		localStorage.setItem("alert", JSON.stringify({ type, message }));
	};

	const showInvite = (props: InviteProps) => {
		const { socket } = { ...props };
		const alreayInInvite = localStorage.getItem("invite");
		if (!alreayInInvite) {
			setInvite({ ...props });
			setIsHiddenInvite(false);
			socket?.emit("gameInviteReceived", {
				senderId: props.senderId,
				message: `Invitation sent successfully to ${trimUserName(
					props.invitedUserName,
				)}.`,
			});
			localStorage.setItem(
				"invite",
				JSON.stringify({
					senderId: props.senderId,
					senderUserName: props.senderUserName,
					invitedId: props.invitedId,
					invitedUserName: props.invitedUserName,
				}),
			);
		} else {
			socket?.emit("declineGameInvite", {
				senderId: props.senderId,
				message: `${trimUserName(
					props.invitedUserName,
				)} is already invited, try again later.`,
			});
		}
	};

	function declineInvite(props: InviteProps) {
		const { socket } = { ...props };
		setIsHiddenInvite(true);
		setInvite(null);
		localStorage.removeItem("invite");
		socket?.emit("declineGameInvite", {
			senderId: props.senderId,
			message: `${trimUserName(
				props.invitedUserName,
			)} declined your game invitation.`,
		});
	}

	function acceptInvite(props: InviteProps) {
		const { socket } = { ...props };
		setIsHiddenInvite(true);
		setInvite(null);
		localStorage.removeItem("invite");
		socket?.once("inviteInGameAfterAccept", (senderInGame) => {
			if (senderInGame)
				showAlert(
					"error",
					`${trimUserName(
						props.invitedUserName,
					)} had already join a game when you accepted invite.`,
				);
			else {
				showAlert(
					"success",
					`You accepted invitation from ${trimUserName(
						props.invitedUserName,
					)}. You will be redirected.`,
				);
				setTimeout(() => {
					if (location.pathname === "/play") navigate("/playMinimized");
					else navigate("/play");
				}, 2000);
			}
		});
		socket?.emit("acceptGameInvite", {
			senderId: props.senderId,
			message: `${trimUserName(
				props.invitedUserName,
			)} accepted your game invitation.`,
		});
	}

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (alert) {
			setIsHiddenAlert(false);
			timeoutId = setTimeout(() => {
				setIsHiddenAlert(true);
				setAlert(null);
				localStorage.removeItem("alert");
			}, ALERT_TIMEOUT);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [alert]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;
		if (invite) {
			timeoutId = setTimeout(() => {
				declineInvite(invite);
			}, INVITE_TIMEOUT);
			setIsHiddenInvite(false);
		}
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [invite]);

	return (
		<AlertContext.Provider value={{ showAlert, showInvite }}>
			{alert && !isHiddenAlert && (
				<div
					className={`alert alert-${alert.type} ${isHiddenAlert ? "hide" : ""}`}
				>
					{alert.message}
				</div>
			)}
			{invite && !isHiddenInvite && (
				<div
					className={`d-flex flex-column alert alert-info${
						isHiddenInvite ? "hide" : ""
					}`}
				>
					{invite.senderUserName} invites you to play.
					<div className="d-flex flex-row align-items justify-content mt-10">
						<button
							className="btn btn-success p-5 mr-10"
							onClick={() => acceptInvite(invite)}
						>
							Accept
						</button>
						<button
							className="btn btn-danger p-5"
							onClick={() => declineInvite(invite)}
						>
							Decline
						</button>
					</div>
				</div>
			)}
			{children}
		</AlertContext.Provider>
	);
};

export const useAlert = () => useContext(AlertContext);
