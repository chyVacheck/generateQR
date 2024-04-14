"use strict";
// index.js
// Импортируем библиотеку qr-image
var qr = require("qr-image");
var fs = require("fs");
// Get the text from the command line arguments (ignore the first two arguments, which are the path to Node.js and the path to your script)
var args = process.argv.slice(2);
var flags = ["-h", "--help", "-rw", "--rewrite", "-txt"];
// print help info
if (args.includes("-h") || args.includes("--help")) {
    console.log("\nUsage: generateQR <data> <name of output file>\n\nDescription:\nCLI tool to generate QR code from text.\n\nArguments:\n  data -   The data to encode in the QR code.\n  name -   The name of output QR code file. (optional)\n\nExamples:\n  generateQR --help // will show this message\n  generateQR \"Hello, world!\" // will generate qrcode.png\n  generateQR \"https://example.com\" link // will generate link.png\n  generateQR \"https://example.com\" link --rewrite // will rewrite output file link.png\n  generateQR ./text_file.txt -txt // will generate qrcode.png from text_file.txt file\n  generateQR ./text_file.txt -txt --rewrite // will rewrite output file qrcode.png from text_file.txt file\n  generateQR ./text_file.txt name_of_output_file -txt // will generate name_of_output_file.png from text_file.txt file\n");
    process.exit(0); // Exit the program without error
}
// check data
if (args.length < 1) {
    console.error("Error\n  Text can't be empty");
    process.exit(1);
}
var data;
var nameOfOutputFile = "qrcode";
var canRewrite = false;
// check flag for path to txt file
if (args.includes("-txt")) {
    try {
        data = fs.readFileSync(args[0], "utf8");
    }
    catch (error) {
        console.error("Error\n  File at this path [".concat(args[0], "] not found"));
        console.log("  Check path to txt file and try again");
        process.exit(1);
    }
}
else {
    data = args[0];
}
// check flag about rewrite output file
if (args.includes("-rw") || args.includes("--rewrite")) {
    canRewrite = true;
}
// check name
if (args.length > 1 && !flags.includes(args[1]))
    nameOfOutputFile = args[1];
var isTheSameFileExist = fs.existsSync(nameOfOutputFile + ".png");
if (isTheSameFileExist && !canRewrite) {
    console.error("Error\n  File with this name already exists");
    console.log("  To rewrite file use flag --rewrite or -rw");
    process.exit(1);
}
// Создаем QR-код из текста
var qr_png = qr.image(data, { type: "png" });
// Сохраняем QR-код в файл
qr_png.pipe(fs.createWriteStream("".concat(nameOfOutputFile, ".png")));
console.log("QR-code successfully ".concat(isTheSameFileExist && canRewrite ? "rewritten" : "generated", ": ").concat(nameOfOutputFile, ".png"));
