/**
 * Input validation utilities
 */

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Ang number (1-1430 for SGGS)
 */
export function isValidAng(ang: number): boolean {
  return ang >= 1 && ang <= 1430;
}

/**
 * Validate Gurmukhi text (basic check)
 */
export function isValidGurmukhi(text: string): boolean {
  // Check if text contains Gurmukhi characters (U+0A00 to U+0A7F)
  const gurmukhiRegex = /[\u0A00-\u0A7F]/;
  return gurmukhiRegex.test(text);
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

