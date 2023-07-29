const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();
const fs = require('fs');
const funcs = require('./functions');
const { logger } = require('./logger');

const commander = require('commander');

commander
    .version('1.0.0', '-v, --version')
    .usage('[OPTIONS]...')
    .option('-m, --model <value>', 'GPT model for API requests. This script requires the model to be able to use functions, refer to the API for a list of valid models. Default is gpt-3.5-turbo-0613', "gpt-3.5-turbo-0613")
    .option('-t, --temp <value>' , 'Model temperature, refer to API docs for details on what this controls, default is 0.7', 0.7)
    .option('-l <value>', "Log level, default is 'info'. Valid values are 'info', 'debug', 'error', default is 'info'", "info")
    .parse(process.argv);

const options = commander.opts();

// GPT parameters
const gptModel = options.model;
const gptTemp = options.temp;

logger.level = options.log;

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function do_completion(messages, includeFunctions=true) {
    try {
        const call = {
            model: gptModel,
            messages: messages,
            temperature: gptTemp
        }
        if (includeFunctions) {
            call.functions = funcs.functions;
            call.function_call = "auto";
        }
        logger.debug('openai.createChatCompletion ::');
        const completion = await openai.createChatCompletion(call);
        logger.debug('%O', completion);

        const message = completion.data.choices[0].message;
        const completion_text = message.content;
        messages.push(message);

        if ("function_call" in message) {
            var func = funcs.available_functions[message.function_call.name];
            var function_args = JSON.parse(message.function_call.arguments)
      
            logger.debug(`invoking function ${message.function_call.name} with params ::`);
            logger.debug('%O', function_args);
            function_response = await func(function_args);
            if (function_response) {
                var func_response = { "role": "function", "content": function_response, "name": message.function_call.name }
                messages.push(func_response);
                logger.debug('function response :: ');
                logger.debug('%O', func_response);
                await do_completion(messages, false);
            } else {
                // remove the function call because we never made it
                messages.pop();
            }
        } else {
            console.log(completion_text);
        }
    } catch (error) {
        if (error.response) {
            logger.error(error.response.status);
            logger.error(error.response.data);
        } else {
            logger.error(error.message);
        }
    }
}

(async () => {

    const system_prompt = fs.readFileSync('system-prompt.txt', 'utf8');

    const messages = [];
    messages.push({ role: "system", content:  system_prompt });

    while (true) {
        const user_input = readlineSync.question(">>> ");
    
        if (user_input.toUpperCase() === 'QUIT' ||
            user_input.toUpperCase() === 'Q') {
            
            return;
        }
        
        if (user_input.toUpperCase() === "MESSAGES") {
            console.log(messages);
            continue;
        }

        messages.push({ role: "user", content: user_input });

        await do_completion(messages);
    }
})();