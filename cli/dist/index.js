"use strict";
class DimensionError extends Error {
    constructor(message) {
        super(message);
        this.name = "DimensionError";
    }
}
function parseDimensions(input) {
    const [width, height] = input.split(",").map(Number);
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
        throw new Error("Invalid dimensions. Please provide positive integers for width and height.");
    }
    return { width, height };
}
function printHelp() {
    console.log("Usage: ts-node app.ts -dim width,height");
    console.log("Example: ts-node app.ts -dim 10,20");
}
function main() {
    const args = process.argv.slice(2);
    const dimIndex = args.indexOf("-dim");
    if (dimIndex === -1 || dimIndex === args.length - 1) {
        console.log("Error: -dim parameter is required and must have a value.");
        printHelp();
        process.exit(1);
    }
    try {
        const dimensions = parseDimensions(args[dimIndex + 1]);
        console.log("Dimensions:", dimensions);
        console.log("Area:", dimensions.width * dimensions.height);
    }
    catch (error) {
        if (error instanceof DimensionError) {
            console.error(error.message);
        }
        else if (error instanceof Error) {
            console.error("An unexpected error occurred:", error.message);
        }
        else {
            console.error("An unknown error occurred");
        }
        printHelp();
        process.exit(1);
    }
}
main();
