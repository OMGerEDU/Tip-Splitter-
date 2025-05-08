import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert"; 
import { Plus, Trash2, Download, Users, Calculator, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from 'html2canvas';
import CurrencySelector from "./CurrencySelector";

export default function PersonalItemsCalculator({ language, sessionId, onTotalChange }) {
    const [people, setPeople] = useState([{
        id: Date.now(),
        name: "",
        items: []
    }]);
    const [tipPercent, setTipPercent] = useState(15);
    const [expectedTotal, setExpectedTotal] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [totalMismatch, setTotalMismatch] = useState(false);
    const calculationRef = useRef(null);

    // Currency symbols
    const currencySymbols = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        ILS: "₪"
    };

    // Text content
    const text = {
        title: {
            en: "Personal Items Calculator",
            he: "מחשבון פריטים אישי"
        },
        person: {
            en: "Person",
            he: "אדם"
        },
        addPerson: {
            en: "Add Person",
            he: "הוסף אדם"
        },
        addItem: {
            en: "Add Item",
            he: "הוסף פריט"
        },
        description: {
            en: "Description",
            he: "תיאור"
        },
        price: {
            en: "Price",
            he: "מחיר"
        },
        tipPercentage: {
            en: "Tip Percentage",
            he: "אחוז טיפ"
        },
        total: {
            en: "Subtotal",
            he: "סיכום ביניים"
        },
        tip: {
            en: "Tip",
            he: "טיפ"
        },
        grandTotal: {
            en: "Grand Total",
            he: "סה״כ לתשלום"
        },
        download: {
            en: "Save as Image",
            he: "שמור כתמונה"
        },
        name: {
            en: "Name",
            he: "שם"
        },
        personTotal: {
            en: "Total",
            he: "סה״כ"
        },
        perPerson: {
            en: "Per Person",
            he: "לאדם"
        },
        tipAmount: {
            en: "Tip Amount",
            he: "סכום הטיפ"
        },
        calculateTip: {
            en: "Calculate",
            he: "חשב"
        },
        personTip: {
            en: "Tip",
            he: "טיפ"
        },
        personalTipOverride: {
            en: "Override tip (optional)",
            he: "דריסת טיפ (אופציונלי)"
        },
        expectedTotal: {
            en: "Expected Total (for verification)",
            he: "סכום צפוי (לאימות)"
        },
        mismatchWarning: {
            en: "The total doesn't match the sum of individual items. Check if you missed any item.",
            he: "הסכום הכולל אינו תואם לסכום הפריטים הבודדים. בדוק אם שכחת פריט כלשהו."
        },
        mismatchAmount: {
            en: "Difference",
            he: "הפרש"
        }
    };

    // Preset tip percentages
    const tipPresets = [10, 15, 20];

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

    // Initialize session
    useEffect(() => {
        if (sessionId) {
            const savedPeople = localStorage.getItem(`tipSplitter_people_${sessionId}`);
            if (savedPeople) {
                setPeople(JSON.parse(savedPeople));
            }
            
            const savedTipPercent = localStorage.getItem(`tipSplitter_tip_${sessionId}`);
            if (savedTipPercent) {
                setTipPercent(Number(savedTipPercent));
            }
        }
    }, [sessionId]);

    // Save people data to localStorage and update total
    useEffect(() => {
        if (sessionId) {
            localStorage.setItem(`tipSplitter_people_${sessionId}`, JSON.stringify(people));
            localStorage.setItem(`tipSplitter_tip_${sessionId}`, tipPercent.toString());
        }
        
        // Calculate total amount for all people
        const total = calculateTotal();
        
        onTotalChange(total);

        // Check for total mismatch
        if (expectedTotal && !isNaN(parseFloat(expectedTotal))) {
            const calculatedTotal = calculateTotal();
            const diff = Math.abs(calculatedTotal - parseFloat(expectedTotal));
            setTotalMismatch(diff > 0.01); // Allow for tiny rounding errors
        } else {
            setTotalMismatch(false);
        }
    }, [people, expectedTotal, tipPercent, sessionId, onTotalChange]);

    const addPerson = () => {
        setPeople([...people, {
            id: Date.now(),
            name: "",
            items: []
        }]);
    };

    const updatePersonName = (id, name) => {
        setPeople(people.map(person => 
            person.id === id ? { ...person, name } : person
        ));
    };

    const removePerson = (id) => {
        setPeople(people.filter(person => person.id !== id));
    };

    const addItem = (personId) => {
        setPeople(people.map(person => 
            person.id === personId 
                ? { ...person, items: [...person.items, { id: Date.now(), description: "", price: "" }] }
                : person
        ));
    };

    const updateItem = (personId, itemId, field, value) => {
        setPeople(people.map(person => 
            person.id === personId 
                ? { 
                    ...person, 
                    items: person.items.map(item => 
                        item.id === itemId ? { ...item, [field]: value } : item
                    ) 
                }
                : person
        ));
    };

    const removeItem = (personId, itemId) => {
        setPeople(people.map(person => 
            person.id === personId 
                ? { ...person, items: person.items.filter(item => item.id !== itemId) }
                : person
        ));
    };

    // Function to calculate the total for a person
    const calculatePersonTotal = (person) => {
        return person.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    };

    // Calculate grand total (all people)
    const calculateTotal = () => {
        return people.reduce((sum, person) => sum + calculatePersonTotal(person), 0);
    };

    // Calculate tip amount
    const calculateTipAmount = () => {
        const total = calculateTotal();
        return total * (tipPercent / 100);
    };

    // Calculate per person tip
    const calculatePersonTip = (person) => {
        const personTotal = calculatePersonTotal(person);
        const total = calculateTotal();
        
        if (total === 0) return 0;
        
        // Calculate proportional tip
        return personTotal * (tipPercent / 100);
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat(language === "he" ? "he-IL" : "en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const downloadAsImage = async () => {
        if (calculationRef.current) {
            try {
                const canvas = await html2canvas(calculationRef.current, {
                    backgroundColor: "#ffffff",
                    scale: 2,
                });
                
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = image;
                link.download = 'personal-items-calculation.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error generating image:", error);
            }
        }
    };

    // Calculate difference between expected and calculated total
    const calculateDifference = () => {
        if (!expectedTotal || isNaN(parseFloat(expectedTotal))) return 0;
        return parseFloat(expectedTotal) - calculateTotal();
    };

    return (
        <div ref={calculationRef}>
            <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 mb-6">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                            {text.title[language]}
                        </CardTitle>
                        <Button
                            variant="outline"
                            onClick={downloadAsImage}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800"
                        >
                            <Download className="w-4 h-4" />
                            {text.download[language]}
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="pt-6 px-6">
                    {/* Currency and Expected Total */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <CurrencySelector
                            language={language}
                            currency={currency}
                            setCurrency={setCurrency}
                        />
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Label htmlFor="expectedTotal" className="whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
                                {text.expectedTotal[language]}:
                            </Label>
                            <div className="relative w-full md:w-36">
                                <span className="absolute left-3 top-2.5 text-gray-500">
                                    {currencySymbols[currency]}
                                </span>
                                <Input
                                    id="expectedTotal"
                                    value={expectedTotal}
                                    onChange={(e) => setExpectedTotal(e.target.value.replace(/[^\d.]/g, ''))}
                                    className="pl-8 bg-white dark:bg-gray-800"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total mismatch alert */}
                    {totalMismatch && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                {text.mismatchWarning[language]}
                                <div className="font-semibold mt-1">
                                    {text.mismatchAmount[language]}: {formatCurrency(calculateDifference())}
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {/* Tip percentage slider */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                {text.tipPercentage[language]}
                                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                    {tipPercent}%
                                </span>
                            </Label>
                            <div className="flex gap-2">
                                {tipPresets.map(preset => (
                                    <Button
                                        key={preset}
                                        variant={tipPercent === preset ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setTipPercent(preset)}
                                        className="w-10 h-7 p-0"
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
                        />
                    </div>
                    
                    {/* People and their items */}
                    <AnimatePresence>
                        {people.map((person, personIndex) => (
                            <motion.div 
                                key={person.id} 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-8 last:mb-0"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="py-1.5">
                                            {text.person[language]} {personIndex + 1}
                                        </Badge>
                                        <Input
                                            value={person.name}
                                            onChange={(e) => updatePersonName(person.id, e.target.value)}
                                            placeholder={text.name[language]}
                                            className="max-w-[200px] bg-white dark:bg-gray-800"
                                        />
                                    </div>
                                    {people.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removePerson(person.id)}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                                
                                <div className="pl-5 border-l-2 border-gray-200 dark:border-gray-700">
                                    <AnimatePresence>
                                        {person.items.map(item => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex gap-3 mb-3"
                                            >
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => updateItem(person.id, item.id, "description", e.target.value)}
                                                    placeholder={text.description[language]}
                                                    className="flex-grow bg-white dark:bg-gray-800"
                                                />
                                                <div className="w-24 relative">
                                                    <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                        {currencySymbols[currency]}
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(person.id, item.id, "price", e.target.value)}
                                                        placeholder={text.price[language]}
                                                        className="pl-6 bg-white dark:bg-gray-800"
                                                    />
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(person.id, item.id)}
                                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addItem(person.id)}
                                        className="mt-1 mb-3"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        {text.addItem[language]}
                                    </Button>
                                    
                                    {/* Person total */}
                                    {person.items.length > 0 && (
                                        <div className="flex flex-col bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {text.personTotal[language]}:
                                                </span>
                                                <span className="font-semibold">{formatCurrency(calculatePersonTotal(person))}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {text.personTip[language]}:
                                                </span>
                                                <span className="font-semibold">{formatCurrency(calculatePersonTip(person))}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-blue-700 dark:text-blue-300 font-bold mt-1 pt-1 border-t border-blue-200 dark:border-blue-800">
                                                <span>{text.grandTotal[language]}:</span>
                                                <span>{formatCurrency(calculatePersonTotal(person) + calculatePersonTip(person))}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <Button
                        variant="outline"
                        onClick={addPerson}
                        className="mt-4 w-full"
                    >
                        <Users className="w-4 h-4 mr-2" />
                        {text.addPerson[language]}
                    </Button>
                </CardContent>

                <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
                    <div className="w-full space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">{text.total[language]}:</span>
                            <span className="font-semibold">{formatCurrency(calculateTotal())}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">
                                {text.tip[language]} ({tipPercent}%):
                            </span>
                            <span className="font-semibold">{formatCurrency(calculateTipAmount())}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold text-blue-700 dark:text-blue-300 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span>{text.grandTotal[language]}:</span>
                            <span>{formatCurrency(calculateTotal() + calculateTipAmount())}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{text.perPerson[language]} ({people.length}):</span>
                            <span>{formatCurrency((calculateTotal() + calculateTipAmount()) / people.length)}</span>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}