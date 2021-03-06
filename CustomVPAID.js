/**
 * Function bind polyfill for older phantom js
 */

if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
        }

        var aArgs   = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP    = function() {},
            fBound  = function() {
                return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        if (this.prototype) {
            // native functions don't have a prototype
            fNOP.prototype = this.prototype;
        }
        fBound.prototype = new fNOP();

        return fBound;
    };
}

/**
 * Google Closure
 */
var COMPILED = !0,
    goog = goog || {};
goog.global = this;
goog.exportPath_ = function(a, b, c) {
    a = a.split(".");
    c = c || goog.global;
    a[0] in c || !c.execScript || c.execScript("var " + a[0]);
    for (var d; a.length && (d = a.shift());) a.length || void 0 === b ? c = c[d] ? c[d] : c[d] = {} : c[d] = b
};
goog.define = function(a, b) {
    var c = b;
    COMPILED || goog.global.CLOSURE_DEFINES && Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES, a) && (c = goog.global.CLOSURE_DEFINES[a]);
    goog.exportPath_(a, c)
};
goog.DEBUG = !0;
goog.LOCALE = "en";
goog.TRUSTED_SITE = !0;
goog.provide = function(a) {
    if (!COMPILED) {
        if (goog.isProvided_(a)) throw Error('Namespace "' + a + '" already declared.');
        delete goog.implicitNamespaces_[a];
        for (var b = a;
            (b = b.substring(0, b.lastIndexOf("."))) && !goog.getObjectByName(b);) goog.implicitNamespaces_[b] = !0
    }
    goog.exportPath_(a)
};
goog.setTestOnly = function(a) {
    if (COMPILED && !goog.DEBUG) throw a = a || "", Error("Importing test-only code into non-debug environment" + a ? ": " + a : ".");
};
COMPILED || (goog.isProvided_ = function(a) {
    return !goog.implicitNamespaces_[a] && !!goog.getObjectByName(a)
}, goog.implicitNamespaces_ = {});
goog.getObjectByName = function(a, b) {
    for (var c = a.split("."), d = b || goog.global, e; e = c.shift();)
        if (goog.isDefAndNotNull(d[e])) d = d[e];
        else return null;
    return d
};
goog.globalize = function(a, b) {
    var c = b || goog.global,
        d;
    for (d in a) c[d] = a[d]
};
goog.addDependency = function(a, b, c) {
    if (goog.DEPENDENCIES_ENABLED) {
        var d;
        a = a.replace(/\\/g, "/");
        for (var e = goog.dependencies_, f = 0; d = b[f]; f++) e.nameToPath[d] = a, a in e.pathToNames || (e.pathToNames[a] = {}), e.pathToNames[a][d] = !0;
        for (d = 0; b = c[d]; d++) a in e.requires || (e.requires[a] = {}), e.requires[a][b] = !0
    }
};
goog.ENABLE_DEBUG_LOADER = !0;
goog.require = function(a) {
    if (!COMPILED && !goog.isProvided_(a)) {
        if (goog.ENABLE_DEBUG_LOADER) {
            var b = goog.getPathFromDeps_(a);
            if (b) {
                goog.included_[b] = !0;
                goog.writeScripts_();
                return
            }
        }
        a = "goog.require could not find: " + a;
        goog.global.console && goog.global.console.error(a);
        throw Error(a);
    }
};
goog.basePath = "";
goog.nullFunction = function() {};
goog.identityFunction = function(a, b) {
    return a
};
goog.abstractMethod = function() {
    throw Error("unimplemented abstract method");
};
goog.addSingletonGetter = function(a) {
    a.getInstance = function() {
        if (a.instance_) return a.instance_;
        goog.DEBUG && (goog.instantiatedSingletons_[goog.instantiatedSingletons_.length] = a);
        return a.instance_ = new a
    }
};
goog.instantiatedSingletons_ = [];
goog.DEPENDENCIES_ENABLED = !COMPILED && goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED && (goog.included_ = {}, goog.dependencies_ = {
    pathToNames: {},
    nameToPath: {},
    requires: {},
    visited: {},
    written: {}
}, goog.inHtmlDocument_ = function() {
    var a = goog.global.document;
    return "undefined" != typeof a && "write" in a
}, goog.findBasePath_ = function() {
    if (goog.global.CLOSURE_BASE_PATH) goog.basePath = goog.global.CLOSURE_BASE_PATH;
    else if (goog.inHtmlDocument_())
        for (var a = goog.global.document.getElementsByTagName("script"), b = a.length - 1; 0 <= b; --b) {
            var c = a[b].src,
                d = c.lastIndexOf("?"),
                d = -1 == d ? c.length :
                d;
            if ("base.js" == c.substr(d - 7, 7)) {
                goog.basePath = c.substr(0, d - 7);
                break
            }
        }
}, goog.importScript_ = function(a) {
    var b = goog.global.CLOSURE_IMPORT_SCRIPT || goog.writeScriptTag_;
    !goog.dependencies_.written[a] && b(a) && (goog.dependencies_.written[a] = !0)
}, goog.writeScriptTag_ = function(a) {
    if (goog.inHtmlDocument_()) {
        var b = goog.global.document;
        if ("complete" == b.readyState) {
            if (/\bdeps.js$/.test(a)) return !1;
            throw Error('Cannot write "' + a + '" after document load');
        }
        b.write('<script type="text/javascript" src="' + a + '">\x3c/script>');
        return !0
    }
    return !1
}, goog.writeScripts_ = function() {
    function a(e) {
        if (!(e in d.written)) {
            if (!(e in d.visited) && (d.visited[e] = !0, e in d.requires))
                for (var g in d.requires[e])
                    if (!goog.isProvided_(g))
                        if (g in d.nameToPath) a(d.nameToPath[g]);
                        else throw Error("Undefined nameToPath for " + g);
            e in c || (c[e] = !0, b.push(e))
        }
    }
    var b = [],
        c = {},
        d = goog.dependencies_,
        e;
    for (e in goog.included_) d.written[e] || a(e);
    for (e = 0; e < b.length; e++)
        if (b[e]) goog.importScript_(goog.basePath + b[e]);
        else throw Error("Undefined script input");
}, goog.getPathFromDeps_ = function(a) {
    return a in goog.dependencies_.nameToPath ? goog.dependencies_.nameToPath[a] : null
}, goog.findBasePath_(), goog.global.CLOSURE_NO_DEPS || goog.importScript_(goog.basePath + "deps.js"));
goog.typeOf = function(a) {
    var b = typeof a;
    if ("object" == b)
        if (a) {
            if (a instanceof Array) return "array";
            if (a instanceof Object) return b;
            var c = Object.prototype.toString.call(a);
            if ("[object Window]" == c) return "object";
            if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) return "function"
        } else return "null";
    else if ("function" == b && "undefined" == typeof a.call) return "object";
    return b
};
goog.isDef = function(a) {
    return void 0 !== a
};
goog.isNull = function(a) {
    return null === a
};
goog.isDefAndNotNull = function(a) {
    return null != a
};
goog.isArray = function(a) {
    return "array" == goog.typeOf(a)
};
goog.isArrayLike = function(a) {
    var b = goog.typeOf(a);
    return "array" == b || "object" == b && "number" == typeof a.length
};
goog.isDateLike = function(a) {
    return goog.isObject(a) && "function" == typeof a.getFullYear
};
goog.isString = function(a) {
    return "string" == typeof a
};
goog.isBoolean = function(a) {
    return "boolean" == typeof a
};
goog.isNumber = function(a) {
    return "number" == typeof a
};
goog.isFunction = function(a) {
    return "function" == goog.typeOf(a)
};
goog.isObject = function(a) {
    var b = typeof a;
    return "object" == b && null != a || "function" == b
};
goog.getUid = function(a) {
    return a[goog.UID_PROPERTY_] || (a[goog.UID_PROPERTY_] = ++goog.uidCounter_)
};
goog.hasUid = function(a) {
    return !!a[goog.UID_PROPERTY_]
};
goog.removeUid = function(a) {
    "removeAttribute" in a && a.removeAttribute(goog.UID_PROPERTY_);
    try {
        delete a[goog.UID_PROPERTY_]
    } catch (b) {}
};
goog.UID_PROPERTY_ = "closure_uid_" + (1E9 * Math.random() >>> 0);
goog.uidCounter_ = 0;
goog.getHashCode = goog.getUid;
goog.removeHashCode = goog.removeUid;
goog.cloneObject = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.cloneObject(a[c]);
        return b
    }
    return a
};
goog.bindNative_ = function(a, b, c) {
    return a.call.apply(a.bind, arguments)
};
goog.bindJs_ = function(a, b, c) {
    if (!a) throw Error();
    if (2 < arguments.length) {
        var d = Array.prototype.slice.call(arguments, 2);
        return function() {
            var c = Array.prototype.slice.call(arguments);
            Array.prototype.unshift.apply(c, d);
            return a.apply(b, c)
        }
    }
    return function() {
        return a.apply(b, arguments)
    }
};
goog.bind = function(a, b, c) {
    Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? goog.bind = goog.bindNative_ : goog.bind = goog.bindJs_;
    return goog.bind.apply(null, arguments)
};
goog.partial = function(a, b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return function() {
        var b = c.slice();
        b.push.apply(b, arguments);
        return a.apply(this, b)
    }
};
goog.mixin = function(a, b) {
    for (var c in b) a[c] = b[c]
};
goog.now = goog.TRUSTED_SITE && Date.now || function() {
    return +new Date
};
goog.globalEval = function(a) {
    if (goog.global.execScript) goog.global.execScript(a, "JavaScript");
    else if (goog.global.eval)
        if (null == goog.evalWorksForGlobals_ && (goog.global.eval("var _et_ = 1;"), "undefined" != typeof goog.global._et_ ? (delete goog.global._et_, goog.evalWorksForGlobals_ = !0) : goog.evalWorksForGlobals_ = !1), goog.evalWorksForGlobals_) goog.global.eval(a);
        else {
            var b = goog.global.document,
                c = b.createElement("script");
            c.type = "text/javascript";
            c.defer = !1;
            c.appendChild(b.createTextNode(a));
            b.body.appendChild(c);
            b.body.removeChild(c)
        } else throw Error("goog.globalEval not available");
};
goog.evalWorksForGlobals_ = null;
goog.getCssName = function(a, b) {
    var c = function(a) {
            return goog.cssNameMapping_[a] || a
        },
        d = function(a) {
            a = a.split("-");
            for (var b = [], d = 0; d < a.length; d++) b.push(c(a[d]));
            return b.join("-")
        },
        d = goog.cssNameMapping_ ? "BY_WHOLE" == goog.cssNameMappingStyle_ ? c : d : function(a) {
            return a
        };
    return b ? a + "-" + d(b) : d(a)
};
goog.setCssNameMapping = function(a, b) {
    goog.cssNameMapping_ = a;
    goog.cssNameMappingStyle_ = b
};
!COMPILED && goog.global.CLOSURE_CSS_NAME_MAPPING && (goog.cssNameMapping_ = goog.global.CLOSURE_CSS_NAME_MAPPING);
goog.getMsg = function(a, b) {
    var c = b || {},
        d;
    for (d in c) {
        var e = ("" + c[d]).replace(/\$/g, "$$$$");
        a = a.replace(RegExp("\\{\\$" + d + "\\}", "gi"), e)
    }
    return a
};
goog.getMsgWithFallback = function(a, b) {
    return a
};
goog.exportSymbol = function(a, b, c) {
    goog.exportPath_(a, b, c)
};
goog.exportProperty = function(a, b, c) {
    a[b] = c
};
goog.inherits = function(a, b) {
    function c() {}
    c.prototype = b.prototype;
    a.superClass_ = b.prototype;
    a.prototype = new c;
    a.prototype.constructor = a
};
goog.base = function(a, b, c) {
    var d = arguments.callee.caller;
    if (goog.DEBUG && !d) throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");
    if (d.superClass_) return d.superClass_.constructor.apply(a, Array.prototype.slice.call(arguments, 1));
    for (var e = Array.prototype.slice.call(arguments, 2), f = !1, g = a.constructor; g; g = g.superClass_ && g.superClass_.constructor)
        if (g.prototype[b] === d) f = !0;
        else if (f) return g.prototype[b].apply(a,
        e);
    if (a[b] === d) return a.constructor.prototype[b].apply(a, e);
    throw Error("goog.base called from a method of one name to a method of a different name");
};
goog.scope = function(a) {
    a.call(goog.global)
};
goog.debug = {};
goog.debug.Error = function(a) {
    Error.captureStackTrace ? Error.captureStackTrace(this, goog.debug.Error) : this.stack = Error().stack || "";
    a && (this.message = String(a))
};
goog.inherits(goog.debug.Error, Error);
goog.debug.Error.prototype.name = "CustomError";
goog.string = {};
goog.string.Unicode = {
    NBSP: "\u00a0"
};
goog.string.startsWith = function(a, b) {
    return 0 == a.lastIndexOf(b, 0)
};
goog.string.endsWith = function(a, b) {
    var c = a.length - b.length;
    return 0 <= c && a.indexOf(b, c) == c
};
goog.string.caseInsensitiveStartsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(0, b.length))
};
goog.string.caseInsensitiveEndsWith = function(a, b) {
    return 0 == goog.string.caseInsensitiveCompare(b, a.substr(a.length - b.length, b.length))
};
goog.string.caseInsensitiveEquals = function(a, b) {
    return a.toLowerCase() == b.toLowerCase()
};
goog.string.subs = function(a, b) {
    for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1); e.length && 1 < c.length;) d += c.shift() + e.shift();
    return d + c.join("%s")
};
goog.string.collapseWhitespace = function(a) {
    return a.replace(/[\s\xa0]+/g, " ").replace(/^\s+|\s+$/g, "")
};
goog.string.isEmpty = function(a) {
    return /^[\s\xa0]*$/.test(a)
};
goog.string.isEmptySafe = function(a) {
    return goog.string.isEmpty(goog.string.makeSafe(a))
};
goog.string.isBreakingWhitespace = function(a) {
    return !/[^\t\n\r ]/.test(a)
};
goog.string.isAlpha = function(a) {
    return !/[^a-zA-Z]/.test(a)
};
goog.string.isNumeric = function(a) {
    return !/[^0-9]/.test(a)
};
goog.string.isAlphaNumeric = function(a) {
    return !/[^a-zA-Z0-9]/.test(a)
};
goog.string.isSpace = function(a) {
    return " " == a
};
goog.string.isUnicodeChar = function(a) {
    return 1 == a.length && " " <= a && "~" >= a || "\u0080" <= a && "\ufffd" >= a
};
goog.string.stripNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)+/g, " ")
};
goog.string.canonicalizeNewlines = function(a) {
    return a.replace(/(\r\n|\r|\n)/g, "\n")
};
goog.string.normalizeWhitespace = function(a) {
    return a.replace(/\xa0|\s/g, " ")
};
goog.string.normalizeSpaces = function(a) {
    return a.replace(/\xa0|[ \t]+/g, " ")
};
goog.string.collapseBreakingSpaces = function(a) {
    return a.replace(/[\t\r\n ]+/g, " ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g, "")
};
goog.string.trim = function(a) {
    return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
};
goog.string.trimLeft = function(a) {
    return a.replace(/^[\s\xa0]+/, "")
};
goog.string.trimRight = function(a) {
    return a.replace(/[\s\xa0]+$/, "")
};
goog.string.caseInsensitiveCompare = function(a, b) {
    var c = String(a).toLowerCase(),
        d = String(b).toLowerCase();
    return c < d ? -1 : c == d ? 0 : 1
};
goog.string.numerateCompareRegExp_ = /(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare = function(a, b) {
    if (a == b) return 0;
    if (!a) return -1;
    if (!b) return 1;
    for (var c = a.toLowerCase().match(goog.string.numerateCompareRegExp_), d = b.toLowerCase().match(goog.string.numerateCompareRegExp_), e = Math.min(c.length, d.length), f = 0; f < e; f++) {
        var g = c[f],
            h = d[f];
        if (g != h) return c = parseInt(g, 10), !isNaN(c) && (d = parseInt(h, 10), !isNaN(d) && c - d) ? c - d : g < h ? -1 : 1
    }
    return c.length != d.length ? c.length - d.length : a < b ? -1 : 1
};
goog.string.urlEncode = function(a) {
    return encodeURIComponent(String(a))
};
goog.string.urlDecode = function(a) {
    return decodeURIComponent(a.replace(/\+/g, " "))
};
goog.string.newLineToBr = function(a, b) {
    return a.replace(/(\r\n|\r|\n)/g, b ? "<br />" : "<br>")
};
goog.string.htmlEscape = function(a, b) {
    if (b) return a.replace(goog.string.amperRe_, "&amp;").replace(goog.string.ltRe_, "&lt;").replace(goog.string.gtRe_, "&gt;").replace(goog.string.quotRe_, "&quot;");
    if (!goog.string.allRe_.test(a)) return a; - 1 != a.indexOf("&") && (a = a.replace(goog.string.amperRe_, "&amp;")); - 1 != a.indexOf("<") && (a = a.replace(goog.string.ltRe_, "&lt;")); - 1 != a.indexOf(">") && (a = a.replace(goog.string.gtRe_, "&gt;")); - 1 != a.indexOf('"') && (a = a.replace(goog.string.quotRe_, "&quot;"));
    return a
};
goog.string.amperRe_ = /&/g;
goog.string.ltRe_ = /</g;
goog.string.gtRe_ = />/g;
goog.string.quotRe_ = /\"/g;
goog.string.allRe_ = /[&<>\"]/;
goog.string.unescapeEntities = function(a) {
    return goog.string.contains(a, "&") ? "document" in goog.global ? goog.string.unescapeEntitiesUsingDom_(a) : goog.string.unescapePureXmlEntities_(a) : a
};
goog.string.unescapeEntitiesUsingDom_ = function(a) {
    var b = {
            "&amp;": "&",
            "&lt;": "<",
            "&gt;": ">",
            "&quot;": '"'
        },
        c = document.createElement("div");
    return a.replace(goog.string.HTML_ENTITY_PATTERN_, function(a, e) {
        var f = b[a];
        if (f) return f;
        if ("#" == e.charAt(0)) {
            var g = Number("0" + e.substr(1));
            isNaN(g) || (f = String.fromCharCode(g))
        }
        f || (c.innerHTML = a + " ", f = c.firstChild.nodeValue.slice(0, -1));
        return b[a] = f
    })
};
goog.string.unescapePureXmlEntities_ = function(a) {
    return a.replace(/&([^;]+);/g, function(a, c) {
        switch (c) {
            case "amp":
                return "&";
            case "lt":
                return "<";
            case "gt":
                return ">";
            case "quot":
                return '"';
            default:
                if ("#" == c.charAt(0)) {
                    var d = Number("0" + c.substr(1));
                    if (!isNaN(d)) return String.fromCharCode(d)
                }
                return a
        }
    })
};
goog.string.HTML_ENTITY_PATTERN_ = /&([^;\s<&]+);?/g;
goog.string.whitespaceEscape = function(a, b) {
    return goog.string.newLineToBr(a.replace(/  /g, " &#160;"), b)
};
goog.string.stripQuotes = function(a, b) {
    for (var c = b.length, d = 0; d < c; d++) {
        var e = 1 == c ? b : b.charAt(d);
        if (a.charAt(0) == e && a.charAt(a.length - 1) == e) return a.substring(1, a.length - 1)
    }
    return a
};
goog.string.truncate = function(a, b, c) {
    c && (a = goog.string.unescapeEntities(a));
    a.length > b && (a = a.substring(0, b - 3) + "...");
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.truncateMiddle = function(a, b, c, d) {
    c && (a = goog.string.unescapeEntities(a));
    if (d && a.length > b) {
        d > b && (d = b);
        var e = a.length - d;
        a = a.substring(0, b - d) + "..." + a.substring(e)
    } else a.length > b && (d = Math.floor(b / 2), e = a.length - d, a = a.substring(0, d + b % 2) + "..." + a.substring(e));
    c && (a = goog.string.htmlEscape(a));
    return a
};
goog.string.specialEscapeChars_ = {
    "\x00": "\\0",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "\t": "\\t",
    "\x0B": "\\x0B",
    '"': '\\"',
    "\\": "\\\\"
};
goog.string.jsEscapeCache_ = {
    "'": "\\'"
};
goog.string.quote = function(a) {
    a = String(a);
    if (a.quote) return a.quote();
    for (var b = ['"'], c = 0; c < a.length; c++) {
        var d = a.charAt(c),
            e = d.charCodeAt(0);
        b[c + 1] = goog.string.specialEscapeChars_[d] || (31 < e && 127 > e ? d : goog.string.escapeChar(d))
    }
    b.push('"');
    return b.join("")
};
goog.string.escapeString = function(a) {
    for (var b = [], c = 0; c < a.length; c++) b[c] = goog.string.escapeChar(a.charAt(c));
    return b.join("")
};
goog.string.escapeChar = function(a) {
    if (a in goog.string.jsEscapeCache_) return goog.string.jsEscapeCache_[a];
    if (a in goog.string.specialEscapeChars_) return goog.string.jsEscapeCache_[a] = goog.string.specialEscapeChars_[a];
    var b = a,
        c = a.charCodeAt(0);
    if (31 < c && 127 > c) b = a;
    else {
        if (256 > c) {
            if (b = "\\x", 16 > c || 256 < c) b += "0"
        } else b = "\\u", 4096 > c && (b += "0");
        b += c.toString(16).toUpperCase()
    }
    return goog.string.jsEscapeCache_[a] = b
};
goog.string.toMap = function(a) {
    for (var b = {}, c = 0; c < a.length; c++) b[a.charAt(c)] = !0;
    return b
};
goog.string.contains = function(a, b) {
    return -1 != a.indexOf(b)
};
goog.string.countOf = function(a, b) {
    return a && b ? a.split(b).length - 1 : 0
};
goog.string.removeAt = function(a, b, c) {
    var d = a;
    0 <= b && b < a.length && 0 < c && (d = a.substr(0, b) + a.substr(b + c, a.length - b - c));
    return d
};
goog.string.remove = function(a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "");
    return a.replace(c, "")
};
goog.string.removeAll = function(a, b) {
    var c = RegExp(goog.string.regExpEscape(b), "g");
    return a.replace(c, "")
};
goog.string.regExpEscape = function(a) {
    return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
};
goog.string.repeat = function(a, b) {
    return Array(b + 1).join(a)
};
goog.string.padNumber = function(a, b, c) {
    a = goog.isDef(c) ? a.toFixed(c) : String(a);
    c = a.indexOf("."); - 1 == c && (c = a.length);
    return goog.string.repeat("0", Math.max(0, b - c)) + a
};
goog.string.makeSafe = function(a) {
    return null == a ? "" : String(a)
};
goog.string.buildString = function(a) {
    return Array.prototype.join.call(arguments, "")
};
goog.string.getRandomString = function() {
    return Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ goog.now()).toString(36)
};
goog.string.compareVersions = function(a, b) {
    for (var c = 0, d = goog.string.trim(String(a)).split("."), e = goog.string.trim(String(b)).split("."), f = Math.max(d.length, e.length), g = 0; 0 == c && g < f; g++) {
        var h = d[g] || "",
            k = e[g] || "",
            l = RegExp("(\\d*)(\\D*)", "g"),
            p = RegExp("(\\d*)(\\D*)", "g");
        do {
            var m = l.exec(h) || ["", "", ""],
                n = p.exec(k) || ["", "", ""];
            if (0 == m[0].length && 0 == n[0].length) break;
            var c = 0 == m[1].length ? 0 : parseInt(m[1], 10),
                q = 0 == n[1].length ? 0 : parseInt(n[1], 10),
                c = goog.string.compareElements_(c, q) || goog.string.compareElements_(0 ==
                    m[2].length, 0 == n[2].length) || goog.string.compareElements_(m[2], n[2])
        } while (0 == c)
    }
    return c
};
goog.string.compareElements_ = function(a, b) {
    return a < b ? -1 : a > b ? 1 : 0
};
goog.string.HASHCODE_MAX_ = 4294967296;
goog.string.hashCode = function(a) {
    for (var b = 0, c = 0; c < a.length; ++c) b = 31 * b + a.charCodeAt(c), b %= goog.string.HASHCODE_MAX_;
    return b
};
goog.string.uniqueStringCounter_ = 2147483648 * Math.random() | 0;
goog.string.createUniqueString = function() {
    return "goog_" + goog.string.uniqueStringCounter_++
};
goog.string.toNumber = function(a) {
    var b = Number(a);
    return 0 == b && goog.string.isEmpty(a) ? NaN : b
};
goog.string.isLowerCamelCase = function(a) {
    return /^[a-z]+([A-Z][a-z]*)*$/.test(a)
};
goog.string.isUpperCamelCase = function(a) {
    return /^([A-Z][a-z]*)+$/.test(a)
};
goog.string.toCamelCase = function(a) {
    return String(a).replace(/\-([a-z])/g, function(a, c) {
        return c.toUpperCase()
    })
};
goog.string.toSelectorCase = function(a) {
    return String(a).replace(/([A-Z])/g, "-$1").toLowerCase()
};
goog.string.toTitleCase = function(a, b) {
    var c = goog.isString(b) ? goog.string.regExpEscape(b) : "\\s";
    return a.replace(RegExp("(^" + (c ? "|[" + c + "]+" : "") + ")([a-z])", "g"), function(a, b, c) {
        return b + c.toUpperCase()
    })
};
goog.string.parseInt = function(a) {
    isFinite(a) && (a = String(a));
    return goog.isString(a) ? /^\s*-?0x/i.test(a) ? parseInt(a, 16) : parseInt(a, 10) : NaN
};
goog.string.splitLimit = function(a, b, c) {
    a = a.split(b);
    for (var d = []; 0 < c && a.length;) d.push(a.shift()), c--;
    a.length && d.push(a.join(b));
    return d
};
goog.asserts = {};
goog.asserts.ENABLE_ASSERTS = goog.DEBUG;
goog.asserts.AssertionError = function(a, b) {
    b.unshift(a);
    goog.debug.Error.call(this, goog.string.subs.apply(null, b));
    b.shift();
    this.messagePattern = a
};
goog.inherits(goog.asserts.AssertionError, goog.debug.Error);
goog.asserts.AssertionError.prototype.name = "AssertionError";
goog.asserts.doAssertFailure_ = function(a, b, c, d) {
    var e = "Assertion failed";
    if (c) var e = e + (": " + c),
        f = d;
    else a && (e += ": " + a, f = b);
    throw new goog.asserts.AssertionError("" + e, f || []);
};
goog.asserts.assert = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !a && goog.asserts.doAssertFailure_("", null, b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.fail = function(a, b) {
    if (goog.asserts.ENABLE_ASSERTS) throw new goog.asserts.AssertionError("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
};
goog.asserts.assertNumber = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isNumber(a) && goog.asserts.doAssertFailure_("Expected number but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertString = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isString(a) && goog.asserts.doAssertFailure_("Expected string but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertFunction = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isFunction(a) && goog.asserts.doAssertFailure_("Expected function but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertObject = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isObject(a) && goog.asserts.doAssertFailure_("Expected object but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertArray = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isArray(a) && goog.asserts.doAssertFailure_("Expected array but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertBoolean = function(a, b, c) {
    goog.asserts.ENABLE_ASSERTS && !goog.isBoolean(a) && goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.", [goog.typeOf(a), a], b, Array.prototype.slice.call(arguments, 2));
    return a
};
goog.asserts.assertInstanceof = function(a, b, c, d) {
    !goog.asserts.ENABLE_ASSERTS || a instanceof b || goog.asserts.doAssertFailure_("instanceof check failed.", null, c, Array.prototype.slice.call(arguments, 3));
    return a
};
goog.asserts.assertObjectPrototypeIsIntact = function() {
    for (var a in Object.prototype) goog.asserts.fail(a + " should not be enumerable in Object.prototype.")
};
goog.object = {};
goog.object.forEach = function(a, b, c) {
    for (var d in a) b.call(c, a[d], d, a)
};
goog.object.filter = function(a, b, c) {
    var d = {},
        e;
    for (e in a) b.call(c, a[e], e, a) && (d[e] = a[e]);
    return d
};
goog.object.map = function(a, b, c) {
    var d = {},
        e;
    for (e in a) d[e] = b.call(c, a[e], e, a);
    return d
};
goog.object.some = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return !0;
    return !1
};
goog.object.every = function(a, b, c) {
    for (var d in a)
        if (!b.call(c, a[d], d, a)) return !1;
    return !0
};
goog.object.getCount = function(a) {
    var b = 0,
        c;
    for (c in a) b++;
    return b
};
goog.object.getAnyKey = function(a) {
    for (var b in a) return b
};
goog.object.getAnyValue = function(a) {
    for (var b in a) return a[b]
};
goog.object.contains = function(a, b) {
    return goog.object.containsValue(a, b)
};
goog.object.getValues = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = a[d];
    return b
};
goog.object.getKeys = function(a) {
    var b = [],
        c = 0,
        d;
    for (d in a) b[c++] = d;
    return b
};
goog.object.getValueByKeys = function(a, b) {
    for (var c = goog.isArrayLike(b), d = c ? b : arguments, c = c ? 0 : 1; c < d.length && (a = a[d[c]], goog.isDef(a)); c++);
    return a
};
goog.object.containsKey = function(a, b) {
    return b in a
};
goog.object.containsValue = function(a, b) {
    for (var c in a)
        if (a[c] == b) return !0;
    return !1
};
goog.object.findKey = function(a, b, c) {
    for (var d in a)
        if (b.call(c, a[d], d, a)) return d
};
goog.object.findValue = function(a, b, c) {
    return (b = goog.object.findKey(a, b, c)) && a[b]
};
goog.object.isEmpty = function(a) {
    for (var b in a) return !1;
    return !0
};
goog.object.clear = function(a) {
    for (var b in a) delete a[b]
};
goog.object.remove = function(a, b) {
    var c;
    (c = b in a) && delete a[b];
    return c
};
goog.object.add = function(a, b, c) {
    if (b in a) throw Error('The object already contains the key "' + b + '"');
    goog.object.set(a, b, c)
};
goog.object.get = function(a, b, c) {
    return b in a ? a[b] : c
};
goog.object.set = function(a, b, c) {
    a[b] = c
};
goog.object.setIfUndefined = function(a, b, c) {
    return b in a ? a[b] : a[b] = c
};
goog.object.clone = function(a) {
    var b = {},
        c;
    for (c in a) b[c] = a[c];
    return b
};
goog.object.unsafeClone = function(a) {
    var b = goog.typeOf(a);
    if ("object" == b || "array" == b) {
        if (a.clone) return a.clone();
        var b = "array" == b ? [] : {},
            c;
        for (c in a) b[c] = goog.object.unsafeClone(a[c]);
        return b
    }
    return a
};
goog.object.transpose = function(a) {
    var b = {},
        c;
    for (c in a) b[a[c]] = c;
    return b
};
goog.object.PROTOTYPE_FIELDS_ = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend = function(a, b) {
    for (var c, d, e = 1; e < arguments.length; e++) {
        d = arguments[e];
        for (c in d) a[c] = d[c];
        for (var f = 0; f < goog.object.PROTOTYPE_FIELDS_.length; f++) c = goog.object.PROTOTYPE_FIELDS_[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
    }
};
goog.object.create = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.create.apply(null, arguments[0]);
    if (b % 2) throw Error("Uneven number of arguments");
    for (var c = {}, d = 0; d < b; d += 2) c[arguments[d]] = arguments[d + 1];
    return c
};
goog.object.createSet = function(a) {
    var b = arguments.length;
    if (1 == b && goog.isArray(arguments[0])) return goog.object.createSet.apply(null, arguments[0]);
    for (var c = {}, d = 0; d < b; d++) c[arguments[d]] = !0;
    return c
};
goog.object.createImmutableView = function(a) {
    var b = a;
    Object.isFrozen && !Object.isFrozen(a) && (b = Object.create(a), Object.freeze(b));
    return b
};
goog.object.isImmutableView = function(a) {
    return !!Object.isFrozen && Object.isFrozen(a)
};
goog.dom = {};
goog.dom.NodeType = {
    ELEMENT: 1,
    ATTRIBUTE: 2,
    TEXT: 3,
    CDATA_SECTION: 4,
    ENTITY_REFERENCE: 5,
    ENTITY: 6,
    PROCESSING_INSTRUCTION: 7,
    COMMENT: 8,
    DOCUMENT: 9,
    DOCUMENT_TYPE: 10,
    DOCUMENT_FRAGMENT: 11,
    NOTATION: 12
};
goog.array = {};
goog.NATIVE_ARRAY_PROTOTYPES = goog.TRUSTED_SITE;
goog.array.peek = function(a) {
    return a[a.length - 1]
};
goog.array.ARRAY_PROTOTYPE_ = Array.prototype;
goog.array.indexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.indexOf ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a, b, c)
} : function(a, b, c) {
    c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.indexOf(b, c) : -1;
    for (; c < a.length; c++)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.lastIndexOf = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.lastIndexOf ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a, b, null == c ? a.length - 1 : c)
} : function(a, b, c) {
    c = null == c ? a.length - 1 : c;
    0 > c && (c = Math.max(0, a.length + c));
    if (goog.isString(a)) return goog.isString(b) && 1 == b.length ? a.lastIndexOf(b, c) : -1;
    for (; 0 <= c; c--)
        if (c in a && a[c] === b) return c;
    return -1
};
goog.array.forEach = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.forEach ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.forEach.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++) f in e && b.call(c, e[f], f, a)
};
goog.array.forEachRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; --d) d in e && b.call(c, e[d], d, a)
};
goog.array.filter = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.filter ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.filter.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = [], f = 0, g = goog.isString(a) ? a.split("") : a, h = 0; h < d; h++)
        if (h in g) {
            var k = g[h];
            b.call(c, k, h, a) && (e[f++] = k)
        }
    return e
};
goog.array.map = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.map ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.map.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = Array(d), f = goog.isString(a) ? a.split("") : a, g = 0; g < d; g++) g in f && (e[g] = b.call(c, f[g], g, a));
    return e
};
goog.array.reduce = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduce ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduce.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEach(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.reduceRight = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.reduceRight ? function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    d && (b = goog.bind(b, d));
    return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a, b, c)
} : function(a, b, c, d) {
    var e = c;
    goog.array.forEachRight(a, function(c, g) {
        e = b.call(d, e, c, g, a)
    });
    return e
};
goog.array.some = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.some ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.some.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return !0;
    return !1
};
goog.array.every = goog.NATIVE_ARRAY_PROTOTYPES && goog.array.ARRAY_PROTOTYPE_.every ? function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.every.call(a, b, c)
} : function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && !b.call(c, e[f], f, a)) return !1;
    return !0
};
goog.array.count = function(a, b, c) {
    var d = 0;
    goog.array.forEach(a, function(a, f, g) {
        b.call(c, a, f, g) && ++d
    }, c);
    return d
};
goog.array.find = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndex = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, f = 0; f < d; f++)
        if (f in e && b.call(c, e[f], f, a)) return f;
    return -1
};
goog.array.findRight = function(a, b, c) {
    b = goog.array.findIndexRight(a, b, c);
    return 0 > b ? null : goog.isString(a) ? a.charAt(b) : a[b]
};
goog.array.findIndexRight = function(a, b, c) {
    for (var d = a.length, e = goog.isString(a) ? a.split("") : a, d = d - 1; 0 <= d; d--)
        if (d in e && b.call(c, e[d], d, a)) return d;
    return -1
};
goog.array.contains = function(a, b) {
    return 0 <= goog.array.indexOf(a, b)
};
goog.array.isEmpty = function(a) {
    return 0 == a.length
};
goog.array.clear = function(a) {
    if (!goog.isArray(a))
        for (var b = a.length - 1; 0 <= b; b--) delete a[b];
    a.length = 0
};
goog.array.insert = function(a, b) {
    goog.array.contains(a, b) || a.push(b)
};
goog.array.insertAt = function(a, b, c) {
    goog.array.splice(a, c, 0, b)
};
goog.array.insertArrayAt = function(a, b, c) {
    goog.partial(goog.array.splice, a, c, 0).apply(null, b)
};
goog.array.insertBefore = function(a, b, c) {
    var d;
    2 == arguments.length || 0 > (d = goog.array.indexOf(a, c)) ? a.push(b) : goog.array.insertAt(a, b, d)
};
goog.array.remove = function(a, b) {
    var c = goog.array.indexOf(a, b),
        d;
    (d = 0 <= c) && goog.array.removeAt(a, c);
    return d
};
goog.array.removeAt = function(a, b) {
    goog.asserts.assert(null != a.length);
    return 1 == goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1).length
};
goog.array.removeIf = function(a, b, c) {
    b = goog.array.findIndex(a, b, c);
    return 0 <= b ? (goog.array.removeAt(a, b), !0) : !1
};
goog.array.concat = function(a) {
    return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_, arguments)
};
goog.array.toArray = function(a) {
    var b = a.length;
    if (0 < b) {
        for (var c = Array(b), d = 0; d < b; d++) c[d] = a[d];
        return c
    }
    return []
};
goog.array.clone = goog.array.toArray;
goog.array.extend = function(a, b) {
    for (var c = 1; c < arguments.length; c++) {
        var d = arguments[c],
            e;
        if (goog.isArray(d) || (e = goog.isArrayLike(d)) && Object.prototype.hasOwnProperty.call(d, "callee")) a.push.apply(a, d);
        else if (e)
            for (var f = a.length, g = d.length, h = 0; h < g; h++) a[f + h] = d[h];
        else a.push(d)
    }
};
goog.array.splice = function(a, b, c, d) {
    goog.asserts.assert(null != a.length);
    return goog.array.ARRAY_PROTOTYPE_.splice.apply(a, goog.array.slice(arguments, 1))
};
goog.array.slice = function(a, b, c) {
    goog.asserts.assert(null != a.length);
    return 2 >= arguments.length ? goog.array.ARRAY_PROTOTYPE_.slice.call(a, b) : goog.array.ARRAY_PROTOTYPE_.slice.call(a, b, c)
};
goog.array.removeDuplicates = function(a, b) {
    for (var c = b || a, d = {}, e = 0, f = 0; f < a.length;) {
        var g = a[f++],
            h = goog.isObject(g) ? "o" + goog.getUid(g) : (typeof g).charAt(0) + g;
        Object.prototype.hasOwnProperty.call(d, h) || (d[h] = !0, c[e++] = g)
    }
    c.length = e
};
goog.array.binarySearch = function(a, b, c) {
    return goog.array.binarySearch_(a, c || goog.array.defaultCompare, !1, b)
};
goog.array.binarySelect = function(a, b, c) {
    return goog.array.binarySearch_(a, b, !0, void 0, c)
};
goog.array.binarySearch_ = function(a, b, c, d, e) {
    for (var f = 0, g = a.length, h; f < g;) {
        var k = f + g >> 1,
            l;
        l = c ? b.call(e, a[k], k, a) : b(d, a[k]);
        0 < l ? f = k + 1 : (g = k, h = !l)
    }
    return h ? f : ~f
};
goog.array.sort = function(a, b) {
    goog.asserts.assert(null != a.length);
    goog.array.ARRAY_PROTOTYPE_.sort.call(a, b || goog.array.defaultCompare)
};
goog.array.stableSort = function(a, b) {
    for (var c = 0; c < a.length; c++) a[c] = {
        index: c,
        value: a[c]
    };
    var d = b || goog.array.defaultCompare;
    goog.array.sort(a, function(a, b) {
        return d(a.value, b.value) || a.index - b.index
    });
    for (c = 0; c < a.length; c++) a[c] = a[c].value
};
goog.array.sortObjectsByKey = function(a, b, c) {
    var d = c || goog.array.defaultCompare;
    goog.array.sort(a, function(a, c) {
        return d(a[b], c[b])
    })
};
goog.array.isSorted = function(a, b, c) {
    b = b || goog.array.defaultCompare;
    for (var d = 1; d < a.length; d++) {
        var e = b(a[d - 1], a[d]);
        if (0 < e || 0 == e && c) return !1
    }
    return !0
};
goog.array.equals = function(a, b, c) {
    if (!goog.isArrayLike(a) || !goog.isArrayLike(b) || a.length != b.length) return !1;
    var d = a.length;
    c = c || goog.array.defaultCompareEquality;
    for (var e = 0; e < d; e++)
        if (!c(a[e], b[e])) return !1;
    return !0
};
goog.array.compare = function(a, b, c) {
    return goog.array.equals(a, b, c)
};
goog.array.compare3 = function(a, b, c) {
    c = c || goog.array.defaultCompare;
    for (var d = Math.min(a.length, b.length), e = 0; e < d; e++) {
        var f = c(a[e], b[e]);
        if (0 != f) return f
    }
    return goog.array.defaultCompare(a.length, b.length)
};
goog.array.defaultCompare = function(a, b) {
    return a > b ? 1 : a < b ? -1 : 0
};
goog.array.defaultCompareEquality = function(a, b) {
    return a === b
};
goog.array.binaryInsert = function(a, b, c) {
    c = goog.array.binarySearch(a, b, c);
    return 0 > c ? (goog.array.insertAt(a, b, -(c + 1)), !0) : !1
};
goog.array.binaryRemove = function(a, b, c) {
    b = goog.array.binarySearch(a, b, c);
    return 0 <= b ? goog.array.removeAt(a, b) : !1
};
goog.array.bucket = function(a, b, c) {
    for (var d = {}, e = 0; e < a.length; e++) {
        var f = a[e],
            g = b.call(c, f, e, a);
        goog.isDef(g) && (d[g] || (d[g] = [])).push(f)
    }
    return d
};
goog.array.toObject = function(a, b, c) {
    var d = {};
    goog.array.forEach(a, function(e, f) {
        d[b.call(c, e, f, a)] = e
    });
    return d
};
goog.array.range = function(a, b, c) {
    var d = [],
        e = 0,
        f = a;
    c = c || 1;
    void 0 !== b && (e = a, f = b);
    if (0 > c * (f - e)) return [];
    if (0 < c)
        for (a = e; a < f; a += c) d.push(a);
    else
        for (a = e; a > f; a += c) d.push(a);
    return d
};
goog.array.repeat = function(a, b) {
    for (var c = [], d = 0; d < b; d++) c[d] = a;
    return c
};
goog.array.flatten = function(a) {
    for (var b = [], c = 0; c < arguments.length; c++) {
        var d = arguments[c];
        goog.isArray(d) ? b.push.apply(b, goog.array.flatten.apply(null, d)) : b.push(d)
    }
    return b
};
goog.array.rotate = function(a, b) {
    goog.asserts.assert(null != a.length);
    a.length && (b %= a.length, 0 < b ? goog.array.ARRAY_PROTOTYPE_.unshift.apply(a, a.splice(-b, b)) : 0 > b && goog.array.ARRAY_PROTOTYPE_.push.apply(a, a.splice(0, -b)));
    return a
};
goog.array.moveItem = function(a, b, c) {
    goog.asserts.assert(0 <= b && b < a.length);
    goog.asserts.assert(0 <= c && c < a.length);
    b = goog.array.ARRAY_PROTOTYPE_.splice.call(a, b, 1);
    goog.array.ARRAY_PROTOTYPE_.splice.call(a, c, 0, b[0])
};
goog.array.zip = function(a) {
    if (!arguments.length) return [];
    for (var b = [], c = 0;; c++) {
        for (var d = [], e = 0; e < arguments.length; e++) {
            var f = arguments[e];
            if (c >= f.length) return b;
            d.push(f[c])
        }
        b.push(d)
    }
};
goog.array.shuffle = function(a, b) {
    for (var c = b || Math.random, d = a.length - 1; 0 < d; d--) {
        var e = Math.floor(c() * (d + 1)),
            f = a[d];
        a[d] = a[e];
        a[e] = f
    }
};
goog.math = {};
goog.math.randomInt = function(a) {
    return Math.floor(Math.random() * a)
};
goog.math.uniformRandom = function(a, b) {
    return a + Math.random() * (b - a)
};
goog.math.clamp = function(a, b, c) {
    return Math.min(Math.max(a, b), c)
};
goog.math.modulo = function(a, b) {
    var c = a % b;
    return 0 > c * b ? c + b : c
};
goog.math.lerp = function(a, b, c) {
    return a + c * (b - a)
};
goog.math.nearlyEquals = function(a, b, c) {
    return Math.abs(a - b) <= (c || 1E-6)
};
goog.math.standardAngle = function(a) {
    return goog.math.modulo(a, 360)
};
goog.math.toRadians = function(a) {
    return a * Math.PI / 180
};
goog.math.toDegrees = function(a) {
    return 180 * a / Math.PI
};
goog.math.angleDx = function(a, b) {
    return b * Math.cos(goog.math.toRadians(a))
};
goog.math.angleDy = function(a, b) {
    return b * Math.sin(goog.math.toRadians(a))
};
goog.math.angle = function(a, b, c, d) {
    return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d - b, c - a)))
};
goog.math.angleDifference = function(a, b) {
    var c = goog.math.standardAngle(b) - goog.math.standardAngle(a);
    180 < c ? c -= 360 : -180 >= c && (c = 360 + c);
    return c
};
goog.math.sign = function(a) {
    return 0 == a ? 0 : 0 > a ? -1 : 1
};
goog.math.longestCommonSubsequence = function(a, b, c, d) {
    c = c || function(a, b) {
        return a == b
    };
    d = d || function(b, c) {
        return a[b]
    };
    for (var e = a.length, f = b.length, g = [], h = 0; h < e + 1; h++) g[h] = [], g[h][0] = 0;
    for (var k = 0; k < f + 1; k++) g[0][k] = 0;
    for (h = 1; h <= e; h++)
        for (k = 1; k <= f; k++) c(a[h - 1], b[k - 1]) ? g[h][k] = g[h - 1][k - 1] + 1 : g[h][k] = Math.max(g[h - 1][k], g[h][k - 1]);
    for (var l = [], h = e, k = f; 0 < h && 0 < k;) c(a[h - 1], b[k - 1]) ? (l.unshift(d(h - 1, k - 1)), h--, k--) : g[h - 1][k] > g[h][k - 1] ? h-- : k--;
    return l
};
goog.math.sum = function(a) {
    return goog.array.reduce(arguments, function(a, c) {
        return a + c
    }, 0)
};
goog.math.average = function(a) {
    return goog.math.sum.apply(null, arguments) / arguments.length
};
goog.math.standardDeviation = function(a) {
    var b = arguments.length;
    if (2 > b) return 0;
    var c = goog.math.average.apply(null, arguments),
        b = goog.math.sum.apply(null, goog.array.map(arguments, function(a) {
            return Math.pow(a - c, 2)
        })) / (b - 1);
    return Math.sqrt(b)
};
goog.math.isInt = function(a) {
    return isFinite(a) && 0 == a % 1
};
goog.math.isFiniteNumber = function(a) {
    return isFinite(a) && !isNaN(a)
};
goog.math.safeFloor = function(a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.floor(a + (b || 2E-15))
};
goog.math.safeCeil = function(a, b) {
    goog.asserts.assert(!goog.isDef(b) || 0 < b);
    return Math.ceil(a - (b || 2E-15))
};
goog.math.Coordinate = function(a, b) {
    this.x = goog.isDef(a) ? a : 0;
    this.y = goog.isDef(b) ? b : 0
};
goog.math.Coordinate.prototype.clone = function() {
    return new goog.math.Coordinate(this.x, this.y)
};
goog.DEBUG && (goog.math.Coordinate.prototype.toString = function() {
    return "(" + this.x + ", " + this.y + ")"
});
goog.math.Coordinate.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.x == b.x && a.y == b.y : !1
};
goog.math.Coordinate.distance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return Math.sqrt(c * c + d * d)
};
goog.math.Coordinate.magnitude = function(a) {
    return Math.sqrt(a.x * a.x + a.y * a.y)
};
goog.math.Coordinate.azimuth = function(a) {
    return goog.math.angle(0, 0, a.x, a.y)
};
goog.math.Coordinate.squaredDistance = function(a, b) {
    var c = a.x - b.x,
        d = a.y - b.y;
    return c * c + d * d
};
goog.math.Coordinate.difference = function(a, b) {
    return new goog.math.Coordinate(a.x - b.x, a.y - b.y)
};
goog.math.Coordinate.sum = function(a, b) {
    return new goog.math.Coordinate(a.x + b.x, a.y + b.y)
};
goog.math.Coordinate.prototype.ceil = function() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this
};
goog.math.Coordinate.prototype.floor = function() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this
};
goog.math.Coordinate.prototype.round = function() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this
};
goog.math.Coordinate.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.x += a.x, this.y += a.y) : (this.x += a, goog.isNumber(b) && (this.y += b));
    return this
};
goog.math.Coordinate.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.x *= a;
    this.y *= c;
    return this
};
goog.math.Box = function(a, b, c, d) {
    this.top = a;
    this.right = b;
    this.bottom = c;
    this.left = d
};
goog.math.Box.boundingBox = function(a) {
    for (var b = new goog.math.Box(arguments[0].y, arguments[0].x, arguments[0].y, arguments[0].x), c = 1; c < arguments.length; c++) {
        var d = arguments[c];
        b.top = Math.min(b.top, d.y);
        b.right = Math.max(b.right, d.x);
        b.bottom = Math.max(b.bottom, d.y);
        b.left = Math.min(b.left, d.x)
    }
    return b
};
goog.math.Box.prototype.clone = function() {
    return new goog.math.Box(this.top, this.right, this.bottom, this.left)
};
goog.DEBUG && (goog.math.Box.prototype.toString = function() {
    return "(" + this.top + "t, " + this.right + "r, " + this.bottom + "b, " + this.left + "l)"
});
goog.math.Box.prototype.contains = function(a) {
    return goog.math.Box.contains(this, a)
};
goog.math.Box.prototype.expand = function(a, b, c, d) {
    goog.isObject(a) ? (this.top -= a.top, this.right += a.right, this.bottom += a.bottom, this.left -= a.left) : (this.top -= a, this.right += b, this.bottom += c, this.left -= d);
    return this
};
goog.math.Box.prototype.expandToInclude = function(a) {
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.right = Math.max(this.right, a.right);
    this.bottom = Math.max(this.bottom, a.bottom)
};
goog.math.Box.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.top == b.top && a.right == b.right && a.bottom == b.bottom && a.left == b.left : !1
};
goog.math.Box.contains = function(a, b) {
    return a && b ? b instanceof goog.math.Box ? b.left >= a.left && b.right <= a.right && b.top >= a.top && b.bottom <= a.bottom : b.x >= a.left && b.x <= a.right && b.y >= a.top && b.y <= a.bottom : !1
};
goog.math.Box.relativePositionX = function(a, b) {
    return b.x < a.left ? b.x - a.left : b.x > a.right ? b.x - a.right : 0
};
goog.math.Box.relativePositionY = function(a, b) {
    return b.y < a.top ? b.y - a.top : b.y > a.bottom ? b.y - a.bottom : 0
};
goog.math.Box.distance = function(a, b) {
    var c = goog.math.Box.relativePositionX(a, b),
        d = goog.math.Box.relativePositionY(a, b);
    return Math.sqrt(c * c + d * d)
};
goog.math.Box.intersects = function(a, b) {
    return a.left <= b.right && b.left <= a.right && a.top <= b.bottom && b.top <= a.bottom
};
goog.math.Box.intersectsWithPadding = function(a, b, c) {
    return a.left <= b.right + c && b.left <= a.right + c && a.top <= b.bottom + c && b.top <= a.bottom + c
};
goog.math.Box.prototype.ceil = function() {
    this.top = Math.ceil(this.top);
    this.right = Math.ceil(this.right);
    this.bottom = Math.ceil(this.bottom);
    this.left = Math.ceil(this.left);
    return this
};
goog.math.Box.prototype.floor = function() {
    this.top = Math.floor(this.top);
    this.right = Math.floor(this.right);
    this.bottom = Math.floor(this.bottom);
    this.left = Math.floor(this.left);
    return this
};
goog.math.Box.prototype.round = function() {
    this.top = Math.round(this.top);
    this.right = Math.round(this.right);
    this.bottom = Math.round(this.bottom);
    this.left = Math.round(this.left);
    return this
};
goog.math.Box.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.left += a.x, this.right += a.x, this.top += a.y, this.bottom += a.y) : (this.left += a, this.right += a, goog.isNumber(b) && (this.top += b, this.bottom += b));
    return this
};
goog.math.Box.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.left *= a;
    this.right *= a;
    this.top *= c;
    this.bottom *= c;
    return this
};
goog.userAgent = {};
goog.userAgent.ASSUME_IE = !1;
goog.userAgent.ASSUME_GECKO = !1;
goog.userAgent.ASSUME_WEBKIT = !1;
goog.userAgent.ASSUME_MOBILE_WEBKIT = !1;
goog.userAgent.ASSUME_OPERA = !1;
goog.userAgent.ASSUME_ANY_VERSION = !1;
goog.userAgent.BROWSER_KNOWN_ = goog.userAgent.ASSUME_IE || goog.userAgent.ASSUME_GECKO || goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString = function() {
    return goog.global.navigator ? goog.global.navigator.userAgent : null
};
goog.userAgent.getNavigator = function() {
    return goog.global.navigator
};
goog.userAgent.init_ = function() {
    goog.userAgent.detectedOpera_ = !1;
    goog.userAgent.detectedIe_ = !1;
    goog.userAgent.detectedWebkit_ = !1;
    goog.userAgent.detectedMobile_ = !1;
    goog.userAgent.detectedGecko_ = !1;
    var a;
    if (!goog.userAgent.BROWSER_KNOWN_ && (a = goog.userAgent.getUserAgentString())) {
        var b = goog.userAgent.getNavigator();
        goog.userAgent.detectedOpera_ = goog.string.startsWith(a, "Opera");
        goog.userAgent.detectedIe_ = !goog.userAgent.detectedOpera_ && (goog.string.contains(a, "MSIE") || goog.string.contains(a, "Trident"));
        goog.userAgent.detectedWebkit_ = !goog.userAgent.detectedOpera_ && goog.string.contains(a, "WebKit");
        goog.userAgent.detectedMobile_ = goog.userAgent.detectedWebkit_ && goog.string.contains(a, "Mobile");
        goog.userAgent.detectedGecko_ = !goog.userAgent.detectedOpera_ && !goog.userAgent.detectedWebkit_ && !goog.userAgent.detectedIe_ && "Gecko" == b.product
    }
};
goog.userAgent.BROWSER_KNOWN_ || goog.userAgent.init_();
goog.userAgent.OPERA = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_OPERA : goog.userAgent.detectedOpera_;
goog.userAgent.IE = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_IE : goog.userAgent.detectedIe_;
goog.userAgent.GECKO = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_GECKO : goog.userAgent.detectedGecko_;
goog.userAgent.WEBKIT = goog.userAgent.BROWSER_KNOWN_ ? goog.userAgent.ASSUME_WEBKIT || goog.userAgent.ASSUME_MOBILE_WEBKIT : goog.userAgent.detectedWebkit_;
goog.userAgent.MOBILE = goog.userAgent.ASSUME_MOBILE_WEBKIT || goog.userAgent.detectedMobile_;
goog.userAgent.SAFARI = goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_ = function() {
    var a = goog.userAgent.getNavigator();
    return a && a.platform || ""
};
goog.userAgent.PLATFORM = goog.userAgent.determinePlatform_();
goog.userAgent.ASSUME_MAC = !1;
goog.userAgent.ASSUME_WINDOWS = !1;
goog.userAgent.ASSUME_LINUX = !1;
goog.userAgent.ASSUME_X11 = !1;
goog.userAgent.ASSUME_ANDROID = !1;
goog.userAgent.ASSUME_IPHONE = !1;
goog.userAgent.ASSUME_IPAD = !1;
goog.userAgent.PLATFORM_KNOWN_ = goog.userAgent.ASSUME_MAC || goog.userAgent.ASSUME_WINDOWS || goog.userAgent.ASSUME_LINUX || goog.userAgent.ASSUME_X11 || goog.userAgent.ASSUME_ANDROID || goog.userAgent.ASSUME_IPHONE || goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_ = function() {
    goog.userAgent.detectedMac_ = goog.string.contains(goog.userAgent.PLATFORM, "Mac");
    goog.userAgent.detectedWindows_ = goog.string.contains(goog.userAgent.PLATFORM, "Win");
    goog.userAgent.detectedLinux_ = goog.string.contains(goog.userAgent.PLATFORM, "Linux");
    goog.userAgent.detectedX11_ = !!goog.userAgent.getNavigator() && goog.string.contains(goog.userAgent.getNavigator().appVersion || "", "X11");
    var a = goog.userAgent.getUserAgentString();
    goog.userAgent.detectedAndroid_ = !!a &&
        goog.string.contains(a, "Android");
    goog.userAgent.detectedIPhone_ = !!a && goog.string.contains(a, "iPhone");
    goog.userAgent.detectedIPad_ = !!a && goog.string.contains(a, "iPad")
};
goog.userAgent.PLATFORM_KNOWN_ || goog.userAgent.initPlatform_();
goog.userAgent.MAC = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_MAC : goog.userAgent.detectedMac_;
goog.userAgent.WINDOWS = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_WINDOWS : goog.userAgent.detectedWindows_;
goog.userAgent.LINUX = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_LINUX : goog.userAgent.detectedLinux_;
goog.userAgent.X11 = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_X11 : goog.userAgent.detectedX11_;
goog.userAgent.ANDROID = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_ANDROID : goog.userAgent.detectedAndroid_;
goog.userAgent.IPHONE = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPHONE : goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD = goog.userAgent.PLATFORM_KNOWN_ ? goog.userAgent.ASSUME_IPAD : goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_ = function() {
    var a = "",
        b;
    goog.userAgent.OPERA && goog.global.opera ? (a = goog.global.opera.version, a = "function" == typeof a ? a() : a) : (goog.userAgent.GECKO ? b = /rv\:([^\);]+)(\)|;)/ : goog.userAgent.IE ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : goog.userAgent.WEBKIT && (b = /WebKit\/(\S+)/), b && (a = (a = b.exec(goog.userAgent.getUserAgentString())) ? a[1] : ""));
    return goog.userAgent.IE && (b = goog.userAgent.getDocumentMode_(), b > parseFloat(a)) ? String(b) : a
};
goog.userAgent.getDocumentMode_ = function() {
    var a = goog.global.document;
    return a ? a.documentMode : void 0
};
goog.userAgent.VERSION = goog.userAgent.determineVersion_();
goog.userAgent.compare = function(a, b) {
    return goog.string.compareVersions(a, b)
};
goog.userAgent.isVersionOrHigherCache_ = {};
goog.userAgent.isVersionOrHigher = function(a) {
    return goog.userAgent.ASSUME_ANY_VERSION || goog.userAgent.isVersionOrHigherCache_[a] || (goog.userAgent.isVersionOrHigherCache_[a] = 0 <= goog.string.compareVersions(goog.userAgent.VERSION, a))
};
goog.userAgent.isVersion = goog.userAgent.isVersionOrHigher;
goog.userAgent.isDocumentModeOrHigher = function(a) {
    return goog.userAgent.IE && goog.userAgent.DOCUMENT_MODE >= a
};
goog.userAgent.isDocumentMode = goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE = function() {
    var a = goog.global.document;
    return a && goog.userAgent.IE ? goog.userAgent.getDocumentMode_() || ("CSS1Compat" == a.compatMode ? parseInt(goog.userAgent.VERSION, 10) : 5) : void 0
}();
goog.math.Size = function(a, b) {
    this.width = a;
    this.height = b
};
goog.math.Size.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.width == b.width && a.height == b.height : !1
};
goog.math.Size.prototype.clone = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.DEBUG && (goog.math.Size.prototype.toString = function() {
    return "(" + this.width + " x " + this.height + ")"
});
goog.math.Size.prototype.getLongest = function() {
    return Math.max(this.width, this.height)
};
goog.math.Size.prototype.getShortest = function() {
    return Math.min(this.width, this.height)
};
goog.math.Size.prototype.area = function() {
    return this.width * this.height
};
goog.math.Size.prototype.perimeter = function() {
    return 2 * (this.width + this.height)
};
goog.math.Size.prototype.aspectRatio = function() {
    return this.width / this.height
};
goog.math.Size.prototype.isEmpty = function() {
    return !this.area()
};
goog.math.Size.prototype.ceil = function() {
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Size.prototype.fitsInside = function(a) {
    return this.width <= a.width && this.height <= a.height
};
goog.math.Size.prototype.floor = function() {
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Size.prototype.round = function() {
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Size.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.width *= a;
    this.height *= c;
    return this
};
goog.math.Size.prototype.scaleToFit = function(a) {
    a = this.aspectRatio() > a.aspectRatio() ? a.width / this.width : a.height / this.height;
    return this.scale(a)
};
goog.math.Rect = function(a, b, c, d) {
    this.left = a;
    this.top = b;
    this.width = c;
    this.height = d
};
goog.math.Rect.prototype.clone = function() {
    return new goog.math.Rect(this.left, this.top, this.width, this.height)
};
goog.math.Rect.prototype.toBox = function() {
    return new goog.math.Box(this.top, this.left + this.width, this.top + this.height, this.left)
};
goog.math.Rect.createFromBox = function(a) {
    return new goog.math.Rect(a.left, a.top, a.right - a.left, a.bottom - a.top)
};
goog.DEBUG && (goog.math.Rect.prototype.toString = function() {
    return "(" + this.left + ", " + this.top + " - " + this.width + "w x " + this.height + "h)"
});
goog.math.Rect.equals = function(a, b) {
    return a == b ? !0 : a && b ? a.left == b.left && a.width == b.width && a.top == b.top && a.height == b.height : !1
};
goog.math.Rect.prototype.intersection = function(a) {
    var b = Math.max(this.left, a.left),
        c = Math.min(this.left + this.width, a.left + a.width);
    if (b <= c) {
        var d = Math.max(this.top, a.top);
        a = Math.min(this.top + this.height, a.top + a.height);
        if (d <= a) return this.left = b, this.top = d, this.width = c - b, this.height = a - d, !0
    }
    return !1
};
goog.math.Rect.intersection = function(a, b) {
    var c = Math.max(a.left, b.left),
        d = Math.min(a.left + a.width, b.left + b.width);
    if (c <= d) {
        var e = Math.max(a.top, b.top),
            f = Math.min(a.top + a.height, b.top + b.height);
        if (e <= f) return new goog.math.Rect(c, e, d - c, f - e)
    }
    return null
};
goog.math.Rect.intersects = function(a, b) {
    return a.left <= b.left + b.width && b.left <= a.left + a.width && a.top <= b.top + b.height && b.top <= a.top + a.height
};
goog.math.Rect.prototype.intersects = function(a) {
    return goog.math.Rect.intersects(this, a)
};
goog.math.Rect.difference = function(a, b) {
    var c = goog.math.Rect.intersection(a, b);
    if (!c || !c.height || !c.width) return [a.clone()];
    var c = [],
        d = a.top,
        e = a.height,
        f = a.left + a.width,
        g = a.top + a.height,
        h = b.left + b.width,
        k = b.top + b.height;
    b.top > a.top && (c.push(new goog.math.Rect(a.left, a.top, a.width, b.top - a.top)), d = b.top, e -= b.top - a.top);
    k < g && (c.push(new goog.math.Rect(a.left, k, a.width, g - k)), e = k - d);
    b.left > a.left && c.push(new goog.math.Rect(a.left, d, b.left - a.left, e));
    h < f && c.push(new goog.math.Rect(h, d, f - h, e));
    return c
};
goog.math.Rect.prototype.difference = function(a) {
    return goog.math.Rect.difference(this, a)
};
goog.math.Rect.prototype.boundingRect = function(a) {
    var b = Math.max(this.left + this.width, a.left + a.width),
        c = Math.max(this.top + this.height, a.top + a.height);
    this.left = Math.min(this.left, a.left);
    this.top = Math.min(this.top, a.top);
    this.width = b - this.left;
    this.height = c - this.top
};
goog.math.Rect.boundingRect = function(a, b) {
    if (!a || !b) return null;
    var c = a.clone();
    c.boundingRect(b);
    return c
};
goog.math.Rect.prototype.contains = function(a) {
    return a instanceof goog.math.Rect ? this.left <= a.left && this.left + this.width >= a.left + a.width && this.top <= a.top && this.top + this.height >= a.top + a.height : a.x >= this.left && a.x <= this.left + this.width && a.y >= this.top && a.y <= this.top + this.height
};
goog.math.Rect.prototype.squaredDistance = function(a) {
    var b = a.x < this.left ? this.left - a.x : Math.max(a.x - (this.left + this.width), 0);
    a = a.y < this.top ? this.top - a.y : Math.max(a.y - (this.top + this.height), 0);
    return b * b + a * a
};
goog.math.Rect.prototype.distance = function(a) {
    return Math.sqrt(this.squaredDistance(a))
};
goog.math.Rect.prototype.getSize = function() {
    return new goog.math.Size(this.width, this.height)
};
goog.math.Rect.prototype.getTopLeft = function() {
    return new goog.math.Coordinate(this.left, this.top)
};
goog.math.Rect.prototype.getCenter = function() {
    return new goog.math.Coordinate(this.left + this.width / 2, this.top + this.height / 2)
};
goog.math.Rect.prototype.getBottomRight = function() {
    return new goog.math.Coordinate(this.left + this.width, this.top + this.height)
};
goog.math.Rect.prototype.ceil = function() {
    this.left = Math.ceil(this.left);
    this.top = Math.ceil(this.top);
    this.width = Math.ceil(this.width);
    this.height = Math.ceil(this.height);
    return this
};
goog.math.Rect.prototype.floor = function() {
    this.left = Math.floor(this.left);
    this.top = Math.floor(this.top);
    this.width = Math.floor(this.width);
    this.height = Math.floor(this.height);
    return this
};
goog.math.Rect.prototype.round = function() {
    this.left = Math.round(this.left);
    this.top = Math.round(this.top);
    this.width = Math.round(this.width);
    this.height = Math.round(this.height);
    return this
};
goog.math.Rect.prototype.translate = function(a, b) {
    a instanceof goog.math.Coordinate ? (this.left += a.x, this.top += a.y) : (this.left += a, goog.isNumber(b) && (this.top += b));
    return this
};
goog.math.Rect.prototype.scale = function(a, b) {
    var c = goog.isNumber(b) ? b : a;
    this.left *= a;
    this.width *= a;
    this.top *= c;
    this.height *= c;
    return this
};
goog.dom.vendor = {};
goog.dom.vendor.getVendorJsPrefix = function() {
    return goog.userAgent.WEBKIT ? "Webkit" : goog.userAgent.GECKO ? "Moz" : goog.userAgent.IE ? "ms" : goog.userAgent.OPERA ? "O" : null
};
goog.dom.vendor.getVendorPrefix = function() {
    return goog.userAgent.WEBKIT ? "-webkit" : goog.userAgent.GECKO ? "-moz" : goog.userAgent.IE ? "-ms" : goog.userAgent.OPERA ? "-o" : null
};
goog.dom.vendor.getPrefixedPropertyName = function(a, b) {
    if (b && a in b) return a;
    var c = goog.dom.vendor.getVendorJsPrefix();
    return c ? (c = c.toLowerCase(), c += goog.string.toTitleCase(a), !goog.isDef(b) || c in b ? c : null) : null
};
goog.dom.vendor.getPrefixedEventType = function(a) {
    return ((goog.dom.vendor.getVendorJsPrefix() || "") + a).toLowerCase()
};
goog.dom.classes = {};
goog.dom.classes.set = function(a, b) {
    a.className = b
};
goog.dom.classes.get = function(a) {
    a = a.className;
    return goog.isString(a) && a.match(/\S+/g) || []
};
goog.dom.classes.add = function(a, b) {
    var c = goog.dom.classes.get(a),
        d = goog.array.slice(arguments, 1),
        e = c.length + d.length;
    goog.dom.classes.add_(c, d);
    goog.dom.classes.set(a, c.join(" "));
    return c.length == e
};
goog.dom.classes.remove = function(a, b) {
    var c = goog.dom.classes.get(a),
        d = goog.array.slice(arguments, 1),
        e = goog.dom.classes.getDifference_(c, d);
    goog.dom.classes.set(a, e.join(" "));
    return e.length == c.length - d.length
};
goog.dom.classes.add_ = function(a, b) {
    for (var c = 0; c < b.length; c++) goog.array.contains(a, b[c]) || a.push(b[c])
};
goog.dom.classes.getDifference_ = function(a, b) {
    return goog.array.filter(a, function(a) {
        return !goog.array.contains(b, a)
    })
};
goog.dom.classes.swap = function(a, b, c) {
    for (var d = goog.dom.classes.get(a), e = !1, f = 0; f < d.length; f++) d[f] == b && (goog.array.splice(d, f--, 1), e = !0);
    e && (d.push(c), goog.dom.classes.set(a, d.join(" ")));
    return e
};
goog.dom.classes.addRemove = function(a, b, c) {
    var d = goog.dom.classes.get(a);
    goog.isString(b) ? goog.array.remove(d, b) : goog.isArray(b) && (d = goog.dom.classes.getDifference_(d, b));
    goog.isString(c) && !goog.array.contains(d, c) ? d.push(c) : goog.isArray(c) && goog.dom.classes.add_(d, c);
    goog.dom.classes.set(a, d.join(" "))
};
goog.dom.classes.has = function(a, b) {
    return goog.array.contains(goog.dom.classes.get(a), b)
};
goog.dom.classes.enable = function(a, b, c) {
    c ? goog.dom.classes.add(a, b) : goog.dom.classes.remove(a, b)
};
goog.dom.classes.toggle = function(a, b) {
    var c = !goog.dom.classes.has(a, b);
    goog.dom.classes.enable(a, b, c);
    return c
};
goog.dom.TagName = {
    A: "A",
    ABBR: "ABBR",
    ACRONYM: "ACRONYM",
    ADDRESS: "ADDRESS",
    APPLET: "APPLET",
    AREA: "AREA",
    ARTICLE: "ARTICLE",
    ASIDE: "ASIDE",
    AUDIO: "AUDIO",
    B: "B",
    BASE: "BASE",
    BASEFONT: "BASEFONT",
    BDI: "BDI",
    BDO: "BDO",
    BIG: "BIG",
    BLOCKQUOTE: "BLOCKQUOTE",
    BODY: "BODY",
    BR: "BR",
    BUTTON: "BUTTON",
    CANVAS: "CANVAS",
    CAPTION: "CAPTION",
    CENTER: "CENTER",
    CITE: "CITE",
    CODE: "CODE",
    COL: "COL",
    COLGROUP: "COLGROUP",
    COMMAND: "COMMAND",
    DATA: "DATA",
    DATALIST: "DATALIST",
    DD: "DD",
    DEL: "DEL",
    DETAILS: "DETAILS",
    DFN: "DFN",
    DIALOG: "DIALOG",
    DIR: "DIR",
    DIV: "DIV",
    DL: "DL",
    DT: "DT",
    EM: "EM",
    EMBED: "EMBED",
    FIELDSET: "FIELDSET",
    FIGCAPTION: "FIGCAPTION",
    FIGURE: "FIGURE",
    FONT: "FONT",
    FOOTER: "FOOTER",
    FORM: "FORM",
    FRAME: "FRAME",
    FRAMESET: "FRAMESET",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    HEAD: "HEAD",
    HEADER: "HEADER",
    HGROUP: "HGROUP",
    HR: "HR",
    HTML: "HTML",
    I: "I",
    IFRAME: "IFRAME",
    IMG: "IMG",
    INPUT: "INPUT",
    INS: "INS",
    ISINDEX: "ISINDEX",
    KBD: "KBD",
    KEYGEN: "KEYGEN",
    LABEL: "LABEL",
    LEGEND: "LEGEND",
    LI: "LI",
    LINK: "LINK",
    MAP: "MAP",
    MARK: "MARK",
    MATH: "MATH",
    MENU: "MENU",
    META: "META",
    METER: "METER",
    NAV: "NAV",
    NOFRAMES: "NOFRAMES",
    NOSCRIPT: "NOSCRIPT",
    OBJECT: "OBJECT",
    OL: "OL",
    OPTGROUP: "OPTGROUP",
    OPTION: "OPTION",
    OUTPUT: "OUTPUT",
    P: "P",
    PARAM: "PARAM",
    PRE: "PRE",
    PROGRESS: "PROGRESS",
    Q: "Q",
    RP: "RP",
    RT: "RT",
    RUBY: "RUBY",
    S: "S",
    SAMP: "SAMP",
    SCRIPT: "SCRIPT",
    SECTION: "SECTION",
    SELECT: "SELECT",
    SMALL: "SMALL",
    SOURCE: "SOURCE",
    SPAN: "SPAN",
    STRIKE: "STRIKE",
    STRONG: "STRONG",
    STYLE: "STYLE",
    SUB: "SUB",
    SUMMARY: "SUMMARY",
    SUP: "SUP",
    SVG: "SVG",
    TABLE: "TABLE",
    TBODY: "TBODY",
    TD: "TD",
    TEXTAREA: "TEXTAREA",
    TFOOT: "TFOOT",
    TH: "TH",
    THEAD: "THEAD",
    TIME: "TIME",
    TITLE: "TITLE",
    TR: "TR",
    TRACK: "TRACK",
    TT: "TT",
    U: "U",
    UL: "UL",
    VAR: "VAR",
    VIDEO: "VIDEO",
    WBR: "WBR"
};
goog.functions = {};
goog.functions.constant = function(a) {
    return function() {
        return a
    }
};
goog.functions.FALSE = goog.functions.constant(!1);
goog.functions.TRUE = goog.functions.constant(!0);
goog.functions.NULL = goog.functions.constant(null);
goog.functions.identity = function(a, b) {
    return a
};
goog.functions.error = function(a) {
    return function() {
        throw Error(a);
    }
};
goog.functions.fail = function(a) {
    return function() {
        throw a;
    }
};
goog.functions.lock = function(a, b) {
    b = b || 0;
    return function() {
        return a.apply(this, Array.prototype.slice.call(arguments, 0, b))
    }
};
goog.functions.nth = function(a) {
    return function() {
        return arguments[a]
    }
};
goog.functions.withReturnValue = function(a, b) {
    return goog.functions.sequence(a, goog.functions.constant(b))
};
goog.functions.compose = function(a, b) {
    var c = arguments,
        d = c.length;
    return function() {
        var a;
        d && (a = c[d - 1].apply(this, arguments));
        for (var b = d - 2; 0 <= b; b--) a = c[b].call(this, a);
        return a
    }
};
goog.functions.sequence = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a, e = 0; e < c; e++) a = b[e].apply(this, arguments);
        return a
    }
};
goog.functions.and = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a = 0; a < c; a++)
            if (!b[a].apply(this, arguments)) return !1;
        return !0
    }
};
goog.functions.or = function(a) {
    var b = arguments,
        c = b.length;
    return function() {
        for (var a = 0; a < c; a++)
            if (b[a].apply(this, arguments)) return !0;
        return !1
    }
};
goog.functions.not = function(a) {
    return function() {
        return !a.apply(this, arguments)
    }
};
goog.functions.create = function(a, b) {
    var c = function() {};
    c.prototype = a.prototype;
    c = new c;
    a.apply(c, Array.prototype.slice.call(arguments, 1));
    return c
};
goog.functions.CACHE_RETURN_VALUE = !0;
goog.functions.cacheReturnValue = function(a) {
    var b = !1,
        c;
    return function() {
        if (!goog.functions.CACHE_RETURN_VALUE) return a();
        b || (c = a(), b = !0);
        return c
    }
};
goog.dom.BrowserFeature = {
    CAN_ADD_NAME_OR_TYPE_ATTRIBUTES: !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9),
    CAN_USE_CHILDREN_ATTRIBUTE: !goog.userAgent.GECKO && !goog.userAgent.IE || goog.userAgent.IE && goog.userAgent.isDocumentModeOrHigher(9) || goog.userAgent.GECKO && goog.userAgent.isVersionOrHigher("1.9.1"),
    CAN_USE_INNER_TEXT: goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("9"),
    CAN_USE_PARENT_ELEMENT_PROPERTY: goog.userAgent.IE || goog.userAgent.OPERA || goog.userAgent.WEBKIT,
    INNER_HTML_NEEDS_SCOPED_ELEMENT: goog.userAgent.IE
};
goog.dom.ASSUME_QUIRKS_MODE = !1;
goog.dom.ASSUME_STANDARDS_MODE = !1;
goog.dom.COMPAT_MODE_KNOWN_ = goog.dom.ASSUME_QUIRKS_MODE || goog.dom.ASSUME_STANDARDS_MODE;
goog.dom.getDomHelper = function(a) {
    return a ? new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)) : goog.dom.defaultDomHelper_ || (goog.dom.defaultDomHelper_ = new goog.dom.DomHelper)
};
goog.dom.getDocument = function() {
    return document
};
goog.dom.getElement = function(a) {
    return goog.dom.getElementHelper_(document, a)
};
goog.dom.getElementHelper_ = function(a, b) {
    return goog.isString(b) ? a.getElementById(b) : b
};
goog.dom.getRequiredElement = function(a) {
    return goog.dom.getRequiredElementHelper_(document, a)
};
goog.dom.getRequiredElementHelper_ = function(a, b) {
    goog.asserts.assertString(b);
    var c = goog.dom.getElement(b);
    goog.asserts.assert(c, "No element found with id: " + b);
    return c
};
goog.dom.$ = goog.dom.getElement;
goog.dom.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(document, a, b, c)
};
goog.dom.getElementsByClass = function(a, b) {
    var c = b || document;
    return goog.dom.canUseQuerySelector_(c) ? c.querySelectorAll("." + a) : c.getElementsByClassName ? c.getElementsByClassName(a) : goog.dom.getElementsByTagNameAndClass_(document, "*", a, b)
};
goog.dom.getElementByClass = function(a, b) {
    var c = b || document,
        d = null;
    return (d = goog.dom.canUseQuerySelector_(c) ? c.querySelector("." + a) : goog.dom.getElementsByClass(a, b)[0]) || null
};
goog.dom.canUseQuerySelector_ = function(a) {
    return !(!a.querySelectorAll || !a.querySelector)
};
goog.dom.getElementsByTagNameAndClass_ = function(a, b, c, d) {
    a = d || a;
    b = b && "*" != b ? b.toUpperCase() : "";
    if (goog.dom.canUseQuerySelector_(a) && (b || c)) return a.querySelectorAll(b + (c ? "." + c : ""));
    if (c && a.getElementsByClassName) {
        a = a.getElementsByClassName(c);
        if (b) {
            d = {};
            for (var e = 0, f = 0, g; g = a[f]; f++) b == g.nodeName && (d[e++] = g);
            d.length = e;
            return d
        }
        return a
    }
    a = a.getElementsByTagName(b || "*");
    if (c) {
        d = {};
        for (f = e = 0; g = a[f]; f++) b = g.className, "function" == typeof b.split && goog.array.contains(b.split(/\s+/), c) && (d[e++] = g);
        d.length =
            e;
        return d
    }
    return a
};
goog.dom.$$ = goog.dom.getElementsByTagNameAndClass;
goog.dom.setProperties = function(a, b) {
    goog.object.forEach(b, function(b, d) {
        "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in goog.dom.DIRECT_ATTRIBUTE_MAP_ ? a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d], b) : goog.string.startsWith(d, "aria-") || goog.string.startsWith(d, "data-") ? a.setAttribute(d, b) : a[d] = b
    })
};
goog.dom.DIRECT_ATTRIBUTE_MAP_ = {
    cellpadding: "cellPadding",
    cellspacing: "cellSpacing",
    colspan: "colSpan",
    frameborder: "frameBorder",
    height: "height",
    maxlength: "maxLength",
    role: "role",
    rowspan: "rowSpan",
    type: "type",
    usemap: "useMap",
    valign: "vAlign",
    width: "width"
};
goog.dom.getViewportSize = function(a) {
    return goog.dom.getViewportSize_(a || window)
};
goog.dom.getViewportSize_ = function(a) {
    a = a.document;
    a = goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body;
    return new goog.math.Size(a.clientWidth, a.clientHeight)
};
goog.dom.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(window)
};
goog.dom.getDocumentHeight_ = function(a) {
    var b = a.document,
        c = 0;
    if (b) {
        a = goog.dom.getViewportSize_(a).height;
        var c = b.body,
            d = b.documentElement;
        if (goog.dom.isCss1CompatMode_(b) && d.scrollHeight) c = d.scrollHeight != a ? d.scrollHeight : d.offsetHeight;
        else {
            var b = d.scrollHeight,
                e = d.offsetHeight;
            d.clientHeight != e && (b = c.scrollHeight, e = c.offsetHeight);
            c = b > a ? b > e ? b : e : b < e ? b : e
        }
    }
    return c
};
goog.dom.getPageScroll = function(a) {
    return goog.dom.getDomHelper((a || goog.global || window).document).getDocumentScroll()
};
goog.dom.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(document)
};
goog.dom.getDocumentScroll_ = function(a) {
    var b = goog.dom.getDocumentScrollElement_(a);
    a = goog.dom.getWindow_(a);
    return goog.userAgent.IE && goog.userAgent.isVersionOrHigher("10") && a.pageYOffset != b.scrollTop ? new goog.math.Coordinate(b.scrollLeft, b.scrollTop) : new goog.math.Coordinate(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
};
goog.dom.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(document)
};
goog.dom.getDocumentScrollElement_ = function(a) {
    return !goog.userAgent.WEBKIT && goog.dom.isCss1CompatMode_(a) ? a.documentElement : a.body
};
goog.dom.getWindow = function(a) {
    return a ? goog.dom.getWindow_(a) : window
};
goog.dom.getWindow_ = function(a) {
    return a.parentWindow || a.defaultView
};
goog.dom.createDom = function(a, b, c) {
    return goog.dom.createDom_(document, arguments)
};
goog.dom.createDom_ = function(a, b) {
    var c = b[0],
        d = b[1];
    if (!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES && d && (d.name || d.type)) {
        c = ["<", c];
        d.name && c.push(' name="', goog.string.htmlEscape(d.name), '"');
        if (d.type) {
            c.push(' type="', goog.string.htmlEscape(d.type), '"');
            var e = {};
            goog.object.extend(e, d);
            delete e.type;
            d = e
        }
        c.push(">");
        c = c.join("")
    }
    c = a.createElement(c);
    d && (goog.isString(d) ? c.className = d : goog.isArray(d) ? goog.dom.classes.add.apply(null, [c].concat(d)) : goog.dom.setProperties(c, d));
    2 < b.length &&
        goog.dom.append_(a, c, b, 2);
    return c
};
goog.dom.append_ = function(a, b, c, d) {
    function e(c) {
        c && b.appendChild(goog.isString(c) ? a.createTextNode(c) : c)
    }
    for (; d < c.length; d++) {
        var f = c[d];
        goog.isArrayLike(f) && !goog.dom.isNodeLike(f) ? goog.array.forEach(goog.dom.isNodeList(f) ? goog.array.toArray(f) : f, e) : e(f)
    }
};
goog.dom.$dom = goog.dom.createDom;
goog.dom.createElement = function(a) {
    return document.createElement(a)
};
goog.dom.createTextNode = function(a) {
    return document.createTextNode(String(a))
};
goog.dom.createTable = function(a, b, c) {
    return goog.dom.createTable_(document, a, b, !!c)
};
goog.dom.createTable_ = function(a, b, c, d) {
    for (var e = ["<tr>"], f = 0; f < c; f++) e.push(d ? "<td>&nbsp;</td>" : "<td></td>");
    e.push("</tr>");
    e = e.join("");
    c = ["<table>"];
    for (f = 0; f < b; f++) c.push(e);
    c.push("</table>");
    a = a.createElement(goog.dom.TagName.DIV);
    a.innerHTML = c.join("");
    return a.removeChild(a.firstChild)
};
goog.dom.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(document, a)
};
goog.dom.htmlToDocumentFragment_ = function(a, b) {
    var c = a.createElement("div");
    goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT ? (c.innerHTML = "<br>" + b, c.removeChild(c.firstChild)) : c.innerHTML = b;
    if (1 == c.childNodes.length) return c.removeChild(c.firstChild);
    for (var d = a.createDocumentFragment(); c.firstChild;) d.appendChild(c.firstChild);
    return d
};
goog.dom.getCompatMode = function() {
    return goog.dom.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(document)
};
goog.dom.isCss1CompatMode_ = function(a) {
    return goog.dom.COMPAT_MODE_KNOWN_ ? goog.dom.ASSUME_STANDARDS_MODE : "CSS1Compat" == a.compatMode
};
goog.dom.canHaveChildren = function(a) {
    if (a.nodeType != goog.dom.NodeType.ELEMENT) return !1;
    switch (a.tagName) {
        case goog.dom.TagName.APPLET:
        case goog.dom.TagName.AREA:
        case goog.dom.TagName.BASE:
        case goog.dom.TagName.BR:
        case goog.dom.TagName.COL:
        case goog.dom.TagName.COMMAND:
        case goog.dom.TagName.EMBED:
        case goog.dom.TagName.FRAME:
        case goog.dom.TagName.HR:
        case goog.dom.TagName.IMG:
        case goog.dom.TagName.INPUT:
        case goog.dom.TagName.IFRAME:
        case goog.dom.TagName.ISINDEX:
        case goog.dom.TagName.KEYGEN:
        case goog.dom.TagName.LINK:
        case goog.dom.TagName.NOFRAMES:
        case goog.dom.TagName.NOSCRIPT:
        case goog.dom.TagName.META:
        case goog.dom.TagName.OBJECT:
        case goog.dom.TagName.PARAM:
        case goog.dom.TagName.SCRIPT:
        case goog.dom.TagName.SOURCE:
        case goog.dom.TagName.STYLE:
        case goog.dom.TagName.TRACK:
        case goog.dom.TagName.WBR:
            return !1
    }
    return !0
};
goog.dom.appendChild = function(a, b) {
    a.appendChild(b)
};
goog.dom.append = function(a, b) {
    goog.dom.append_(goog.dom.getOwnerDocument(a), a, arguments, 1)
};
goog.dom.removeChildren = function(a) {
    for (var b; b = a.firstChild;) a.removeChild(b)
};
goog.dom.insertSiblingBefore = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b)
};
goog.dom.insertSiblingAfter = function(a, b) {
    b.parentNode && b.parentNode.insertBefore(a, b.nextSibling)
};
goog.dom.insertChildAt = function(a, b, c) {
    a.insertBefore(b, a.childNodes[c] || null)
};
goog.dom.removeNode = function(a) {
    return a && a.parentNode ? a.parentNode.removeChild(a) : null
};
goog.dom.replaceNode = function(a, b) {
    var c = b.parentNode;
    c && c.replaceChild(a, b)
};
goog.dom.flattenElement = function(a) {
    var b, c = a.parentNode;
    if (c && c.nodeType != goog.dom.NodeType.DOCUMENT_FRAGMENT) {
        if (a.removeNode) return a.removeNode(!1);
        for (; b = a.firstChild;) c.insertBefore(b, a);
        return goog.dom.removeNode(a)
    }
};
goog.dom.getChildren = function(a) {
    return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE && void 0 != a.children ? a.children : goog.array.filter(a.childNodes, function(a) {
        return a.nodeType == goog.dom.NodeType.ELEMENT
    })
};
goog.dom.getFirstElementChild = function(a) {
    return void 0 != a.firstElementChild ? a.firstElementChild : goog.dom.getNextElementNode_(a.firstChild, !0)
};
goog.dom.getLastElementChild = function(a) {
    return void 0 != a.lastElementChild ? a.lastElementChild : goog.dom.getNextElementNode_(a.lastChild, !1)
};
goog.dom.getNextElementSibling = function(a) {
    return void 0 != a.nextElementSibling ? a.nextElementSibling : goog.dom.getNextElementNode_(a.nextSibling, !0)
};
goog.dom.getPreviousElementSibling = function(a) {
    return void 0 != a.previousElementSibling ? a.previousElementSibling : goog.dom.getNextElementNode_(a.previousSibling, !1)
};
goog.dom.getNextElementNode_ = function(a, b) {
    for (; a && a.nodeType != goog.dom.NodeType.ELEMENT;) a = b ? a.nextSibling : a.previousSibling;
    return a
};
goog.dom.getNextNode = function(a) {
    if (!a) return null;
    if (a.firstChild) return a.firstChild;
    for (; a && !a.nextSibling;) a = a.parentNode;
    return a ? a.nextSibling : null
};
goog.dom.getPreviousNode = function(a) {
    if (!a) return null;
    if (!a.previousSibling) return a.parentNode;
    for (a = a.previousSibling; a && a.lastChild;) a = a.lastChild;
    return a
};
goog.dom.isNodeLike = function(a) {
    return goog.isObject(a) && 0 < a.nodeType
};
goog.dom.isElement = function(a) {
    return goog.isObject(a) && a.nodeType == goog.dom.NodeType.ELEMENT
};
goog.dom.isWindow = function(a) {
    return goog.isObject(a) && a.window == a
};
goog.dom.getParentElement = function(a) {
    if (goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY && !(goog.userAgent.IE && goog.userAgent.isVersionOrHigher("9") && !goog.userAgent.isVersionOrHigher("10") && goog.global.SVGElement && a instanceof goog.global.SVGElement)) return a.parentElement;
    a = a.parentNode;
    return goog.dom.isElement(a) ? a : null
};
goog.dom.contains = function(a, b) {
    if (a.contains && b.nodeType == goog.dom.NodeType.ELEMENT) return a == b || a.contains(b);
    if ("undefined" != typeof a.compareDocumentPosition) return a == b || Boolean(a.compareDocumentPosition(b) & 16);
    for (; b && a != b;) b = b.parentNode;
    return b == a
};
goog.dom.compareNodeOrder = function(a, b) {
    if (a == b) return 0;
    if (a.compareDocumentPosition) return a.compareDocumentPosition(b) & 2 ? 1 : -1;
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        if (a.nodeType == goog.dom.NodeType.DOCUMENT) return -1;
        if (b.nodeType == goog.dom.NodeType.DOCUMENT) return 1
    }
    if ("sourceIndex" in a || a.parentNode && "sourceIndex" in a.parentNode) {
        var c = a.nodeType == goog.dom.NodeType.ELEMENT,
            d = b.nodeType == goog.dom.NodeType.ELEMENT;
        if (c && d) return a.sourceIndex - b.sourceIndex;
        var e = a.parentNode,
            f = b.parentNode;
        return e == f ? goog.dom.compareSiblingOrder_(a, b) : !c && goog.dom.contains(e, b) ? -1 * goog.dom.compareParentsDescendantNodeIe_(a, b) : !d && goog.dom.contains(f, a) ? goog.dom.compareParentsDescendantNodeIe_(b, a) : (c ? a.sourceIndex : e.sourceIndex) - (d ? b.sourceIndex : f.sourceIndex)
    }
    d = goog.dom.getOwnerDocument(a);
    c = d.createRange();
    c.selectNode(a);
    c.collapse(!0);
    d = d.createRange();
    d.selectNode(b);
    d.collapse(!0);
    return c.compareBoundaryPoints(goog.global.Range.START_TO_END, d)
};
goog.dom.compareParentsDescendantNodeIe_ = function(a, b) {
    var c = a.parentNode;
    if (c == b) return -1;
    for (var d = b; d.parentNode != c;) d = d.parentNode;
    return goog.dom.compareSiblingOrder_(d, a)
};
goog.dom.compareSiblingOrder_ = function(a, b) {
    for (var c = b; c = c.previousSibling;)
        if (c == a) return -1;
    return 1
};
goog.dom.findCommonAncestor = function(a) {
    var b, c = arguments.length;
    if (!c) return null;
    if (1 == c) return arguments[0];
    var d = [],
        e = Infinity;
    for (b = 0; b < c; b++) {
        for (var f = [], g = arguments[b]; g;) f.unshift(g), g = g.parentNode;
        d.push(f);
        e = Math.min(e, f.length)
    }
    f = null;
    for (b = 0; b < e; b++) {
        for (var g = d[0][b], h = 1; h < c; h++)
            if (g != d[h][b]) return f;
        f = g
    }
    return f
};
goog.dom.getOwnerDocument = function(a) {
    return a.nodeType == goog.dom.NodeType.DOCUMENT ? a : a.ownerDocument || a.document
};
goog.dom.getFrameContentDocument = function(a) {
    return a.contentDocument || a.contentWindow.document
};
goog.dom.getFrameContentWindow = function(a) {
    return a.contentWindow || goog.dom.getWindow(goog.dom.getFrameContentDocument(a))
};
goog.dom.setTextContent = function(a, b) {
    if ("textContent" in a) a.textContent = b;
    else if (a.firstChild && a.firstChild.nodeType == goog.dom.NodeType.TEXT) {
        for (; a.lastChild != a.firstChild;) a.removeChild(a.lastChild);
        a.firstChild.data = b
    } else {
        goog.dom.removeChildren(a);
        var c = goog.dom.getOwnerDocument(a);
        a.appendChild(c.createTextNode(String(b)))
    }
};
goog.dom.getOuterHtml = function(a) {
    if ("outerHTML" in a) return a.outerHTML;
    var b = goog.dom.getOwnerDocument(a).createElement("div");
    b.appendChild(a.cloneNode(!0));
    return b.innerHTML
};
goog.dom.findNode = function(a, b) {
    var c = [];
    return goog.dom.findNodes_(a, b, c, !0) ? c[0] : void 0
};
goog.dom.findNodes = function(a, b) {
    var c = [];
    goog.dom.findNodes_(a, b, c, !1);
    return c
};
goog.dom.findNodes_ = function(a, b, c, d) {
    if (null != a)
        for (a = a.firstChild; a;) {
            if (b(a) && (c.push(a), d) || goog.dom.findNodes_(a, b, c, d)) return !0;
            a = a.nextSibling
        }
    return !1
};
goog.dom.TAGS_TO_IGNORE_ = {
    SCRIPT: 1,
    STYLE: 1,
    HEAD: 1,
    IFRAME: 1,
    OBJECT: 1
};
goog.dom.PREDEFINED_TAG_VALUES_ = {
    IMG: " ",
    BR: "\n"
};
goog.dom.isFocusableTabIndex = function(a) {
    return goog.dom.hasSpecifiedTabIndex_(a) && goog.dom.isTabIndexFocusable_(a)
};
goog.dom.setFocusableTabIndex = function(a, b) {
    b ? a.tabIndex = 0 : (a.tabIndex = -1, a.removeAttribute("tabIndex"))
};
goog.dom.isFocusable = function(a) {
    var b;
    return (b = goog.dom.isFormElement_(a) ? !a.disabled && (!goog.dom.hasSpecifiedTabIndex_(a) || goog.dom.isTabIndexFocusable_(a)) : goog.dom.isFocusableTabIndex(a)) && goog.userAgent.IE ? goog.dom.hasNonZeroBoundingRect_(a) : b
};
goog.dom.hasSpecifiedTabIndex_ = function(a) {
    a = a.getAttributeNode("tabindex");
    return goog.isDefAndNotNull(a) && a.specified
};
goog.dom.isTabIndexFocusable_ = function(a) {
    a = a.tabIndex;
    return goog.isNumber(a) && 0 <= a && 32768 > a
};
goog.dom.isFormElement_ = function(a) {
    return a.tagName == goog.dom.TagName.INPUT || a.tagName == goog.dom.TagName.TEXTAREA || a.tagName == goog.dom.TagName.SELECT || a.tagName == goog.dom.TagName.BUTTON
};
goog.dom.hasNonZeroBoundingRect_ = function(a) {
    a = goog.isFunction(a.getBoundingClientRect) ? a.getBoundingClientRect() : {
        height: a.offsetHeight,
        width: a.offsetWidth
    };
    return goog.isDefAndNotNull(a) && 0 < a.height && 0 < a.width
};
goog.dom.getTextContent = function(a) {
    if (goog.dom.BrowserFeature.CAN_USE_INNER_TEXT && "innerText" in a) a = goog.string.canonicalizeNewlines(a.innerText);
    else {
        var b = [];
        goog.dom.getTextContent_(a, b, !0);
        a = b.join("")
    }
    a = a.replace(/ \xAD /g, " ").replace(/\xAD/g, "");
    a = a.replace(/\u200B/g, "");
    goog.dom.BrowserFeature.CAN_USE_INNER_TEXT || (a = a.replace(/ +/g, " "));
    " " != a && (a = a.replace(/^\s*/, ""));
    return a
};
goog.dom.getRawTextContent = function(a) {
    var b = [];
    goog.dom.getTextContent_(a, b, !1);
    return b.join("")
};
goog.dom.getTextContent_ = function(a, b, c) {
    if (!(a.nodeName in goog.dom.TAGS_TO_IGNORE_))
        if (a.nodeType == goog.dom.NodeType.TEXT) c ? b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g, "")) : b.push(a.nodeValue);
        else if (a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);
    else
        for (a = a.firstChild; a;) goog.dom.getTextContent_(a, b, c), a = a.nextSibling
};
goog.dom.getNodeTextLength = function(a) {
    return goog.dom.getTextContent(a).length
};
goog.dom.getNodeTextOffset = function(a, b) {
    for (var c = b || goog.dom.getOwnerDocument(a).body, d = []; a && a != c;) {
        for (var e = a; e = e.previousSibling;) d.unshift(goog.dom.getTextContent(e));
        a = a.parentNode
    }
    return goog.string.trimLeft(d.join("")).replace(/ +/g, " ").length
};
goog.dom.getNodeAtOffset = function(a, b, c) {
    a = [a];
    for (var d = 0, e = null; 0 < a.length && d < b;)
        if (e = a.pop(), !(e.nodeName in goog.dom.TAGS_TO_IGNORE_))
            if (e.nodeType == goog.dom.NodeType.TEXT) var f = e.nodeValue.replace(/(\r\n|\r|\n)/g, "").replace(/ +/g, " "),
                d = d + f.length;
            else if (e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_) d += goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;
    else
        for (f = e.childNodes.length - 1; 0 <= f; f--) a.push(e.childNodes[f]);
    goog.isObject(c) && (c.remainder = e ? e.nodeValue.length + b - d - 1 : 0, c.node = e);
    return e
};
goog.dom.isNodeList = function(a) {
    if (a && "number" == typeof a.length) {
        if (goog.isObject(a)) return "function" == typeof a.item || "string" == typeof a.item;
        if (goog.isFunction(a)) return "function" == typeof a.item
    }
    return !1
};
goog.dom.getAncestorByTagNameAndClass = function(a, b, c) {
    if (!b && !c) return null;
    var d = b ? b.toUpperCase() : null;
    return goog.dom.getAncestor(a, function(a) {
        return (!d || a.nodeName == d) && (!c || goog.dom.classes.has(a, c))
    }, !0)
};
goog.dom.getAncestorByClass = function(a, b) {
    return goog.dom.getAncestorByTagNameAndClass(a, null, b)
};
goog.dom.getAncestor = function(a, b, c, d) {
    c || (a = a.parentNode);
    c = null == d;
    for (var e = 0; a && (c || e <= d);) {
        if (b(a)) return a;
        a = a.parentNode;
        e++
    }
    return null
};
goog.dom.getActiveElement = function(a) {
    try {
        return a && a.activeElement
    } catch (b) {}
    return null
};
goog.dom.getPixelRatio = goog.functions.cacheReturnValue(function() {
    var a = goog.dom.getWindow(),
        b = goog.userAgent.GECKO && goog.userAgent.MOBILE;
    return goog.isDef(a.devicePixelRatio) && !b ? a.devicePixelRatio : a.matchMedia ? goog.dom.matchesPixelRatio_(0.75) || goog.dom.matchesPixelRatio_(1.5) || goog.dom.matchesPixelRatio_(2) || goog.dom.matchesPixelRatio_(3) || 1 : 1
});
goog.dom.matchesPixelRatio_ = function(a) {
    return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: " + a + "),(min--moz-device-pixel-ratio: " + a + "),(min-resolution: " + a + "dppx)").matches ? a : 0
};
goog.dom.DomHelper = function(a) {
    this.document_ = a || goog.global.document || document
};
goog.dom.DomHelper.prototype.getDomHelper = goog.dom.getDomHelper;
goog.dom.DomHelper.prototype.setDocument = function(a) {
    this.document_ = a
};
goog.dom.DomHelper.prototype.getDocument = function() {
    return this.document_
};
goog.dom.DomHelper.prototype.getElement = function(a) {
    return goog.dom.getElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.getRequiredElement = function(a) {
    return goog.dom.getRequiredElementHelper_(this.document_, a)
};
goog.dom.DomHelper.prototype.$ = goog.dom.DomHelper.prototype.getElement;
goog.dom.DomHelper.prototype.getElementsByTagNameAndClass = function(a, b, c) {
    return goog.dom.getElementsByTagNameAndClass_(this.document_, a, b, c)
};
goog.dom.DomHelper.prototype.getElementsByClass = function(a, b) {
    return goog.dom.getElementsByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.getElementByClass = function(a, b) {
    return goog.dom.getElementByClass(a, b || this.document_)
};
goog.dom.DomHelper.prototype.$$ = goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;
goog.dom.DomHelper.prototype.setProperties = goog.dom.setProperties;
goog.dom.DomHelper.prototype.getViewportSize = function(a) {
    return goog.dom.getViewportSize(a || this.getWindow())
};
goog.dom.DomHelper.prototype.getDocumentHeight = function() {
    return goog.dom.getDocumentHeight_(this.getWindow())
};
goog.dom.DomHelper.prototype.createDom = function(a, b, c) {
    return goog.dom.createDom_(this.document_, arguments)
};
goog.dom.DomHelper.prototype.$dom = goog.dom.DomHelper.prototype.createDom;
goog.dom.DomHelper.prototype.createElement = function(a) {
    return this.document_.createElement(a)
};
goog.dom.DomHelper.prototype.createTextNode = function(a) {
    return this.document_.createTextNode(String(a))
};
goog.dom.DomHelper.prototype.createTable = function(a, b, c) {
    return goog.dom.createTable_(this.document_, a, b, !!c)
};
goog.dom.DomHelper.prototype.htmlToDocumentFragment = function(a) {
    return goog.dom.htmlToDocumentFragment_(this.document_, a)
};
goog.dom.DomHelper.prototype.getCompatMode = function() {
    return this.isCss1CompatMode() ? "CSS1Compat" : "BackCompat"
};
goog.dom.DomHelper.prototype.isCss1CompatMode = function() {
    return goog.dom.isCss1CompatMode_(this.document_)
};
goog.dom.DomHelper.prototype.getWindow = function() {
    return goog.dom.getWindow_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScrollElement = function() {
    return goog.dom.getDocumentScrollElement_(this.document_)
};
goog.dom.DomHelper.prototype.getDocumentScroll = function() {
    return goog.dom.getDocumentScroll_(this.document_)
};
goog.dom.DomHelper.prototype.getActiveElement = function(a) {
    return goog.dom.getActiveElement(a || this.document_)
};
goog.dom.DomHelper.prototype.appendChild = goog.dom.appendChild;
goog.dom.DomHelper.prototype.append = goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren = goog.dom.canHaveChildren;
goog.dom.DomHelper.prototype.removeChildren = goog.dom.removeChildren;
goog.dom.DomHelper.prototype.insertSiblingBefore = goog.dom.insertSiblingBefore;
goog.dom.DomHelper.prototype.insertSiblingAfter = goog.dom.insertSiblingAfter;
goog.dom.DomHelper.prototype.insertChildAt = goog.dom.insertChildAt;
goog.dom.DomHelper.prototype.removeNode = goog.dom.removeNode;
goog.dom.DomHelper.prototype.replaceNode = goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement = goog.dom.flattenElement;
goog.dom.DomHelper.prototype.getChildren = goog.dom.getChildren;
goog.dom.DomHelper.prototype.getFirstElementChild = goog.dom.getFirstElementChild;
goog.dom.DomHelper.prototype.getLastElementChild = goog.dom.getLastElementChild;
goog.dom.DomHelper.prototype.getNextElementSibling = goog.dom.getNextElementSibling;
goog.dom.DomHelper.prototype.getPreviousElementSibling = goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode = goog.dom.getNextNode;
goog.dom.DomHelper.prototype.getPreviousNode = goog.dom.getPreviousNode;
goog.dom.DomHelper.prototype.isNodeLike = goog.dom.isNodeLike;
goog.dom.DomHelper.prototype.isElement = goog.dom.isElement;
goog.dom.DomHelper.prototype.isWindow = goog.dom.isWindow;
goog.dom.DomHelper.prototype.getParentElement = goog.dom.getParentElement;
goog.dom.DomHelper.prototype.contains = goog.dom.contains;
goog.dom.DomHelper.prototype.compareNodeOrder = goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor = goog.dom.findCommonAncestor;
goog.dom.DomHelper.prototype.getOwnerDocument = goog.dom.getOwnerDocument;
goog.dom.DomHelper.prototype.getFrameContentDocument = goog.dom.getFrameContentDocument;
goog.dom.DomHelper.prototype.getFrameContentWindow = goog.dom.getFrameContentWindow;
goog.dom.DomHelper.prototype.setTextContent = goog.dom.setTextContent;
goog.dom.DomHelper.prototype.getOuterHtml = goog.dom.getOuterHtml;
goog.dom.DomHelper.prototype.findNode = goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes = goog.dom.findNodes;
goog.dom.DomHelper.prototype.isFocusableTabIndex = goog.dom.isFocusableTabIndex;
goog.dom.DomHelper.prototype.setFocusableTabIndex = goog.dom.setFocusableTabIndex;
goog.dom.DomHelper.prototype.isFocusable = goog.dom.isFocusable;
goog.dom.DomHelper.prototype.getTextContent = goog.dom.getTextContent;
goog.dom.DomHelper.prototype.getNodeTextLength = goog.dom.getNodeTextLength;
goog.dom.DomHelper.prototype.getNodeTextOffset = goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset = goog.dom.getNodeAtOffset;
goog.dom.DomHelper.prototype.isNodeList = goog.dom.isNodeList;
goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass = goog.dom.getAncestorByTagNameAndClass;
goog.dom.DomHelper.prototype.getAncestorByClass = goog.dom.getAncestorByClass;
goog.dom.DomHelper.prototype.getAncestor = goog.dom.getAncestor;
goog.style = {};
goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS = !1;
goog.style.setStyle = function(a, b, c) {
    goog.isString(b) ? goog.style.setStyle_(a, c, b) : goog.object.forEach(b, goog.partial(goog.style.setStyle_, a))
};
goog.style.setStyle_ = function(a, b, c) {
    (c = goog.style.getVendorJsStyleName_(a, c)) && (a.style[c] = b)
};
goog.style.getVendorJsStyleName_ = function(a, b) {
    var c = goog.string.toCamelCase(b);
    if (void 0 === a.style[c]) {
        var d = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b);
        if (void 0 !== a.style[d]) return d
    }
    return c
};
goog.style.getVendorStyleName_ = function(a, b) {
    var c = goog.string.toCamelCase(b);
    return void 0 === a.style[c] && (c = goog.dom.vendor.getVendorJsPrefix() + goog.string.toTitleCase(b), void 0 !== a.style[c]) ? goog.dom.vendor.getVendorPrefix() + "-" + b : b
};
goog.style.getStyle = function(a, b) {
    var c = a.style[goog.string.toCamelCase(b)];
    return "undefined" !== typeof c ? c : a.style[goog.style.getVendorJsStyleName_(a, b)] || ""
};
goog.style.getComputedStyle = function(a, b) {
    var c = goog.dom.getOwnerDocument(a);
    return c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null)) ? c[b] || c.getPropertyValue(b) || "" : ""
};
goog.style.getCascadedStyle = function(a, b) {
    return a.currentStyle ? a.currentStyle[b] : null
};
goog.style.getStyle_ = function(a, b) {
    return goog.style.getComputedStyle(a, b) || goog.style.getCascadedStyle(a, b) || a.style && a.style[b]
};
goog.style.getComputedPosition = function(a) {
    return goog.style.getStyle_(a, "position")
};
goog.style.getBackgroundColor = function(a) {
    return goog.style.getStyle_(a, "backgroundColor")
};
goog.style.getComputedOverflowX = function(a) {
    return goog.style.getStyle_(a, "overflowX")
};
goog.style.getComputedOverflowY = function(a) {
    return goog.style.getStyle_(a, "overflowY")
};
goog.style.getComputedZIndex = function(a) {
    return goog.style.getStyle_(a, "zIndex")
};
goog.style.getComputedTextAlign = function(a) {
    return goog.style.getStyle_(a, "textAlign")
};
goog.style.getComputedCursor = function(a) {
    return goog.style.getStyle_(a, "cursor")
};
goog.style.setPosition = function(a, b, c) {
    var d, e = goog.userAgent.GECKO && (goog.userAgent.MAC || goog.userAgent.X11) && goog.userAgent.isVersionOrHigher("1.9");
    b instanceof goog.math.Coordinate ? (d = b.x, b = b.y) : (d = b, b = c);
    a.style.left = goog.style.getPixelStyleValue_(d, e);
    a.style.top = goog.style.getPixelStyleValue_(b, e)
};
goog.style.getPosition = function(a) {
    return new goog.math.Coordinate(a.offsetLeft, a.offsetTop)
};
goog.style.getClientViewportElement = function(a) {
    a = a ? goog.dom.getOwnerDocument(a) : goog.dom.getDocument();
    return !goog.userAgent.IE || goog.userAgent.isDocumentModeOrHigher(9) || goog.dom.getDomHelper(a).isCss1CompatMode() ? a.documentElement : a.body
};
goog.style.getViewportPageOffset = function(a) {
    var b = a.body;
    a = a.documentElement;
    return new goog.math.Coordinate(b.scrollLeft || a.scrollLeft, b.scrollTop || a.scrollTop)
};
goog.style.getBoundingClientRect_ = function(a) {
    var b;
    try {
        b = a.getBoundingClientRect()
    } catch (c) {
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
    }
    goog.userAgent.IE && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
    return b
};
goog.style.getOffsetParent = function(a) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(8)) return a.offsetParent;
    var b = goog.dom.getOwnerDocument(a),
        c = goog.style.getStyle_(a, "position"),
        d = "fixed" == c || "absolute" == c;
    for (a = a.parentNode; a && a != b; a = a.parentNode)
        if (c = goog.style.getStyle_(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c)) return a;
    return null
};
goog.style.getVisibleRectForElement = function(a) {
    for (var b = new goog.math.Box(0, Infinity, Infinity, 0), c = goog.dom.getDomHelper(a), d = c.getDocument().body, e = c.getDocument().documentElement, f = c.getDocumentScrollElement(); a = goog.style.getOffsetParent(a);)
        if (!(goog.userAgent.IE && 0 == a.clientWidth || goog.userAgent.WEBKIT && 0 == a.clientHeight && a == d || a == d || a == e || "visible" == goog.style.getStyle_(a, "overflow"))) {
            var g = goog.style.getPageOffset(a),
                h = goog.style.getClientLeftTop(a);
            g.x += h.x;
            g.y += h.y;
            b.top = Math.max(b.top,
                g.y);
            b.right = Math.min(b.right, g.x + a.clientWidth);
            b.bottom = Math.min(b.bottom, g.y + a.clientHeight);
            b.left = Math.max(b.left, g.x)
        }
    d = f.scrollLeft;
    f = f.scrollTop;
    b.left = Math.max(b.left, d);
    b.top = Math.max(b.top, f);
    c = c.getViewportSize();
    b.right = Math.min(b.right, d + c.width);
    b.bottom = Math.min(b.bottom, f + c.height);
    return 0 <= b.top && 0 <= b.left && b.bottom > b.top && b.right > b.left ? b : null
};
goog.style.getContainerOffsetToScrollInto = function(a, b, c) {
    var d = goog.style.getPageOffset(a),
        e = goog.style.getPageOffset(b),
        f = goog.style.getBorderBox(b),
        g = d.x - e.x - f.left,
        d = d.y - e.y - f.top,
        e = b.clientWidth - a.offsetWidth;
    a = b.clientHeight - a.offsetHeight;
    f = b.scrollLeft;
    b = b.scrollTop;
    c ? (f += g - e / 2, b += d - a / 2) : (f += Math.min(g, Math.max(g - e, 0)), b += Math.min(d, Math.max(d - a, 0)));
    return new goog.math.Coordinate(f, b)
};
goog.style.scrollIntoContainerView = function(a, b, c) {
    a = goog.style.getContainerOffsetToScrollInto(a, b, c);
    b.scrollLeft = a.x;
    b.scrollTop = a.y
};
goog.style.getClientLeftTop = function(a) {
    if (goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher("1.9")) {
        var b = parseFloat(goog.style.getComputedStyle(a, "borderLeftWidth"));
        if (goog.style.isRightToLeft(a)) var c = a.offsetWidth - a.clientWidth - b - parseFloat(goog.style.getComputedStyle(a, "borderRightWidth")),
            b = b + c;
        return new goog.math.Coordinate(b, parseFloat(goog.style.getComputedStyle(a, "borderTopWidth")))
    }
    return new goog.math.Coordinate(a.clientLeft, a.clientTop)
};
goog.style.getPageOffset = function(a) {
    var b, c = goog.dom.getOwnerDocument(a),
        d = goog.style.getStyle_(a, "position");
    goog.asserts.assertObject(a, "Parameter is required");
    var e = !goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS && goog.userAgent.GECKO && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && (0 > b.screenX || 0 > b.screenY),
        f = new goog.math.Coordinate(0, 0),
        g = goog.style.getClientViewportElement(c);
    if (a == g) return f;
    if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS ||
        a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), a = goog.dom.getDomHelper(c).getDocumentScroll(), f.x = b.left + a.x, f.y = b.top + a.y;
    else if (c.getBoxObjectFor && !e) b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(g), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
    else {
        b = a;
        do {
            f.x += b.offsetLeft;
            f.y += b.offsetTop;
            b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
            if (goog.userAgent.WEBKIT && "fixed" == goog.style.getComputedPosition(b)) {
                f.x += c.body.scrollLeft;
                f.y += c.body.scrollTop;
                break
            }
            b = b.offsetParent
        } while (b &&
            b != a);
        if (goog.userAgent.OPERA || goog.userAgent.WEBKIT && "absolute" == d) f.y -= c.body.offsetTop;
        for (b = a;
            (b = goog.style.getOffsetParent(b)) && b != c.body && b != g;) f.x -= b.scrollLeft, goog.userAgent.OPERA && "TR" == b.tagName || (f.y -= b.scrollTop)
    }
    return f
};
goog.style.getPageOffsetLeft = function(a) {
    return goog.style.getPageOffset(a).x
};
goog.style.getPageOffsetTop = function(a) {
    return goog.style.getPageOffset(a).y
};
goog.style.getFramedPageOffset = function(a, b) {
    var c = new goog.math.Coordinate(0, 0),
        d = goog.dom.getWindow(goog.dom.getOwnerDocument(a)),
        e = a;
    do {
        var f = d == b ? goog.style.getPageOffset(e) : goog.style.getClientPositionForElement_(goog.asserts.assert(e));
        c.x += f.x;
        c.y += f.y
    } while (d && d != b && (e = d.frameElement) && (d = d.parent));
    return c
};
goog.style.translateRectForAnotherFrame = function(a, b, c) {
    if (b.getDocument() != c.getDocument()) {
        var d = b.getDocument().body;
        c = goog.style.getFramedPageOffset(d, c.getWindow());
        c = goog.math.Coordinate.difference(c, goog.style.getPageOffset(d));
        goog.userAgent.IE && !b.isCss1CompatMode() && (c = goog.math.Coordinate.difference(c, b.getDocumentScroll()));
        a.left += c.x;
        a.top += c.y
    }
};
goog.style.getRelativePosition = function(a, b) {
    var c = goog.style.getClientPosition(a),
        d = goog.style.getClientPosition(b);
    return new goog.math.Coordinate(c.x - d.x, c.y - d.y)
};
goog.style.getClientPositionForElement_ = function(a) {
    var b;
    if (goog.style.GET_BOUNDING_CLIENT_RECT_ALWAYS_EXISTS || a.getBoundingClientRect) b = goog.style.getBoundingClientRect_(a), b = new goog.math.Coordinate(b.left, b.top);
    else {
        b = goog.dom.getDomHelper(a).getDocumentScroll();
        var c = goog.style.getPageOffset(a);
        b = new goog.math.Coordinate(c.x - b.x, c.y - b.y)
    }
    return goog.userAgent.GECKO && !goog.userAgent.isVersionOrHigher(12) ? goog.math.Coordinate.sum(b, goog.style.getCssTranslation(a)) : b
};
goog.style.getClientPosition = function(a) {
    goog.asserts.assert(a);
    if (a.nodeType == goog.dom.NodeType.ELEMENT) return goog.style.getClientPositionForElement_(a);
    var b = goog.isFunction(a.getBrowserEvent),
        c = a;
    a.targetTouches ? c = a.targetTouches[0] : b && a.getBrowserEvent().targetTouches && (c = a.getBrowserEvent().targetTouches[0]);
    return new goog.math.Coordinate(c.clientX, c.clientY)
};
goog.style.setPageOffset = function(a, b, c) {
    var d = goog.style.getPageOffset(a);
    b instanceof goog.math.Coordinate && (c = b.y, b = b.x);
    goog.style.setPosition(a, a.offsetLeft + (b - d.x), a.offsetTop + (c - d.y))
};
goog.style.setSize = function(a, b, c) {
    if (b instanceof goog.math.Size) c = b.height, b = b.width;
    else if (void 0 == c) throw Error("missing height argument");
    goog.style.setWidth(a, b);
    goog.style.setHeight(a, c)
};
goog.style.getPixelStyleValue_ = function(a, b) {
    "number" == typeof a && (a = (b ? Math.round(a) : a) + "px");
    return a
};
goog.style.setHeight = function(a, b) {
    a.style.height = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.setWidth = function(a, b) {
    a.style.width = goog.style.getPixelStyleValue_(b, !0)
};
goog.style.getSize = function(a) {
    return goog.style.evaluateWithTemporaryDisplay_(goog.style.getSizeWithDisplay_, a)
};
goog.style.evaluateWithTemporaryDisplay_ = function(a, b) {
    if ("none" != goog.style.getStyle_(b, "display")) return a(b);
    var c = b.style,
        d = c.display,
        e = c.visibility,
        f = c.position;
    c.visibility = "hidden";
    c.position = "absolute";
    c.display = "inline";
    var g = a(b);
    c.display = d;
    c.position = f;
    c.visibility = e;
    return g
};
goog.style.getSizeWithDisplay_ = function(a) {
    var b = a.offsetWidth,
        c = a.offsetHeight,
        d = goog.userAgent.WEBKIT && !b && !c;
    return goog.isDef(b) && !d || !a.getBoundingClientRect ? new goog.math.Size(b, c) : (a = goog.style.getBoundingClientRect_(a), new goog.math.Size(a.right - a.left, a.bottom - a.top))
};
goog.style.getTransformedSize = function(a) {
    if (!a.getBoundingClientRect) return null;
    a = goog.style.evaluateWithTemporaryDisplay_(goog.style.getBoundingClientRect_, a);
    return new goog.math.Size(a.right - a.left, a.bottom - a.top)
};
goog.style.getBounds = function(a) {
    var b = goog.style.getPageOffset(a);
    a = goog.style.getSize(a);
    return new goog.math.Rect(b.x, b.y, a.width, a.height)
};
goog.style.toCamelCase = function(a) {
    return goog.string.toCamelCase(String(a))
};
goog.style.toSelectorCase = function(a) {
    return goog.string.toSelectorCase(a)
};
goog.style.getOpacity = function(a) {
    var b = a.style;
    a = "";
    "opacity" in b ? a = b.opacity : "MozOpacity" in b ? a = b.MozOpacity : "filter" in b && (b = b.filter.match(/alpha\(opacity=([\d.]+)\)/)) && (a = String(b[1] / 100));
    return "" == a ? a : Number(a)
};
goog.style.setOpacity = function(a, b) {
    var c = a.style;
    "opacity" in c ? c.opacity = b : "MozOpacity" in c ? c.MozOpacity = b : "filter" in c && (c.filter = "" === b ? "" : "alpha(opacity=" + 100 * b + ")")
};
goog.style.setTransparentBackgroundImage = function(a, b) {
    var c = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? c.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + b + '", sizingMethod="crop")' : (c.backgroundImage = "url(" + b + ")", c.backgroundPosition = "top left", c.backgroundRepeat = "no-repeat")
};
goog.style.clearTransparentBackgroundImage = function(a) {
    a = a.style;
    "filter" in a ? a.filter = "" : a.backgroundImage = "none"
};
goog.style.showElement = function(a, b) {
    goog.style.setElementShown(a, b)
};
goog.style.setElementShown = function(a, b) {
    a.style.display = b ? "" : "none"
};
goog.style.isElementShown = function(a) {
    return "none" != a.style.display
};
goog.style.installStyles = function(a, b) {
    var c = goog.dom.getDomHelper(b),
        d = null,
        e = c.getDocument();
    goog.userAgent.IE && e.createStyleSheet ? (d = e.createStyleSheet(), goog.style.setStyles(d, a)) : (e = c.getElementsByTagNameAndClass("head")[0], e || (d = c.getElementsByTagNameAndClass("body")[0], e = c.createDom("head"), d.parentNode.insertBefore(e, d)), d = c.createDom("style"), goog.style.setStyles(d, a), c.appendChild(e, d));
    return d
};
goog.style.uninstallStyles = function(a) {
    goog.dom.removeNode(a.ownerNode || a.owningElement || a)
};
goog.style.setStyles = function(a, b) {
    goog.userAgent.IE ? a.cssText = b : a.innerHTML = b
};
goog.style.setPreWrap = function(a) {
    a = a.style;
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.whiteSpace = "pre", a.wordWrap = "break-word") : a.whiteSpace = goog.userAgent.GECKO ? "-moz-pre-wrap" : "pre-wrap"
};
goog.style.setInlineBlock = function(a) {
    a = a.style;
    a.position = "relative";
    goog.userAgent.IE && !goog.userAgent.isVersionOrHigher("8") ? (a.zoom = "1", a.display = "inline") : a.display = goog.userAgent.GECKO ? goog.userAgent.isVersionOrHigher("1.9a") ? "inline-block" : "-moz-inline-box" : "inline-block"
};
goog.style.isRightToLeft = function(a) {
    return "rtl" == goog.style.getStyle_(a, "direction")
};
goog.style.unselectableStyle_ = goog.userAgent.GECKO ? "MozUserSelect" : goog.userAgent.WEBKIT ? "WebkitUserSelect" : null;
goog.style.isUnselectable = function(a) {
    return goog.style.unselectableStyle_ ? "none" == a.style[goog.style.unselectableStyle_].toLowerCase() : goog.userAgent.IE || goog.userAgent.OPERA ? "on" == a.getAttribute("unselectable") : !1
};
goog.style.setUnselectable = function(a, b, c) {
    c = c ? null : a.getElementsByTagName("*");
    var d = goog.style.unselectableStyle_;
    if (d) {
        if (b = b ? "none" : "", a.style[d] = b, c) {
            a = 0;
            for (var e; e = c[a]; a++) e.style[d] = b
        }
    } else if (goog.userAgent.IE || goog.userAgent.OPERA)
        if (b = b ? "on" : "", a.setAttribute("unselectable", b), c)
            for (a = 0; e = c[a]; a++) e.setAttribute("unselectable", b)
};
goog.style.getBorderBoxSize = function(a) {
    return new goog.math.Size(a.offsetWidth, a.offsetHeight)
};
goog.style.setBorderBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "border-box");
    else if (c = a.style, d) {
        var d = goog.style.getPaddingBox(a),
            e = goog.style.getBorderBox(a);
        c.pixelWidth = b.width - e.left - d.left - d.right - e.right;
        c.pixelHeight = b.height - e.top - d.top - d.bottom - e.bottom
    } else c.pixelWidth = b.width, c.pixelHeight = b.height
};
goog.style.getContentBoxSize = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = goog.userAgent.IE && a.currentStyle;
    if (c && goog.dom.getDomHelper(b).isCss1CompatMode() && "auto" != c.width && "auto" != c.height && !c.boxSizing) return b = goog.style.getIePixelValue_(a, c.width, "width", "pixelWidth"), a = goog.style.getIePixelValue_(a, c.height, "height", "pixelHeight"), new goog.math.Size(b, a);
    c = goog.style.getBorderBoxSize(a);
    b = goog.style.getPaddingBox(a);
    a = goog.style.getBorderBox(a);
    return new goog.math.Size(c.width - a.left -
        b.left - b.right - a.right, c.height - a.top - b.top - b.bottom - a.bottom)
};
goog.style.setContentBoxSize = function(a, b) {
    var c = goog.dom.getOwnerDocument(a),
        d = goog.dom.getDomHelper(c).isCss1CompatMode();
    if (!goog.userAgent.IE || d && goog.userAgent.isVersionOrHigher("8")) goog.style.setBoxSizingSize_(a, b, "content-box");
    else if (c = a.style, d) c.pixelWidth = b.width, c.pixelHeight = b.height;
    else {
        var d = goog.style.getPaddingBox(a),
            e = goog.style.getBorderBox(a);
        c.pixelWidth = b.width + e.left + d.left + d.right + e.right;
        c.pixelHeight = b.height + e.top + d.top + d.bottom + e.bottom
    }
};
goog.style.setBoxSizingSize_ = function(a, b, c) {
    a = a.style;
    goog.userAgent.GECKO ? a.MozBoxSizing = c : goog.userAgent.WEBKIT ? a.WebkitBoxSizing = c : a.boxSizing = c;
    a.width = Math.max(b.width, 0) + "px";
    a.height = Math.max(b.height, 0) + "px"
};
goog.style.getIePixelValue_ = function(a, b, c, d) {
    if (/^\d+px?$/.test(b)) return parseInt(b, 10);
    var e = a.style[c],
        f = a.runtimeStyle[c];
    a.runtimeStyle[c] = a.currentStyle[c];
    a.style[c] = b;
    b = a.style[d];
    a.style[c] = e;
    a.runtimeStyle[c] = f;
    return b
};
goog.style.getIePixelDistance_ = function(a, b) {
    var c = goog.style.getCascadedStyle(a, b);
    return c ? goog.style.getIePixelValue_(a, c, "left", "pixelLeft") : 0
};
goog.style.getBox_ = function(a, b) {
    if (goog.userAgent.IE) {
        var c = goog.style.getIePixelDistance_(a, b + "Left"),
            d = goog.style.getIePixelDistance_(a, b + "Right"),
            e = goog.style.getIePixelDistance_(a, b + "Top"),
            f = goog.style.getIePixelDistance_(a, b + "Bottom");
        return new goog.math.Box(e, d, f, c)
    }
    c = goog.style.getComputedStyle(a, b + "Left");
    d = goog.style.getComputedStyle(a, b + "Right");
    e = goog.style.getComputedStyle(a, b + "Top");
    f = goog.style.getComputedStyle(a, b + "Bottom");
    return new goog.math.Box(parseFloat(e), parseFloat(d), parseFloat(f),
        parseFloat(c))
};
goog.style.getPaddingBox = function(a) {
    return goog.style.getBox_(a, "padding")
};
goog.style.getMarginBox = function(a) {
    return goog.style.getBox_(a, "margin")
};
goog.style.ieBorderWidthKeywords_ = {
    thin: 2,
    medium: 4,
    thick: 6
};
goog.style.getIePixelBorder_ = function(a, b) {
    if ("none" == goog.style.getCascadedStyle(a, b + "Style")) return 0;
    var c = goog.style.getCascadedStyle(a, b + "Width");
    return c in goog.style.ieBorderWidthKeywords_ ? goog.style.ieBorderWidthKeywords_[c] : goog.style.getIePixelValue_(a, c, "left", "pixelLeft")
};
goog.style.getBorderBox = function(a) {
    if (goog.userAgent.IE && !goog.userAgent.isDocumentModeOrHigher(9)) {
        var b = goog.style.getIePixelBorder_(a, "borderLeft"),
            c = goog.style.getIePixelBorder_(a, "borderRight"),
            d = goog.style.getIePixelBorder_(a, "borderTop");
        a = goog.style.getIePixelBorder_(a, "borderBottom");
        return new goog.math.Box(d, c, a, b)
    }
    b = goog.style.getComputedStyle(a, "borderLeftWidth");
    c = goog.style.getComputedStyle(a, "borderRightWidth");
    d = goog.style.getComputedStyle(a, "borderTopWidth");
    a = goog.style.getComputedStyle(a,
        "borderBottomWidth");
    return new goog.math.Box(parseFloat(d), parseFloat(c), parseFloat(a), parseFloat(b))
};
goog.style.getFontFamily = function(a) {
    var b = goog.dom.getOwnerDocument(a),
        c = "";
    if (b.body.createTextRange) {
        b = b.body.createTextRange();
        b.moveToElementText(a);
        try {
            c = b.queryCommandValue("FontName")
        } catch (d) {
            c = ""
        }
    }
    c || (c = goog.style.getStyle_(a, "fontFamily"));
    a = c.split(",");
    1 < a.length && (c = a[0]);
    return goog.string.stripQuotes(c, "\"'")
};
goog.style.lengthUnitRegex_ = /[^\d]+$/;
goog.style.getLengthUnits = function(a) {
    return (a = a.match(goog.style.lengthUnitRegex_)) && a[0] || null
};
goog.style.ABSOLUTE_CSS_LENGTH_UNITS_ = {
    cm: 1,
    "in": 1,
    mm: 1,
    pc: 1,
    pt: 1
};
goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_ = {
    em: 1,
    ex: 1
};
goog.style.getFontSize = function(a) {
    var b = goog.style.getStyle_(a, "fontSize"),
        c = goog.style.getLengthUnits(b);
    if (b && "px" == c) return parseInt(b, 10);
    if (goog.userAgent.IE) {
        if (c in goog.style.ABSOLUTE_CSS_LENGTH_UNITS_) return goog.style.getIePixelValue_(a, b, "left", "pixelLeft");
        if (a.parentNode && a.parentNode.nodeType == goog.dom.NodeType.ELEMENT && c in goog.style.CONVERTIBLE_RELATIVE_CSS_UNITS_) return a = a.parentNode, c = goog.style.getStyle_(a, "fontSize"), goog.style.getIePixelValue_(a, b == c ? "1em" : b, "left", "pixelLeft")
    }
    c =
        goog.dom.createDom("span", {
            style: "visibility:hidden;position:absolute;line-height:0;padding:0;margin:0;border:0;height:1em;"
        });
    goog.dom.appendChild(a, c);
    b = c.offsetHeight;
    goog.dom.removeNode(c);
    return b
};
goog.style.parseStyleAttribute = function(a) {
    var b = {};
    goog.array.forEach(a.split(/\s*;\s*/), function(a) {
        a = a.split(/\s*:\s*/);
        2 == a.length && (b[goog.string.toCamelCase(a[0].toLowerCase())] = a[1])
    });
    return b
};
goog.style.toStyleAttribute = function(a) {
    var b = [];
    goog.object.forEach(a, function(a, d) {
        b.push(goog.string.toSelectorCase(d), ":", a, ";")
    });
    return b.join("")
};
goog.style.setFloat = function(a, b) {
    a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] = b
};
goog.style.getFloat = function(a) {
    return a.style[goog.userAgent.IE ? "styleFloat" : "cssFloat"] || ""
};
goog.style.getScrollbarWidth = function(a) {
    var b = goog.dom.createElement("div");
    a && (b.className = a);
    b.style.cssText = "overflow:auto;position:absolute;top:0;width:100px;height:100px";
    a = goog.dom.createElement("div");
    goog.style.setSize(a, "200px", "200px");
    b.appendChild(a);
    goog.dom.appendChild(goog.dom.getDocument().body, b);
    a = b.offsetWidth - b.clientWidth;
    goog.dom.removeNode(b);
    return a
};
goog.style.MATRIX_TRANSLATION_REGEX_ = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
goog.style.getCssTranslation = function(a) {
    var b;
    goog.userAgent.IE ? b = "-ms-transform" : goog.userAgent.WEBKIT ? b = "-webkit-transform" : goog.userAgent.OPERA ? b = "-o-transform" : goog.userAgent.GECKO && (b = "-moz-transform");
    var c;
    b && (c = goog.style.getStyle_(a, b));
    c || (c = goog.style.getStyle_(a, "transform"));
    return c ? (a = c.match(goog.style.MATRIX_TRANSLATION_REGEX_)) ? new goog.math.Coordinate(parseFloat(a[1]), parseFloat(a[2])) : new goog.math.Coordinate(0, 0) : new goog.math.Coordinate(0, 0)
};
goog.disposable = {};
goog.disposable.IDisposable = function() {};
goog.Disposable = function() {
    goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF && (goog.Disposable.INCLUDE_STACK_ON_CREATION && (this.creationStack = Error().stack), goog.Disposable.instances_[goog.getUid(this)] = this)
};
goog.Disposable.MonitoringMode = {
    OFF: 0,
    PERMANENT: 1,
    INTERACTIVE: 2
};
goog.Disposable.MONITORING_MODE = 0;
goog.Disposable.INCLUDE_STACK_ON_CREATION = !0;
goog.Disposable.instances_ = {};
goog.Disposable.getUndisposedObjects = function() {
    var a = [],
        b;
    for (b in goog.Disposable.instances_) goog.Disposable.instances_.hasOwnProperty(b) && a.push(goog.Disposable.instances_[Number(b)]);
    return a
};
goog.Disposable.clearUndisposedObjects = function() {
    goog.Disposable.instances_ = {}
};
goog.Disposable.prototype.disposed_ = !1;
goog.Disposable.prototype.isDisposed = function() {
    return this.disposed_
};
goog.Disposable.prototype.getDisposed = goog.Disposable.prototype.isDisposed;
goog.Disposable.prototype.dispose = function() {
    if (!this.disposed_ && (this.disposed_ = !0, this.disposeInternal(), goog.Disposable.MONITORING_MODE != goog.Disposable.MonitoringMode.OFF)) {
        var a = goog.getUid(this);
        if (goog.Disposable.MONITORING_MODE == goog.Disposable.MonitoringMode.PERMANENT && !goog.Disposable.instances_.hasOwnProperty(a)) throw Error(this + " did not call the goog.Disposable base constructor or was disposed of after a clearUndisposedObjects call");
        delete goog.Disposable.instances_[a]
    }
};
goog.Disposable.prototype.registerDisposable = function(a) {
    this.addOnDisposeCallback(goog.partial(goog.dispose, a))
};
goog.Disposable.prototype.addOnDisposeCallback = function(a, b) {
    this.onDisposeCallbacks_ || (this.onDisposeCallbacks_ = []);
    this.onDisposeCallbacks_.push(goog.bind(a, b))
};
goog.Disposable.prototype.disposeInternal = function() {
    if (this.onDisposeCallbacks_)
        for (; this.onDisposeCallbacks_.length;) this.onDisposeCallbacks_.shift()()
};
goog.Disposable.isDisposed = function(a) {
    return a && "function" == typeof a.isDisposed ? a.isDisposed() : !1
};
goog.dispose = function(a) {
    a && "function" == typeof a.dispose && a.dispose()
};
goog.disposeAll = function(a) {
    for (var b = 0, c = arguments.length; b < c; ++b) {
        var d = arguments[b];
        goog.isArrayLike(d) ? goog.disposeAll.apply(null, d) : goog.dispose(d)
    }
};
goog.pubsub = {};
goog.pubsub.PubSub = function() {
    goog.Disposable.call(this);
    this.subscriptions_ = [];
    this.topics_ = {}
};
goog.inherits(goog.pubsub.PubSub, goog.Disposable);
goog.pubsub.PubSub.prototype.key_ = 1;
goog.pubsub.PubSub.prototype.publishDepth_ = 0;
goog.pubsub.PubSub.prototype.subscribe = function(a, b, c) {
    var d = this.topics_[a];
    d || (d = this.topics_[a] = []);
    var e = this.key_;
    this.subscriptions_[e] = a;
    this.subscriptions_[e + 1] = b;
    this.subscriptions_[e + 2] = c;
    this.key_ = e + 3;
    d.push(e);
    return e
};
goog.pubsub.PubSub.prototype.subscribeOnce = function(a, b, c) {
    var d = this.subscribe(a, function(a) {
        b.apply(c, arguments);
        this.unsubscribeByKey(d)
    }, this);
    return d
};
goog.pubsub.PubSub.prototype.unsubscribe = function(a, b, c) {
    if (a = this.topics_[a]) {
        var d = this.subscriptions_;
        if (a = goog.array.find(a, function(a) {
                return d[a + 1] == b && d[a + 2] == c
            })) return this.unsubscribeByKey(a)
    }
    return !1
};
goog.pubsub.PubSub.prototype.unsubscribeByKey = function(a) {
    if (0 != this.publishDepth_) return this.pendingKeys_ || (this.pendingKeys_ = []), this.pendingKeys_.push(a), !1;
    var b = this.subscriptions_[a];
    if (b) {
        var c = this.topics_[b];
        c && goog.array.remove(c, a);
        delete this.subscriptions_[a];
        delete this.subscriptions_[a + 1];
        delete this.subscriptions_[a + 2]
    }
    return !!b
};
goog.pubsub.PubSub.prototype.publish = function(a, b) {
    var c = this.topics_[a];
    if (c) {
        this.publishDepth_++;
        for (var d = goog.array.slice(arguments, 1), e = 0, f = c.length; e < f; e++) {
            var g = c[e];
            this.subscriptions_[g + 1].apply(this.subscriptions_[g + 2], d)
        }
        this.publishDepth_--;
        if (this.pendingKeys_ && 0 == this.publishDepth_)
            for (; c = this.pendingKeys_.pop();) this.unsubscribeByKey(c);
        return 0 != e
    }
    return !1
};
goog.pubsub.PubSub.prototype.clear = function(a) {
    if (a) {
        var b = this.topics_[a];
        b && (goog.array.forEach(b, this.unsubscribeByKey, this), delete this.topics_[a])
    } else this.subscriptions_.length = 0, this.topics_ = {}
};
goog.pubsub.PubSub.prototype.getCount = function(a) {
    if (a) {
        var b = this.topics_[a];
        return b ? b.length : 0
    }
    a = 0;
    for (b in this.topics_) a += this.getCount(b);
    return a
};
goog.pubsub.PubSub.prototype.disposeInternal = function() {
    goog.pubsub.PubSub.superClass_.disposeInternal.call(this);
    delete this.subscriptions_;
    delete this.topics_;
    delete this.pendingKeys_
};

