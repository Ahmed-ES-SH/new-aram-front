"use client";
import axios from "axios";
import React from "react";

export default function page() {
  const secretKey = "bNlSr4yr6CR0P5nNgN48MJF2bg9Gst";
  //   const PublicKey = "sPnkKQiOqrI4U7evV2gRazg9RlYbde";

  const options = {
    method: "POST",
    url: "https://uatcheckout.thawani.om/api/v1/checkout/session",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "thawani-api-key": secretKey,
    },
    data: {
      client_reference_id: "123412",
      mode: "payment",
      products: [{ name: "product 1", quantity: 1, unit_amount: 100 }],
      success_url: "https://thw.om/success",
      cancel_url: "https://thw.om/cancel",
      metadata: { "Customer name": "somename", "order id": 0 },
    },
  };

  const check = async () => {
    try {
      const { data } = await axios.request(options);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button className="bg-primary px-4 py-2 rounded-lg" onClick={check}>
        check
      </button>
    </div>
  );
}
