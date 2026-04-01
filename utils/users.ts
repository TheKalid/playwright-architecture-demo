/**
 * Credenciales públicas de demostración — https://www.saucedemo.com/
 */
export const SAUCE_DEMO_PASSWORD = 'secret_sauce' as const;

export const SAUCE_DEMO_USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export type SauceDemoUserKey = keyof typeof SAUCE_DEMO_USERS;
export type SauceDemoUsername = (typeof SAUCE_DEMO_USERS)[SauceDemoUserKey];
