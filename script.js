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

// Groq Cloud API Configuration
const API_KEY = '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';
const url = 'https://api.groq.com/openai/v1/chat/completions';

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

    // Show loading / typing state
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'message bot-message';
    botMsgDiv.textContent = 'Thinking...';
    chatMessages.appendChild(botMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // System prompt establishing ZYRO's legal context
    const systemPrompt = "You are the AI Legal Advisor for ZYRO ('Beyond the One'), a sportswear enterprise in Bangladesh. Answer user questions professionally and concisely, citing the five core statutes accurately: Partnership Act 1932 (liability/formation), Companies Act 1994 (corporate structure/limited liability), Contract Act 1872 (Section 73 breach of contract and damages), Sale of Goods Act 1930 (Sections 13 & 43 regarding defective goods/rejection), and Negotiable Instruments Act 1881 (Section 138 regarding bounced cheques and mandatory 30-day demand notice).";

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'openai/gpt-oss-20b',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: messageText }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0].message) {
            botMsgDiv.textContent = data.choices[0].message.content;
        } else {
            botMsgDiv.textContent = "Sorry, I couldn't process your legal query right now.";
        }
    } catch (error) {
        console.error('Groq API Error:', error);
        botMsgDiv.textContent = "Connection error. Please check your network.";
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}
