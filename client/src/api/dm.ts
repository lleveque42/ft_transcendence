export async function usersListDmRequest(
	accessToken: string,
): Promise<Response> {
	return await fetch(
		`${process.env.REACT_APP_BACKEND_URL}/channels/users_list/retrieve`,
		{
			credentials: "include",
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		},
	);
}

export async function createDmRequest(
	accessToken: string,
	formValues: {
		title: string;
		mode: string;
		password: string;
		type: string;
		id1: number;
		id2: number;
	},
) {
	return await fetch(
		`${process.env.REACT_APP_BACKEND_URL}/channels/create_join_dm`,
		{
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify(formValues),
		},
	);
}
