document.addEventListener('DOMContentLoaded', () => {
    const styleSelect = document.getElementById('styleSelect');
    const customStyleInput = document.getElementById('customStyle');
    const convertBtn = document.getElementById('convertBtn');
    const btnText = document.querySelector('.btn-text');
    const loader = document.getElementById('loader');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');

    // Show/hide custom style input field
    styleSelect.addEventListener('change', () => {
        if (styleSelect.value === 'custom') {
            customStyleInput.style.display = 'block';
            customStyleInput.focus();
        } else {
            customStyleInput.style.display = 'none';
        }
    });

    // Handle the conversion
    convertBtn.addEventListener('click', async () => {
        const textToConvert = inputText.value.trim();
        let targetStyle = styleSelect.value;

        if (targetStyle === 'custom') {
            targetStyle = customStyleInput.value.trim();
        }

        if (!textToConvert) {
            alert('Please enter some text to convert.');
            return;
        }

        if (!targetStyle) {
            alert('Please select or enter a target style.');
            return;
        }

        // Show loading state
        setLoading(true);

        try {
            const systemPrompt = `You are an expert linguist and translator named Lingua-Morph. Your task is to translate the user's text into the specified language, dialect, or slang. Be creative, accurate, and embody the requested style in your response. Do not add any extra commentary, just provide the translated text.`;
            
            let userPrompt;
            if (targetStyle === 'Speak in Tongues') {
                userPrompt = `Please translate the following text into "Speaking in Tongues". This is a mystical, ancient language where each word sounds like it could be from multiple different real-world languages simultaneously, yet it is its own unique, made-up language. The goal is that a single spoken word could be interpreted differently by people of different linguistic backgrounds. For example, a word might sound like it has Latin roots, but also sound vaguely like a Slavic or Asian word at the same time. The resulting text should sound profound and enigmatic. Do not explain the translation, just provide the result.\n\nText to translate: "${textToConvert}"`;
            } else {
                userPrompt = `Please translate the following text to "${targetStyle}":\n\n"${textToConvert}"`;
            }

            const completion = await websim.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
            });

            const result = completion.content;
            outputText.value = result;

        } catch (error) {
            console.error('Error during AI conversion:', error);
            outputText.value = 'Sorry, an error occurred. Please try again.';
        } finally {
            // Hide loading state
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            convertBtn.disabled = true;
            btnText.style.display = 'none';
            loader.style.display = 'block';
        } else {
            convertBtn.disabled = false;
            btnText.style.display = 'inline';
            loader.style.display = 'none';
        }
    }
});