/*
 * VPAID2 events
 */
var spotx = {
    "iab": {
        "VPAID": {
            "VPAID2": function() {},
            "VPAID2Event": {
                AD_LOADED: "AdLoaded",
                AD_STARTED: "AdStarted",
                AD_STOPPED: "AdStopped",
                AD_SKIPPED: "AdSkipped",
                AD_LINEAR_CHANGE: "AdLinearChange",
                AD_SIZE_CHANGE: "AdSizeChange",
                AD_EXPANDED_CHANGE: "AdExpandedChange",
                AD_SKIPPABLE_STATE_CHANGE: "AdSkippableStateChange",
                AD_REMAINING_TIME_CHANGE: "AdRemainingTimeChange",
                AD_DURATION_CHANGE: "AdDurationChange",
                AD_VOLUME_CHANGE: "AdVolumeChange",
                AD_IMPRESSION: "AdImpression",
                AD_VIDEO_START: "AdVideoStart",
                AD_VIDEO_FIRST_QUARTILE: "AdVideoFirstQuartile",
                AD_VIDEO_MIDPOINT: "AdVideoMidpoint",
                AD_VIDEO_THIRD_QUARTILE: "AdVideoThirdQuartile",
                AD_VIDEO_COMPLETE: "AdVideoComplete",
                AD_CLICKED: "AdClickThru",
                AD_INTERACTION: "AdInteraction",
                AD_USER_ACCEPT_INVITATION: "AdUserAcceptInvitation",
                AD_USER_MINIMIZE: "AdUserMinimize",
                AD_USER_CLOSE: "AdUserClose",
                AD_PAUSED: "AdPaused",
                AD_PLAYING: "AdPlaying",
                AD_LOG: "AdLog",
                AD_ERROR: "AdError"
            }
        }
    },
    "test": {}
};


