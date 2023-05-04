export async function isAuthRequest(): Promise<Response | null> {
	try {
		const res = await fetch("http://localhost:3000/auth/refresh", {
			credentials: "include",
		});
		return res;
	} catch (e) {
		console.error("Error refresh: ", e);
	}
	return null;
}

export async function logoutRequest(accessToken: string) {
	try {
		await fetch("http://localhost:3000/auth/logout", {
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
	const res = await fetch("http://localhost:3000/auth/login", {
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
	const res = await fetch("http://localhost:3000/auth/signup", {
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
	const res = await fetch("http://localhost:3000/auth/tfa", {
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
