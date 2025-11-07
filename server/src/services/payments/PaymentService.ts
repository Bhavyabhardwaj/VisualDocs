/**
 * Payment Service Factory
 * Creates and manages payment providers
 */

import { PaymentProvider } from './PaymentProvider';
import { DodoProvider } from './DodoProvider';

type PaymentProviderType = 'dodo';

export class PaymentService {
  private static instance: PaymentService;
  private provider: PaymentProvider;
  private providerType: PaymentProviderType;

  private constructor() {
    // Initialize based on environment variable
    this.providerType = (process.env.PAYMENT_PROVIDER as PaymentProviderType) || 'dodo';
    this.provider = this.createProvider(this.providerType);
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  /**
   * Get the current payment provider
   */
  public getProvider(): PaymentProvider {
    return this.provider;
  }

  /**
   * Get the current provider type
   */
  public getProviderType(): PaymentProviderType {
    return this.providerType;
  }

  /**
   * Switch payment provider (useful for A/B testing or multi-gateway support)
   */
  public switchProvider(type: PaymentProviderType): void {
    this.providerType = type;
    this.provider = this.createProvider(type);
  }

  /**
   * Create a payment provider instance
   */
  private createProvider(type: PaymentProviderType): PaymentProvider {
    switch (type) {
      case 'dodo':
        if (!process.env.DODO_API_KEY) {
          throw new Error('DODO_API_KEY is not configured');
        }
        const isProduction = process.env.NODE_ENV === 'production';
        return new DodoProvider(process.env.DODO_API_KEY, isProduction);

      default:
        throw new Error(`Unsupported payment provider: ${type}`);
    }
  }

  /**
   * Get provider-specific features
   */
  public getFeatures() {
    const features = {
      stripe: {
        cryptoPayments: false,
        internationalCards: true,
        recurringBilling: true,
        customerPortal: true,
        invoicing: true,
        fraudDetection: true,
        taxCalculation: true,
      },
      dodo: {
        cryptoPayments: true,
        internationalCards: true,
        recurringBilling: true,
        customerPortal: true,
        invoicing: true,
        fraudDetection: true,
        taxCalculation: false,
      },
    };

    return features[this.providerType];
  }

  /**
   * Get pricing comparison
   */
  public getPricing() {
    const pricing = {
      stripe: {
        transactionFee: '2.9% + $0.30',
        monthlyFee: '$0',
        internationalFee: '+1.5%',
        currencyConversion: '+1%',
      },
      dodo: {
        transactionFee: '1.5% - 2%',
        monthlyFee: '$0',
        internationalFee: '+0.5%',
        currencyConversion: '+0.5%',
      },
    };

    return pricing[this.providerType];
  }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();
