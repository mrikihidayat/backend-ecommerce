const axios = require('axios');

const midtransService = {};

const MIDTRANS_API_URL = process.env.MIDTRANS_API_URL;
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

midtransService.getSupportedBanks = () => {
    return [
        { code: 'bca', name: 'BCA' },
        { code: 'bni', name: 'BNI' },
        { code: 'bri', name: 'BRI' },
        { code: 'mandiri', name: 'Mandiri Bill' },
        { code: 'permata', name: 'Permata' },
        { code: 'cimb', name: 'CIMB' },
    ];
};

midtransService.requestTransaction = async (bank, orderId, grossAmount) => {
    const supportedBanks = midtransService.getSupportedBanks().map(bank => bank.code);

    if (!supportedBanks.includes(bank)) {
        throw new Error('Bank not supported');
    }

    const payload = {
        payment_type: bank === 'mandiri' ? 'echannel' : bank === 'permata' ? 'permata' : 'bank_transfer',
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        },
    };

    if (bank === 'mandiri') {
        payload.echannel = {
            bill_info1: 'Payment:',
            bill_info2: 'Online purchase',
        };
    } else if (bank !== 'permata') {
        payload.bank_transfer = {
            bank,
        };
    }

    try {
        const response = await axios.post(`${MIDTRANS_API_URL}/charge`, payload, {
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${Buffer.from(SERVER_KEY).toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });
        return midtransService.formatResponse(response.data);
    } catch (error) {
        throw new Error(`Transaction request failed: ${error.response?.data?.status_message || error.message}`);
    }
};

midtransService.getTransactionStatus = async (orderId) => {
    try {
        const response = await axios.get(`${MIDTRANS_API_URL}/${orderId}/status`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Basic ${Buffer.from(SERVER_KEY).toString('base64')}`,
                'Content-Type': 'application/json',
            },
        });
        return midtransService.formatStatusResponse(response.data);
    } catch (error) {
        throw new Error(`Failed to get transaction status: ${error.response?.data?.status_message || error.message}`);
    }
};

midtransService.formatResponse = (data) => {
    return {
        status_code: data.status_code || null,
        status_message: data.status_message || null,
        transaction_id: data.transaction_id || null,
        order_id: data.order_id || null,
        merchant_id: data.merchant_id || null,
        gross_amount: data.gross_amount || null,
        currency: data.currency || null,
        payment_type: data.payment_type || null,
        transaction_time: data.transaction_time || null,
        transaction_status: data.transaction_status || null,
        va_numbers: data.va_numbers || null,
        fraud_status: data.fraud_status || null,
        bill_key: data.bill_key || null,
        biller_code: data.biller_code || null,
        permata_va_number: data.permata_va_number || null,
        expiry_time: data.expiry_time || null,
    };
};

midtransService.formatStatusResponse = (data) => {
    return {
        masked_card: data.masked_card || null,
        approval_code: data.approval_code || null,
        bank: data.bank || null,
        eci: data.eci || null,
        channel_response_code: data.channel_response_code || null,
        channel_response_message: data.channel_response_message || null,
        transaction_time: data.transaction_time || null,
        gross_amount: data.gross_amount || null,
        currency: data.currency || null,
        order_id: data.order_id || null,
        payment_type: data.payment_type || null,
        signature_key: data.signature_key || null,
        status_code: data.status_code || null,
        transaction_id: data.transaction_id || null,
        transaction_status: data.transaction_status || null,
        fraud_status: data.fraud_status || null,
        settlement_time: data.settlement_time || null,
        status_message: data.status_message || null,
        merchant_id: data.merchant_id || null,
        card_type: data.card_type || null,
        three_ds_version: data.three_ds_version || null,
        challenge_completion: data.challenge_completion || null,
    };
};

module.exports = midtransService;
