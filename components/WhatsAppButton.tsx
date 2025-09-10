"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.520-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.485 3.696" />
  </svg>
);

interface WhatsAppButtonProps {
  phoneNumber?: string;
  currentLang: string;
  productName?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber = "+31618264718",
  currentLang = "en",
  productName,
  className = "",
}: WhatsAppButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const generateWhatsAppUrl = (message: string) => {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phoneNumber.replace(/\D/g, "")}?text=${encodedMessage}`;
  };

  const messages = {
    general: {
      en: "Hello! I'm interested in your cultural products. Could you help me?",
      nl: "Hallo! Ik ben geïnteresseerd in jullie culturele producten. Kunnen jullie me helpen?",
    },
    product: {
      en: `Hello! I'm interested in the product: ${productName}. Could you provide more information?`,
      nl: `Hallo! Ik ben geïnteresseerd in het product: ${productName}. Kunnen jullie meer informatie geven?`,
    },
    store: {
      en: "Hello! I'd like to visit your store. What are your opening hours?",
      nl: "Hallo! Ik zou graag jullie winkel bezoeken. Wat zijn jullie openingstijden?",
    },
    custom: {
      en: "Hello! I have a question about...",
      nl: "Hallo! Ik heb een vraag over...",
    },
  };

  const quickMessages = [
    {
      icon: "🛍️",
      text: currentLang === "en" ? "General Inquiry" : "Algemene Vraag",
      message: messages.general[currentLang as keyof typeof messages.general],
    },
    ...(productName
      ? [
          {
            icon: "📦",
            text: currentLang === "en" ? "About Product" : "Over Product",
            message:
              messages.product[currentLang as keyof typeof messages.product],
          },
        ]
      : []),
    {
      icon: "🏪",
      text: currentLang === "en" ? "Visit Store" : "Winkel Bezoeken",
      message: messages.store[currentLang as keyof typeof messages.store],
    },
    {
      icon: "💬",
      text: currentLang === "en" ? "Custom Message" : "Aangepast Bericht",
      message: messages.custom[currentLang as keyof typeof messages.custom],
    },
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {/* Expanded Menu */}
      {isExpanded && (
        <div className="mb-4 bg-background rounded-2xl shadow-2xl border border-border p-4 min-w-[280px] animate-in slide-in-from-bottom-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center space-x-2">
              {/* <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">WA</span>
              </div> */}
              <div>
                <h4 className="font-serif font-semibold text-foreground text-sm">
                  {currentLang === "en" ? "WhatsApp Us" : "WhatsApp Ons"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {currentLang === "en"
                    ? "We reply quickly!"
                    : "We reageren snel!"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <XMarkIcon className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Quick Message Options */}
          <div className="space-y-2">
            {quickMessages.map((msg, index) => (
              <a
                key={index}
                href={generateWhatsAppUrl(msg.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 hover:bg-secondary rounded-lg transition-colors group"
                onClick={() => setIsExpanded(false)}
              >
                <span className="text-lg">{msg.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {msg.text}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {msg.message.length > 40
                      ? `${msg.message.substring(0, 40)}...`
                      : msg.message}
                  </p>
                </div>
              </a>
            ))}
          </div>

          {/* Direct WhatsApp Link */}
          <div className="mt-4 pt-3 border-t border-border">
            <a
              href={generateWhatsAppUrl(
                messages.general[currentLang as keyof typeof messages.general]
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center space-x-2 py-3 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>{currentLang === "en" ? "Start Chat" : "Start Chat"}</span>
            </a>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
        aria-label={
          currentLang === "en"
            ? "Contact us via WhatsApp"
            : "Contact ons via WhatsApp"
        }
      >
        {/* WhatsApp Icon */}
        {!isExpanded ? (
          <WhatsAppIcon className="w-7 h-7 text-white" />
        ) : (
          <XMarkIcon className="w-6 h-6 text-white" />
        )}

        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-15 scale-110"></div>

        {/* Notification Badge */}
        {!isExpanded && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
        )}
      </button>

      {/* Tooltip */}
      {!isExpanded && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-foreground text-background text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {currentLang === "en" ? "Chat with us" : "Chat met ons"}
          <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-foreground"></div>
        </div>
      )}
    </div>
  );
}
