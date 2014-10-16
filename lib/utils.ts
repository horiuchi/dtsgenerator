export function toTSType(type: string, debugSource?: any): string {
	switch (type) {
		case "any":
			return "any";
		case "string":
			return "string";
		case "integer":
		case "number":
			return "number";
		case "boolean":
			return "boolean";
		case "object":
		case "array":
			return null;
		default :
			if (debugSource) {
				console.error(debugSource);
			}
			throw new Error("unknown type: " + type);
	}
}

export function capitalizeName(s: string): string {
  s = s.trim();
  return s.replace(/(?:^|[^A-Za-z0-9])([A-Za-z0-9])/g, function(_, m) {
    return m.toUpperCase();
  });
}

export function searchPath(obj: any, paths: string[]): any {
  for (var i = 0, len = paths.length; i < len; ++i) {
    var p = paths[i];
    if (!obj[p]) {
      return null;
    }
    obj = obj[p];
  }
  return obj;
}