spotx.iab.VPAID.VPAID2.prototype.handshakeVersion = function(a) {};
spotx.iab.VPAID.VPAID2.prototype.initAd = function(a, b, c, d, e, f) {};
spotx.iab.VPAID.VPAID2.prototype.resizeAd = function(a, b, c) {};
spotx.iab.VPAID.VPAID2.prototype.startAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.stopAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.pauseAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.resumeAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.expandAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.collapseAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.skipAd = function() {};
spotx.iab.VPAID.VPAID2.prototype.subscribe = function(a, b, c) {};
spotx.iab.VPAID.VPAID2.prototype.unsubscribe = function(a, b) {};
spotx.iab.VPAID.VPAID2.prototype.getAdLinear = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdWidth = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdHeight = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdExpanded = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdSkippableState = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdRemainingTime = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdDuration = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdVolume = function() {};
spotx.iab.VPAID.VPAID2.prototype.setAdVolume = function(a) {};
spotx.iab.VPAID.VPAID2.prototype.getAdCompanions = function() {};
spotx.iab.VPAID.VPAID2.prototype.getAdIcons = function() {};

/**
 * @constructor
 */
spotx.test.VPAIDAd = function() {
    this.aVPAIDVersion = "2.0";
    this.oPubSub = new goog.pubsub.PubSub

    // The slot is the div element on the main page that the ad is supposed to
    // occupy.
    this.slot_ = null;
    // The video slot is the video object that the creative can use to render the
    // video element it might have.
    this.videoSlot_ = null;
    // An object containing all registered events.  These events are all
    // callbacks from the vpaid ad.
    this.eventCallbacks_ = {};
    // A list of attributes getable and setable.
    this.attributes_ = {
        'companions' : '',
        'desiredBitrate' : 256,
        'duration' : 15,
        'expanded' : false,
        'height' : 0,
        'icons' : '',
        'linear' : true,
        'remainingTime' : 15,
        'skippableState' : false,
        'viewMode' : 'normal',
        'width' : 0,
        'volume' : 0.5
    };

    this.adDurationCountdownInterval = null;
    this.startAdRemainingTimeCountdown();

  /**
   * @type {number} An index into what quartile was last reported.
   * @private
   */
  this.lastQuartileIndex_ = 0;

  /**
   * A set of events to be reported.
   * @type {Object}
   * @private
   */
  this.quartileEvents_ = [
    {event: spotx.iab.VPAID.VPAID2Event.AD_IMPRESSION, value: 0},
    {event: spotx.iab.VPAID.VPAID2Event.AD_VIDEO_START, value: 0},
    {event: spotx.iab.VPAID.VPAID2Event.AD_VIDEO_FIRST_QUARTILE, value: 25},
    {event: spotx.iab.VPAID.VPAID2Event.AD_VIDEO_MIDPOINT, value: 50},
    {event: spotx.iab.VPAID.VPAID2Event.AD_VIDEO_THIRD_QUARTILE, value: 75},
    {event: spotx.iab.VPAID.VPAID2Event.AD_VIDEO_COMPLETE, value: 100}
  ];
};

