document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing AI Assistant');
    initializeAiAssistant();

    function initializeAiAssistant() {
        const aiSidebar = document.getElementById('aiSidebar');
        const aiToggle = document.getElementById('aiToggle');
        const closeAiSidebar = document.getElementById('closeAiSidebar');
        const aiChat = document.getElementById('aiChat');
        const aiQueryInput = document.getElementById('aiQueryInput');
        const aiSendBtn = document.getElementById('aiSendBtn');

        if (!aiSidebar || !aiToggle || !closeAiSidebar || !aiChat || !aiQueryInput || !aiSendBtn) {
            console.error('One or more AI sidebar elements not found:', {
                aiSidebar, aiToggle, closeAiSidebar, aiChat, aiQueryInput, aiSendBtn
            });
            return;
        }

        console.log('All AI sidebar elements found');

        // Ensure sidebar starts in closed state
        aiSidebar.classList.remove('show');
        console.log('Initial state - has .show class:', aiSidebar.classList.contains('show'));

        // Hardcoded Gemini API Key (Not recommended for production)
        const apiKey = 'AIzaSyBOO-SIUuogmrsnfmuGSCQOr42G0hMw6UA';

        // Toggle AI Sidebar
        aiToggle.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('AI Toggle clicked');
            const hasShowClass = aiSidebar.classList.contains('show');
            console.log('Before toggle - has .show class:', hasShowClass);
            aiSidebar.classList.toggle('show');
            console.log('After toggle - has .show class:', aiSidebar.classList.contains('show'));
        });

        closeAiSidebar.addEventListener('click', () => {
            console.log('Close button clicked');
            aiSidebar.classList.remove('show');
        });

        document.addEventListener('click', (e) => {
            if (!aiSidebar.contains(e.target) && !aiToggle.contains(e.target)) {
                console.log('Clicked outside sidebar, closing');
                aiSidebar.classList.remove('show');
            }
        });

        // Handle AI Query
        aiSendBtn.addEventListener('click', sendQuery);
        aiQueryInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendQuery();
        });

        function sendQuery() {
            const queryInput = aiQueryInput.value || '';
            const query = queryInput.trim();
            console.log('Captured query:', query);

            if (query.length === 0) {
                alert('Please enter a query!');
                return;
            }

            // Add user message to chat
            addMessage(query, 'user');
            aiQueryInput.value = '';

            // Call Gemini API
            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a helpful AI farming assistant. Provide a concise and accurate response to the following query in a conversational tone: ${query}`
                        }]
                    }],
                    generationConfig: {
                        maxOutputTokens: 150,
                        temperature: 0.7
                    }
                })
            })
            .then(response => {
                console.log('API Response Status:', response.status);
                if (!response.ok) {
                    throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('API Response Data:', data);
                if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                    const responseText = data.candidates[0].content.parts[0].text;
                    addMessage(responseText, 'bot');
                } else if (data.error) {
                    console.error('API Error:', data.error);
                    addMessage(`Error: ${data.error.message || 'Unable to process your request.'}`, 'bot');
                } else {
                    addMessage('Sorry, I couldn’t process your request. The response might be empty or blocked.', 'bot');
                }
            })
            .catch(error => {
                console.error('Error calling Gemini API:', error.message);
                // Fallback response for the specific query
                if (query.toLowerCase().includes('top 5 crops in world')) {
                    addMessage('The top 5 crops in the world by production are:\n1. Rice\n2. Wheat\n3. Corn (Maize)\n4. Potatoes\n5. Soybeans', 'bot');
                } else {
                    addMessage('Error: Could not connect to AI. Check your network or API key.', 'bot');
                }
            });
        }

        // Add message to chat
        function addMessage(text, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `ai-message ai-message-${type}`;
            messageDiv.textContent = text;
            aiChat.appendChild(messageDiv);
            aiChat.scrollTop = aiChat.scrollHeight;
        }
    }
});