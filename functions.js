const readlineSync = require("readline-sync");
const { logger } = require('./logger');

function confirmPrompt(prompt, params) {
    console.log(prompt);
    if (params) {
        console.log(params);
    }
    
    const user_input = readlineSync.question("Proceed? (y/n) ");
    if (user_input.toUpperCase() === 'Y') {
        return true;
    }
    return false;
}

const functions = [
    {
        "name": "get_car_specs",
        "description": "Get detailed specs about a car by make, model and year",
        "parameters": {
            "type": "object",
            "properties": {
                "make": {
                    "type": "string",
                    "description": "Make of the vehicle"
                },
                "model": {
                    "type": "string",
                    "description": "Model of the vehicle"
                },
                "year": {
                    "type": "string",
                    "description": "Model year of the vehicle"
                }
            }
        }
    },
    { 
        "name": "create_car_specs",
        "description": "Save new specs for a car",
        "parameters": {
            "type": "object",
            "properties": {
                "make": {
                    "type": "string",
                    "description": "Make of the vehicle"
                },
                "model": {
                    "type": "string",
                    "description": "Model of the vehicle"
                },
                "year": {
                    "type": "string",
                    "description": "Model year of the vehicle"
                },
                "specs": {
                    "type": "object",
                    "description": "Specs to save for the vehicle",
                    "properties": {
                        "height": {
                            "type": "number",
                            "description": "Height of the vehicle in inches"
                        },
                        "length": {
                            "type": "number",
                            "description": "Length of the vehicle in inches"
                        },
                        "width": {
                            "type": "number",
                            "description": "Width of the vehicle in inches"
                        },
                        "weight": {
                            "type": "number",
                            "description": "Weight of the vehicle in pounds"
                        }
                    }
                }
            }
        }
    }
];

function getspecs(params) {
    return JSON.stringify({
        "height": 54,
        "length": 99,
        "width": 48,
        "weight": 1024
    });
}

function createspecs(params) {
    if (!confirmPrompt(`Creating spec for ${params.year} ${params.make} ${params.model}`)) {
        logger.debug("cancelling call");
        return false;
    }
    
    return `created specs for ${params.year} ${params.make} ${params.model}`;
}

const available_functions = {
    "create_car_specs": createspecs,
    "get_car_specs": getspecs
};

exports.functions = functions;
exports.available_functions = available_functions;