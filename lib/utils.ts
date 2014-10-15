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
