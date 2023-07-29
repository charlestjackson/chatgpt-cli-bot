# chatgpt-cli-bot
A simple cli test harness / bot interface for testing out ChatGPT's API


## Usage
Before this can be used, the user's OpenAI API key must be provided in a variable named OPENAI\_API\_KEY in a .env file in the root directory. 

The simplest way to run the both is with the [runbot.sh](runbot.sh) script. This will start a simple prompt and response interface with ChatGPT. 
Any messages entered will be submitted to the ChatGPT API and the reponse will be printed. 

A few special commands have been included in this version of the bot:

- `messages` will print out the full current message history with ChatGPT for debugging purposes
- `quit` or `q` will exit the program


## Functions
A goal of this project is to enable experimentation with ChatGPT's [function calling](https://platform.openai.com/docs/guides/gpt/function-calling) capabilities. 
To that end, a couple of mock simple functions have been included in the project. ChatGPT will invoke these functions as it determines is appropriate based on the user's input. 

## System Prompt
The initial system prompt is an important part of getting the most out of the ChatGPT API. The default system prompt is very basic and can be changed by modifying [system-prompt.txt](system-prompt.txt). 