/**
 * Mock ANPR / OCR service.
 *
 * In production this calls the Plate Recognizer cloud API (see Part 2 of the
 * project execution plan). For local development and demos, this stub
 * simulates a plate read with a randomized confidence score so the full
 * entry/exit workflow (including the below-threshold manual-review path)
 * can be exercised without real camera hardware.
 *
 * Swap the body of `recognizePlate` for a real HTTPS call to Plate Recognizer
 * (or any ANPR provider) when hardware is available — the rest of the
 * application only depends on the { plate_number, confidence } shape below.
 */

const THRESHOLD = parseFloat(process.env.ANPR_CONFIDENCE_THRESHOLD || "0.85");

function randomPlate() {
  const letters = () => Array.from({ length: 2 }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join("");
  const digits = (n) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
  return `${letters()}${digits(2)}${letters()}${digits(4)}`; // e.g. MH12AB1234
}

async function recognizePlate({ plate_number } = {}) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 150));

  const plate = plate_number || randomPlate();
  const confidence = Math.round((0.7 + Math.random() * 0.3) * 100) / 100; // 0.70 - 1.00

  return {
    plate_number: plate,
    confidence,
    requires_manual_review: confidence < THRESHOLD,
    image_url: `https://mock-s3-bucket.local/anpr/${Date.now()}.jpg`,
  };
}

module.exports = { recognizePlate, THRESHOLD };
