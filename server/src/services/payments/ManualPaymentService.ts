/**
 * FREE Manual Payment Service
 * Zero fees - Handle payments manually during MVP phase
 * Upgrade to automated when you have revenue
 */

export interface ManualPaymentRequest {
  userId: string;
  planId: 'starter' | 'professional' | 'enterprise';
  billingPeriod: 'monthly' | 'annually';
  amount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'upi' | 'crypto' | 'paypal';
}

export interface PaymentInstructions {
  method: string;
  amount: number;
  currency: string;
  details: Record<string, string>;
  referenceId: string;
  expiresAt: Date;
}

export class ManualPaymentService {
  /**
   * Generate payment instructions for user
   * 100% FREE - No payment gateway needed
   */
  generatePaymentInstructions(
    request: ManualPaymentRequest
  ): PaymentInstructions {
    const referenceId = `VD-${Date.now()}-${request.userId.slice(0, 6)}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const instructions: PaymentInstructions = {
      method: request.paymentMethod,
      amount: request.amount,
      currency: request.currency,
      referenceId,
      expiresAt,
      details: {},
    };

    switch (request.paymentMethod) {
      case 'bank_transfer':
        instructions.details = {
          accountName: 'VisualDocs Inc.',
          accountNumber: '1234567890',
          bankName: 'Your Bank Name',
          ifscCode: 'BANK0001234', // For India
          swiftCode: 'BANKUS33XXX', // For International
          reference: referenceId,
          instructions:
            'Please include the reference ID in the transfer description',
        };
        break;

      case 'upi':
        instructions.details = {
          upiId: 'visualdocs@paytm',
          qrCode: `upi://pay?pa=visualdocs@paytm&pn=VisualDocs&am=${request.amount}&cu=${request.currency}&tn=${referenceId}`,
          reference: referenceId,
          instructions: 'Scan QR code or use UPI ID. Include reference in notes.',
        };
        break;

      case 'crypto':
        instructions.details = {
          btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          ethAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          usdtAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
          network: 'Ethereum (ERC20) or Bitcoin',
          reference: referenceId,
          instructions:
            'Send exact amount. Include reference in transaction memo if possible.',
        };
        break;

      case 'paypal':
        instructions.details = {
          paypalEmail: 'payments@visualdocs.com',
          paypalMe: 'https://paypal.me/visualdocs',
          reference: referenceId,
          instructions:
            'Send as Friends & Family to avoid fees. Include reference in notes.',
        };
        break;
    }

    return instructions;
  }

  /**
   * Record pending payment (waiting for manual verification)
   */
  async createPendingPayment(request: ManualPaymentRequest) {
    const instructions = this.generatePaymentInstructions(request);

    // Store in database
    // await prisma.pendingPayment.create({
    //   data: {
    //     userId: request.userId,
    //     planId: request.planId,
    //     billingPeriod: request.billingPeriod,
    //     amount: request.amount,
    //     currency: request.currency,
    //     paymentMethod: request.paymentMethod,
    //     referenceId: instructions.referenceId,
    //     status: 'pending',
    //     expiresAt: instructions.expiresAt,
    //     instructions: instructions.details,
    //   },
    // });

    return instructions;
  }

  /**
   * Verify payment manually (admin action)
   */
  async verifyPayment(referenceId: string, adminId: string) {
    // 1. Find pending payment
    // const payment = await prisma.pendingPayment.findUnique({
    //   where: { referenceId },
    // });

    // 2. Update payment status
    // await prisma.pendingPayment.update({
    //   where: { referenceId },
    //   data: {
    //     status: 'verified',
    //     verifiedBy: adminId,
    //     verifiedAt: new Date(),
    //   },
    // });

    // 3. Activate user subscription
    // await prisma.user.update({
    //   where: { id: payment.userId },
    //   data: {
    //     subscriptionStatus: 'active',
    //     subscriptionPlan: payment.planId,
    //     billingPeriod: payment.billingPeriod,
    //     subscriptionEndsAt: this.calculateEndDate(payment.billingPeriod),
    //   },
    // });

    // 4. Send confirmation email
    // await sendPaymentConfirmationEmail(payment.userId);

    return { success: true };
  }

  /**
   * Reject payment (admin action)
   */
  async rejectPayment(referenceId: string, reason: string, adminId: string) {
    // await prisma.pendingPayment.update({
    //   where: { referenceId },
    //   data: {
    //     status: 'rejected',
    //     rejectionReason: reason,
    //     verifiedBy: adminId,
    //     verifiedAt: new Date(),
    //   },
    // });

    // Send rejection email with instructions
    return { success: true };
  }

  /**
   * Get all pending payments (admin dashboard)
   */
  async getPendingPayments() {
    // return await prisma.pendingPayment.findMany({
    //   where: { status: 'pending' },
    //   include: { user: { select: { email: true, name: true } } },
    //   orderBy: { createdAt: 'desc' },
    // });
    return [];
  }

  /**
   * Calculate subscription end date
   */
  private calculateEndDate(billingPeriod: 'monthly' | 'annually'): Date {
    const now = new Date();
    if (billingPeriod === 'monthly') {
      return new Date(now.setMonth(now.getMonth() + 1));
    } else {
      return new Date(now.setFullYear(now.getFullYear() + 1));
    }
  }

  /**
   * Get payment methods available in your region
   */
  getAvailablePaymentMethods(country: string = 'US') {
    const methods = {
      IN: ['bank_transfer', 'upi', 'crypto', 'paypal'],
      US: ['bank_transfer', 'crypto', 'paypal'],
      GLOBAL: ['crypto', 'paypal'],
    };

    return methods[country as keyof typeof methods] || methods.GLOBAL;
  }
}

export const manualPaymentService = new ManualPaymentService();
