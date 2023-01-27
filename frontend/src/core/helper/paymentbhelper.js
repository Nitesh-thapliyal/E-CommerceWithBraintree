import { API } from "./../../backend";

export const getToken = (userId, token) => {
	const bearerToken = `Bearer ${token}`;
	return fetch(`${API}/paypal/gettoken/${userId}`, {
		method: "GET",
		headers: {
			Authorization: bearerToken,
			"Content-Type": "application/json",
			Accept: "application/json"
		}
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => console.log(error));
};

export const processPayment = (userId, token, paymentInfo) => {
	const bearerToken = `Bearer ${token}`;
	return fetch(`${API}/paypal/payment/${userId}`, {
		method: "POST",
		headers: {
			Authorization: bearerToken,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(paymentInfo)
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => console.log(error));
};