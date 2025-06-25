"use client";
import { useState, useEffect } from "react";
import "./CurrencyConverter.css";

const API_KEY = import.meta.env.VITE_PUBLIC_EXCHANGE_RATE_API_KEY;

const App = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [convertedAmount, setConvertedAmount] = useState(null);
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

    fetchExchangeRates();
  }, [fromCurrency, API_URL]);

  useEffect(() => {
    if (exchangeRates[toCurrency] && amount) {
      setConvertedAmount((amount * exchangeRates[toCurrency]).toFixed(2));
    }
  }, [amount, fromCurrency, toCurrency, exchangeRates]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  if (loading) {
    return <div className="converter-container">Loading exchange rates...</div>;
  }

  if (error) {
    return (
      <div className="converter-container error-message">
        Error: {error}. Please check your API key and try again.
      </div>
    );
  }

  const currencies = Object.keys(exchangeRates);

  return (
    <div className="container">
      <div className="converter-container">
        <h1>Konverter Mata Uang</h1>

        <div className="input-group">
          <label htmlFor="amount">Jumlah:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            min="0"
          />
        </div>

        <div className="input-group">
          <label htmlFor="fromCurrency">Dari Mata Uang:</label>
          <select
            id="fromCurrency"
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button className="swap-button" onClick={handleSwapCurrencies}>
          &#8646; Tukar
        </button>

        <div className="input-group">
          <label htmlFor="toCurrency">Ke Mata Uang:</label>
          <select
            id="toCurrency"
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        {convertedAmount && (
          <div className="result">
            <p>
              {amount} {fromCurrency} = <strong>{convertedAmount}</strong>{" "}
              {toCurrency}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
