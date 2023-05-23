import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import Input from "../../components/Input/Input";
import { usePrivateRouteSocket } from "../../context/PrivateRouteProvider";
import { useAlert } from "../../context/AlertProvider";

type FormValues = {
	title: string;
	mode: string;
	password: string;
	type: string;
	username: string;
};

const initialFormValues: FormValues = {
	title: "",
	mode: "public",
	password: "",
	type: "",
	username: "",
};

export default function NewChannel() {
	const { user } = useUser();
	const [radioValue, setRadioValue] = useState("Public");
	const [chanProtected, setChanProtected] = useState(false);
	const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

	const socket = usePrivateRouteSocket();
	const { showAlert } = useAlert();

	const navigate = useNavigate();

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	function handleRadioChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		if (value === "Protected") {
			setChanProtected(true);
		} else {
			setChanProtected(false);
		}
		setRadioValue(value);
	}

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		formValues.username = user.userName;
		formValues.type = "Channel";
		formValues.mode = radioValue;
		if (formValues.mode !== "Protected") {
			formValues.password = "";
		}
		try {
			const res: Response = await fetch(
				"http://localhost:3000/channels/create_channel",
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(formValues),
				},
			);
			if (res.status === 201) {
				const body = await res.json();
				if (body != null && body === "Duplicate") {
					showAlert("error", "Channel" + formValues.title + " already exists");
				} else {
					showAlert(
						"success",
						"Channel" + formValues.title + " created with success",
					);
					socket.chatSocket?.emit("joinChatRoom", formValues.title);
				}
			} else if (res.ok) {
				console.log("Response issued : " + res.statusText);
				navigate("/chat/channels");
			}
		} catch (e) {
			console.error("Fatal error");
		}
	}

	return (
		<div className="d-flex flex-column align-items flex-1">
			<div className="title mt-20">New channel</div>
			<ChatNav />
			<form
				onSubmit={handleSubmit}
				className="d-flex flex-column align-items justify-content p-20"
			>
				<div className="mb-5">
					<label>
						<input
							type="radio"
							value="Public"
							checked={radioValue === "Public"}
							onChange={handleRadioChange}
						/>
						Public
					</label>
				</div>
				<div className="mb-5">
					<label>
						<input
							type="radio"
							value="Private"
							checked={radioValue === "Private"}
							onChange={handleRadioChange}
						/>
						Private
					</label>
				</div>
				<div className="mb-10">
					<label>
						<input
							type="radio"
							value="Protected"
							checked={radioValue === "Protected"}
							onChange={handleRadioChange}
						/>
						Protected
					</label>
				</div>
				<Input
					icon="fa-solid fa-at"
					type="text"
					name="title"
					placeholder="Title"
					value={formValues.title}
					onChange={handleInputChange}
				/>
				{chanProtected && (
					<>
						<Input
							icon="fa-solid fa-lock"
							type="password"
							name="password"
							placeholder="Password"
							value={formValues.password}
							onChange={handleInputChange}
						/>
					</>
				)}
				<button className="btn-primary p-5 mt-5" type="submit">
					Create channel
				</button>
			</form>
		</div>
	);
}
