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

// Initialize Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: process.env.VITE_MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: process.env.VITE_MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.VITE_MIDTRANS_CLIENT_KEY || '',
});

// Create transaction and get Snap token
app.post('/api/payment/create', async (req, res) => {
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

    try {
        console.log('Creating transaction for:', orderId);
        const transaction = await snap.createTransaction(parameter);
        res.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });
    } catch (error) {
        console.error('MidTrans Error:', error.message);
        res.status(500).json({
            error: error.message,
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
