import express from 'express';
import cors from 'cors';
import midtransClient from 'midtrans-client';
import dotenv from 'dotenv';

// Load .env from parent directory
dotenv.config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Log which keys are being used (masked for security)
const serverKey = process.env.VITE_MIDTRANS_SERVER_KEY || '';
const clientKey = process.env.VITE_MIDTRANS_CLIENT_KEY || '';
console.log('Server Key loaded:', serverKey ? `${serverKey.substring(0, 15)}...${serverKey.slice(-4)}` : 'MISSING');
console.log('Client Key loaded:', clientKey ? `${clientKey.substring(0, 15)}...${clientKey.slice(-4)}` : 'MISSING');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: serverKey,
    clientKey: clientKey,
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

    // If a specific payment method was selected, limit Snap to show only that method
    if (paymentMethod) {
        parameter.enabled_payments = [paymentMethod];
    }

    try {
        console.log('Creating transaction with params:', JSON.stringify(parameter));
        const transaction = await snap.createTransaction(parameter);
        console.log('Transaction created successfully:', transaction);
        res.json({
            token: transaction.token,
            redirect_url: transaction.redirect_url,
        });
    } catch (error) {
        console.error('MidTrans Error:', error.message);

        // Extract detailed error info
        const apiResponse = error.ApiResponse || error.httpStatusCode;
        console.error('API Response:', JSON.stringify(apiResponse));

        res.status(500).json({
            error: error.message,
            details: apiResponse
        });
    }
});

// Test endpoint - check if API key works
app.get('/api/test-key', async (req, res) => {
    try {
        const testParam = {
            transaction_details: {
                order_id: `TEST-${Date.now()}`,
                gross_amount: 10000,
            },
        };
        const transaction = await snap.createTransaction(testParam);
        res.json({
            status: 'SUCCESS',
            message: 'API key is valid!',
            token: transaction.token
        });
    } catch (error) {
        res.json({
            status: 'FAILED',
            message: error.message,
            serverKeyUsed: serverKey ? `${serverKey.substring(0, 20)}...` : 'NONE',
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', midtrans: 'sandbox' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
    console.log(`MidTrans Merchant: ${process.env.VITE_MIDTRANS_MERCHANT_ID}`);
    console.log(`Test your key: http://localhost:${PORT}/api/test-key`);
});