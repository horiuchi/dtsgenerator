export function toTSType(type: string, debugSource?: any): string {
  switch (type) {
    case 'any':
    case 'null':
      return 'any';
    case 'string':
      return 'string';
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'object':
    case 'array':
      return null;
    default :
      if (debugSource) {
        console.error('  debugSource=' + debugSource);
      }
      throw new Error('unknown type: ' + type);
  }
}

export function capitalizeName(s: string): string {
  if (!s) return s;
  s = s.trim();
  return s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
    return m.toUpperCase();
  });
}

export function mergeSchema(a: any, b: any): any {
  Object.keys(b).forEach((key) => {
    if (a[key]) {
      console.error('  lhs=' + a);
      console.error('  rhs=' + b);
      throw new Error('invalid schema: duplicate property in allOf.');
    }
    a[key] = b[key];
  });
  return a;
}

