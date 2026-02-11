import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
    // Enable CORS manually
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { orderId, amount, name, billTitle, paymentMethod } = req.body;

        const serverKey = process.env.VITE_MIDTRANS_SERVER_KEY;
        const clientKey = process.env.VITE_MIDTRANS_CLIENT_KEY;

        if (!serverKey || !clientKey) {
            console.error('Missing Midtrans keys');
            return res.status(500).json({ error: 'Midtrans keys missing in environment variables' });
        }

        const snap = new midtransClient.Snap({
            isProduction: process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: serverKey,
            clientKey: clientKey,
        });

        console.log('Creating transaction for:', orderId);

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            item_details: [{
                id: orderId,
                price: amount,
                quantity: 1,
                name: billTitle || 'Pembayaran SPP',
            }],
            customer_details: {
                first_name: name || 'Student',
            },
        };

        if (paymentMethod) {
            parameter.enabled_payments = [paymentMethod];
        }

        const transaction = await snap.createTransaction(parameter);

        return res.status(200).json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });

    } catch (error) {
        console.error('MidTrans Error:', error);
        return res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: error.ApiResponse || error.httpStatusCode
        });
    }
}
