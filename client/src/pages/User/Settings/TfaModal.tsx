import { useState } from "react";
import Input from "../../../components/Input/Input";
import styles from "./TfaModal.module.scss";

interface ModalProps {
	closeModal: () => void;
	qrCodeUrl: string;
}

export default function TfaModal({ closeModal, qrCodeUrl }: ModalProps) {
	const [inputValue, setInputValue] = useState<string>("");

	async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		setInputValue(e.target.value);
	}

	async function handleSubmit() {
		console.log("VALUES: ", inputValue);
	}

	return (
		<div className={styles.modalContainer} onClick={closeModal}>
			<div
				className={styles.modalContent}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<h3>Configure 2FA</h3>
				<div className="mt-10 mb-20 d-flex flex-column align-items justify-content">
					<img src={qrCodeUrl} alt="qr code" />
					<small className="mt-5 d-flex justify-content">
						Scan the Qr Code with your favorite 2FA app
					</small>
				</div>
				<Input
					icon="fa-solid fa-key"
					type="text"
					name="userName"
					placeholder="Ex: 123456"
					value={inputValue}
					onChange={handleInputChange}
				/>
				<button
					className="btn btn-primary p-5"
					type="submit"
					onClick={handleSubmit}
				>
					Validate
				</button>
				<button className="btn btn-reverse-primary" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
