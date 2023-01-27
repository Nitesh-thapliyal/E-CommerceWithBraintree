import React, { useState, useEffect } from "react";
import { emptyCart, loadCart } from "./helper/cartHelper";
import { Link } from "react-router-dom";
import { getToken, processPayment } from "./helper/paymentbhelper";
import { createOrder } from "./helper/orderHelper";
import { isAuthenticated } from "./../auth/helper/index";
import DropIn from "braintree-web-drop-in-react";

const Paymentb = (
	products,
	setRefresh = function (val) {
		return val;
	},
	refresh = undefined
) => {
	const userId = isAuthenticated() && isAuthenticated().user._id;
	const token = isAuthenticated() && isAuthenticated().token;

	const [info, setInfo] = useState({
		loading: false,
		success: false,
		clientToken: null,
		error: "",
		instance: {}
	});

	const getClientToken = (userId, token) => {
		getToken(userId, token).then((info) => {
			if (info.error) {
				setInfo({
					...info,
					error: info.error
				});
			} else {
				const clientToken = info.clientToken;
				setInfo({ clientToken });
			}
		});
	};

	const onPurchases = () => {
		setInfo({ loading: true });
		let nonce;
		let getNonce = info.instance
			.requestPaymentMethod()
			.then((data) => {
				nonce = data.nonce;
				const paymentData = {
					paymentMethodNonce: nonce,
					amount: getFinalPrice()
				};
				processPayment(userId, token, paymentData)
					.then((response) => {
						setInfo({
							...info,
							success: response.success,
							loading: false
						});
						console.log("PAYMENY SUCCESS");
						//TODO : Empty and Reload page
					})
					.catch((error) => {
						setInfo({
							loading: false,
							success: false,
							error: error
						});
						console.log("PAYMENY Failed");
					});
			})
			.catch((err) => console.log(err));
	};

	const getFinalPrice = () => {
		console.log("PRODUCTS : " + products.length);
		let amount = 0;
		products.map((product) => {
			amount += product.price;
		});
		return amount;
	};

	useEffect(() => {
		getClientToken(userId, token);
	}, []);

	const showBraintree = () => {
		return (
			<div>
				{isAuthenticated() && info.clientToken !== null ? (
					<div>
						<DropIn
							options={{ authorization: info.clientToken }}
							onInstance={(instance) =>
								(info.instance = instance)
							}
						/>
						<button
							className="btn btn-success btn-block"
							onClick={onPurchases}
						>
							Buy
						</button>
					</div>
				) : (
					<Link to="/signin">
						<button className="btn btn-warning">
							Please sign in to purchase
						</button>
					</Link>
				)}
			</div>
		);
	};

	return <div>{showBraintree()}</div>;
};

export default Paymentb;