spotx.test.VPAIDAd.prototype.startAdRemainingTimeCountdown = function() {
    var $this = this;
    clearInterval(this.adDurationCountdownInterval);
};

spotx.test.VPAIDAd.prototype.stopAdRemainingTimeCountdown = function() {
    clearInterval(this.adDurationCountdownInterval);
};

spotx.test.VPAIDAd.prototype.publish = function(a, b) {
    console.log("Test Ad :: Publishing " + a);
    this.oPubSub.publish(a, b)
};

/**
 * Html to populate into the ad.  This provides all UI elements for the ad.
 */
spotx.test.VPAIDAd.prototype.getAdTemplate = function() {
    var strRetval = '<div align="center" id="vpaidTemplateDiv" style="z-index:2; position:absolute; width:100%" onClick="event.stopPropagation()">' +
                        '<input id="playBtn" class="vpaidTemplateButtons" type="button" value="Play">' +
                        '<input id="pauseBtn" class="vpaidTemplateButtons" type="button" value="Pause">' +
                        '<input id="clickthruBtn" class="vpaidTemplateButtons" type="button" value="ClickThru">' + 
                        '<input id="muteBtn" class="vpaidTemplateButtons" type="button" value="Mute/Unmute">' + 
                        '<input id="stopBtn" class="vpaidTemplateButtons" type="button" value="Stop">' +
                        '<input id="skipBtn" class="vpaidTemplateButtons" type="button" value="Skip">' + 
                        '<input id="setSkippableBtn" class="vpaidTemplateButtons" type="button" value="Set Skippable">' + 
                        '<input id="interactionChangeBtn" class="vpaidTemplateButtons" type="button" value="Interaction">' + 
                        '<input id="errorChangeBtn" class="vpaidTemplateButtons" type="button" value="Error">' + 
                    '</div>';

    return strRetval;
};

