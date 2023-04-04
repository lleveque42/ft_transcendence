import styles from "./Input.module.scss";

export default function Input(props: {
	icon: string;
	type: string;
	name: string;
	placeholder: string;
	value: any;
	onChange: any;
}) {
	return (
		<label className={styles.inputContainer}>
			<i className={props.icon}></i>
			<input
				type={props.type}
				name={props.name}
				placeholder={props.placeholder}
				value={props.value}
				onChange={props.onChange}
			/>
		</label>
	);
}
