// Toggle chat visibility
function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatContainer.classList.toggle('chat-hidden');
}

// Handle Enter keypress in chat input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Send message to Google Gemini API
async function sendMessage() {
    const inputField = document.getElementById('user-input');
    const messageText = inputField.value.trim();
    if (!messageText) return;

    const chatMessages = document.getElementById('chat-messages');

    // Append User Message
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'message user-message';
    userMsgDiv.textContent = messageText;
    chatMessages.appendChild(userMsgDiv);

    inputField.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Google Gemini API Configuration (Free Tier via Google AI Studio)
    const API_KEY = 'AQ.Ab8RN6IFHHCXGm4ZWfo4FBbc4DXm1gVkU8fOBbzz_fVQf7abRg'; // <-- Paste your AI Studio API key here
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // System prompt giving persona and context of ZYRO's case study
    const systemPrompt = `You are the AI Legal Advisor Bot for ZYRO ("Beyond the One"), a Bangladeshi sportswear enterprise founded by Arif, Bushra, and Sami, which later incorporated as ZYRO Ltd. 
    Context details you know:
    - Act 1: Started as a partnership (Partnership Act 1932, s.25 liability), then incorporated as ZYRO Ltd. under the Companies Act 1994. Bought fabric by sample/description under Sale of Goods Act 1930 s.15.
    - Act 2: Sami double-booked an exclusive kit deal with a rival club while Bushra was abroad. ZYRO missed delivery deadlines, leading to termination and liquidated damages under Contract Act 1872 s.73. TexSource delivered defective fabric (wrong weight, bleeding colors), giving ZYRO the right to reject goods under Sale of Goods Act ss.13 & 43. ZYRO stopped payment on the TexSource cheque, causing it to bounce (Negotiable Instruments Act 1881 s.138). Counterfeit fakes flooded the market. Arbitration Act 2001 is used for dispute resolution.
    Answer user questions professionally, citing these statutes accurately and concisely.`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nUser Question: ${messageText}`
                    }]
                }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your legal query right now.";

        // Append Bot Message
        const botMsgDiv = document.createElement('div');
        botMsgDiv.className = 'message bot-message';
        botMsgDiv.textContent = botReply;
        chatMessages.appendChild(botMsgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error('Error:', error);
        const errorMsgDiv = document.createElement('div');
        errorMsgDiv.className = 'message bot-message';
        errorMsgDiv.textContent = "Error connecting to the Gemini AI legal service.";
        chatMessages.appendChild(errorMsgDiv);
    }
}