/**
 * Add a style tag to style the VPAID buttons. 
 */
spotx.test.VPAIDAd.prototype.setTemplateStyle = function() {
    var styleBody = `.vpaidTemplateButtons {
        background-color: #8ec641;
        color: #1b9dd0;
        border: 2px solid #1b9dd0;
        text-align: center;
        font-size: 80%;
        width: 30%;
        font-family: "Lato", sans-serif;
        margin: 2px 2px 2px 2px;
        font-weight: bold;
    }`;

    var styleTag = document.createElement('style');
    styleTag.type = 'text/css';
    styleTag.appendChild(document.createTextNode(styleBody));
    document.head.appendChild(styleTag);
};

/**
 * VPAID defined init ad, initializes all attributes in the ad.  Ad will
 * not start until startAd is called.
 *
 * @param {number} width The ad width.
 * @param {number} height The ad heigth.
 * @param {string} viewMode The ad view mode.
 * @param {number} desiredBitrate The desired bitrate.
 * @param {Object} creativeData Data associated with the creative.
 * @param {Object} environmentVars Variables associated with the creative like
 *     the slot and video slot.
 */
spotx.test.VPAIDAd.prototype.initAd = function(
    width,
    height,
    viewMode,
    desiredBitrate,
    creativeData,
    environmentVars)
{
    var $this = this;
    // slot and videoSlot are passed as part of the environmentVars
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;
    this.attributes_['width'] = width;
    this.attributes_['height'] = height;
    this.attributes_['viewMode'] = viewMode;
    this.attributes_['desiredBitrate'] = desiredBitrate;

    this.renderSlot_();
    this.updateVideoSlot_();
    this.addButtonListeners_();

    this.aVpaidEventsToFire = [];

    if (environmentVars &&
        environmentVars.aFireVPAIDEventsFromAd &&
        goog.isArray(environmentVars.aFireVPAIDEventsFromAd))
    {
        goog.array.forEach(environmentVars.aFireVPAIDEventsFromAd, function(oVpaidEventToFire)
        {
            var iTimeoutID = setTimeout(function()
                {
                    $this.publish(oVpaidEventToFire.strEvent);
                },
                oVpaidEventToFire.iDelay);

            goog.array.insert(
                $this.aVpaidEventsToFire,
                iTimeoutID
            );
        });
    }

    this.publish(spotx.iab.VPAID.VPAID2Event.AD_LOADED)

    this.setupScrollListener_();
};

