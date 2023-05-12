export default function trimUserName(userName: string): string {
	let displayUserName: string = userName;
	if (displayUserName.length > 10)
		displayUserName = displayUserName.substring(0, 10) + "...";
	return displayUserName;
}
