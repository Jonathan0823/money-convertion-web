"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const API_KEY = import.meta.env.VITE_PUBLIC_EXCHANGE_RATE_API_KEY;

export default function Component() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [convertedAmount, setConvertedAmount] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.result === "error") {
          throw new Error(`API Error: ${data["error-type"]}`);
        }
        setExchangeRates(data.conversion_rates);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (API_KEY) {
      fetchExchangeRates();
    } else {
      setError("API key not found");
      setLoading(false);
    }
  }, [fromCurrency, API_URL]);

  useEffect(() => {
    if (exchangeRates[toCurrency] && amount) {
      const numAmount = Number.parseFloat(amount);
      if (!isNaN(numAmount)) {
        setConvertedAmount((numAmount * exchangeRates[toCurrency]).toFixed(2));
      }
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
  };

  const currencies = Object.keys(exchangeRates);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading exchange rates...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md border-red-200">
          <CardContent className="p-8 text-center">
            <div className="text-red-600">
              <p className="font-medium">Error: {error}</p>
              <p className="text-sm mt-2">
                Please check your API key and try again.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Currency Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Currency Conversion Row */}
          <div className="flex items-center gap-4">
            {/* From Currency */}
            <div className="flex-1 space-y-2">
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg font-medium"
                min="0"
                step="0.01"
                placeholder="Enter amount"
              />
            </div>

            {/* Arrow Icon */}
            <div className="flex-shrink-0 pt-6">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                <ArrowLeftRight className="h-4 w-4 text-slate-600" />
              </div>
            </div>

            {/* To Currency */}
            <div className="flex-1 space-y-2">
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="text"
                value={convertedAmount}
                readOnly
                className="h-12 text-lg font-medium bg-slate-50 cursor-not-allowed"
                placeholder="Converted amount"
              />
            </div>
          </div>

          {/* Exchange Rate Display */}
          {exchangeRates[toCurrency] && (
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                1 {fromCurrency} = {exchangeRates[toCurrency].toFixed(4)}{" "}
                {toCurrency}
              </p>
            </div>
          )}

          {/* Swap Button */}
          <div className="flex justify-center pt-2">
            <Button
              onClick={handleSwapCurrencies}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Swap Currencies
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