/**
 * Adds the videoSlot to the page if required and then sets the videoSlot src.
 * @private
 */
spotx.test.VPAIDAd.prototype.updateVideoSlot_ = function() {
    if (this.videoSlot_ === null) {
        this.videoSlot_ = document.createElement('video');
        this.videoSlot_.width = this.getAdWidth();
        this.videoSlot_.height = this.getAdHeight();
        goog.style.setStyle(this.videoSlot_, 'z-index', '0');
        goog.style.setStyle(this.videoSlot_, 'position', 'absolute');
        this.slot_.appendChild(this.videoSlot_);
    }
    if (this.videoSlot_.parentNode === null) {
        goog.style.setStyle(this.videoSlot_, 'z-index', '0');
        goog.style.setStyle(this.videoSlot_, 'position', 'absolute');
        this.slot_.appendChild(this.videoSlot_);
    }
    var foundSource = false;
    // We can pass the video and mimetype in via parameters if this line is used.
    // var videos = this.parameters_.videos || [];

    var videos = [{'url':'https://cdn.spotxcdn.com/website/integration_test/media/2017_q1/Video/SpotX_green_15_1366.mp4', 'mimetype':'video/mp4'}];
    for (var i = 0; i < videos.length; i++) {
        // Choose the first video with a supported mimetype.
        if (this.videoSlot_.canPlayType(videos[i].mimetype) != '') {
            this.videoSlot_.setAttribute('src', videos[i].url);
            foundSource = true;
            break;
        }
    }
    if (!foundSource) {
        // Unable to find a source video.
        this.publish(spotx.iab.VPAID.VPAID2Event.AD_ERROR);
    }

    // Add event listeners for the videoSlot
    this.videoSlot_.addEventListener(
        'timeupdate',
        this.timeUpdateHandler_.bind(this),
        false);
    this.videoSlot_.addEventListener(
        'ended',
        this.stopAd.bind(this),
        false);
};

