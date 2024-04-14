// index.js

// Импортируем библиотеку qr-image
const qr = require("qr-image");
const fs = require("fs");

// Get the text from the command line arguments (ignore the first two arguments, which are the path to Node.js and the path to your script)
const args = process.argv.slice(2);

const flags: string[] = ["-h", "--help", "-rw", "--rewrite", "-txt"];

// print help info
if (args.includes("-h") || args.includes("--help")) {
  console.log(`
Usage: generateQR <data> <name of output file>

Description:
CLI tool to generate QR code from text.

Arguments:
  data -   The data to encode in the QR code.
  name -   The name of output QR code file. (optional)

Examples:
  generateQR --help // will show this message
  generateQR "Hello, world!" // will generate qrcode.png
  generateQR "https://example.com" link // will generate link.png
  generateQR "https://example.com" link --rewrite // will rewrite output file link.png
  generateQR ./text_file.txt -txt // will generate qrcode.png from text_file.txt file
  generateQR ./text_file.txt -txt --rewrite // will rewrite output file qrcode.png from text_file.txt file
  generateQR ./text_file.txt name_of_output_file -txt // will generate name_of_output_file.png from text_file.txt file
`);
  process.exit(0); // Exit the program without error
}

// check data
if (args.length < 1) {
  console.error("Error\n  Text can't be empty");
  process.exit(1);
}

let data: string;
let nameOfOutputFile: string = "qrcode";
let canRewrite: boolean = false;

// check flag for path to txt file
if (args.includes("-txt")) {
  try {
    data = fs.readFileSync(args[0], "utf8");
  } catch (error) {
    console.error(`Error\n  File at this path [${args[0]}] not found`);
    console.log("  Check path to txt file and try again");
    process.exit(1);
  }
} else {
  data = args[0];
}

// check flag about rewrite output file
if (args.includes("-rw") || args.includes("--rewrite")) {
  canRewrite = true;
}

// check name
if (args.length > 1 && !flags.includes(args[1])) nameOfOutputFile = args[1];

const isTheSameFileExist: boolean = fs.existsSync(nameOfOutputFile + ".png");

if (isTheSameFileExist && !canRewrite) {
  console.error("Error\n  File with this name already exists");
  console.log("  To rewrite file use flag --rewrite or -rw");
  process.exit(1);
}

// Создаем QR-код из текста
const qr_png = qr.image(data, { type: "png" });

// Сохраняем QR-код в файл
qr_png.pipe(fs.createWriteStream(`${nameOfOutputFile}.png`));

console.log(
  `QR-code successfully ${
    isTheSameFileExist && canRewrite ? "rewritten" : "generated"
  }: ${nameOfOutputFile}.png`
);
