import axios from 'axios';

const headers = {
    headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.TOSS_PAYMENT_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json'
    }
}

/**
 * 결제승인
 * 
 * @param order_no 
 * @param payment_key 
 * @param amount 
 */
export async function confirm(order_no: string, payment_key: string, amount: number) {
    const url = 'https://api.tosspayments.com/v1/payments/confirm';
    const data = {
        orderId: order_no,
        paymentKey: payment_key,
        amount: amount
    }

    try {
        let result = await axios.post(url, data, headers);
        return { statusCode: 200, data: result.data }
    } catch (err) {
        return { statusCode: 400, message: err.response.data.message }
    }
}

/**
 * 결제취소
 * 
 * @param payment_key 
 * @param cancel_reason 
 */
export async function cancel(payment_key: string, cancel_reason: string) {
    const url = `https://api.tosspayments.com/v1/payments/${payment_key}/cancel`;
    const data = {
        cancelReason: cancel_reason
    }

    try {
        await axios.post(url, data, headers);
        return { statusCode: 200 }
    } catch (err) {
        if (err.response.data.code === 'ALREADY_CANCELED_PAYMENT') { // 이미 취소된 결제
            return { statusCode: 200 } 
        } else {
            return { statusCode: 400, message: err.response.data.message }
        }
    }
}