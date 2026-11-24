import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Dog Ate My Homework: Funniest Excuse
// One line, in the dog's own voice, after being caught eating the homework.
// The dog takes the teacher's instruction literally and blames the teacher:
// it believes it did nothing wrong — it was only following instructions.
const ENTRY: string =
  "The teacher said to digest the material, so I did. Blame her, not me.";

// Gate guard: the sealed scorer requires UTF-8 text of 1-200 characters,
// not only white space, exactly one line, and no trailing newline.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`Entry must be 1-200 characters, got ${ENTRY.length}.`);
}
if (ENTRY.trim() !== ENTRY) {
  throw new Error("Entry must not have leading or trailing whitespace.");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("Entry must be exactly one line.");
}
if (ENTRY.trim().length === 0) {
  throw new Error("Entry must not be only white space.");
}

const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outputPath: string = join(outputDir, "entry.txt");

// Write exactly the entry line: no trailing newline is added.
writeFileSync(outputPath, ENTRY, "utf8");

// Read the file back and verify it matches the entry exactly, at the
// byte level as well as the text level, so a stray newline or a different
// encoding cannot slip through unnoticed.
const written: string = readFileSync(outputPath, "utf8");
if (written !== ENTRY) {
  throw new Error("Verification failed: entry.txt does not match the entry.");
}
const writtenBytes: Buffer = readFileSync(outputPath);
if (!writtenBytes.equals(Buffer.from(ENTRY, "utf8"))) {
  throw new Error("Verification failed: entry.txt bytes differ from the entry.");
}
if (written.endsWith("\n") || written.length > 200 || written.length < 1) {
  throw new Error("Verification failed: entry.txt fails the gate on re-read.");
}
console.log(`Wrote ${written.length} characters to ${outputPath}`);
