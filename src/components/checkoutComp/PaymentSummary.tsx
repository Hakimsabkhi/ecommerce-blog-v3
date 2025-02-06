import PaypalButton from '@/components/checkoutComp/PaypalButton';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { clearCart } from '@/store/cartSlice';

interface PaymentSummaryProps {
  totalPrice: number;
  totalDiscount: number;
  selectedMethod: string;
  deliveryCost: number;
  items: CartItem[];
  onCheckout: (price: number, discount: number, items: CartItem[]) => void;
  selectedPaymentMethod: string;
  backcarte: () => void;
  currentStep: 'cart' | 'checkout' | 'order-summary';
  handleOrderSummary(ref: string): void;
}

interface CartItem {
  _id: string;
  name: string;
  description: string;
  ref: string;
  tva?: number;
  price: number;
  imageUrl?: string;
  stock: number;
  discount?: number;
  color?: string;
  material?: string;
  status?: string;
  quantity: number;
}

interface PaymentDetails extends Record<string, unknown> {
  id: string;
  payer: {
    payer_id: string;
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  status: string;
  update_time: string;
}

const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  handleOrderSummary,
  totalPrice,
  totalDiscount,
  currentStep,
  items,
  onCheckout,
  selectedPaymentMethod,
  backcarte,
  selectedMethod,
  deliveryCost,
}) => {
  const dispatch = useDispatch();
  const [totalWithShipping, setTotalWithShipping] = useState(totalPrice + deliveryCost);

  useEffect(() => {
    setTotalWithShipping(totalPrice + deliveryCost);
  }, [totalPrice, deliveryCost]);

  const sendMail = async (ref: string) => {
    try {
      const response = await fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ref }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAddress = (document.querySelector('select[name="address-method"]') as HTMLInputElement | null)?.value;
    const selectedPayment = (document.querySelector('input[name="payment-method"]:checked') as HTMLInputElement | null)
      ?.value;

    if (!selectedAddress || !selectedPayment) {
      toast.error('Please select an address and payment method');
      return;
    }

    const orderData = {
      address: selectedAddress,
      paymentMethod: selectedPayment,
      selectedMethod,
      deliveryCost,
      totalDiscount,
      totalWithShipping,
      items,
    };

    try {
      const response = await fetch('/api/order/postorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.status === 200) {
        const data = await response.json();
        const { ref } = data;

        if (!ref) {
          throw new Error("Missing 'ref' in response");
        }

        sendMail(ref);
        handleOrderSummary(ref);
        toast.success('Order submitted successfully!');
        dispatch(clearCart());
      } else if (response.status === 400) {
        toast.error('Please check your information.');
      } else if (response.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(`Unexpected error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error in handleOrderSubmit:', error);
      toast.error(`${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSuccess = (details: Record<string, unknown>) => {
    const paymentDetails = details as PaymentDetails; // Type assertion

    if (paymentDetails.id && paymentDetails.payer) {
      handleOrderSubmit(new Event('submit') as unknown as React.FormEvent); // Trigger form submission
    } else {
      toast.error('Payment details are missing.');
    }
  };

  return (
    <div className="bg-gray-100 rounded-md p-4 w-[30%]">
      <div className="flex border border-[#15335E] overflow-hidden rounded-md">
        <input
          type="email"
          placeholder="Promo code"
          className="w-full outline-none bg-white text-gray-600 text-sm px-4 py-2.5"
        />
        <button
          type="button"
          className="flex items-center justify-center font-semibold tracking-wide bg-primary hover:bg-[#15335E] px-4 text-sm text-white"
        >
          Apply
        </button>
      </div>

      <ul className="text-gray-800 mt-8 space-y-4">
        <li className="flex flex-wrap gap-4 text-base">
          Discount <span className="ml-auto font-bold">{totalDiscount.toFixed(2)} TND</span>
        </li>
        <li className="flex flex-wrap gap-4 text-base">
          Shipping <span className="ml-auto font-bold">{deliveryCost.toFixed(2)} TND</span>
        </li>
        <li className="flex flex-wrap gap-4 text-base">
          Tva <span className="ml-auto font-bold">0 TND</span>
        </li>
        <li className="flex flex-wrap gap-4 text-base font-bold">
          Total <span className="ml-auto">{totalWithShipping.toFixed(2)} TND</span>
        </li>
      </ul>

      {currentStep === 'cart' && (
        <div className="mt-8 space-y-2">
          <button
            onClick={() => onCheckout(totalWithShipping, totalDiscount, items)}
            type="button"
            className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-primary hover:bg-[#15335E] ${
              items.length > 0 ? '' : 'opacity-50 cursor-not-allowed'
            } text-white rounded-md`}
            disabled={items.length === 0}
          >
            Checkout
          </button>

          <Link href="/">
            <button
              type="button"
              className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md"
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      )}

      {currentStep === 'checkout' && (
        <div className="mt-8 space-y-2">
          {selectedPaymentMethod !== 'paypal' && (
            <button
              onClick={handleOrderSubmit}
              type="button"
              disabled={!selectedPaymentMethod}
              className={`text-sm px-4 py-2.5 w-full font-semibold tracking-wide bg-primary ${
                selectedPaymentMethod ? 'hover:bg-[#15335E]' : 'opacity-50 cursor-not-allowed'
              } text-white rounded-md`}
            >
              Proceed to Payment
            </button>
          )}
          {selectedPaymentMethod === 'paypal' && (
            <PaypalButton amount={totalWithShipping.toFixed(2)} onSuccess={handleSuccess} />
          )}
          <button
            onClick={backcarte}
            type="button"
            className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide border border-blue-500 bg-blue-500 hover:bg-[#15335E] hover:border-[#15355E] text-white rounded-md"
          >
            Back
          </button>

          <Link href="/">
            <button
              type="button"
              className="text-sm mt-2 px-4 py-2.5 w-full font-semibold tracking-wide bg-transparent text-gray-800 border border-gray-300 rounded-md hover:bg-[#15335E] hover:text-white"
            >
              Cancel
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
