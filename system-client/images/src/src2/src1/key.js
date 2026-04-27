import readline from 'readline';
import 'dotenv/config';

const API_KEY = "AIzaSyDUfW5OxKGdFfSwJ4PtlktKfq1HDBnGCF0";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    bold: "\x1b[1m",
    magenta: "\x1b[35m"
};

console.clear();
// console.log(`${colors.magenta}${colors.bold}===========================================${colors.reset}`);
// console.log(`${colors.magenta}${colors.bold} 🌐 ONLINE AI DEBUGGER 🌐 ${colors.reset}`);
// console.log(`${colors.magenta}${colors.bold}===========================================${colors.reset}`);

if (!API_KEY) {
    console.log(`${colors.red}🚨 ERROR: GEMINI_API_KEY is missing from your .env file!${colors.reset}`);
    process.exit(1);
}

// console.log(`${colors.cyan}System Online. Connected to Gemini AI.${colors.reset}`);
// console.log(`Paste your terminal error below and press Enter.`);
// console.log(`(Type 'exit' to quit)\n`);

async function analyzeError(userInput) {
    if (userInput.toLowerCase() === 'exit') {
        console.log(`${colors.green}Happy coding! Closing debugger...${colors.reset}`);
        rl.close();
        return;
    }

    if (!userInput.trim()) {
        askForError();
        return;
    }

    console.log(`\n${colors.yellow}Analyzing your error... Please wait...${colors.reset}\n`);

    // The strict instructions we give the AI so it doesn't ramble
    const systemPrompt = `You are an expert Senior Full-Stack Web Developer. 
    The user is building an e-commerce app named 'Kape-Ling Ka' using Node.js, Express, MongoDB, and plain HTML/JS.
    They just encountered this error. 
    Provide a very concise diagnosis of why it happened, and write the exact steps or code needed to fix it. Keep it brief and formatted for a terminal.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `${systemPrompt}\n\nERROR:\n${userInput}` }]
                }]
            })
        });

        const data = await response.json();

        if (data.error) {
            console.log(`${colors.red}API Error: ${data.error.message}${colors.reset}\n`);
        } else {
            // Extract the AI's text response and print it beautifully
            const aiText = data.candidates[0].content.parts[0].text;
            console.log(`${colors.green}${colors.bold}🚨 DIAGNOSIS & SOLUTION:${colors.reset}`);
            console.log(`${colors.cyan}${aiText}${colors.reset}\n`);
        }

    } catch (error) {
        console.log(`${colors.red}Failed to connect. Check your internet connection.${colors.reset}\n`);
    }

    // Ask for the next error
    askForError();
}

function askForError() {
    rl.question(`${colors.magenta}Paste Error > ${colors.reset}`, analyzeError);
}

// Start the loop
askForError();