import React, { useState, useEffect, useRef } from "react";
import { CopyCheck, DollarSign, Users, Percent, Divide, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';
import CurrencySelector from "./CurrencySelector";

export default function TipCalculator({ language, onSaveSplit, tourActive, setTourRef }) {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [numPeople, setNumPeople] = useState(2);
  const [copied, setCopied] = useState(null);
  const [currency, setCurrency] = useState("USD");

  const billInputRef = useRef(null);
  const tipSliderRef = useRef(null);
  const numPeopleRef = useRef(null);
  const resultsRef = useRef(null);
  const calculatorRef = useRef(null);

  // Currency symbols
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    ILS: "₪"
  };

  // Load currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("tipSplitter_currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tipSplitter_currency", currency);
  }, [currency]);

  // Set tour refs for guided tour
  useEffect(() => {
    if (tourActive && setTourRef) {
      setTourRef({
        billInput: billInputRef,
        tipSlider: tipSliderRef,
        numPeople: numPeopleRef,
        results: resultsRef
      });
    }
  }, [tourActive, setTourRef]);

  // Text content in both languages
  const text = {
    calculator: { en: "Bill Calculator", he: "מחשבון חשבון" },
    billAmount: { en: "Bill Amount", he: "סכום החשבון" },
    tipPercentage: { en: "Tip Percentage", he: "אחוז טיפ" },
    numberOfPeople: { en: "Number of People", he: "מספר אנשים" },
    tipAmount: { en: "Tip Amount", he: "סכום הטיפ" },
    totalBill: { en: "Total Bill", he: "סה״כ לתשלום" },
    tipPerPerson: { en: "Tip Per Person", he: "טיפ לאדם" },
    totalPerPerson: { en: "Total Per Person", he: "סה״כ לאדם" },
    copy: { en: "Copy", he: "העתק" },
    copied: { en: "Copied!", he: "הועתק!" },
    saveImage: { en: "Save as Image", he: "שמור כתמונה" },
  };
  
  // Preset tip percentages
  const tipPresets = [10, 15, 20];

  const handleBillChange = (e) => {
    // Remove all non-numeric characters except decimal point
    const value = e.target.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      return;
    }
    
    setBill(value);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  // Calculate tip and total amounts
  const tipAmount = bill ? parseFloat(bill) * (tipPercent / 100) : 0;
  const totalBill = bill ? parseFloat(bill) + tipAmount : 0;
  const tipPerPerson = numPeople > 0 ? tipAmount / numPeople : 0;
  const totalPerPerson = numPeople > 0 ? totalBill / numPeople : 0;
  
  // Format currency display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat(language === "he" ? "he-IL" : "en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Save calculation to history when values change
  useEffect(() => {
    if (bill && parseFloat(bill) > 0) {
      const calculationData = {
        timestamp: new Date().toISOString(),
        bill: parseFloat(bill),
        currency,
        tipPercent,
        numPeople,
        tipAmount,
        totalBill,
        tipPerPerson,
        totalPerPerson
      };
      onSaveSplit(calculationData);
    }
  }, [bill, currency, tipPercent, numPeople, tipAmount, totalBill, tipPerPerson, totalPerPerson, onSaveSplit]);

  // Function to save calculator as image
  const saveAsImage = async () => {
    if (calculatorRef.current) {
      try {
        const canvas = await html2canvas(calculatorRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
        });
        
        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.href = image;
        link.download = 'tip-calculation.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error generating image:", error);
      }
    }
  };

  return (
    <Card className="tip-calculator-section bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700" ref={calculatorRef}>
      <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            {text.calculator[language]}
          </CardTitle>
          <Button
            variant="outline"
            onClick={saveAsImage}
            className="flex items-center gap-2 bg-white dark:bg-gray-800"
          >
            <Download className="w-4 h-4" />
            {text.saveImage[language]}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 px-6 pb-6 space-y-6">
        {/* Currency Selector */}
        <div className="flex justify-end">
          <CurrencySelector 
            language={language}
            currency={currency}
            setCurrency={setCurrency}
          />
        </div>

        {/* Bill amount input */}
        <div className="space-y-2" ref={billInputRef}>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {text.billAmount[language]}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  {language === "en" 
                    ? "Enter the total bill amount before tip" 
                    : "הזן את סכום החשבון הכולל לפני הטיפ"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">
              {currencySymbols[currency]}
            </span>
            <Input
              type="text"
              value={bill}
              onChange={handleBillChange}
              className={`pl-8 text-lg font-medium bg-white dark:bg-gray-800 ${language === "he" ? "text-right" : ""}`}
              placeholder="0.00"
            />
          </div>
        </div>
        
        {/* Tip percentage slider */}
        <div className="space-y-4" ref={tipSliderRef}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              {text.tipPercentage[language]}
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {tipPercent}%
              </span>
            </label>
            <div className="flex gap-2">
              {tipPresets.map(preset => (
                <Button
                  key={preset}
                  variant={tipPercent === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTipPercent(preset)}
                  className="w-12 h-8"
                >
                  {preset}%
                </Button>
              ))}
            </div>
          </div>
          <Slider
            value={[tipPercent]}
            min={0}
            max={30}
            step={1}
            onValueChange={(val) => setTipPercent(val[0])}
            className="cursor-pointer"
          />
        </div>
        
        {/* Number of people */}
        <div className="space-y-2" ref={numPeopleRef}>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {text.numberOfPeople[language]}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  {language === "en" 
                    ? "How many people are splitting the bill" 
                    : "בין כמה אנשים מחלקים את החשבון"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              disabled={numPeople <= 1}
              className="rounded-full h-8 w-8 bg-white dark:bg-gray-800"
            >
              -
            </Button>
            <div className="w-12 text-center flex items-center justify-center gap-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{numPeople}</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setNumPeople(numPeople + 1)}
              className="rounded-full h-8 w-8 bg-white dark:bg-gray-800"
            >
              +
            </Button>
          </div>
        </div>
        
        {/* Results */}
        <div 
          className="mt-8 grid grid-cols-2 gap-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
          ref={resultsRef}
        >
          {/* Tip amount */}
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Percent className="h-3 w-3" />
              {text.tipAmount[language]}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {formatCurrency(tipAmount)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(formatCurrency(tipAmount), "tip")}
                className="h-6 w-6"
              >
                {copied === "tip" ? (
                  <CopyCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <CopyCheck className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Total bill */}
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {text.totalBill[language]}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {formatCurrency(totalBill)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(formatCurrency(totalBill), "total")}
                className="h-6 w-6"
              >
                {copied === "total" ? (
                  <CopyCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <CopyCheck className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Tip per person */}
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Divide className="h-3 w-3" />
              {text.tipPerPerson[language]}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {formatCurrency(tipPerPerson)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(formatCurrency(tipPerPerson), "tipPerPerson")}
                className="h-6 w-6"
              >
                {copied === "tipPerPerson" ? (
                  <CopyCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <CopyCheck className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Total per person */}
          <div className="space-y-1">
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {text.totalPerPerson[language]}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                {formatCurrency(totalPerPerson)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(formatCurrency(totalPerPerson), "totalPerPerson")}
                className="h-6 w-6"
              >
                {copied === "totalPerPerson" ? (
                  <CopyCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <CopyCheck className="h-3 w-3 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}