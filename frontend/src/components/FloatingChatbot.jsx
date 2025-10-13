import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GLOBAL_KNOWLEDGE, CHATBOT_NAME } from './ChatbotKnowledge'; // 🚨 Corregido: Añadida extensión .jsx
import useUserSpecificData from '../hooks/useUserSpecificData.js'; // 🚨 Corregido: Añadida extensión .js
import { useProductContext } from '../context/ProductContext.jsx'; // 🚨 Corregido: Añadida extensión .jsx

// --- UTILIDAD DE MARKDOWN ---
// Parser simple para manejar **negritas** (Markdown)
const parseMarkdown = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Renderiza el contenido entre ** ** en negrita
            return <b key={index}>{part.substring(2, part.length - 2)}</b>;
        }
        return part;
    });
    return parts;
};

// --- LÓGICA DE CLASIFICACIÓN (El motor de la "IA") ---
const useChatbotLogic = (userName, productInfo, userData) => {
    
    const classifyAndRespond = useCallback((text) => {
        const normalizedText = text.toLowerCase();
        
        // 1. Clasificación de Saludos
        if (normalizedText.match(/hola|buenos d(í|i)as|buenas tardes|buenas noches|qu(é|e) tal/i)) {
            const name = userName || "personita";
            return `¡Hola ${name}! Me alegra verte. ¿Tienes dudas sobre la tienda o sobre el producto que estás viendo?`;
        }

        // 2. Clasificación de Preguntas PERSONALIZADAS (Solo si el usuario está logueado)
        if (userName) {
            if (normalizedText.match(/mis rese(ñ|n)as|cuantas rese(ñ|n)as|rese(ñ|n)as hechas/i)) {
                return `Has escrito **${userData.reviewsCount} reseña(s)** hasta ahora. ¡Gracias por compartir tu experiencia!`;
            }
            if (normalizedText.match(/mi historial|ventas|cuantas compras|he gastado|mi (ú|u)ltima compra/i)) {
                if (userData.totalOrders > 0) {
                    return `Tienes un total de **${userData.totalOrders} pedidos** con nosotros, y has gastado un total de **$${userData.totalSpent.toFixed(2)} USD**. Tu último pedido fue el ${userData.recentOrderDate}. ¡Eres un cliente VIP!`;
                }
                return "Aún no tienes pedidos registrados. ¡Es el momento perfecto para hacer tu primera compra!";
            }
        }
        
        // 3. Clasificación de Preguntas ESPECÍFICAS DEL PRODUCTO (Solo si estamos en una página de producto)
        if (productInfo) {
            const { name, price, stock } = productInfo;

            if (normalizedText.match(/precio|cuesta|valor/i)) {
                return `El precio de **${name}** es de **$${price}**. Si tienes alguna duda sobre el envío, pregúntame sobre 'envío'.`;
            }
            if (normalizedText.match(/stock|disponible|unidades|hay en existencia/i)) {
                if (stock > 0) {
                    return `Actualmente hay **${stock} unidades** de **${name}** disponibles.`;
                }
                return `¡Mala suerte! **${name}** está agotado por el momento. Te recomendamos añadirlo a tu lista de deseos.`;
            }
            if (normalizedText.match(/detalles de este producto|composici(ó|o)n|material/i)) {
                return `Para ver los detalles completos, material y medidas de **${name}**, por favor haz clic en el botón '+' en la sección del producto.`;
            }
        }

        // 4. Clasificación de Preguntas GENERALES (GLOBAL_KNOWLEDGE)
        for (const item of GLOBAL_KNOWLEDGE) {
            if (item.query.test(normalizedText)) {
                return item.answer;
            }
        }

        // 5. Respuesta por Defecto (Fallback)
        let fallbackMessage = "Lo siento, **no puedo ayudarte con eso en este momento**.";
        if (!userName && normalizedText.match(/mis/i)) {
            fallbackMessage += " Para preguntas personalizadas (reseñas, historial), por favor **inicia sesión** primero.";
        } else if (productInfo) {
            fallbackMessage += " Mis funciones están limitadas a temas generales de la tienda y al producto **que estás viendo**.";
        } else {
             fallbackMessage += " Mis funciones están limitadas a temas generales de la tienda (horarios, contacto, devoluciones, etc.).";
        }
        return fallbackMessage;
    }, [userName, productInfo, userData]);

    return classifyAndRespond;
};

// --- COMPONENTE PRINCIPAL FLOTANTE ---

