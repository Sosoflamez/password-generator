export type PasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
const AMBIGUOUS = "Il1O0o";

export function generatePassword(options: PasswordOptions): string {
  let charset = "";

  if (options.lowercase) charset += LOWERCASE;
  if (options.uppercase) charset += UPPERCASE;
  if (options.numbers) charset += NUMBERS;
  if (options.symbols) charset += SYMBOLS;

  if (options.excludeAmbiguous) {
    charset = charset
      .split("")
      .filter((c) => !AMBIGUOUS.includes(c))
      .join("");
  }

  if (!charset) return "";

  // Use crypto for secure randomness
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }

  // Guarantee at least one char from each selected group
  const required: string[] = [];
  if (options.lowercase) required.push(LOWERCASE.replace(/[Il1O0o]/g, "") || LOWERCASE);
  if (options.uppercase) required.push(UPPERCASE.replace(/[Il1O0o]/g, "") || UPPERCASE);
  if (options.numbers) required.push(NUMBERS.replace(/[Il1O0o]/g, "") || NUMBERS);
  if (options.symbols) required.push(SYMBOLS);

  const positions = new Uint32Array(required.length);
  crypto.getRandomValues(positions);

  let result = password.split("");
  required.forEach((group, i) => {
    const pos = positions[i] % options.length;
    const charArray = group.split("");
    const randIdx = new Uint32Array(1);
    crypto.getRandomValues(randIdx);
    result[pos] = charArray[randIdx[0] % charArray.length];
  });

  return result.join("");
}

export type StrengthLevel = {
  score: number; // 0-4
  label: string;
  color: string;
  width: string;
};

export function evaluateStrength(password: string, options: PasswordOptions): StrengthLevel {
  if (!password) return { score: 0, label: "—", color: "#333", width: "0%" };

  let score = 0;

  // Length scoring
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;

  // Variety scoring
  const typeCount = [
    options.lowercase,
    options.uppercase,
    options.numbers,
    options.symbols,
  ].filter(Boolean).length;

  if (typeCount >= 2) score++;
  if (typeCount >= 3) score++;
  if (typeCount >= 4) score++;

  // Cap at 4
  score = Math.min(4, Math.floor(score / 1.5));

  const levels = [
    { score: 0, label: "Très faible", color: "#ff3b3b", width: "10%" },
    { score: 1, label: "Faible", color: "#ff7b3b", width: "30%" },
    { score: 2, label: "Moyen", color: "#ffd93b", width: "55%" },
    { score: 3, label: "Fort", color: "#3bff9b", width: "80%" },
    { score: 4, label: "Très fort", color: "#00ff88", width: "100%" },
  ];

  return levels[score];
}

export function calculateEntropy(password: string, options: PasswordOptions): number {
  let charsetSize = 0;
  if (options.lowercase) charsetSize += 26;
  if (options.uppercase) charsetSize += 26;
  if (options.numbers) charsetSize += 10;
  if (options.symbols) charsetSize += 28;

  if (!charsetSize || !password.length) return 0;
  return Math.floor(password.length * Math.log2(charsetSize));
}
