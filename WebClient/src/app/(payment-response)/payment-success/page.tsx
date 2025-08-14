// components/PaymentSuccess.tsx
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50 px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-indigo-600 size-16 mb-4" />
        <h2 className="text-2xl font-semibold text-indigo-700">Payment Successful</h2>
        <p className="mt-2 text-gray-600">
          Your transaction was completed successfully.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-6 bg-indigo-600 hover:bg-indogo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
