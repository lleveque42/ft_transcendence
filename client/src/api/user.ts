const url = `${process.env.REACT_APP_BACKEND_URL}/user`;

export async function settingsRequest(
	accessToken: string,
	newUserName: string,
): Promise<Response> {
	const res = await fetch(`${url}/settings`, {
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

export async function generateQrCodeRequest(
	accessToken: string,
): Promise<Response> {
	const res = await fetch(`${url}/tfa/generate`, {
		method: "GET",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});
	return res;
}

export async function disableTfaRequest(
	accessToken: string,
): Promise<Response> {
	const res = await fetch(`${url}/tfa/disable`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return res;
}

export async function enableTfaRequest(
	accessToken: string,
	code: string,
): Promise<Response> {
	const res = await fetch(`${url}/tfa/enable`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ code }),
	});
	return res;
}

export async function userUploadAvatar(
	accessToken: string,
	formData: FormData,
): Promise<Response> {
	const res = await fetch(`${url}/upload/avatar`, {
		method: "PATCH",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
		body: formData,
	});
	return res;
}

export async function userAvatarRequest(
	accessToken: string,
	username: string,
): Promise<Response> {
	const res = await fetch(`${url}/avatar/${username}`, {
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return res;
}

export async function userProfileInfosRequest(
	accessToken: string,
	username: string | undefined,
): Promise<Response> {
	const res = await fetch(`${url}/infos/${username}`, {
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return res;
}

export async function toggleFriendshipRequest(
	accessToken: string,
	username: string,
	method: string,
) {
	const res = await fetch(`${url}/friend`, {
		credentials: "include",
		method: method,
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username }),
	});
	return res;
}

export async function getAllUsersRequest(accessToken: string) {
	const res = await fetch(`${url}/users`, {
		credentials: "include",
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return res;
}
