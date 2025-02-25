module.exports = {
	Split(cad, separator) {
		return (cad + '').split(separator);
	},
	AbsoluteUrl(url) {
		if (url) {
			var protocol = window.location.protocol;
			if (url.startsWith(protocol)) {
				return url;
			}
			var slashes = protocol + "//";
			var host = slashes + window.location.hostname + ( window.location.port ? ':' + window.location.port : '');
			if (!url.startsWith('/')) {
				url = '/' + url;
			}
			return host + url.trim();
		} else {
			return null;
		}
	},
	FormatFloat(n, places) {
		//TODO: CultureInfo
		return ('' + parseFloat(n.toFixed(places))).replace(".", ",");
	},
	AppendParam(url, param, value) {
		var parts = url.split('#');
		var n = parts[0].indexOf('?');
		var separator = (n >= 0 ? '&' : '?');
		var ret = parts[0] + separator + param + "=" + value;
		if (parts.length > 1) {
			ret += "#" + parts[1];
		}
		return ret;
	},
	LowerFirstIfOnlyUpper(cad) {
		if (cad.length === 1 || cad.substring(1) === cad.substring(1).toLowerCase()) {
			return cad.toLowerCase();
		}
		return cad;
	},
	isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	},
	isNumericFlex(n) {
		var t = '' + n;
		t = t.replaceAll(",", ".");
		if (this.countMatches(t, ".") > 1) {
			return false;
		}
		return !isNaN(parseFloat(t)) && isFinite(t);
	},
	countMatches(cad, item) {
		var ret = 0;
		var i = 0;
		while ((i = cad.indexOf(item, i) + 1) !== 0) {
			ret++;
		}
		return ret;
	},
	IsIntegerGreaterThan(str, than) {
		let n = Number(str);
		return Number.isInteger(n) && n > than;
	},
	IsNumberGreaterThan(str, than) {
		let n = Number(str);
		return n > than;
	},
	IsIntegerGreaterThan0(str) {
		return this.IsIntegerGreaterThan(str, 0);
	},
	IsNumberGreaterThan0(str) {
		return this.IsNumberGreaterThan(str, 0);
	},
	AddDot(str) {
		if (str !== null && this.EndsWith(str, ".") === false) {
			return str + '.';
		} else {
			return str;
		}
	},
	applySymbols(cad) {
		return cad.replace('km2', 'km²');
	},
	Capitalize(cad) {
		if (cad.length === 0) {
			return cad;
		} else {
			return cad.charAt(0).toUpperCase() + cad.slice(1);
		}
	},
	EscapeHtml(unsafe) {
		return ('' + unsafe)
			.replaceAll(/&/g, "&amp;")
			.replaceAll(/</g, "&lt;")
			.replaceAll(/>/g, "&gt;")
			.replaceAll(/"/g, "&quot;")
			.replaceAll(/'/g, "&#039;");
	},
	EscapeRegExp(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
	},
	Replace(cad, text, text2) {
		if (cad === null) {
			return null;
		}
		return (cad.toString()).replace(new RegExp(this.EscapeRegExp(text), "g"), text2);
	},
	StartsWith(cad, part, pos) {
		return cad.startsWith(part, pos);
		// return cad.lastIndexOf(part, 0) === 0;
	},
	EndsWith(cad, part, len) {
		return cad.endsWith(part, len);
		// return cad.indexOf(part, cad.length - part.length) !== -1;
	},
	Contains(cad, part, pos) {
		return cad.includes(part, pos);
		// return cad.indexOf(part) !== -1;
	},
	GetHashCode(str) {
		var hash = 0;
		for (var i = 0; i < str.length; i++) {
			var character = str.charCodeAt(i);
			hash = ((hash << 5) - hash) + character;
			hash = hash & hash; // Convert to 32bit integer
		}
		return hash;
	},
	// Versión modificada quitando los caracteres que sería raro tenga un mail...
	// no valida mail que tengan: !#$%&'*/=?^`{|}~
	IsEmail(email) {
		// see: http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
		const re = /^[a-zA-Z0-9+_\-]+(?:\.[a-zA-Z0-9+_\-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
		// Versión original de la función de validación
		// const re = /^[a-zA-Z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-zA-Z0-9!#$%&'\*+\/=?\^_`{|}~\-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?$/;
		return re.test(email);
	},
	QuoteAttr(s, preserveCR) {
		preserveCR = preserveCR ? '&#13;' : '\n';
		return ('' + s) // Forces the conversion to string.
			.replace(/&/g, '&amp;') // This MUST be the 1st replacement.
			.replace(/'/g, '&apos;') // The 4 other predefined entities, required.
			.replace(/"/g, '&quot;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			// otros replaces...
			.replace(/\r\n/g, preserveCR) // Must be before the next replacement.
			.replace(/[\r\n]/g, preserveCR);
	},
};



String.prototype.removeHtmlRange = function(start, end) {
	return this.slice(start, end).removeHtml();
};

String.prototype.removeHtml = function() {
	return this.replace(/<\/?[^>]+(>|$)/g, "");
};

String.prototype.insert = function(index, str) {
	if (index === 0) {
		return str + this;
	}
	return this.slice(0, index) + str + this.slice(index);
};

String.prototype.replaceRange = function(start, end, str) {
	return this.slice(0, start) + str + this.slice(end);
};

