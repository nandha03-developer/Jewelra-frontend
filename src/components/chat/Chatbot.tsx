'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  const initialBotMessage: Message = {
    id: '1',
    text: 'Vanakkam! Welcome to Jewelra. How can I help you today?',
    sender: 'bot',
    timestamp: new Date(),
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen && mounted) {
      setMessages([{ ...initialBotMessage, timestamp: new Date() }]);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="hidden md:block fixed bottom-6 left-8 z-[100] font-[inter]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-24 left-0 w-[320px] h-[500px] flex flex-col pointer-events-auto"
          >
            {/* Glass Container */}
            <div className="flex-1 bg-white/80 backdrop-blur-2xl rounded-[32px] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden relative">

              {/* Modern Header - Slim Version */}
              <div className="bg-white p-3.5 px-5 flex items-center justify-between border-b border-gray-100/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#751A20] to-[#A61E26] flex items-center justify-center shadow-lg shadow-maroon-900/10">
                    <Icon icon="solar:chat-square-call-bold" className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs">Jewelra Bot</h3>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-[9px] text-gray-400 font-medium">Assistant</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <Icon icon="solar:close-circle-bold" className="text-gray-300 text-lg" />
                </button>
              </div>

              {/* Chat View */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-white/30 to-white/10">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${msg.sender === 'user'
                        ? 'bg-[#751A20] text-white rounded-tr-none font-medium'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none'
                        }`}
                    >
                      {msg.sender === 'bot' ? (
                        <div
                          className="whitespace-pre-wrap"
                          dangerouslySetInnerHTML={{
                            __html: msg.text.replace(
                              /(https?:\/\/[^\s]+|(?:\/shop\/[^\s]+))/g,
                              '<a href="$1" class="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-gray-50 text-[#751A20] rounded-lg text-[11px] font-bold border border-[#751A20]/10 hover:bg-gray-100 transition-all">Shop Now <i class="iconify" data-icon="solar:arrow-right-up-bold"></i></a>'
                            ).replace(/\n/g, '<br />')
                          }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      )}
                      <div className={`mt-1 text-[8px] opacity-40 ${msg.sender === 'user' ? 'text-white text-right' : 'text-gray-400 text-left'}`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white px-3 py-2 rounded-2xl border border-gray-100 flex gap-1">
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Floating Input */}
              <div className="p-4 bg-white/50 border-t border-gray-100/50 backdrop-blur-md">
                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 bg-white rounded-[20px] p-1.5 shadow-sm border border-gray-100"
                >
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-gray-300"
                  />
                  <button
                    type="submit"
                    disabled={!message.trim()}
                    className="w-10 h-10 bg-[#751A20] text-white rounded-[16px] flex items-center justify-center hover:bg-[#A61E26] disabled:opacity-20 transition-all flex-shrink-0"
                  >
                    <Icon icon="solar:plain-2-bold" className="text-lg" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#751A20] to-[#a62128] flex items-center justify-center shadow-[0_15px_35px_rgba(117,26,32,0.3)] border border-white/10 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              className="flex items-center justify-center relative z-10"
            >
              <Icon icon="solar:close-circle-bold" className="text-3xl text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
              className="flex items-center justify-center relative z-10"
            >
              <Icon icon="solar:chat-round-dots-bold" className="text-3xl text-white" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-green-500 border-[2.5px] border-[#751A20] rounded-full"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
