// components/PaymentFailure.tsx
"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="max-w-md w-full text-center">
        <XCircle className="mx-auto text-red-600 size-16 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700">Payment Failed</h2>
        <p className="mt-2 text-gray-600">
          Oops! Something went wrong with your payment.
        </p>
        <Link
          href="/pricing"
          className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
