import styles from "./TfaModal.module.scss";

interface ModalProps {
	closeModal: () => void;
}

export default function TfaModal({ closeModal }: ModalProps) {
	return (
		<div className={styles.modalContainer} onClick={closeModal}>
			<div
				className={styles.modalContent}
				onClick={(e) => {
					e.stopPropagation();
				}}
			>
				<h3>Configure 2FA</h3>
				<button className="btn btn-reverse-primary" onClick={closeModal}>
					Close
				</button>
			</div>
		</div>
	);
}