const FloatingChatbot = ({ userName }) => {
    
    // Obtiene el producto de la página actual
    const { currentProduct: productInfo } = useProductContext();
    // Obtiene los datos específicos del usuario (pedidos, reseñas)
    const { userData, loading: userLoading } = useUserSpecificData();

    // Hook que contiene toda la lógica de respuesta
    const classifyAndRespond = useChatbotLogic(userName, productInfo, userData);

    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Saludo inicial y mensaje de bienvenida
    useEffect(() => {
        const greetingName = userName || "personita";
        let initialText = `¡Hola ${greetingName}! Mi nombre es **${CHATBOT_NAME}**.`;
        
        if (productInfo) {
            initialText += ` Puedo ayudarte con preguntas generales o sobre el producto **${productInfo.name}** que estás viendo.`;
        } else {
            initialText += ` Estoy aquí para ayudarte con preguntas generales sobre Eternal Joyeria (envíos, horarios, políticas, etc.).`;
        }

        setMessages([{ 
            sender: 'bot', 
            text: initialText
        }]);
    }, [userName, productInfo]);
    
    // Auto-scroll
    useEffect(() => {
        // Asegura que el último mensaje sea visible
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping, userLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        const userQuery = input.trim();
        if (!userQuery || isTyping || userLoading) return;

        // 1. Añadir mensaje del usuario
        setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
        setInput('');
        setIsTyping(true);

        // 2. Simular tiempo de procesamiento
        // Añade una pequeña demora para simular una respuesta de IA
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400)); 
        const botResponse = classifyAndRespond(userQuery);

        // 3. Añadir respuesta del bot
        setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
        setIsTyping(false);
    };
 
    // Estilos CSS (usando objetos de estilo para React)
    const chatbotStyles = {
        button: {
            position: 'fixed', bottom: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%',
            backgroundColor: '#D1A6B4', color: 'white', border: 'none', cursor: 'pointer', fontSize: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)', zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', transition: 'transform 0.2s',
        },
        container: {
            position: 'fixed', bottom: '90px', right: '20px', width: '350px', height: '450px',
            backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
            zIndex: 9999, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        },
        header: {
            padding: '12px 15px', background: '#D1A6B4', color: 'white', fontWeight: 'bold', fontSize: '1.1em',
            borderTopLeftRadius: '15px', borderTopRightRadius: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        },
        messageArea: {
            flexGrow: 1, padding: '15px', overflowY: 'auto', borderBottom: '1px solid #eee',
            display: 'flex', flexDirection: 'column', gap: '10px',
            // Oculta la scrollbar
            msOverflowStyle: 'none', 
            scrollbarWidth: 'none', 
        },
        form: { display: 'flex', padding: '10px', borderTop: '1px solid #eee' },
        input: {
            flexGrow: 1, padding: '10px', border: '1px solid #ccc', borderRadius: '8px', marginRight: '10px',
            outline: 'none', transition: 'border-color 0.2s'
        },
        sendButton: {
            backgroundColor: '#D1A6B4', color: 'white', border: 'none', borderRadius: '8px',
            padding: '10px 15px', cursor: 'pointer', transition: 'background-color 0.2s',
            minWidth: '40px',
        },
        message: (sender) => ({
            maxWidth: '85%', padding: '10px', borderRadius: '15px', fontSize: '0.9em',
            alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: sender === 'user' ? '#D1A6B4' : '#f0f0f0',
            color: sender === 'user' ? 'white' : '#333',
            // Asegura que solo se rompan las esquinas donde el mensaje no se une a uno del mismo emisor
            borderBottomRightRadius: sender === 'user' ? '0' : '15px',
            borderBottomLeftRadius: sender === 'user' ? '15px' : '0',
            whiteSpace: 'pre-wrap'
        })
    };

    return (
        <>
            {/* Botón flotante (Burbuja) */}
            <button 
                style={chatbotStyles.button} 
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? "Cerrar Chat" : `Abrir Asistente ${CHATBOT_NAME}`}
            >
                {isOpen ? '×' : '💬'}
            </button>

            {/* Contenedor del Chat */}
            {isOpen && (
                <div style={chatbotStyles.container}>
                    <div style={chatbotStyles.header}>
                        <span>{CHATBOT_NAME} - Asistente</span>
                        {productInfo && <span style={{fontSize: '0.8em', marginLeft: '10px', fontWeight: 'normal'}}>Viendo: {productInfo.name}</span>}
                    </div>

                    <div className="message-area" style={chatbotStyles.messageArea}>
                        {messages.map((msg, index) => (
                            <div 
                                key={index} 
                                style={chatbotStyles.message(msg.sender)}
                            >
                                {/* Renderiza con soporte Markdown */}
                                {parseMarkdown(msg.text)} 
                            </div>
                        ))}
                        {isTyping && (
                            <div style={chatbotStyles.message('bot')}>
                                <span style={{ fontStyle: 'italic', color: '#888' }}>Escribiendo...</span>
                            </div>
                        )}
                        {userLoading && <div style={chatbotStyles.message('bot')}><span style={{ fontStyle: 'italic', color: '#888' }}>Cargando datos de perfil...</span></div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} style={chatbotStyles.form}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ej: ¿Dónde está mi historial de ventas?"
                            disabled={isTyping || userLoading}
                            style={chatbotStyles.input}
                        />
                        <button 
                            type="submit" 
                            disabled={isTyping || userLoading || !input.trim()}
                            style={chatbotStyles.sendButton}
                        >
                            {isTyping ? '⏳' : '➔'}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default FloatingChatbot;
