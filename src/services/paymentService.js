import confetti from 'canvas-confetti';

export const PaymentService = {
  // Simulate payment gateway checkout (UPI, Card, Netbanking)
  async processPayment({ amount, currency, studentName, orderSummary, method = 'upi' }) {
    return new Promise((resolve, reject) => {
      // Realistic simulated network latency of 1.2 seconds
      setTimeout(() => {
        const isSuccess = true; // In production this invokes Razorpay/Stripe checkout SDK
        if (isSuccess) {
          const transactionId = `PAY_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
          
          // Trigger celebratory confetti on screen
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // Ignore confetti errors if any
          }

          resolve({
            success: true,
            transactionId,
            paidAmount: amount,
            currency,
            paidAt: new Date().toISOString(),
            method
          });
        } else {
          reject(new Error('Payment failed. Please check your bank balance or retry with another payment mode.'));
        }
      }, 1200);
    });
  }
};
