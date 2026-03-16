export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: any })[]) {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      // Basic recursive support if needed, but simple arrays for now
      classes.push(...input.filter(Boolean));
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}
