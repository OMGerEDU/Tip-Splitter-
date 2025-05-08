import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Download } from "lucide-react";
import html2canvas from 'html2canvas';

export default function SharedSession({ language, sessionId }) {
    const [participants, setParticipants] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [currency, setCurrency] = useState("USD");
    const sessionRef = useRef(null);

    const text = {
        title: {
            en: "Share Calculation",
            he: "שיתוף חישוב"
        },
        participants: {
            en: "Participants",
            he: "משתתפים"
        },
        totalAmount: {
            en: "Total Amount",
            he: "סכום כולל"
        },
        perPerson: {
            en: "Per Person",
            he: "לאדם"
        },
        noParticipants: {
            en: "No participants yet. Share the session link to invite friends!",
            he: "אין משתתפים עדיין. שתף את הקישור להזמין חברים!"
        },
        saveImage: {
            en: "Save as Image",
            he: "שמור כתמונה"
        },
        copied: {
            en: "Copied!",
            he: "הועתק!"
        }
    };

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

    useEffect(() => {
        if (sessionId) {
            const updateParticipants = () => {
                const allKeys = Object.keys(localStorage);
                const sessionKeys = allKeys.filter(key => key.startsWith(`tipSplitter_people_${sessionId}`));
                
                const parts = sessionKeys.map(key => {
                    const people = JSON.parse(localStorage.getItem(key) || '[]');
                    let total = 0;
                    
                    // Flatten all items from all people and calculate total
                    for (const person of people) {
                        for (const item of person.items || []) {
                            total += parseFloat(item.price || 0);
                        }
                    }
                    
                    return {
                        id: key.split('_').pop(),
                        people,
                        total
                    };
                });

                setParticipants(parts);
                setTotalAmount(parts.reduce((sum, p) => sum + p.total, 0));
            };

            updateParticipants();
            window.addEventListener('storage', updateParticipants);
            return () => window.removeEventListener('storage', updateParticipants);
        }
    }, [sessionId]);

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
        if (sessionRef.current) {
            try {
                const canvas = await html2canvas(sessionRef.current, {
                    backgroundColor: "#ffffff",
                    scale: 2,
                });
                
                const image = canvas.toDataURL("image/png");
                const link = document.createElement('a');
                link.href = image;
                link.download = 'shared-session.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error("Error generating image:", error);
            }
        }
    };

    return (
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 h-fit" ref={sessionRef}>
            <CardHeader className="bg-blue-50 dark:bg-blue-900/20 p-4 border-b border-blue-100 dark:border-blue-800">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        {text.title[language]}
                    </CardTitle>
                    <Button
                        variant="outline"
                        onClick={downloadAsImage}
                        className="flex items-center gap-2 bg-white dark:bg-gray-800"
                    >
                        <Download className="w-4 h-4" />
                        {text.saveImage[language]}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                {participants.length > 0 ? (
                    <div className="space-y-4">
                        {participants.map(participant => (
                            <div 
                                key={participant.id}
                                className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                        <span className="text-blue-600 dark:text-blue-300 font-semibold">
                                            {participant.id.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-medium">{participant.id}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {participant.people?.length || 0} people
                                        </div>
                                    </div>
                                </div>
                                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(participant.total)}
                                </div>
                            </div>
                        ))}

                        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>{text.totalAmount[language]}:</span>
                                <span className="text-green-600 dark:text-green-400">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                            {participants.length > 0 && (
                                <div className="flex justify-between items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span>{text.perPerson[language]}:</span>
                                    <span>
                                        {formatCurrency(totalAmount / participants.length)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">{text.noParticipants[language]}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}