export async function settingsRequest(
	accessToken: string,
	newUserName: string,
): Promise<Response> {
	const res = await fetch("http://localhost:3000/user/settings", {
		method: "PATCH",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ newUserName }),
	});
	return res;
}
