const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
};

export function log(step: string, msg: string): void {
  console.log(`${COLORS.cyan}[${step}]${COLORS.reset} ${msg}`);
}

export function warn(step: string, msg: string): void {
  console.warn(`${COLORS.yellow}[${step}] WARN:${COLORS.reset} ${msg}`);
}

export function error(step: string, msg: string): void {
  console.error(`${COLORS.red}[${step}] ERROR:${COLORS.reset} ${msg}`);
}

export function success(step: string, msg: string): void {
  console.log(`${COLORS.green}[${step}] OK:${COLORS.reset} ${msg}`);
}