/**
 * Populates the inner html of the slot.
 * @private
 */
spotx.test.VPAIDAd.prototype.renderSlot_ = function() {
    var slotExists = this.slot_ && this.slot_.tagName === 'DIV';
    if (!slotExists)
    {
        document.html && (goog.style.setStyle(document.html, "padding", 0), goog.style.setStyle(document.html, "margin", 0));
        document.body || (document.body = /**@type {HTMLDocument}*/ document.createElement("body"));
        goog.style.setStyle(document.body, "padding", 0);
        goog.style.setStyle(document.body, "margin", 0);

        this.slot_ = document.createElement('div');
        goog.style.setWidth(this.slot_, this.iWidth);
        goog.style.setHeight(this.slot_, this.iHeight);
        goog.style.setStyle(this.slot_, "background-color", "#e3e3e3");
        goog.style.setStyle(this.slot_, "top", "0");
        goog.style.setStyle(this.slot_, "left", "0");
        goog.style.setStyle(this.slot_, "position", "absolute");

        document.body.appendChild(this.slot_);
    }
    this.slot_.innerHTML = this.getAdTemplate();
    this.setTemplateStyle();
};

/**
 * Called by the video element.  Calls events as the video reaches times.
 * @private
 */
spotx.test.VPAIDAd.prototype.timeUpdateHandler_ = function() {
  this.attributes_['remainingTime'] =
      this.videoSlot_.duration - this.videoSlot_.currentTime;
  if (this.lastQuartileIndex_ >= this.quartileEvents_.length) {
    return;
  }
  var percentPlayed =
      this.videoSlot_.currentTime * 100.0 / this.videoSlot_.duration;
  if (percentPlayed >= this.quartileEvents_[this.lastQuartileIndex_].value) {
    var lastQuartileEvent = this.quartileEvents_[this.lastQuartileIndex_].event;
    this.publish(lastQuartileEvent);
    this.lastQuartileIndex_ += 1;
  }
  if (this.attributes_['duration'] != this.videoSlot_.duration) {
    this.attributes_['duration'] = this.videoSlot_.duration;
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_DURATION_CHANGE);
  }
};

