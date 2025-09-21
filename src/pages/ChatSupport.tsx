import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Bot, 
  Phone, 
  AlertTriangle,
  Heart,
  Lightbulb,
  Wifi,
  Send,
  User,
  Loader2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatSupport = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "👋 Hello! I'm your AI mental health companion powered by advanced RAG technology. I have access to comprehensive mental health resources and can provide personalized support. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef(`mental-health-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToN8n = async (message: string) => {
    try {
      const response = await fetch('https://sumanth7.app.n8n.cloud/webhook/a73b7815-198a-4378-b036-61500647dffd/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          chatInput: message,
          message: message,
          action: 'sendMessage',
          sessionId: sessionIdRef.current,
          context: 'mental-health-support',
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.output || data.response || data.message || data.text || data.reply || "I received your message and I'm here to help you with personalized mental health support.";
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error connecting to n8n AI agent:', error);
      return "I'm experiencing a temporary connection issue with the AI system. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await sendMessageToN8n(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties. Please reach out to a mental health professional if you need immediate support.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="flex w-full max-w-6xl bg-white/5 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600">
                <AvatarFallback className="bg-transparent text-white">
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  AI Mental Health Support <Sparkles className="h-5 w-5 text-yellow-400" />
                </h1>
                <p className="text-blue-200 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Private & Secure
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
              <Wifi className="w-3 h-3 mr-2" />
              Online
            </Badge>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-3 max-w-md ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <Avatar className={`flex-shrink-0 h-8 w-8 ${message.sender === 'ai' ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gradient-to-r from-green-500 to-blue-500'}`}>
                    <AvatarFallback className="bg-transparent text-white">
                      {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`rounded-2xl px-4 py-3 max-w-sm break-words ${message.sender === 'ai' ? 'bg-white/10 text-white backdrop-blur-sm' : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <Avatar className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
                    <AvatarFallback className="bg-transparent text-white">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                      <span className="text-sm text-white/70">AI is analyzing your message...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-sm p-4 flex items-center space-x-4">
            <Input
              placeholder="Share what's on your mind..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isTyping}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-2xl px-4 py-3 h-auto min-h-[48px] backdrop-blur-sm focus:bg-white/15 transition-all"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isTyping || !currentMessage.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl px-6 py-3 h-12"
            >
              {isTyping ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white/5 backdrop-blur-sm p-6 space-y-6 border-l border-white/10 overflow-y-auto custom-scrollbar">
          {/* Sidebar cards go here, unchanged from your original code */}
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;
