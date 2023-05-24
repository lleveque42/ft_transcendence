const url = `${process.env.REACT_APP_BACKEND_URL}/auth`;

export async function isAuthRequest(): Promise<Response | null> {
	try {
		const res = await fetch(`${url}/refresh`, {
			credentials: "include",
		});
		return res;
	} catch (e) {
		console.error("Error refresh: ", e);
	}
	return null;
}

export async function callback42(code: string): Promise<Response> {
	const res = await fetch(
	`${url}/callback42/${code}`,
	{
		credentials: "include",
	});
	return res;
}

export async function logoutRequest(accessToken: string) {
	try {
		await fetch(`${url}/logout`, {
			method: "POST",
			credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});
	} catch (e) {
		console.error("Error logout: ", e);
	}
}

export async function loginRequest(formValues: {
	userName: string;
	password: string;
}): Promise<Response> {
	const res = await fetch(`${url}/login`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formValues),
	});
	return res;
}

export async function signupRequest(formValues: {
	userName: string;
	email: string;
	password: string;
}): Promise<Response> {
	const res = await fetch(`${url}/signup`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formValues),
	});
	return res;
}

export async function verifyTfaRequest(code: string, accessToken: string) {
	const res = await fetch(`${url}/tfa`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ code }),
	});
	return res;
}