/**
 * Adds listeners to all VPAID buttons.
 * @private
 */
spotx.test.VPAIDAd.prototype.addButtonListeners_ = function() { 
    var playBtn = this.getElement_('playBtn');
    playBtn.addEventListener('click', this.playButtonOnClick_.bind(this));

    var pauseBtn = this.getElement_('pauseBtn');
    pauseBtn.addEventListener('click', this.pauseButtonOnClick_.bind(this));

    var clickthruBtn = this.getElement_('clickthruBtn');
    clickthruBtn.addEventListener('click', this.clickThruButtonOnClick_.bind(this));

    var clickthruVideo = document.getElementsByTagName('body');
    clickthruVideo[0].addEventListener('click', this.clickThruButtonOnClick_.bind(this));

    var muteBtn = this.getElement_('muteBtn');
    muteBtn.addEventListener('click', this.muteButtonOnClick_.bind(this));

    var stopBtn = this.getElement_('stopBtn');
    stopBtn.addEventListener('click', this.stopButtonOnClick_.bind(this));

    var skipBtn = this.getElement_('skipBtn');
    skipBtn.addEventListener('click', this.skipButtonOnClick_.bind(this));

    var setSkippableBtn = this.getElement_('setSkippableBtn');
    setSkippableBtn.addEventListener('click', this.setSkippableButtonOnClick_.bind(this));

    var interactionChangeBtn = this.getElement_('interactionChangeBtn');
    interactionChangeBtn.addEventListener('click', this.interactionButtonOnClick_.bind(this));

    var errorChangeBtn = this.getElement_('errorChangeBtn');
    errorChangeBtn.addEventListener('click', this.errorButtonOnClick_.bind(this));
};

/**
 * Returns the versions of vpaid ad supported.
 * @param {string} version
 * @return {string}
 */
spotx.test.VPAIDAd.prototype.handshakeVersion = function(version) {
    return ('2.0');
};

/**
 * Called by the wrapper to start the ad.
 */
spotx.test.VPAIDAd.prototype.startAd = function() {
    this.videoSlot_.play();
    this.startAdRemainingTimeCountdown();
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_STARTED);
};

/**
 * Called by the wrapper to stop the ad.
 */
spotx.test.VPAIDAd.prototype.stopAd = function() {
    this.stopAdRemainingTimeCountdown();
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_STOPPED);
};

/**
 * @param {number} value The volume in percentage.
 */
spotx.test.VPAIDAd.prototype.setAdVolume = function(value) {
    this.attributes_['volume'] = value;
    this.videoSlot_.volume = value;
};

/**
 * @return {number} The volume of the ad.
 */
spotx.test.VPAIDAd.prototype.getAdVolume = function() {
    return this.attributes_['volume'];
};

/**
 * @param {number} width The new width.
 * @param {number} height A new height.
 * @param {string} viewMode A new view mode.
 */
spotx.test.VPAIDAd.prototype.resizeAd = function(width, height, viewMode) {
    this.attributes_['width'] = width;
    this.attributes_['height'] = height;
    this.attributes_['viewMode'] = viewMode;
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_SIZE_CHANGE);
};

/**
 * Pauses the ad.
 */
spotx.test.VPAIDAd.prototype.pauseAd = function() {
    this.videoSlot_.pause();
    this.stopAdRemainingTimeCountdown(); // mocks playing
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_PAUSED);
};

/**
 * Resumes the ad.
 */
spotx.test.VPAIDAd.prototype.resumeAd = function() {
    this.videoSlot_.play();
    this.startAdRemainingTimeCountdown(); // mocks playing
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_PLAYING);
};

/**
 * Expands the ad.
 */
spotx.test.VPAIDAd.prototype.expandAd = function() {
    this.attributes_['expanded'] = true;
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_EXPANDED_CHANGE);
};

/**
 * Returns true if the ad is expanded.
 *
 * @return {boolean}
 */
spotx.test.VPAIDAd.prototype.getAdExpanded = function() {
    return this.attributes_['expanded'];
};

/**
 * Returns the skippable state of the ad.
 *
 * @return {boolean}
 */
spotx.test.VPAIDAd.prototype.getAdSkippableState = function() {
    return this.attributes_['skippableState'];
};

/**
 * Collapses the ad.
 */
spotx.test.VPAIDAd.prototype.collapseAd = function() {
    this.attributes_['expanded'] = false;
};

/**
 * Skips the ad.
 */
spotx.test.VPAIDAd.prototype.skipAd = function() {
    var skippableState = this.attributes_['skippableState'];
    if (skippableState) {
        this.publish(spotx.iab.VPAID.VPAID2Event.AD_SKIPPED);
    }
};

/**
 * Registers a callback for an event.
 * @param {Function} aCallback The callback function.
 * @param {string} eventName The callback type.
 * @param {Object} aContext The context for the callback.
 */
spotx.test.VPAIDAd.prototype.subscribe = function(a, b, c) {
    c && (a = goog.bind(a, c));
    this.oPubSub.subscribe(b, a, c)
};

/**
 * Removes a callback based on the eventName.
 */
spotx.test.VPAIDAd.prototype.unsubscribe = function(a, b, c) {
    this.oPubSub.unsubscribe(b, a, c)
};

/**
 * @return {number} The ad width.
 */
spotx.test.VPAIDAd.prototype.getAdWidth = function() {
    return this.attributes_['width'];
};

/**
 * @return {number} The ad height.
 */
spotx.test.VPAIDAd.prototype.getAdHeight = function() {
    return this.attributes_['height'];
};

/**
 * @return {number} The time remaining in the ad.
 */
spotx.test.VPAIDAd.prototype.getAdRemainingTime = function() {
    return this.attributes_['remainingTime'];
};

/**
 * @return {number} The duration of the ad.
 */
spotx.test.VPAIDAd.prototype.getAdDuration = function() {
    return this.attributes_['duration'];
};

/**
 * @return {string} List of companions in vast xml.
 */
spotx.test.VPAIDAd.prototype.getAdCompanions = function() {
    return this.attributes_['companions'];
};

/**
 * @return {string} A list of icons.
 */
spotx.test.VPAIDAd.prototype.getAdIcons = function() {
    return this.attributes_['icons'];
};

/**
 * @return {boolean} True if the ad is a linear, false for non linear.
 */
spotx.test.VPAIDAd.prototype.getAdLinear = function() {
    return this.attributes_['linear'];
};

/**
 * Updates the VPAID button template when there is a change.
 */
spotx.test.VPAIDAd.prototype.updateTemplate = function() {
    this.slot_.innerHTML = this.getAdTemplate();
    if (this.videoSlot_.parentNode === null) {
        this.slot_.appendChild(this.videoSlot_);
    }
    this.addButtonListeners_();
};

/**
 * Callback for when the mute button is clicked.
 * @private
 */
spotx.test.VPAIDAd.prototype.muteButtonOnClick_ = function() {
    if (this.getAdVolume() === 0) {
        this.setAdVolume(1.0)
    } else {
        this.setAdVolume(0.0)
    }
};

/**
 * Callback for Click Thru button and video.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.clickThruButtonOnClick_ = function() {
    window.open('https://spotx.tv', '_blank');
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_CLICKED);
};

/**
 * Callback for VPAID Play button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.playButtonOnClick_ = function() {
    this.resumeAd();
};

/**
 * Callback for VPAID Pause button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.pauseButtonOnClick_ = function() {
    this.pauseAd();
};

/**
 * Callback for VPAID Stop button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.stopButtonOnClick_ = function() {
    this.stopAd();
};

/**
 * Callback for VPAID Skip button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.skipButtonOnClick_ = function() {
    this.skipAd();
};

/**
 * Callback for VPAID Set Skippable button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.setSkippableButtonOnClick_ = function() {
    this.attributes_['skippableState'] = true;
    this.updateTemplate();
};

/**
 * Callback for VPAID Interaction button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.interactionButtonOnClick_ = function() {
    this.videoSlot_.pause();
    var interactiveImage = document.createElement('img');
    interactiveImage.height = (this.getAdHeight() / 2);
    interactiveImage.width = (this.getAdWidth() / 2);
    interactiveImage.src = 'https://www.spotx.tv/wp-content/uploads/preloader.png'
    interactiveImage.id = 'interactiveImage';

    var vpaidTemplateDiv = document.getElementById('vpaidTemplateDiv');
    vpaidTemplateDiv.appendChild(interactiveImage);

    var interactiveElement = this.getElement_("interactiveImage");
    interactiveElement.addEventListener('click', this.interactionElementHandler_.bind(this));
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_INTERACTION);
};

/**
 * Callback for VPAID Interaction.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.interactionElementHandler_ = function() {
    this.updateTemplate();
    this.videoSlot_.play();
}

/**
 * Callback for VPAID Error button.
 *
 * @private
 */
spotx.test.VPAIDAd.prototype.errorButtonOnClick_ = function() {
    this.publish(spotx.iab.VPAID.VPAID2Event.AD_ERROR);
};

/**
 * Gets an element by its name.
 *
 * @return {?Element}
 * @private
 */
spotx.test.VPAIDAd.prototype.getElement_ = function(key) {
    var element = document.getElementById(key);
    if (element != null) {
        return element;
    }
    try {
        var element = parent.document.getElementById(key);
    } catch(e) {
        return null;
    }
    return element;
};

/**
 * Add scroll listeners.
 * @private
 */
spotx.test.VPAIDAd.prototype.setupScrollListener_ = function() {
    try {
        window.parent.addEventListener("scroll", this.logPercentVisible_.bind(this));
    } catch(e) {
        // If we're not in a friendly iframe do no action.
    }
};

/**
 * Printss the percent of the ad that is visible. If
 * the iframe is not friendly it sends an error.
 * @return {boolean}
 * @private
 */
spotx.test.VPAIDAd.prototype.logPercentVisible_ = function() {
    try {
        var slot = this.slot_;
        var rect = slot.getBoundingClientRect();
        var right = Math.min(rect.left + slot.offsetWidth,
            window.parent.pageXOffset + window.parent.innerWidth);
        var left = Math.max(rect.left, window.parent.pageXOffset);
        var width = window.parent.innerWidth ||
            window.parent.document.documentElement.clientWidth ||
            window.parent.document.body.clientWidth;
        var height = window.parent.innerHeight ||
            window.parent.document.documentElement.clientHeight ||
            window.parent.document.body.clientHeight;
        var top = rect.top < 0 ? 0 : Math.min(rect.top, width);
        var bottom = rect.bottom < 0 ? 0 : Math.min(rect.bottom, height);
        var percentage = 0;
        var visibleY = bottom - top;
        var visibleX = right - left;
        if (visibleY > 0 && visibleX > 0) {
            var elementSize = slot.offsetWidth * slot.offsetHeight;
            if (elementSize != 0) {
                percentage = Math.round(
                    (visibleX * visibleY) * 100 / elementSize);
            }
        }
        this.getElement_('percentVisible').textContent = percentage;
        //this.ping_('www.example.com/percentvisible?total=' + percentage);
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * Main function called by wrapper to get the vpaid ad.
 *
 * @return {Object}
 */
var getVPAIDAd = function() {
    return new spotx.test.VPAIDAd();
};