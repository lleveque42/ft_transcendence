import ChatNav from "../../components/Chat/ChatNav/ChatNav";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserProvider";
import Input from "../../components/Input/Input";
import { useAlert } from "../../context/AlertProvider";
import { ChannelModel } from "../../entities/entities";

type FormValues = {
	title: string|undefined;
	mode: string|undefined;
	password: string|undefined;
    type: string|undefined;
    username: string|undefined;
};

const initialFormValues: FormValues = {
    title: "title",
	mode: "public",
	password: "",
    type: "Channel",
	username: "",
};

export default function EditChannel() {
  
	const { accessToken, user } = useUser();
	const [radioValue, setRadioValue] = useState("Public");
	const [chanProtected, setChanProtected] = useState(false);	
    const [formValues, setFormValues] = useState<FormValues>(initialFormValues);

	let {title} = useParams();
	
	const { showAlert } = useAlert();

	const navigate = useNavigate();

	const [channelState, setChannelState] = useState<ChannelModel[]>([]);
	
	useEffect(() => {
		(async () => {
			try {
				await fetch(`http://localhost:3000/channels/edit/${title}`, {
					credentials: "include",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((res) => res.json())
				.then(
				(chan) => {
					setChannelState([...channelState, chan]);
				}
				);
            } catch (e) {
			}
        })();
    }, [title, accessToken, channelState]);

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;
		setFormValues({ ...formValues, [name]: value });
	}

	function handleRadioChange(event:  React.ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		if (value === "Protected"){setChanProtected(true)} else {setChanProtected(false)}
		setRadioValue(value);
	}

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
        formValues.username = user.userName;
        formValues.type = "Channel";
		formValues.mode = radioValue;
		if (formValues.mode !== "Protected"){
			formValues.password = "";
		}
		try {
			const res : Response = await fetch("http://localhost:3000/channels/edit_channel", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formValues),
			});
			if (res.status === 201) {
					showAlert("success", "Channel" + formValues.title + " edited with success");
					// socket.chatSocket?.emit("joinChatRoom",formValues.title);
					navigate("/chat/channels");
				}
		} catch (e) {
			console.error("Fatal error");
		}
	}
	const channelForm = Array.isArray(channelState) ? channelState.map(({ id, title, password, type, mode, ownerId}) => {
		// Set the formValues
		formValues.title= title;
		formValues.mode= mode;
		formValues.password= password;
		formValues.type=  type;
		formValues.username =  user.userName;

		// Rendering
		return (
			<>
			<div className="radio">
				<label>
					<input
					type="radio"
					value="Public"
					checked={mode === "Public"}
					onChange={handleRadioChange}
					/>
					Public
				</label>
				</div>
				<div className="radio">
				<label>
					<input
					type="radio"
					value="Private"
					checked={mode === "Private"}
					onChange={handleRadioChange}
					/>
					Private
				</label>
				</div>
				<div className="radio mb-10">
				<label>
					<input
					type="radio"
					value="Protected"
					checked={mode === "Protected"}
					onChange={handleRadioChange}
					/>
					Protected
				</label>
				</div>
				<Input
					icon="fa-solid fa-at"
					type="text"
					name="title"
					placeholder="New chan title"
					value={formValues.title}
					onChange={handleInputChange}
				/>
				{chanProtected &&
					<>
					<Input
						icon="fa-solid fa-lock"
						type="password"
						name="password"
						placeholder="********"
						value={formValues.password}
						onChange={handleInputChange}
						/>
					</>
				}
			</>
		)
			})
			:
			<></>
			;
	

return (
		<div className="container d-flex flex-column justify-content align-items">
			<div className="title">Edit channel</div>
			<div>
				<ChatNav/>
				<form
					onSubmit={handleSubmit}
					className="d-flex flex-column align-items justify-content p-20"
				>
					{channelForm}
				{/* Radio button to set the mode of the channel */}
				{/* <div className="radio">
				<label>
					<input
					type="radio"
					value="Public"
					checked={channelState?.type === "Public"}
					onChange={handleRadioChange}
					/>
					Public
				</label>
				</div>
				<div className="radio">
				<label>
					<input
					type="radio"
					value="Private"
					checked={channelState?.type === "Private"}
					onChange={handleRadioChange}
					/>
					Private
				</label>
				</div>
				<div className="radio mb-10">
				<label>
					<input
					type="radio"
					value="Protected"
					checked={channelState?.type === "Protected"}
					onChange={handleRadioChange}
					/>
					Protected
				</label>
				</div>
				<Input
					icon="fa-solid fa-at"
					type="text"
					name="title"
					placeholder={formValues.title}
					value={formValues.title}
					onChange={handleInputChange}
				/>
				{chanProtected &&
					<>
					<Input
						icon="fa-solid fa-lock"
						type="password"
						name="password"
						placeholder="********"
						value={formValues.password}
						onChange={handleInputChange}
						/>
					</>
				} */}
				<div
					className={` d-flex flex-row justify-content-space-between mb-30`}
				>
					<button className="btn-primary" type="submit">
						Edit
					</button>
				</div>
			</form>
			</div>
		</div>
	);
}