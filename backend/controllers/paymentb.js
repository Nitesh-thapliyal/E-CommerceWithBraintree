const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
	environment: braintree.Environment.Sandbox,
	merchantId: process.env.BMERCHANT_ID,
	publicKey: process.env.BPUBLIC_KEY,
	privateKey: process.env.BPRIVATE_KEY
});

exports.getToken = (req, res) => {
	gateway.clientToken.generate({}, (err, response) => {
		if (err) {
			res.status(500).json(err);
		} else {
			res.send(response);
		}
	});
};

exports.processPayment = (req, res) => {
	let nonceFromTheClient = req.body.paymentMethodNonce;
	let amountFromTheClient = req.body.amount;
	gateway.transaction.sale(
		{
			amount: amountFromTheClient,
			paymentMethodNonce: nonceFromTheClient,
			options: {
				submitForSettlement: true
			}
		},
		(err, result) => {
			if (err) {
				res.status(500).json(err);
			} else {
				res.status(200).json(result);
			}
		}
	);
};