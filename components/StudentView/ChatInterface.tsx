
import React, { useState, useEffect, useRef } from 'react';
import { PatientCase, ChatMessage } from '../../types';
import { generatePatientResponse, generateTTS, generatePatientAvatar } from '../../services/geminiService';

interface ChatInterfaceProps {
  currentCase: PatientCase;
  onFinish: (history: ChatMessage[]) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentCase, onFinish }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    generatePatientAvatar(`${currentCase.profile.gender}, age ${currentCase.profile.age}, ${currentCase.profile.chiefComplaint}`)
      .then(url => setAvatar(url));

    const initWelcome = async () => {
      const welcome = `สวัสดีครับ/ค่ะ ฉันคือ ${currentCase.profile.name} มาด้วยอาการ ${currentCase.profile.chiefComplaint} ค่ะ`;
      setMessages([{ role: 'model', text: welcome, timestamp: Date.now() }]);
      setIsSpeaking(true);
      await generateTTS(welcome);
      setIsSpeaking(false);
    };

    initWelcome();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'th-TH';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
    }
  }, [currentCase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping || isSpeaking) return;

    const userMsg: ChatMessage = { role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await generatePatientResponse(currentCase, messages, inputValue);
      const botMsg: ChatMessage = { role: 'model', text: responseText || '...', timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false); // Text displayed
      
      if (responseText) {
        setIsSpeaking(true);
        await generateTTS(responseText);
        setIsSpeaking(false);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setIsSpeaking(false);
    }
  };

  const isInputDisabled = isTyping || isSpeaking || isListening;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      <div className="lg:w-1/3 flex flex-col gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="aspect-video lg:aspect-square bg-slate-100 relative">
            {avatar ? (
              <img src={avatar} alt="Patient Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center animate-pulse">
                <i className="fas fa-user text-6xl text-slate-300"></i>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h2 className="text-white font-bold text-xl">{currentCase.profile.name}</h2>
              <p className="text-white/80 text-sm">อายุ {currentCase.profile.age} ปี • เพศ {currentCase.profile.gender === 'Male' ? 'ชาย' : 'หญิง'}</p>
            </div>
            {isSpeaking && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-lg border border-indigo-100 flex items-center gap-2 animate-bounce">
                <div className="flex gap-1">
                  <span className="w-1 h-3 bg-indigo-600 rounded-full animate-pulse"></span>
                  <span className="w-1 h-3 bg-indigo-400 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse delay-150"></span>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-tighter">ผู้ป่วยกำลังพูด...</span>
              </div>
            )}
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">อาการสำคัญ (Chief Complaint)</label>
              <p className="text-slate-700 font-semibold mt-1">{currentCase.profile.chiefComplaint}</p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
              <button 
                disabled={isInputDisabled}
                onClick={() => onFinish(messages)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
              >
                <i className="fas fa-stethoscope"></i> จบการซักประวัติและไปวินิจฉัย
              </button>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
          <h3 className="text-indigo-900 font-bold text-sm mb-2 flex items-center gap-2">
            <i className={`fas ${isSpeaking ? 'fa-volume-up text-indigo-600' : 'fa-lightbulb text-amber-500'}`}></i> 
            {isSpeaking ? 'กรุณาตั้งใจฟังผู้ป่วย' : 'คำแนะนำ'}
          </h3>
          <p className="text-indigo-700 text-xs leading-relaxed font-medium">
            {isSpeaking 
              ? "รอให้ผู้ป่วยพูดจบก่อน จึงจะสามารถถามคำถามถัดไปได้ค่ะ" 
              : "ซักประวัติให้ครอบคลุมที่สุดก่อนไปขั้นตอนวินิจฉัยนะคะ"}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
              }`}>
                <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t-2 border-slate-100">
          <div className="relative flex items-center gap-2">
            <button
              disabled={isSpeaking || isTyping}
              onClick={toggleListening}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isListening ? 'bg-rose-500 text-white animate-pulse shadow-lg' : 
                (isSpeaking || isTyping) ? 'bg-slate-100 text-slate-300 border-slate-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border'
              }`}
            >
              <i className={`fas ${isListening ? 'fa-microphone text-lg' : 'fa-microphone-slash text-lg'}`}></i>
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                disabled={isInputDisabled}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isSpeaking ? "กรุณารอผู้ป่วยพูดจบ..." : isListening ? "กำลังฟัง..." : "ถามคำถามซักประวัติที่นี่..."}
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm md:text-base outline-none transition-all pr-12 ${
                  isSpeaking 
                    ? 'bg-slate-50 border-slate-100 text-slate-400 italic' 
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-700'
                }`}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isInputDisabled}
                className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  !inputValue.trim() || isInputDisabled ? 'opacity-0 scale-90' : 'text-indigo-600 hover:bg-indigo-50 scale-100 opacity-100'
                }`}
              >
                <i className="fas fa-paper-plane text-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
