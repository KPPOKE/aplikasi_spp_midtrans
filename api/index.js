import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';

const app = express();

// Configure CORS for Vercel
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Create transaction and get Snap token
app.post('/api/payment/create', async (req, res) => {
    try {
        const serverKey = process.env.VITE_MIDTRANS_SERVER_KEY;
        const clientKey = process.env.VITE_MIDTRANS_CLIENT_KEY;

        console.log('Debug: Server Key present?', !!serverKey);
        console.log('Debug: Client Key present?', !!clientKey);

        if (!serverKey || !clientKey) {
            throw new Error('Midtrans keys missing in environment variables');
        }

        // Initialize Midtrans Snap inside handler to catch errors safely
        const snap = new midtransClient.Snap({
            isProduction: process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
            serverKey: serverKey,
            clientKey: clientKey,
        });

        const { orderId, amount, name, billTitle, paymentMethod } = req.body;

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

        console.log('Creating transaction for:', orderId);
        const transaction = await snap.createTransaction(parameter);

        res.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });
    } catch (error) {
        console.error('MidTrans Error:', error);
        res.status(500).json({
            error: error.message || 'Internal Server Error',
            details: error.ApiResponse || error.httpStatusCode
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        environment: process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true' ? 'production' : 'sandbox',
        server: 'vercel-serverless'
    });
});

// Base route
app.get('/api', (req, res) => {
    res.send('EduPay API Running');
});

export default app;
