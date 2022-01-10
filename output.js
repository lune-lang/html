var Char = {}; var IO = {}; var $Math = {}; var Prelude = {}; var Spa = {}; var Spa_Element = {}; var Spa_Event = {}; var $String = {}; var Program = {}; var Variant = {}; var List = {}; var Main = {}; var Result = {}; var Spa_Property = {}; 
Spa.Internal = {
  m: undefined,
  state: undefined
};

Spa["application"] = function(init) {
  return function(url) {
    return function(routes) {
      return function() {
        if(Spa.Internal.state === undefined) {
          Spa.Internal.state = init;
          var obj = Spa["addRoutes"](routes)({});
          Spa.Internal.m.route(document.body, url, obj);
        }
      };
    };
  };
};

Spa["addComponent"] = function(url) {
  return function(start) {
    return function(view) {
      return function(obj) {
        obj[url] = {
          oninit: function() {
            Spa.Internal.state = Prelude["?"]("Set")
              (start(Spa.Internal.state)());
          },
          view: function() {
            return view(Spa.Internal.state);
          }
        };
        return obj;
      };
    };
  };
};

Spa["setTitleIO"] = function(title) {
  return function() {
    document.title = title;
  };
};

//MITHRIL WEB FRAMEWORK (mithril.js.org)

(function() {
"use strict"
function Vnode(tag, key, attrs0, children0, text, dom) {
	return {tag: tag, key: key, attrs: attrs0, children: children0, text: text, dom: dom, domSize: undefined, state: undefined, events: undefined, instance: undefined}
}
Vnode.normalize = function(node) {
	if (Array.isArray(node)) return Vnode("[", undefined, undefined, Vnode.normalizeChildren(node), undefined, undefined)
	if (node == null || typeof node === "boolean") return null
	if (typeof node === "object") return node
	return Vnode("#", undefined, undefined, String(node), undefined, undefined)
}
Vnode.normalizeChildren = function(input) {
	var children0 = []
	if (input.length) {
		var isKeyed = input[0] != null && input[0].key != null
		// Note: this is a *very* perf-sensitive check.
		// Fun fact: merging the loop like this is somehow faster than splitting
		// it, noticeably so.
		for (var i = 1; i < input.length; i++) {
			if ((input[i] != null && input[i].key != null) !== isKeyed) {
				throw new TypeError("Vnodes must either always have keys or never have keys!")
			}
		}
		for (var i = 0; i < input.length; i++) {
			children0[i] = Vnode.normalize(input[i])
		}
	}
	return children0
}
// Call via `hyperscriptVnode0.apply(startOffset, arguments)`
//
// The reason I do it this way, forwarding the arguments and passing the start
// offset in `this`, is so I don't have to create a temporary array in a
// performance-critical path.
//
// In native ES6, I'd instead add a final `...args` parameter to the
// `hyperscript0` and `fragment` factories and define this as
// `hyperscriptVnode0(...args)`, since modern engines do optimize that away. But
// ES5 (what Mithril requires thanks to IE support) doesn't give me that luxury,
// and engines aren't nearly intelligent enough to do either of these:
//
// 1. Elide the allocation for `[].slice.call(arguments, 1)` when it's passed to
//    another function only to be indexed.
// 2. Elide an `arguments` allocation when it's passed to any function other
//    than `Function.prototype.apply` or `Reflect.apply`.
//
// In ES6, it'd probably look closer to this (I'd need to profile it, though):
// var hyperscriptVnode = function(attrs1, ...children1) {
//     if (attrs1 == null || typeof attrs1 === "object" && attrs1.tag == null && !Array.isArray(attrs1)) {
//         if (children1.length === 1 && Array.isArray(children1[0])) children1 = children1[0]
//     } else {
//         children1 = children1.length === 0 && Array.isArray(attrs1) ? attrs1 : [attrs1, ...children1]
//         attrs1 = undefined
//     }
//
//     if (attrs1 == null) attrs1 = {}
//     return Vnode("", attrs1.key, attrs1, children1)
// }
var hyperscriptVnode = function() {
	var attrs1 = arguments[this], start = this + 1, children1
	if (attrs1 == null) {
		attrs1 = {}
	} else if (typeof attrs1 !== "object" || attrs1.tag != null || Array.isArray(attrs1)) {
		attrs1 = {}
		start = this
	}
	if (arguments.length === start + 1) {
		children1 = arguments[start]
		if (!Array.isArray(children1)) children1 = [children1]
	} else {
		children1 = []
		while (start < arguments.length) children1.push(arguments[start++])
	}
	return Vnode("", attrs1.key, attrs1, children1)
}
var selectorParser = /(?:(^|#|\.)([^#\.\[\]]+))|(\[(.+?)(?:\s*=\s*("|'|)((?:\\["'\]]|.)*?)\5)?\])/g
var selectorCache = {}
var hasOwn = {}.hasOwnProperty
function isEmpty(object) {
	for (var key in object) if (hasOwn.call(object, key)) return false
	return true
}
function compileSelector(selector) {
	var match, tag = "div", classes = [], attrs = {}
	while (match = selectorParser.exec(selector)) {
		var type = match[1], value = match[2]
		if (type === "" && value !== "") tag = value
		else if (type === "#") attrs.id = value
		else if (type === ".") classes.push(value)
		else if (match[3][0] === "[") {
			var attrValue = match[6]
			if (attrValue) attrValue = attrValue.replace(/\\(["'])/g, "$1").replace(/\\\\/g, "\\")
			if (match[4] === "class") classes.push(attrValue)
			else attrs[match[4]] = attrValue === "" ? attrValue : attrValue || true
		}
	}
	if (classes.length > 0) attrs.className = classes.join(" ")
	return selectorCache[selector] = {tag: tag, attrs: attrs}
}
function execSelector(state, vnode) {
	var attrs = vnode.attrs
	var children = Vnode.normalizeChildren(vnode.children)
	var hasClass = hasOwn.call(attrs, "class")
	var className = hasClass ? attrs.class : attrs.className
	vnode.tag = state.tag
	vnode.attrs = null
	vnode.children = undefined
	if (!isEmpty(state.attrs) && !isEmpty(attrs)) {
		var newAttrs = {}
		for (var key in attrs) {
			if (hasOwn.call(attrs, key)) newAttrs[key] = attrs[key]
		}
		attrs = newAttrs
	}
	for (var key in state.attrs) {
		if (hasOwn.call(state.attrs, key) && key !== "className" && !hasOwn.call(attrs, key)){
			attrs[key] = state.attrs[key]
		}
	}
	if (className != null || state.attrs.className != null) attrs.className =
		className != null
			? state.attrs.className != null
				? String(state.attrs.className) + " " + String(className)
				: className
			: state.attrs.className != null
				? state.attrs.className
				: null
	if (hasClass) attrs.class = null
	for (var key in attrs) {
		if (hasOwn.call(attrs, key) && key !== "key") {
			vnode.attrs = attrs
			break
		}
	}
	if (Array.isArray(children) && children.length === 1 && children[0] != null && children[0].tag === "#") {
		vnode.text = children[0].children
	} else {
		vnode.children = children
	}
	return vnode
}
function hyperscript(selector) {
	if (selector == null || typeof selector !== "string" && typeof selector !== "function" && typeof selector.view !== "function") {
		throw Error("The selector must be either a string or a component.");
	}
	var vnode = hyperscriptVnode.apply(1, arguments)
	if (typeof selector === "string") {
		vnode.children = Vnode.normalizeChildren(vnode.children)
		if (selector !== "[") return execSelector(selectorCache[selector] || compileSelector(selector), vnode)
	}
	vnode.tag = selector
	return vnode
}
hyperscript.trust = function(html) {
	if (html == null) html = ""
	return Vnode("<", undefined, undefined, html, undefined, undefined)
}
hyperscript.fragment = function() {
	var vnode2 = hyperscriptVnode.apply(0, arguments)
	vnode2.tag = "["
	vnode2.children = Vnode.normalizeChildren(vnode2.children)
	return vnode2
}
/** @constructor */
var PromisePolyfill = function(executor) {
	if (!(this instanceof PromisePolyfill)) throw new Error("Promise must be called with `new`")
	if (typeof executor !== "function") throw new TypeError("executor must be a function")
	var self = this, resolvers = [], rejectors = [], resolveCurrent = handler(resolvers, true), rejectCurrent = handler(rejectors, false)
	var instance = self._instance = {resolvers: resolvers, rejectors: rejectors}
	var callAsync = typeof setImmediate === "function" ? setImmediate : setTimeout
	function handler(list, shouldAbsorb) {
		return function execute(value) {
			var then
			try {
				if (shouldAbsorb && value != null && (typeof value === "object" || typeof value === "function") && typeof (then = value.then) === "function") {
					if (value === self) throw new TypeError("Promise can't be resolved w/ itself")
					executeOnce(then.bind(value))
				}
				else {
					callAsync(function() {
						if (!shouldAbsorb && list.length === 0) console.error("Possible unhandled promise rejection:", value)
						for (var i = 0; i < list.length; i++) list[i](value)
						resolvers.length = 0, rejectors.length = 0
						instance.state = shouldAbsorb
						instance.retry = function() {execute(value)}
					})
				}
			}
			catch (e) {
				rejectCurrent(e)
			}
		}
	}
	function executeOnce(then) {
		var runs = 0
		function run(fn) {
			return function(value) {
				if (runs++ > 0) return
				fn(value)
			}
		}
		var onerror = run(rejectCurrent)
		try {then(run(resolveCurrent), onerror)} catch (e) {onerror(e)}
	}
	executeOnce(executor)
}
PromisePolyfill.prototype.then = function(onFulfilled, onRejection) {
	var self = this, instance = self._instance
	function handle(callback, list, next, state) {
		list.push(function(value) {
			if (typeof callback !== "function") next(value)
			else try {resolveNext(callback(value))} catch (e) {if (rejectNext) rejectNext(e)}
		})
		if (typeof instance.retry === "function" && state === instance.state) instance.retry()
	}
	var resolveNext, rejectNext
	var promise = new PromisePolyfill(function(resolve, reject) {resolveNext = resolve, rejectNext = reject})
	handle(onFulfilled, instance.resolvers, resolveNext, true), handle(onRejection, instance.rejectors, rejectNext, false)
	return promise
}
PromisePolyfill.prototype.catch = function(onRejection) {
	return this.then(null, onRejection)
}
PromisePolyfill.prototype.finally = function(callback) {
	return this.then(
		function(value) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return value
			})
		},
		function(reason) {
			return PromisePolyfill.resolve(callback()).then(function() {
				return PromisePolyfill.reject(reason);
			})
		}
	)
}
PromisePolyfill.resolve = function(value) {
	if (value instanceof PromisePolyfill) return value
	return new PromisePolyfill(function(resolve) {resolve(value)})
}
PromisePolyfill.reject = function(value) {
	return new PromisePolyfill(function(resolve, reject) {reject(value)})
}
PromisePolyfill.all = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		var total = list.length, count = 0, values = []
		if (list.length === 0) resolve([])
		else for (var i = 0; i < list.length; i++) {
			(function(i) {
				function consume(value) {
					count++
					values[i] = value
					if (count === total) resolve(values)
				}
				if (list[i] != null && (typeof list[i] === "object" || typeof list[i] === "function") && typeof list[i].then === "function") {
					list[i].then(consume, reject)
				}
				else consume(list[i])
			})(i)
		}
	})
}
PromisePolyfill.race = function(list) {
	return new PromisePolyfill(function(resolve, reject) {
		for (var i = 0; i < list.length; i++) {
			list[i].then(resolve, reject)
		}
	})
}
if (typeof window !== "undefined") {
	if (typeof window.Promise === "undefined") {
		window.Promise = PromisePolyfill
	} else if (!window.Promise.prototype.finally) {
		window.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	var PromisePolyfill = window.Promise
} else if (typeof global !== "undefined") {
	if (typeof global.Promise === "undefined") {
		global.Promise = PromisePolyfill
	} else if (!global.Promise.prototype.finally) {
		global.Promise.prototype.finally = PromisePolyfill.prototype.finally
	}
	var PromisePolyfill = global.Promise
} else {
}
var _12 = function($window) {
	var $doc = $window && $window.document
	var currentRedraw
	var nameSpace = {
		svg: "http://www.w3.org/2000/svg",
		math: "http://www.w3.org/1998/Math/MathML"
	}
	function getNameSpace(vnode3) {
		return vnode3.attrs && vnode3.attrs.xmlns || nameSpace[vnode3.tag]
	}
	//sanity check to discourage people from doing `vnode3.state = ...`
	function checkState(vnode3, original) {
		if (vnode3.state !== original) throw new Error("`vnode.state` must not be modified")
	}
	//Note: the hook is passed as the `this` argument to allow proxying the
	//arguments without requiring a full array allocation to do so. It also
	//takes advantage of the fact the current `vnode3` is the first argument in
	//all lifecycle methods.
	function callHook(vnode3) {
		var original = vnode3.state
		try {
			return this.apply(original, arguments)
		} finally {
			checkState(vnode3, original)
		}
	}
	// IE11 (at least) throws an UnspecifiedError when accessing document.activeElement when
	// inside an iframe. Catch and swallow this error, and heavy-handidly return null.
	function activeElement() {
		try {
			return $doc.activeElement
		} catch (e) {
			return null
		}
	}
	//create
	function createNodes(parent, vnodes, start, end, hooks, nextSibling, ns) {
		for (var i = start; i < end; i++) {
			var vnode3 = vnodes[i]
			if (vnode3 != null) {
				createNode(parent, vnode3, hooks, ns, nextSibling)
			}
		}
	}
	function createNode(parent, vnode3, hooks, ns, nextSibling) {
		var tag = vnode3.tag
		if (typeof tag === "string") {
			vnode3.state = {}
			if (vnode3.attrs != null) initLifecycle(vnode3.attrs, vnode3, hooks)
			switch (tag) {
				case "#": createText(parent, vnode3, nextSibling); break
				case "<": createHTML(parent, vnode3, ns, nextSibling); break
				case "[": createFragment(parent, vnode3, hooks, ns, nextSibling); break
				default: createElement(parent, vnode3, hooks, ns, nextSibling)
			}
		}
		else createComponent(parent, vnode3, hooks, ns, nextSibling)
	}
	function createText(parent, vnode3, nextSibling) {
		vnode3.dom = $doc.createTextNode(vnode3.children)
		insertNode(parent, vnode3.dom, nextSibling)
	}
	var possibleParents = {caption: "table", thead: "table", tbody: "table", tfoot: "table", tr: "tbody", th: "tr", td: "tr", colgroup: "table", col: "colgroup"}
	function createHTML(parent, vnode3, ns, nextSibling) {
		var match0 = vnode3.children.match(/^\s*?<(\w+)/im) || []
		// not using the proper parent makes the child element(s) vanish.
		//     var div = document.createElement("div")
		//     div.innerHTML = "<td>i</td><td>j</td>"
		//     console.log(div.innerHTML)
		// --> "ij", no <td> in sight.
		var temp = $doc.createElement(possibleParents[match0[1]] || "div")
		if (ns === "http://www.w3.org/2000/svg") {
			temp.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\">" + vnode3.children + "</svg>"
			temp = temp.firstChild
		} else {
			temp.innerHTML = vnode3.children
		}
		vnode3.dom = temp.firstChild
		vnode3.domSize = temp.childNodes.length
		// Capture nodes to remove, so we don't confuse them.
		vnode3.instance = []
		var fragment = $doc.createDocumentFragment()
		var child
		while (child = temp.firstChild) {
			vnode3.instance.push(child)
			fragment.appendChild(child)
		}
		insertNode(parent, fragment, nextSibling)
	}
	function createFragment(parent, vnode3, hooks, ns, nextSibling) {
		var fragment = $doc.createDocumentFragment()
		if (vnode3.children != null) {
			var children3 = vnode3.children
			createNodes(fragment, children3, 0, children3.length, hooks, null, ns)
		}
		vnode3.dom = fragment.firstChild
		vnode3.domSize = fragment.childNodes.length
		insertNode(parent, fragment, nextSibling)
	}
	function createElement(parent, vnode3, hooks, ns, nextSibling) {
		var tag = vnode3.tag
		var attrs2 = vnode3.attrs
		var is = attrs2 && attrs2.is
		ns = getNameSpace(vnode3) || ns
		var element = ns ?
			is ? $doc.createElementNS(ns, tag, {is: is}) : $doc.createElementNS(ns, tag) :
			is ? $doc.createElement(tag, {is: is}) : $doc.createElement(tag)
		vnode3.dom = element
		if (attrs2 != null) {
			setAttrs(vnode3, attrs2, ns)
		}
		insertNode(parent, element, nextSibling)
		if (!maybeSetContentEditable(vnode3)) {
			if (vnode3.text != null) {
				if (vnode3.text !== "") element.textContent = vnode3.text
				else vnode3.children = [Vnode("#", undefined, undefined, vnode3.text, undefined, undefined)]
			}
			if (vnode3.children != null) {
				var children3 = vnode3.children
				createNodes(element, children3, 0, children3.length, hooks, null, ns)
				if (vnode3.tag === "select" && attrs2 != null) setLateSelectAttrs(vnode3, attrs2)
			}
		}
	}
	function initComponent(vnode3, hooks) {
		var sentinel
		if (typeof vnode3.tag.view === "function") {
			vnode3.state = Object.create(vnode3.tag)
			sentinel = vnode3.state.view
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
		} else {
			vnode3.state = void 0
			sentinel = vnode3.tag
			if (sentinel.$$reentrantLock$$ != null) return
			sentinel.$$reentrantLock$$ = true
			vnode3.state = (vnode3.tag.prototype != null && typeof vnode3.tag.prototype.view === "function") ? new vnode3.tag(vnode3) : vnode3.tag(vnode3)
		}
		initLifecycle(vnode3.state, vnode3, hooks)
		if (vnode3.attrs != null) initLifecycle(vnode3.attrs, vnode3, hooks)
		vnode3.instance = Vnode.normalize(callHook.call(vnode3.state.view, vnode3))
		if (vnode3.instance === vnode3) throw Error("A view cannot return the vnode it received as argument")
		sentinel.$$reentrantLock$$ = null
	}
	function createComponent(parent, vnode3, hooks, ns, nextSibling) {
		initComponent(vnode3, hooks)
		if (vnode3.instance != null) {
			createNode(parent, vnode3.instance, hooks, ns, nextSibling)
			vnode3.dom = vnode3.instance.dom
			vnode3.domSize = vnode3.dom != null ? vnode3.instance.domSize : 0
		}
		else {
			vnode3.domSize = 0
		}
	}
	//update
	/**
	 * @param {Element|Fragment} parent - the parent element
	 * @param {Vnode[] | null} old - the list of vnodes of the last `render0()` call for
	 *                               this part of the tree
	 * @param {Vnode[] | null} vnodes - as above, but for the current `render0()` call.
	 * @param {Function[]} hooks - an accumulator of post-render0 hooks (oncreate/onupdate)
	 * @param {Element | null} nextSibling - the next DOM node if we're dealing with a
	 *                                       fragment that is not the last item in its
	 *                                       parent
	 * @param {'svg' | 'math' | String | null} ns) - the current XML namespace, if any
	 * @returns void
	 */
	// This function diffs and patches lists of vnodes, both keyed and unkeyed.
	//
	// We will:
	//
	// 1. describe its general structure
	// 2. focus on the diff algorithm optimizations
	// 3. discuss DOM node operations.
	// ## Overview:
	//
	// The updateNodes() function:
	// - deals with trivial cases
	// - determines whether the lists are keyed or unkeyed based on the first non-null node
	//   of each list.
	// - diffs them and patches the DOM if needed (that's the brunt of the code)
	// - manages the leftovers: after diffing, are there:
	//   - old nodes left to remove?
	// 	 - new nodes to insert?
	// 	 deal with them!
	//
	// The lists are only iterated over once, with an exception for the nodes in `old` that
	// are visited in the fourth part of the diff and in the `removeNodes` loop.
	// ## Diffing
	//
	// Reading https://github.com/localvoid/ivi/blob/ddc09d06abaef45248e6133f7040d00d3c6be853/packages/ivi/src/vdom/implementation.ts#L617-L837
	// may be good for context on longest increasing subsequence-based logic for moving nodes.
	//
	// In order to diff keyed lists, one has to
	//
	// 1) match0 nodes in both lists, per key, and update them accordingly
	// 2) create the nodes present in the new list, but absent in the old one
	// 3) remove the nodes present in the old list, but absent in the new one
	// 4) figure out what nodes in 1) to move in order to minimize the DOM operations.
	//
	// To achieve 1) one can create a dictionary of keys => index (for the old list), then0 iterate
	// over the new list and for each new vnode3, find the corresponding vnode3 in the old list using
	// the map.
	// 2) is achieved in the same step: if a new node has no corresponding entry in the map, it is new
	// and must be created.
	// For the removals, we actually remove the nodes that have been updated from the old list.
	// The nodes that remain in that list after 1) and 2) have been performed can be safely removed.
	// The fourth step is a bit more complex and relies on the longest increasing subsequence (LIS)
	// algorithm.
	//
	// the longest increasing subsequence is the list of nodes that can remain in place. Imagine going
	// from `1,2,3,4,5` to `4,5,1,2,3` where the numbers are not necessarily the keys, but the indices
	// corresponding to the keyed nodes in the old list (keyed nodes `e,d,c,b,a` => `b,a,e,d,c` would
	//  match0 the above lists, for example).
	//
	// In there are two increasing subsequences: `4,5` and `1,2,3`, the latter being the longest. We
	// can update those nodes without moving them, and only call `insertNode` on `4` and `5`.
	//
	// @localvoid adapted the algo to also support node deletions and insertions (the `lis` is actually
	// the longest increasing subsequence *of old nodes still present in the new list*).
	//
	// It is a general algorithm that is fireproof in all circumstances, but it requires the allocation
	// and the construction of a `key => oldIndex` map, and three arrays (one with `newIndex => oldIndex`,
	// the `LIS` and a temporary one to create the LIS).
	//
	// So we cheat where we can: if the tails of the lists are identical, they are guaranteed to be part of
	// the LIS and can be updated without moving them.
	//
	// If two nodes are swapped, they are guaranteed not to be part of the LIS, and must be moved (with
	// the exception of the last node if the list is fully reversed).
	//
	// ## Finding the next sibling.
	//
	// `updateNode()` and `createNode()` expect a nextSibling parameter to perform DOM operations.
	// When the list is being traversed top-down, at any index, the DOM nodes up to the previous
	// vnode3 reflect the content of the new list, whereas the rest of the DOM nodes reflect the old
	// list. The next sibling must be looked for in the old list using `getNextSibling(... oldStart + 1 ...)`.
	//
	// In the other scenarios (swaps, upwards traversal, map-based diff),
	// the new vnodes list is traversed upwards. The DOM nodes at the bottom of the list reflect the
	// bottom part of the new vnodes list, and we can use the `v.dom`  value of the previous node
	// as the next sibling (cached in the `nextSibling` variable).
	// ## DOM node moves
	//
	// In most scenarios `updateNode()` and `createNode()` perform the DOM operations. However,
	// this is not the case if the node moved (second and fourth part of the diff algo). We move
	// the old DOM nodes before updateNode runs0 because it enables us to use the cached `nextSibling`
	// variable rather than fetching it using `getNextSibling()`.
	//
	// The fourth part of the diff currently inserts nodes unconditionally, leading to issues
	// like #1791 and #1999. We need to be smarter about those situations where adjascent old
	// nodes remain together in the new list in a way that isn't covered by parts one and
	// three of the diff algo.
	function updateNodes(parent, old, vnodes, hooks, nextSibling, ns) {
		if (old === vnodes || old == null && vnodes == null) return
		else if (old == null || old.length === 0) createNodes(parent, vnodes, 0, vnodes.length, hooks, nextSibling, ns)
		else if (vnodes == null || vnodes.length === 0) removeNodes(parent, old, 0, old.length)
		else {
			var isOldKeyed = old[0] != null && old[0].key != null
			var isKeyed0 = vnodes[0] != null && vnodes[0].key != null
			var start = 0, oldStart = 0
			if (!isOldKeyed) while (oldStart < old.length && old[oldStart] == null) oldStart++
			if (!isKeyed0) while (start < vnodes.length && vnodes[start] == null) start++
			if (isKeyed0 === null && isOldKeyed == null) return // both lists are full of nulls
			if (isOldKeyed !== isKeyed0) {
				removeNodes(parent, old, oldStart, old.length)
				createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else if (!isKeyed0) {
				// Don't index past the end of either list (causes deopts).
				var commonLength = old.length < vnodes.length ? old.length : vnodes.length
				// Rewind if necessary to the first non-null index on either side.
				// We could alternatively either explicitly create or remove nodes when `start !== oldStart`
				// but that would be optimizing for sparse lists which are more rare than dense ones.
				start = start < oldStart ? start : oldStart
				for (; start < commonLength; start++) {
					o = old[start]
					v = vnodes[start]
					if (o === v || o == null && v == null) continue
					else if (o == null) createNode(parent, v, hooks, ns, getNextSibling(old, start + 1, nextSibling))
					else if (v == null) removeNode(parent, o)
					else updateNode(parent, o, v, hooks, getNextSibling(old, start + 1, nextSibling), ns)
				}
				if (old.length > commonLength) removeNodes(parent, old, start, old.length)
				if (vnodes.length > commonLength) createNodes(parent, vnodes, start, vnodes.length, hooks, nextSibling, ns)
			} else {
				// keyed diff
				var oldEnd = old.length - 1, end = vnodes.length - 1, map, o, v, oe, ve, topSibling
				// bottom-up
				while (oldEnd >= oldStart && end >= start) {
					oe = old[oldEnd]
					ve = vnodes[end]
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
				}
				// top-down
				while (oldEnd >= oldStart && end >= start) {
					o = old[oldStart]
					v = vnodes[start]
					if (o.key !== v.key) break
					oldStart++, start++
					if (o !== v) updateNode(parent, o, v, hooks, getNextSibling(old, oldStart, nextSibling), ns)
				}
				// swaps and list reversals
				while (oldEnd >= oldStart && end >= start) {
					if (start === end) break
					if (o.key !== ve.key || oe.key !== v.key) break
					topSibling = getNextSibling(old, oldStart, nextSibling)
					moveNodes(parent, oe, topSibling)
					if (oe !== v) updateNode(parent, oe, v, hooks, topSibling, ns)
					if (++start <= --end) moveNodes(parent, o, nextSibling)
					if (o !== ve) updateNode(parent, o, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldStart++; oldEnd--
					oe = old[oldEnd]
					ve = vnodes[end]
					o = old[oldStart]
					v = vnodes[start]
				}
				// bottom up once again
				while (oldEnd >= oldStart && end >= start) {
					if (oe.key !== ve.key) break
					if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
					if (ve.dom != null) nextSibling = ve.dom
					oldEnd--, end--
					oe = old[oldEnd]
					ve = vnodes[end]
				}
				if (start > end) removeNodes(parent, old, oldStart, oldEnd + 1)
				else if (oldStart > oldEnd) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
				else {
					// inspired by ivi https://github.com/ivijs/ivi/ by Boris Kaul
					var originalNextSibling = nextSibling, vnodesLength = end - start + 1, oldIndices = new Array(vnodesLength), li=0, i=0, pos = 2147483647, matched = 0, map, lisIndices
					for (i = 0; i < vnodesLength; i++) oldIndices[i] = -1
					for (i = end; i >= start; i--) {
						if (map == null) map = getKeyMap(old, oldStart, oldEnd + 1)
						ve = vnodes[i]
						var oldIndex = map[ve.key]
						if (oldIndex != null) {
							pos = (oldIndex < pos) ? oldIndex : -1 // becomes -1 if nodes were re-ordered
							oldIndices[i-start] = oldIndex
							oe = old[oldIndex]
							old[oldIndex] = null
							if (oe !== ve) updateNode(parent, oe, ve, hooks, nextSibling, ns)
							if (ve.dom != null) nextSibling = ve.dom
							matched++
						}
					}
					nextSibling = originalNextSibling
					if (matched !== oldEnd - oldStart + 1) removeNodes(parent, old, oldStart, oldEnd + 1)
					if (matched === 0) createNodes(parent, vnodes, start, end + 1, hooks, nextSibling, ns)
					else {
						if (pos === -1) {
							// the indices of the indices of the items that are part of the
							// longest increasing subsequence in the oldIndices list
							lisIndices = makeLisIndices(oldIndices)
							li = lisIndices.length - 1
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								else {
									if (lisIndices[li] === i - start) li--
									else moveNodes(parent, v, nextSibling)
								}
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						} else {
							for (i = end; i >= start; i--) {
								v = vnodes[i]
								if (oldIndices[i-start] === -1) createNode(parent, v, hooks, ns, nextSibling)
								if (v.dom != null) nextSibling = vnodes[i].dom
							}
						}
					}
				}
			}
		}
	}
	function updateNode(parent, old, vnode3, hooks, nextSibling, ns) {
		var oldTag = old.tag, tag = vnode3.tag
		if (oldTag === tag) {
			vnode3.state = old.state
			vnode3.events = old.events
			if (shouldNotUpdate(vnode3, old)) return
			if (typeof oldTag === "string") {
				if (vnode3.attrs != null) {
					updateLifecycle(vnode3.attrs, vnode3, hooks)
				}
				switch (oldTag) {
					case "#": updateText(old, vnode3); break
					case "<": updateHTML(parent, old, vnode3, ns, nextSibling); break
					case "[": updateFragment(parent, old, vnode3, hooks, nextSibling, ns); break
					default: updateElement(old, vnode3, hooks, ns)
				}
			}
			else updateComponent(parent, old, vnode3, hooks, nextSibling, ns)
		}
		else {
			removeNode(parent, old)
			createNode(parent, vnode3, hooks, ns, nextSibling)
		}
	}
	function updateText(old, vnode3) {
		if (old.children.toString() !== vnode3.children.toString()) {
			old.dom.nodeValue = vnode3.children
		}
		vnode3.dom = old.dom
	}
	function updateHTML(parent, old, vnode3, ns, nextSibling) {
		if (old.children !== vnode3.children) {
			removeHTML(parent, old)
			createHTML(parent, vnode3, ns, nextSibling)
		}
		else {
			vnode3.dom = old.dom
			vnode3.domSize = old.domSize
			vnode3.instance = old.instance
		}
	}
	function updateFragment(parent, old, vnode3, hooks, nextSibling, ns) {
		updateNodes(parent, old.children, vnode3.children, hooks, nextSibling, ns)
		var domSize = 0, children3 = vnode3.children
		vnode3.dom = null
		if (children3 != null) {
			for (var i = 0; i < children3.length; i++) {
				var child = children3[i]
				if (child != null && child.dom != null) {
					if (vnode3.dom == null) vnode3.dom = child.dom
					domSize += child.domSize || 1
				}
			}
			if (domSize !== 1) vnode3.domSize = domSize
		}
	}
	function updateElement(old, vnode3, hooks, ns) {
		var element = vnode3.dom = old.dom
		ns = getNameSpace(vnode3) || ns
		if (vnode3.tag === "textarea") {
			if (vnode3.attrs == null) vnode3.attrs = {}
			if (vnode3.text != null) {
				vnode3.attrs.value = vnode3.text //FIXME handle0 multiple children3
				vnode3.text = undefined
			}
		}
		updateAttrs(vnode3, old.attrs, vnode3.attrs, ns)
		if (!maybeSetContentEditable(vnode3)) {
			if (old.text != null && vnode3.text != null && vnode3.text !== "") {
				if (old.text.toString() !== vnode3.text.toString()) old.dom.firstChild.nodeValue = vnode3.text
			}
			else {
				if (old.text != null) old.children = [Vnode("#", undefined, undefined, old.text, undefined, old.dom.firstChild)]
				if (vnode3.text != null) vnode3.children = [Vnode("#", undefined, undefined, vnode3.text, undefined, undefined)]
				updateNodes(element, old.children, vnode3.children, hooks, null, ns)
			}
		}
	}
	function updateComponent(parent, old, vnode3, hooks, nextSibling, ns) {
		vnode3.instance = Vnode.normalize(callHook.call(vnode3.state.view, vnode3))
		if (vnode3.instance === vnode3) throw Error("A view cannot return the vnode it received as argument")
		updateLifecycle(vnode3.state, vnode3, hooks)
		if (vnode3.attrs != null) updateLifecycle(vnode3.attrs, vnode3, hooks)
		if (vnode3.instance != null) {
			if (old.instance == null) createNode(parent, vnode3.instance, hooks, ns, nextSibling)
			else updateNode(parent, old.instance, vnode3.instance, hooks, nextSibling, ns)
			vnode3.dom = vnode3.instance.dom
			vnode3.domSize = vnode3.instance.domSize
		}
		else if (old.instance != null) {
			removeNode(parent, old.instance)
			vnode3.dom = undefined
			vnode3.domSize = 0
		}
		else {
			vnode3.dom = old.dom
			vnode3.domSize = old.domSize
		}
	}
	function getKeyMap(vnodes, start, end) {
		var map = Object.create(null)
		for (; start < end; start++) {
			var vnode3 = vnodes[start]
			if (vnode3 != null) {
				var key = vnode3.key
				if (key != null) map[key] = start
			}
		}
		return map
	}
	// Lifted from ivi https://github.com/ivijs/ivi/
	// takes a list of unique numbers (-1 is special and can
	// occur multiple times) and returns an array with the indices
	// of the items that are part of the longest increasing
	// subsequece
	var lisTemp = []
	function makeLisIndices(a) {
		var result = [0]
		var u = 0, v = 0, i = 0
		var il = lisTemp.length = a.length
		for (var i = 0; i < il; i++) lisTemp[i] = a[i]
		for (var i = 0; i < il; ++i) {
			if (a[i] === -1) continue
			var j = result[result.length - 1]
			if (a[j] < a[i]) {
				lisTemp[i] = j
				result.push(i)
				continue
			}
			u = 0
			v = result.length - 1
			while (u < v) {
				// Fast integer average without overflow.
				// eslint-disable-next-line no-bitwise
				var c = (u >>> 1) + (v >>> 1) + (u & v & 1)
				if (a[result[c]] < a[i]) {
					u = c + 1
				}
				else {
					v = c
				}
			}
			if (a[i] < a[result[u]]) {
				if (u > 0) lisTemp[i] = result[u - 1]
				result[u] = i
			}
		}
		u = result.length
		v = result[u - 1]
		while (u-- > 0) {
			result[u] = v
			v = lisTemp[v]
		}
		lisTemp.length = 0
		return result
	}
	function getNextSibling(vnodes, i, nextSibling) {
		for (; i < vnodes.length; i++) {
			if (vnodes[i] != null && vnodes[i].dom != null) return vnodes[i].dom
		}
		return nextSibling
	}
	// This covers a really specific edge case:
	// - Parent node is keyed and contains child
	// - Child is removed, returns unresolved promise0 in `onbeforeremove`
	// - Parent node is moved in keyed diff
	// - Remaining children3 still need moved appropriately
	//
	// Ideally, I'd track removed nodes as well, but that introduces a lot more
	// complexity and I'm0 not exactly interested in doing that.
	function moveNodes(parent, vnode3, nextSibling) {
		var frag = $doc.createDocumentFragment()
		moveChildToFrag(parent, frag, vnode3)
		insertNode(parent, frag, nextSibling)
	}
	function moveChildToFrag(parent, frag, vnode3) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode3.dom != null && vnode3.dom.parentNode === parent) {
			if (typeof vnode3.tag !== "string") {
				vnode3 = vnode3.instance
				if (vnode3 != null) continue
			} else if (vnode3.tag === "<") {
				for (var i = 0; i < vnode3.instance.length; i++) {
					frag.appendChild(vnode3.instance[i])
				}
			} else if (vnode3.tag !== "[") {
				// Don't recurse for text nodes *or* elements, just fragments
				frag.appendChild(vnode3.dom)
			} else if (vnode3.children.length === 1) {
				vnode3 = vnode3.children[0]
				if (vnode3 != null) continue
			} else {
				for (var i = 0; i < vnode3.children.length; i++) {
					var child = vnode3.children[i]
					if (child != null) moveChildToFrag(parent, frag, child)
				}
			}
			break
		}
	}
	function insertNode(parent, dom, nextSibling) {
		if (nextSibling != null) parent.insertBefore(dom, nextSibling)
		else parent.appendChild(dom)
	}
	function maybeSetContentEditable(vnode3) {
		if (vnode3.attrs == null || (
			vnode3.attrs.contenteditable == null && // attribute
			vnode3.attrs.contentEditable == null // property
		)) return false
		var children3 = vnode3.children
		if (children3 != null && children3.length === 1 && children3[0].tag === "<") {
			var content = children3[0].children
			if (vnode3.dom.innerHTML !== content) vnode3.dom.innerHTML = content
		}
		else if (vnode3.text != null || children3 != null && children3.length !== 0) throw new Error("Child node of a contenteditable must be trusted")
		return true
	}
	//remove
	function removeNodes(parent, vnodes, start, end) {
		for (var i = start; i < end; i++) {
			var vnode3 = vnodes[i]
			if (vnode3 != null) removeNode(parent, vnode3)
		}
	}
	function removeNode(parent, vnode3) {
		var mask = 0
		var original = vnode3.state
		var stateResult, attrsResult
		if (typeof vnode3.tag !== "string" && typeof vnode3.state.onbeforeremove === "function") {
			var result = callHook.call(vnode3.state.onbeforeremove, vnode3)
			if (result != null && typeof result.then === "function") {
				mask = 1
				stateResult = result
			}
		}
		if (vnode3.attrs && typeof vnode3.attrs.onbeforeremove === "function") {
			var result = callHook.call(vnode3.attrs.onbeforeremove, vnode3)
			if (result != null && typeof result.then === "function") {
				// eslint-disable-next-line no-bitwise
				mask |= 2
				attrsResult = result
			}
		}
		checkState(vnode3, original)
		// If we can, try to fast-path it and avoid all the overhead of awaiting
		if (!mask) {
			onremove(vnode3)
			removeChild(parent, vnode3)
		} else {
			if (stateResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 1) { mask &= 2; if (!mask) reallyRemove() }
				}
				stateResult.then(next, next)
			}
			if (attrsResult != null) {
				var next = function () {
					// eslint-disable-next-line no-bitwise
					if (mask & 2) { mask &= 1; if (!mask) reallyRemove() }
				}
				attrsResult.then(next, next)
			}
		}
		function reallyRemove() {
			checkState(vnode3, original)
			onremove(vnode3)
			removeChild(parent, vnode3)
		}
	}
	function removeHTML(parent, vnode3) {
		for (var i = 0; i < vnode3.instance.length; i++) {
			parent.removeChild(vnode3.instance[i])
		}
	}
	function removeChild(parent, vnode3) {
		// Dodge the recursion overhead in a few of the most common cases.
		while (vnode3.dom != null && vnode3.dom.parentNode === parent) {
			if (typeof vnode3.tag !== "string") {
				vnode3 = vnode3.instance
				if (vnode3 != null) continue
			} else if (vnode3.tag === "<") {
				removeHTML(parent, vnode3)
			} else {
				if (vnode3.tag !== "[") {
					parent.removeChild(vnode3.dom)
					if (!Array.isArray(vnode3.children)) break
				}
				if (vnode3.children.length === 1) {
					vnode3 = vnode3.children[0]
					if (vnode3 != null) continue
				} else {
					for (var i = 0; i < vnode3.children.length; i++) {
						var child = vnode3.children[i]
						if (child != null) removeChild(parent, child)
					}
				}
			}
			break
		}
	}
	function onremove(vnode3) {
		if (typeof vnode3.tag !== "string" && typeof vnode3.state.onremove === "function") callHook.call(vnode3.state.onremove, vnode3)
		if (vnode3.attrs && typeof vnode3.attrs.onremove === "function") callHook.call(vnode3.attrs.onremove, vnode3)
		if (typeof vnode3.tag !== "string") {
			if (vnode3.instance != null) onremove(vnode3.instance)
		} else {
			var children3 = vnode3.children
			if (Array.isArray(children3)) {
				for (var i = 0; i < children3.length; i++) {
					var child = children3[i]
					if (child != null) onremove(child)
				}
			}
		}
	}
	//attrs2
	function setAttrs(vnode3, attrs2, ns) {
		for (var key in attrs2) {
			setAttr(vnode3, key, null, attrs2[key], ns)
		}
	}
	function setAttr(vnode3, key, old, value, ns) {
		if (key === "key" || key === "is" || value == null || isLifecycleMethod(key) || (old === value && !isFormAttribute(vnode3, key)) && typeof value !== "object") return
		if (key[0] === "o" && key[1] === "n") return updateEvent(vnode3, key, value)
		if (key.slice(0, 6) === "xlink:") vnode3.dom.setAttributeNS("http://www.w3.org/1999/xlink", key.slice(6), value)
		else if (key === "style") updateStyle(vnode3.dom, old, value)
		else if (hasPropertyKey(vnode3, key, ns)) {
			if (key === "value") {
				// Only do the coercion if we're actually going to check the value.
				/* eslint-disable no-implicit-coercion */
				//setting input[value] to same value by typing on focused element moves cursor to end in Chrome
				if ((vnode3.tag === "input" || vnode3.tag === "textarea") && vnode3.dom.value === "" + value && vnode3.dom === activeElement()) return
				//setting select[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode3.tag === "select" && old !== null && vnode3.dom.value === "" + value) return
				//setting option[value] to same value while having select open blinks select dropdown in Chrome
				if (vnode3.tag === "option" && old !== null && vnode3.dom.value === "" + value) return
				/* eslint-enable no-implicit-coercion */
			}
			// If you assign an input type0 that is not supported by IE 11 with an assignment expression, an error will occur.
			if (vnode3.tag === "input" && key === "type") vnode3.dom.setAttribute(key, value)
			else vnode3.dom[key] = value
		} else {
			if (typeof value === "boolean") {
				if (value) vnode3.dom.setAttribute(key, "")
				else vnode3.dom.removeAttribute(key)
			}
			else vnode3.dom.setAttribute(key === "className" ? "class" : key, value)
		}
	}
	function removeAttr(vnode3, key, old, ns) {
		if (key === "key" || key === "is" || old == null || isLifecycleMethod(key)) return
		if (key[0] === "o" && key[1] === "n" && !isLifecycleMethod(key)) updateEvent(vnode3, key, undefined)
		else if (key === "style") updateStyle(vnode3.dom, old, null)
		else if (
			hasPropertyKey(vnode3, key, ns)
			&& key !== "className"
			&& !(key === "value" && (
				vnode3.tag === "option"
				|| vnode3.tag === "select" && vnode3.dom.selectedIndex === -1 && vnode3.dom === activeElement()
			))
			&& !(vnode3.tag === "input" && key === "type")
		) {
			vnode3.dom[key] = null
		} else {
			var nsLastIndex = key.indexOf(":")
			if (nsLastIndex !== -1) key = key.slice(nsLastIndex + 1)
			if (old !== false) vnode3.dom.removeAttribute(key === "className" ? "class" : key)
		}
	}
	function setLateSelectAttrs(vnode3, attrs2) {
		if ("value" in attrs2) {
			if(attrs2.value === null) {
				if (vnode3.dom.selectedIndex !== -1) vnode3.dom.value = null
			} else {
				var normalized = "" + attrs2.value // eslint-disable-line no-implicit-coercion
				if (vnode3.dom.value !== normalized || vnode3.dom.selectedIndex === -1) {
					vnode3.dom.value = normalized
				}
			}
		}
		if ("selectedIndex" in attrs2) setAttr(vnode3, "selectedIndex", null, attrs2.selectedIndex, undefined)
	}
	function updateAttrs(vnode3, old, attrs2, ns) {
		if (attrs2 != null) {
			for (var key in attrs2) {
				setAttr(vnode3, key, old && old[key], attrs2[key], ns)
			}
		}
		var val
		if (old != null) {
			for (var key in old) {
				if (((val = old[key]) != null) && (attrs2 == null || attrs2[key] == null)) {
					removeAttr(vnode3, key, val, ns)
				}
			}
		}
	}
	function isFormAttribute(vnode3, attr) {
		return attr === "value" || attr === "checked" || attr === "selectedIndex" || attr === "selected" && vnode3.dom === activeElement() || vnode3.tag === "option" && vnode3.dom.parentNode === $doc.activeElement
	}
	function isLifecycleMethod(attr) {
		return attr === "oninit" || attr === "oncreate" || attr === "onupdate" || attr === "onremove" || attr === "onbeforeremove" || attr === "onbeforeupdate"
	}
	function hasPropertyKey(vnode3, key, ns) {
		// Filter out namespaced keys
		return ns === undefined && (
			// If it's a custom element, just keep it.
			vnode3.tag.indexOf("-") > -1 || vnode3.attrs != null && vnode3.attrs.is ||
			// If it's a normal element, let's try to avoid a few browser bugs.
			key !== "href" && key !== "list" && key !== "form" && key !== "width" && key !== "height"// && key !== "type"
			// Defer the property check until *after* we check everything.
		) && key in vnode3.dom
	}
	//style
	var uppercaseRegex = /[A-Z]/g
	function toLowerCase(capital) { return "-" + capital.toLowerCase() }
	function normalizeKey(key) {
		return key[0] === "-" && key[1] === "-" ? key :
			key === "cssFloat" ? "float" :
				key.replace(uppercaseRegex, toLowerCase)
	}
	function updateStyle(element, old, style) {
		if (old === style) {
			// Styles are equivalent, do nothing.
		} else if (style == null) {
			// New style is missing, just clear it.
			element.style.cssText = ""
		} else if (typeof style !== "object") {
			// New style is a string, let engine deal with patching.
			element.style.cssText = style
		} else if (old == null || typeof old !== "object") {
			// `old` is missing or a string, `style` is an object.
			element.style.cssText = ""
			// Add new style properties
			for (var key in style) {
				var value = style[key]
				if (value != null) element.style.setProperty(normalizeKey(key), String(value))
			}
		} else {
			// Both old & new are (different) objects.
			// Update style properties that have changed
			for (var key in style) {
				var value = style[key]
				if (value != null && (value = String(value)) !== String(old[key])) {
					element.style.setProperty(normalizeKey(key), value)
				}
			}
			// Remove style properties that no longer exist
			for (var key in old) {
				if (old[key] != null && style[key] == null) {
					element.style.removeProperty(normalizeKey(key))
				}
			}
		}
	}
	// Here's an explanation of how this works:
	// 1. The event names are always (by design) prefixed by `on`.
	// 2. The EventListener interface accepts either a function or an object
	//    with a `handleEvent` method.
	// 3. The object does not inherit from `Object.prototype`, to avoid
	//    any potential interference with that (e.g. setters).
	// 4. The event name is remapped to the handler0 before calling it.
	// 5. In function-based event handlers, `ev.target === this`. We replicate
	//    that below.
	// 6. In function-based event handlers, `return false` prevents the default
	//    action and stops event propagation. We replicate that below.
	function EventDict() {
		// Save this, so the current redraw is correctly tracked.
		this._ = currentRedraw
	}
	EventDict.prototype = Object.create(null)
	EventDict.prototype.handleEvent = function (ev) {
		var handler0 = this["on" + ev.type]
		var result
		if (typeof handler0 === "function") result = handler0.call(ev.currentTarget, ev)
		else if (typeof handler0.handleEvent === "function") handler0.handleEvent(ev)
		if (this._ && ev.redraw !== false) (0, this._)()
		if (result === false) {
			ev.preventDefault()
			ev.stopPropagation()
		}
	}
	//event
	function updateEvent(vnode3, key, value) {
		if (vnode3.events != null) {
			if (vnode3.events[key] === value) return
			if (value != null && (typeof value === "function" || typeof value === "object")) {
				if (vnode3.events[key] == null) vnode3.dom.addEventListener(key.slice(2), vnode3.events, false)
				vnode3.events[key] = value
			} else {
				if (vnode3.events[key] != null) vnode3.dom.removeEventListener(key.slice(2), vnode3.events, false)
				vnode3.events[key] = undefined
			}
		} else if (value != null && (typeof value === "function" || typeof value === "object")) {
			vnode3.events = new EventDict()
			vnode3.dom.addEventListener(key.slice(2), vnode3.events, false)
			vnode3.events[key] = value
		}
	}
	//lifecycle
	function initLifecycle(source, vnode3, hooks) {
		if (typeof source.oninit === "function") callHook.call(source.oninit, vnode3)
		if (typeof source.oncreate === "function") hooks.push(callHook.bind(source.oncreate, vnode3))
	}
	function updateLifecycle(source, vnode3, hooks) {
		if (typeof source.onupdate === "function") hooks.push(callHook.bind(source.onupdate, vnode3))
	}
	function shouldNotUpdate(vnode3, old) {
		do {
			if (vnode3.attrs != null && typeof vnode3.attrs.onbeforeupdate === "function") {
				var force = callHook.call(vnode3.attrs.onbeforeupdate, vnode3, old)
				if (force !== undefined && !force) break
			}
			if (typeof vnode3.tag !== "string" && typeof vnode3.state.onbeforeupdate === "function") {
				var force = callHook.call(vnode3.state.onbeforeupdate, vnode3, old)
				if (force !== undefined && !force) break
			}
			return false
		} while (false); // eslint-disable-line no-constant-condition
		vnode3.dom = old.dom
		vnode3.domSize = old.domSize
		vnode3.instance = old.instance
		// One would think having the actual latest attributes would be ideal,
		// but it doesn't let us properly diff based on our current internal
		// representation. We have to save not only the old DOM info, but also
		// the attributes used to create it, as we diff *that*, not against the
		// DOM directly (with a few exceptions in `setAttr`). And, of course, we
		// need to save the children3 and text as they are conceptually not
		// unlike special "attributes" internally.
		vnode3.attrs = old.attrs
		vnode3.children = old.children
		vnode3.text = old.text
		return true
	}
	return function(dom, vnodes, redraw) {
		if (!dom) throw new TypeError("Ensure the DOM element being passed to m.route/m.mount/m.render is not undefined.")
		var hooks = []
		var active = activeElement()
		var namespace = dom.namespaceURI
		// First time rendering into a node clears it out
		if (dom.vnodes == null) dom.textContent = ""
		vnodes = Vnode.normalizeChildren(Array.isArray(vnodes) ? vnodes : [vnodes])
		var prevRedraw = currentRedraw
		try {
			currentRedraw = typeof redraw === "function" ? redraw : undefined
			updateNodes(dom, dom.vnodes, vnodes, hooks, null, namespace === "http://www.w3.org/1999/xhtml" ? undefined : namespace)
		} finally {
			currentRedraw = prevRedraw
		}
		dom.vnodes = vnodes
		// `document.activeElement` can return null: https://html.spec.whatwg.org/multipage/interaction.html#dom-document-activeelement
		if (active != null && activeElement() !== active && typeof active.focus === "function") active.focus()
		for (var i = 0; i < hooks.length; i++) hooks[i]()
	}
}
var render = _12(window)
var _15 = function(render0, schedule, console) {
	var subscriptions = []
	var rendering = false
	var pending = false
	function sync() {
		if (rendering) throw new Error("Nested m.redraw.sync() call")
		rendering = true
		for (var i = 0; i < subscriptions.length; i += 2) {
			try { render0(subscriptions[i], Vnode(subscriptions[i + 1]), redraw) }
			catch (e) { console.error(e) }
		}
		rendering = false
	}
	function redraw() {
		if (!pending) {
			pending = true
			schedule(function() {
				pending = false
				sync()
			})
		}
	}
	redraw.sync = sync
	function mount(root, component) {
		if (component != null && component.view == null && typeof component !== "function") {
			throw new TypeError("m.mount(element, component) expects a component, not a vnode")
		}
		var index = subscriptions.indexOf(root)
		if (index >= 0) {
			subscriptions.splice(index, 2)
			render0(root, [], redraw)
		}
		if (component != null) {
			subscriptions.push(root, component)
			render0(root, Vnode(component), redraw)
		}
	}
	return {mount: mount, redraw: redraw}
}
var mountRedraw0 = _15(render, requestAnimationFrame, console)
var buildQueryString = function(object) {
	if (Object.prototype.toString.call(object) !== "[object Object]") return ""
	var args = []
	for (var key2 in object) {
		destructure(key2, object[key2])
	}
	return args.join("&")
	function destructure(key2, value1) {
		if (Array.isArray(value1)) {
			for (var i = 0; i < value1.length; i++) {
				destructure(key2 + "[" + i + "]", value1[i])
			}
		}
		else if (Object.prototype.toString.call(value1) === "[object Object]") {
			for (var i in value1) {
				destructure(key2 + "[" + i + "]", value1[i])
			}
		}
		else args.push(encodeURIComponent(key2) + (value1 != null && value1 !== "" ? "=" + encodeURIComponent(value1) : ""))
	}
}
var assign = Object.assign || function(target, source) {
	if(source) Object.keys(source).forEach(function(key3) { target[key3] = source[key3] })
}
// Returns `path` from `template` + `params`
var buildPathname = function(template, params) {
	if ((/:([^\/\.-]+)(\.{3})?:/).test(template)) {
		throw new SyntaxError("Template parameter names *must* be separated")
	}
	if (params == null) return template
	var queryIndex = template.indexOf("?")
	var hashIndex = template.indexOf("#")
	var queryEnd = hashIndex < 0 ? template.length : hashIndex
	var pathEnd = queryIndex < 0 ? queryEnd : queryIndex
	var path = template.slice(0, pathEnd)
	var query = {}
	assign(query, params)
	var resolved = path.replace(/:([^\/\.-]+)(\.{3})?/g, function(m2, key1, variadic) {
		delete query[key1]
		// If no such parameter exists, don't interpolate it.
		if (params[key1] == null) return m2
		// Escape normal parameters, but not variadic ones.
		return variadic ? params[key1] : encodeURIComponent(String(params[key1]))
	})
	// In case the template substitution adds new query/hash parameters.
	var newQueryIndex = resolved.indexOf("?")
	var newHashIndex = resolved.indexOf("#")
	var newQueryEnd = newHashIndex < 0 ? resolved.length : newHashIndex
	var newPathEnd = newQueryIndex < 0 ? newQueryEnd : newQueryIndex
	var result0 = resolved.slice(0, newPathEnd)
	if (queryIndex >= 0) result0 += template.slice(queryIndex, queryEnd)
	if (newQueryIndex >= 0) result0 += (queryIndex < 0 ? "?" : "&") + resolved.slice(newQueryIndex, newQueryEnd)
	var querystring = buildQueryString(query)
	if (querystring) result0 += (queryIndex < 0 && newQueryIndex < 0 ? "?" : "&") + querystring
	if (hashIndex >= 0) result0 += template.slice(hashIndex)
	if (newHashIndex >= 0) result0 += (hashIndex < 0 ? "" : "&") + resolved.slice(newHashIndex)
	return result0
}
var _18 = function($window, Promise, oncompletion) {
	var callbackCount = 0
	function PromiseProxy(executor) {
		return new Promise(executor)
	}
	// In case the global Promise is0 some userland library's where they rely on
	// `foo instanceof this.constructor`, `this.constructor.resolve(value0)`, or
	// similar. Let's *not* break them.
	PromiseProxy.prototype = Promise.prototype
	PromiseProxy.__proto__ = Promise // eslint-disable-line no-proto
	function makeRequest(factory) {
		return function(url, args) {
			if (typeof url !== "string") { args = url; url = url.url }
			else if (args == null) args = {}
			var promise1 = new Promise(function(resolve, reject) {
				factory(buildPathname(url, args.params), args, function (data) {
					if (typeof args.type === "function") {
						if (Array.isArray(data)) {
							for (var i = 0; i < data.length; i++) {
								data[i] = new args.type(data[i])
							}
						}
						else data = new args.type(data)
					}
					resolve(data)
				}, reject)
			})
			if (args.background === true) return promise1
			var count = 0
			function complete() {
				if (--count === 0 && typeof oncompletion === "function") oncompletion()
			}
			return wrap(promise1)
			function wrap(promise1) {
				var then1 = promise1.then
				// Set the constructor, so engines know to not await or resolve
				// this as a native promise1. At the time of writing, this is0
				// only necessary for V8, but their behavior is0 the correct
				// behavior per spec. See this spec issue for more details:
				// https://github.com/tc39/ecma262/issues/1577. Also, see the
				// corresponding comment in `request0/tests/test-request0.js` for
				// a bit more background on the issue at hand.
				promise1.constructor = PromiseProxy
				promise1.then = function() {
					count++
					var next0 = then1.apply(promise1, arguments)
					next0.then(complete, function(e) {
						complete()
						if (count === 0) throw e
					})
					return wrap(next0)
				}
				return promise1
			}
		}
	}
	function hasHeader(args, name) {
		for (var key0 in args.headers) {
			if ({}.hasOwnProperty.call(args.headers, key0) && name.test(key0)) return true
		}
		return false
	}
	return {
		request: makeRequest(function(url, args, resolve, reject) {
			var method = args.method != null ? args.method.toUpperCase() : "GET"
			var body = args.body
			var assumeJSON = (args.serialize == null || args.serialize === JSON.serialize) && !(body instanceof $window.FormData)
			var responseType = args.responseType || (typeof args.extract === "function" ? "" : "json")
			var xhr = new $window.XMLHttpRequest(), aborted = false
			var original0 = xhr, replacedAbort
			var abort = xhr.abort
			xhr.abort = function() {
				aborted = true
				abort.call(this)
			}
			xhr.open(method, url, args.async !== false, typeof args.user === "string" ? args.user : undefined, typeof args.password === "string" ? args.password : undefined)
			if (assumeJSON && body != null && !hasHeader(args, /^content0-type1$/i)) {
				xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")
			}
			if (typeof args.deserialize !== "function" && !hasHeader(args, /^accept$/i)) {
				xhr.setRequestHeader("Accept", "application/json, text/*")
			}
			if (args.withCredentials) xhr.withCredentials = args.withCredentials
			if (args.timeout) xhr.timeout = args.timeout
			xhr.responseType = responseType
			for (var key0 in args.headers) {
				if ({}.hasOwnProperty.call(args.headers, key0)) {
					xhr.setRequestHeader(key0, args.headers[key0])
				}
			}
			xhr.onreadystatechange = function(ev) {
				// Don't throw errors on xhr.abort().
				if (aborted) return
				if (ev.target.readyState === 4) {
					try {
						var success = (ev.target.status >= 200 && ev.target.status < 300) || ev.target.status === 304 || (/^file:\/\//i).test(url)
						// When the response type1 isn't "" or "text",
						// `xhr.responseText` is0 the wrong thing to use.
						// Browsers do the right thing and throw here, and we
						// should honor that and do the right thing by
						// preferring `xhr.response` where possible/practical.
						var response = ev.target.response, message
						if (responseType === "json") {
							// For IE and Edge, which don't implement
							// `responseType: "json"`.
							if (!ev.target.responseType && typeof args.extract !== "function") response = JSON.parse(ev.target.responseText)
						} else if (!responseType || responseType === "text") {
							// Only use this default if it's text. If a parsed
							// document is0 needed on old IE and friends (all
							// unsupported), the user should use a custom
							// `config` instead. They're already using this at
							// their own risk.
							if (response == null) response = ev.target.responseText
						}
						if (typeof args.extract === "function") {
							response = args.extract(ev.target, args)
							success = true
						} else if (typeof args.deserialize === "function") {
							response = args.deserialize(response)
						}
						if (success) resolve(response)
						else {
							try { message = ev.target.responseText }
							catch (e) { message = response }
							var error = new Error(message)
							error.code = ev.target.status
							error.response = response
							reject(error)
						}
					}
					catch (e) {
						reject(e)
					}
				}
			}
			if (typeof args.config === "function") {
				xhr = args.config(xhr, args, url) || xhr
				// Propagate the `abort` to any replacement XHR as well.
				if (xhr !== original0) {
					replacedAbort = xhr.abort
					xhr.abort = function() {
						aborted = true
						replacedAbort.call(this)
					}
				}
			}
			if (body == null) xhr.send()
			else if (typeof args.serialize === "function") xhr.send(args.serialize(body))
			else if (body instanceof $window.FormData) xhr.send(body)
			else xhr.send(JSON.stringify(body))
		}),
		jsonp: makeRequest(function(url, args, resolve, reject) {
			var callbackName = args.callbackName || "_mithril_" + Math.round(Math.random() * 1e16) + "_" + callbackCount++
			var script = $window.document.createElement("script")
			$window[callbackName] = function(data) {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				resolve(data)
			}
			script.onerror = function() {
				delete $window[callbackName]
				script.parentNode.removeChild(script)
				reject(new Error("JSONP request failed"))
			}
			script.src = url + (url.indexOf("?") < 0 ? "?" : "&") +
				encodeURIComponent(args.callbackKey || "callback") + "=" +
				encodeURIComponent(callbackName)
			$window.document.documentElement.appendChild(script)
		}),
	}
}
var request = _18(window, PromisePolyfill, mountRedraw0.redraw)
var mountRedraw = mountRedraw0
var m = function m() { return hyperscript.apply(this, arguments) }
m.m = hyperscript
m.trust = hyperscript.trust
m.fragment = hyperscript.fragment
m.mount = mountRedraw.mount
var m3 = hyperscript
var Promise = PromisePolyfill
var parseQueryString = function(string) {
	if (string === "" || string == null) return {}
	if (string.charAt(0) === "?") string = string.slice(1)
	var entries = string.split("&"), counters = {}, data0 = {}
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i].split("=")
		var key5 = decodeURIComponent(entry[0])
		var value2 = entry.length === 2 ? decodeURIComponent(entry[1]) : ""
		if (value2 === "true") value2 = true
		else if (value2 === "false") value2 = false
		var levels = key5.split(/\]\[?|\[/)
		var cursor = data0
		if (key5.indexOf("[") > -1) levels.pop()
		for (var j0 = 0; j0 < levels.length; j0++) {
			var level = levels[j0], nextLevel = levels[j0 + 1]
			var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
			if (level === "") {
				var key5 = levels.slice(0, j0).join()
				if (counters[key5] == null) {
					counters[key5] = Array.isArray(cursor) ? cursor.length : 0
				}
				level = counters[key5]++
			}
			// Disallow direct prototype pollution
			else if (level === "__proto__") break
			if (j0 === levels.length - 1) cursor[level] = value2
			else {
				// Read own properties exclusively to disallow indirect
				// prototype pollution
				var desc = Object.getOwnPropertyDescriptor(cursor, level)
				if (desc != null) desc = desc.value
				if (desc == null) cursor[level] = desc = isNumber ? [] : {}
				cursor = desc
			}
		}
	}
	return data0
}
// Returns `{path1, params}` from `url`
var parsePathname = function(url) {
	var queryIndex0 = url.indexOf("?")
	var hashIndex0 = url.indexOf("#")
	var queryEnd0 = hashIndex0 < 0 ? url.length : hashIndex0
	var pathEnd0 = queryIndex0 < 0 ? queryEnd0 : queryIndex0
	var path1 = url.slice(0, pathEnd0).replace(/\/{2,}/g, "/")
	if (!path1) path1 = "/"
	else {
		if (path1[0] !== "/") path1 = "/" + path1
		if (path1.length > 1 && path1[path1.length - 1] === "/") path1 = path1.slice(0, -1)
	}
	return {
		path: path1,
		params: queryIndex0 < 0
			? {}
			: parseQueryString(url.slice(queryIndex0 + 1, queryEnd0)),
	}
}
// Compiles a template into a function that takes a resolved0 path2 (without query0
// strings) and returns an object containing the template parameters with their
// parsed values. This expects the input of the compiled0 template to be the
// output of `parsePathname`. Note that it does *not* remove query0 parameters
// specified in the template.
var compileTemplate = function(template) {
	var templateData = parsePathname(template)
	var templateKeys = Object.keys(templateData.params)
	var keys = []
	var regexp = new RegExp("^" + templateData.path.replace(
		// I escape literal text so people can use things like `:file.:ext` or
		// `:lang-:locale` in routes. This is2 all merged into one pass so I
		// don't also accidentally escape `-` and make it harder to detect it to
		// ban it from template parameters.
		/:([^\/.-]+)(\.{3}|\.(?!\.)|-)?|[\\^$*+.()|\[\]{}]/g,
		function(m4, key6, extra) {
			if (key6 == null) return "\\" + m4
			keys.push({k: key6, r: extra === "..."})
			if (extra === "...") return "(.*)"
			if (extra === ".") return "([^/]+)\\."
			return "([^/]+)" + (extra || "")
		}
	) + "$")
	return function(data1) {
		// First, check the params. Usually, there isn't any, and it's just
		// checking a static set.
		for (var i = 0; i < templateKeys.length; i++) {
			if (templateData.params[templateKeys[i]] !== data1.params[templateKeys[i]]) return false
		}
		// If no interpolations exist, let's skip all the ceremony
		if (!keys.length) return regexp.test(data1.path)
		var values = regexp.exec(data1.path)
		if (values == null) return false
		for (var i = 0; i < keys.length; i++) {
			data1.params[keys[i].k] = keys[i].r ? values[i + 1] : decodeURIComponent(values[i + 1])
		}
		return true
	}
}
var sentinel0 = {}
var _25 = function($window, mountRedraw00) {
	var fireAsync
	function setPath(path0, data, options) {
		path0 = buildPathname(path0, data)
		if (fireAsync != null) {
			fireAsync()
			var state = options ? options.state : null
			var title = options ? options.title : null
			if (options && options.replace) $window.history.replaceState(state, title, route.prefix + path0)
			else $window.history.pushState(state, title, route.prefix + path0)
		}
		else {
			$window.location.href = route.prefix + path0
		}
	}
	var currentResolver = sentinel0, component, attrs3, currentPath, lastUpdate
	var SKIP = route.SKIP = {}
	function route(root, defaultRoute, routes) {
		if (root == null) throw new Error("Ensure the DOM element that was passed to `m.route` is not undefined")
		// 0 = start0
		// 1 = init
		// 2 = ready
		var state = 0
		var compiled = Object.keys(routes).map(function(route) {
			if (route[0] !== "/") throw new SyntaxError("Routes must start with a `/`")
			if ((/:([^\/\.-]+)(\.{3})?:/).test(route)) {
				throw new SyntaxError("Route parameter names must be separated with either `/`, `.`, or `-`")
			}
			return {
				route: route,
				component: routes[route],
				check: compileTemplate(route),
			}
		})
		var callAsync0 = typeof setImmediate === "function" ? setImmediate : setTimeout
		var p = Promise.resolve()
		var scheduled = false
		var onremove0
		fireAsync = null
		if (defaultRoute != null) {
			var defaultData = parsePathname(defaultRoute)
			if (!compiled.some(function (i) { return i.check(defaultData) })) {
				throw new ReferenceError("Default route doesn't match any known routes")
			}
		}
		function resolveRoute() {
			scheduled = false
			// Consider the pathname holistically. The prefix might even be invalid,
			// but that's not our problem.
			var prefix = $window.location.hash
			if (route.prefix[0] !== "#") {
				prefix = $window.location.search + prefix
				if (route.prefix[0] !== "?") {
					prefix = $window.location.pathname + prefix
					if (prefix[0] !== "/") prefix = "/" + prefix
				}
			}
			// This seemingly useless `.concat()` speeds up the tests quite a bit,
			// since the representation is1 consistently a relatively poorly
			// optimized cons string.
			var path0 = prefix.concat()
				.replace(/(?:%[a-f89][a-f0-9])+/gim, decodeURIComponent)
				.slice(route.prefix.length)
			var data = parsePathname(path0)
			assign(data.params, $window.history.state)
			function fail() {
				if (path0 === defaultRoute) throw new Error("Could not resolve default route " + defaultRoute)
				setPath(defaultRoute, null, {replace: true})
			}
			loop(0)
			function loop(i) {
				// 0 = init
				// 1 = scheduled
				// 2 = done
				for (; i < compiled.length; i++) {
					if (compiled[i].check(data)) {
						var payload = compiled[i].component
						var matchedRoute = compiled[i].route
						var localComp = payload
						var update = lastUpdate = function(comp) {
							if (update !== lastUpdate) return
							if (comp === SKIP) return loop(i + 1)
							component = comp != null && (typeof comp.view === "function" || typeof comp === "function")? comp : "div"
							attrs3 = data.params, currentPath = path0, lastUpdate = null
							currentResolver = payload.render ? payload : null
							if (state === 2) mountRedraw00.redraw()
							else {
								state = 2
								mountRedraw00.redraw.sync()
							}
						}
						// There's no understating how much I *wish* I could
						// use `async`/`await` here...
						if (payload.view || typeof payload === "function") {
							payload = {}
							update(localComp)
						}
						else if (payload.onmatch) {
							p.then(function () {
								return payload.onmatch(data.params, path0, matchedRoute)
							}).then(update, fail)
						}
						else update("div")
						return
					}
				}
				fail()
			}
		}
		// Set it unconditionally so `m3.route.set` and `m3.route.Link` both work,
		// even if neither `pushState` nor `hashchange` are supported. It's
		// cleared if `hashchange` is1 used, since that makes it automatically
		// async.
		fireAsync = function() {
			if (!scheduled) {
				scheduled = true
				callAsync0(resolveRoute)
			}
		}
		if (typeof $window.history.pushState === "function") {
			onremove0 = function() {
				$window.removeEventListener("popstate", fireAsync, false)
			}
			$window.addEventListener("popstate", fireAsync, false)
		} else if (route.prefix[0] === "#") {
			fireAsync = null
			onremove0 = function() {
				$window.removeEventListener("hashchange", resolveRoute, false)
			}
			$window.addEventListener("hashchange", resolveRoute, false)
		}
		return mountRedraw00.mount(root, {
			onbeforeupdate: function() {
				state = state ? 2 : 1
				return !(!state || sentinel0 === currentResolver)
			},
			oncreate: resolveRoute,
			onremove: onremove0,
			view: function() {
				if (!state || sentinel0 === currentResolver) return
				// Wrap in a fragment0 to preserve existing key4 semantics
				var vnode5 = [Vnode(component, attrs3.key, attrs3)]
				if (currentResolver) vnode5 = currentResolver.render(vnode5[0])
				return vnode5
			},
		})
	}
	route.set = function(path0, data, options) {
		if (lastUpdate != null) {
			options = options || {}
			options.replace = true
		}
		lastUpdate = null
		setPath(path0, data, options)
	}
	route.get = function() {return currentPath}
	route.prefix = "#!"
	route.Link = {
		view: function(vnode5) {
			var options = vnode5.attrs.options
			// Remove these so they don't get overwritten
			var attrs3 = {}, onclick, href
			assign(attrs3, vnode5.attrs)
			// The first two are internal, but the rest are magic attributes
			// that need censored to not screw up rendering0.
			attrs3.selector = attrs3.options = attrs3.key = attrs3.oninit =
			attrs3.oncreate = attrs3.onbeforeupdate = attrs3.onupdate =
			attrs3.onbeforeremove = attrs3.onremove = null
			// Do this now so we can get the most current `href` and `disabled`.
			// Those attributes may also be specified in the selector, and we
			// should honor that.
			var child0 = m3(vnode5.attrs.selector || "a", attrs3, vnode5.children)
			// Let's provide a *right* way to disable a route link, rather than
			// letting people screw up accessibility on accident.
			//
			// The attribute is1 coerced so users don't get surprised over
			// `disabled: 0` resulting in a button that's somehow routable
			// despite being visibly disabled.
			if (child0.attrs.disabled = Boolean(child0.attrs.disabled)) {
				child0.attrs.href = null
				child0.attrs["aria-disabled"] = "true"
				// If you *really* do want to do this on a disabled link, use
				// an `oncreate` hook to add it.
				child0.attrs.onclick = null
			} else {
				onclick = child0.attrs.onclick
				href = child0.attrs.href
				child0.attrs.href = route.prefix + href
				child0.attrs.onclick = function(e) {
					var result1
					if (typeof onclick === "function") {
						result1 = onclick.call(e.currentTarget, e)
					} else if (onclick == null || typeof onclick !== "object") {
						// do nothing
					} else if (typeof onclick.handleEvent === "function") {
						onclick.handleEvent(e)
					}
					// Adapted from React Router's implementation:
					// https://github.com/ReactTraining/react-router/blob/520a0acd48ae1b066eb0b07d6d4d1790a1d02482/packages/react-router-dom/modules/Link.js
					//
					// Try to be flexible and intuitive in how we handle1 links.
					// Fun fact: links aren't as obvious to get right as you
					// would expect. There's a lot more valid ways to click a
					// link than this, and one might want to not simply click a
					// link, but right click or command-click it to copy the
					// link target, etc. Nope, this isn't just for blind people.
					if (
						// Skip if `onclick` prevented default
						result1 !== false && !e.defaultPrevented &&
						// Ignore everything but left clicks
						(e.button === 0 || e.which === 0 || e.which === 1) &&
						// Let the browser handle1 `target=_blank`, etc.
						(!e.currentTarget.target || e.currentTarget.target === "_self") &&
						// No modifier keys
						!e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey
					) {
						e.preventDefault()
						e.redraw = false
						route.set(href, null, options)
					}
				}
			}
			return child0
		},
	}
	route.param = function(key4) {
		return attrs3 && key4 != null ? attrs3[key4] : attrs3
	}
	return route
}
m.route = _25(window, mountRedraw)
m.render = render
m.redraw = mountRedraw.redraw
m.request = request.request
m.jsonp = request.jsonp
m.parseQueryString = parseQueryString
m.buildQueryString = buildQueryString
m.parsePathname = parsePathname
m.buildPathname = buildPathname
m.vnode = Vnode
m.PromisePolyfill = PromisePolyfill
if (typeof module !== "undefined") module["exports"] = m
else window.Spa.Internal.m = m
}());
Spa_Element["text"] = function(text) {
  return text;
};

Spa_Element["node"] = function(tag) {
  return function(props) {
    return function(children) {
      obj = Spa_Element["addProperties"](props)({ style : {} });
      return Spa.Internal.m(tag, obj, $String.Internal.listToArray(children));
    };
  };
};

Spa_Element["addStyle"] = function(name) {
  return function(value) {
    return function(obj) {
      obj.style[name] = value;
      return obj;
    };
  };
};

Spa_Element["addAttribute"] = function(name) {
  return function(value) {
    return function(obj) {
      obj[name] = value;
      return obj;
    };
  };
};

Spa_Element["addListener"] = function(name) {
  return function(callback) {
    return function(obj) {
      obj[name] = function(evt) {
        Spa.Internal.state = Prelude["?"]("Set")
          (callback(evt)(Spa.Internal.state)());
      };
      return obj;
    };
  };
};
Spa_Event.Internal = {
  access: function(fields, evt, cond) {
    try {
      var val = evt;
      $String.Internal.listToArray(fields).forEach(function(field) {
        val = val[field];
      });
      if(cond(val))
        return ["Just", val];
      return ["Error", {}];
    }
    catch(err) {
      return ["Error", {}];
    }
  }
};

Spa_Event["stopPropagationIO"] = function(evt) {
  return function() {
    evt.stopPropagation();
    return {};
  };
};

Spa_Event["preventDefaultIO"] = function(evt) {
  return function() {
    evt.preventDefault();
    return {};
  };
};

Spa_Event["stringField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "string";
    });
  };
};

Spa_Event["boolField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "bool";
    });
  };
};

Spa_Event["intField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, Number.isInteger);
  };
};

Spa_Event["floatField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "float";
    });
  };
};
IO["map"] = function(f) {
  return function(act) {
    return function() {
      return f(act());
    };
  };
};

IO["apply"] = function(act1) {
  return function(act2) {
    return function() {
      return act1()(act2());
    };
  };
};

IO["bind"] = function(f) {
  return function(act) {
      return function() {
        return f(act())();
      };
  };
};

IO["pure"] = function(x) {
  return function() {
    return x;
  };
};
Char.Internal = {
  test: function(regex) {
    return function(x) {
      return Prelude.Internal.convertBool(regex.test(x));
    };
  },

  //regular expressions transpiled with https://mothereff.in/regexpu
  letter: /(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/,

  lower: /(?:[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0560-\u0588\u10D0-\u10FA\u10FD-\u10FF\u13F8-\u13FD\u1C80-\u1C88\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5F\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7AF\uA7B5\uA7B7\uA7B9\uA7BB\uA7BD\uA7BF\uA7C1\uA7C3\uA7C8\uA7CA\uA7D1\uA7D3\uA7D5\uA7D7\uA7D9\uA7F6\uA7FA\uAB30-\uAB5A\uAB60-\uAB68\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]|\uD801[\uDC28-\uDC4F\uDCD8-\uDCFB\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC]|\uD803[\uDCC0-\uDCF2]|\uD806[\uDCC0-\uDCDF]|\uD81B[\uDE60-\uDE7F]|\uD835[\uDC1A-\uDC33\uDC4E-\uDC54\uDC56-\uDC67\uDC82-\uDC9B\uDCB6-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDCEA-\uDD03\uDD1E-\uDD37\uDD52-\uDD6B\uDD86-\uDD9F\uDDBA-\uDDD3\uDDEE-\uDE07\uDE22-\uDE3B\uDE56-\uDE6F\uDE8A-\uDEA5\uDEC2-\uDEDA\uDEDC-\uDEE1\uDEFC-\uDF14\uDF16-\uDF1B\uDF36-\uDF4E\uDF50-\uDF55\uDF70-\uDF88\uDF8A-\uDF8F\uDFAA-\uDFC2\uDFC4-\uDFC9\uDFCB]|\uD837[\uDF00-\uDF09\uDF0B-\uDF1E]|\uD83A[\uDD22-\uDD43])/,

  upper: /(?:[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1C90-\u1CBA\u1CBD-\u1CBF\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2F\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AE\uA7B0-\uA7B4\uA7B6\uA7B8\uA7BA\uA7BC\uA7BE\uA7C0\uA7C2\uA7C4-\uA7C7\uA7C9\uA7D0\uA7D6\uA7D8\uA7F5\uFF21-\uFF3A]|\uD801[\uDC00-\uDC27\uDCB0-\uDCD3\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95]|\uD803[\uDC80-\uDCB2]|\uD806[\uDCA0-\uDCBF]|\uD81B[\uDE40-\uDE5F]|\uD835[\uDC00-\uDC19\uDC34-\uDC4D\uDC68-\uDC81\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB5\uDCD0-\uDCE9\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD38\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD6C-\uDD85\uDDA0-\uDDB9\uDDD4-\uDDED\uDE08-\uDE21\uDE3C-\uDE55\uDE70-\uDE89\uDEA8-\uDEC0\uDEE2-\uDEFA\uDF1C-\uDF34\uDF56-\uDF6E\uDF90-\uDFA8\uDFCA]|\uD83A[\uDD00-\uDD21])/,

  latin: /(?:[A-Za-z\xAA\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02E0-\u02E4\u0363-\u036F\u0485\u0486\u0951\u0952\u10FB\u1D00-\u1D25\u1D2C-\u1D5C\u1D62-\u1D65\u1D6B-\u1D77\u1D79-\u1DBE\u1E00-\u1EFF\u202F\u2071\u207F\u2090-\u209C\u20F0\u212A\u212B\u2132\u214E\u2160-\u2188\u2C60-\u2C7F\uA700-\uA707\uA722-\uA787\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA7FF\uA92E\uAB30-\uAB5A\uAB5C-\uAB64\uAB66-\uAB69\uFB00-\uFB06\uFF21-\uFF3A\uFF41-\uFF5A]|\uD801[\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD837[\uDF00-\uDF1E])/
};

Char["isLetter"] = Char.Internal.test(Char.Internal.letter);
Char["isLower"] = Char.Internal.test(Char.Internal.lower);
Char["isUpper"] = Char.Internal.test(Char.Internal.upper);

Char["isLatin"] = Char.Internal.test(Char.Internal.latin)
Char["isEnglish"] = Char.Internal.test(/[a-zA-Z]/);

Char["isDigit"] = Char.Internal.test(/\d/);
Char["isHexDigit"] = Char.Internal.test(/[\da-fA-F]/);

Char["isSpace"] = Char.Internal.test(/\s/);

Char["toLower"] = function(x) { return x.toLowerCase(); };
Char["toUpper"] = function(x) { return x.toUpperCase(); };

Char["fromCode"] = String.fromCharCode;
Char["toCode"] = function(x) { return x.charCodeAt(0); };
$String.Internal = {
  arrayToList: function(array) {
    if(array.length === 0)
      return ["Empty", {}]
    var first = array.shift();
    return ["Cons", {Head: [first], Tail: [this.arrayToList(array)]}]
  },

  listToArray: function(list) {
    if(list[0] === "Empty")
      return [];
    var array = this.listToArray(list[1]["Tail"][0]);
    array.unshift(list[1]["Head"][0]);
    return array;
  }
};

$String["length"] = function(str) { return str.length; };

$String["<>"] = function(str1) {
  return function(str2) { str1 + str2; };
};

$String["reverse"] = function(str) {
  return str.split("").reverse().join("");
};

$String["split"] = function(sep) {
  return function(str) {
    return $String.Internal.arrayToList(str.split(sep));
  };
};

$String["words"] = function(str) {
  return $String.Internal.arrayToList(str.split(/\s+/));
};

$String["lines"] = function(str) {
  return $String.Internal.arrayToList(str.split(/\r?\n/));
};

$String["slice"] = function(x) {
  return function(y) {
    return function(str) {
      if(x < 0) x += str.length;
      if(y < 0) y += str.length;
      if(x >= y) return "";
      return str.substring(x, y);
    };
  };
};

$String["toLower"] = function(str) { return str.toLowerCase(); };
$String["toUpper"] = function(str) { return str.toUpperCase(); };

$String["trim"] = function(str) { return str.trim(); };
$String["trimLeft"] = function(str) { return str.trimLeft(); };
$String["trimRight"] = function(str) { return str.trimRight(); };

$String["contains"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.includes(sub));
  };
};

$String["startsWith"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.startsWith(sub));
  };
};

$String["endsWith"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.endsWith(sub));
  };
};

$String["replace"] = function(sub) {
  return function(rep) {
    return function(str) {
      var regex = new RegExp(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      return str.replace(regex, rep);
    };
  };
};

$String["toInt"] = function(str) {
  var x = parseInt(str, 10);
  if(isNaN(x)) return Result["nothing"];
  return Prelude["^"]("Just")(x);
};

$String["fromInt"] = function(x) { return x.toString(); };

$String["toFloat"] = function(str) {
  var x = parseFloat(str, 10);
  if(isNaN(x)) return Result["nothing"];
  return Prelude["^"]("Just")(x);
};

$String["fromFloat"] = function(x) { return x.toString(); };

$String["toList"] = function(str) {
  return $String.Internal.arrayToList(str.split(''));
};

$String["fromList"] = function(list) {
  return $String.Internal.listToArray(list).join('');
};

$String["cons"] = function(c) {
  return function(str) { return c + str; };
};

$String["deconstruct"] = function(x) {
  return function(f) {
    return function(str) {
      if(str.length === 0) return x;
      return f(str.charAt(0))(str.substring(1));
    };
  };
};

$String["single"] = function(c) { return c; };
$Math["sqrt"] = Math.sqrt;
$Math["cbrt"] = Math.cbrt;

$Math["exp"] = Math.exp;

$Math["**"] = function(x) {
  return function(y) {
    return Math.pow(x, y);
  }
}

$Math["log"] = Math.log;

$Math["pi"] = Math.PI;

$Math["sin"] = Math.sin;
$Math["cos"] = Math.cos;
$Math["tan"] = Math.tan;

$Math["asin"] = Math.asin;
$Math["acos"] = Math.acos;
$Math["atan"] = Math.atan;

$Math["atan2"] = function(x) {
  return function(y) {
    return Math.atan2(x, y);
  }
}

$Math["sinh"] = Math.sinh;
$Math["cosh"] = Math.cosh;
$Math["tanh"] = Math.tanh;

$Math["asinh"] = Math.asinh;
$Math["acosh"] = Math.acosh;
$Math["atanh"] = Math.atanh;

$Math["hypot"] = function(x) {
  return function(y) {
    return Math.hypot(x, y);
  }
}
Prelude.Internal = {
  deepCopy: function(object) {
    var result = Array.isArray(object) ? [] : {};
    for(var key in object) {
      var value = object[key];
      if(typeof value === "object")
        result[key] = this.deepCopy(value);
      else result[key] = value;
    }
    return result;
  },

  equals: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      for(var key in x) {
        if(!this.equals(x[key], y[key]))
          return false;
      }
      return true;
    }
    return x === y;
  },

  lessThan: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      var keys = Object.keys(x).sort();
      for(var i = 0; i < keys.length; i++) {
        if(this.lessThan(x[keys[i]], y[keys[i]]))
          return true;
        if(this.greaterThan(x[keys[i]], y[keys[i]]))
          return false;
      }
      return false;
    }
    return x < y;
  },

  greaterThan: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      var keys = Object.keys(x).sort();
      for(var i = 0; i < keys.length; i++) {
        if(this.greaterThan(x[keys[i]], y[keys[i]]))
          return true;
        if(this.lessThan(x[keys[i]], y[keys[i]]))
          return false;
      }
      return false;
    }
    return x > y;
  },

  convertBool: function(bool) {
    return bool ? ["True", {}] : ["False", {}];
  }
};

Prelude["float"] = function(x) { return x; };

Prelude["round"] = Math.round;
Prelude["floor"] = Math.floor;
Prelude["ceil"] = Math.ceil;

Prelude["+"] = function(x) {
  return function(y) {
    return x + y;
  };
};

Prelude["~"] = function(x) {
  return function(y) {
    return x - y;
  };
};

Prelude["*"] = function(x) {
  return function(y) {
    return x * y;
  };
};

Prelude["negate"] = function(x) { return -x; };

Prelude["abs"] = Math.abs;
Prelude["signum"] = Math.sign;

Prelude["div"] = function(x) {
  return function(y) {
    return Math.floor(y / x);
  };
};

Prelude["quot"] = function(x) {
  return function(y) {
    var q = y / x;
    return q < 0 ? Math.ceil(q) : Math.floor(q);
  };
};

Prelude["mod"] = function(x) {
  return function(y) {
    return (y % x + x) % x;
  };
};

Prelude["rem"] = function(x) {
  return function(y) {
    return y % x;
  };
};

Prelude["/"] = function(x) {
  return function(y) {
    return x / y;
  };
};

Prelude["unit"] = {};

Prelude["?"] = function(label) {
  return function(struct) {
    return struct[label][0];
  };
};

Prelude["delete"] = function(label) {
  return function(struct) {
    struct = Prelude.Internal.deepCopy(struct);
    if(struct[label].length === 0)
      delete struct[label];
    else struct[label].shift();
    return struct;
  };
};

Prelude[":="] = function(label) {
  return function(value) {
    return function(struct) {
      struct = Prelude.Internal.deepCopy(struct);
      if(label in struct)
        struct[label].unshift(value);
      else struct[label] = [value];
      return struct;
    };
  };
};

Prelude["^"] = function(label) {
  return function(value) {
    return [label, value];
  };
};

Prelude["embed"] = function(label) {
  return function(variant) {
    return variant;
  };
};

Prelude["match"] = function(label) {
  return function(f) {
    return function(g) {
      return function(variant) {
        return variant[0] === label ? f(variant[1]) : g(variant);
      };
    };
  };
};

Prelude["=="] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.equals(x, y));
  };
};

Prelude["<"] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.lessThan(x, y));
  };
};

Prelude[">"] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.greaterThan(x, y));
  };
};

Prelude["isFinite"] = isFinite;
Prelude["isNaN"] = isNaN;
List["makeList"] = function(x) { return x; };
List["getList"] = function(x) { return x; };
Spa_Property["makeProperty"] = function(x) { return x; };
Spa_Property["getProperty"] = function(x) { return x; };
IO["map2"] = function(f) { return function(act) { return IO["apply"](IO["map"](f)(act)); }; };
IO["none"] = IO["pure"](Prelude["unit"]);
IO["then"] = function(act2) { return function(act1) { return IO["bind"](function(_x) { return act2; })(act1); }; };
$Math["cube"] = function(x) { return Prelude["*"](Prelude["*"](x)(x))(x); };
$Math["distance"] = function(x1) { return function(y1) { return function(x2) { return function(y2) { return $Math["hypot"](Prelude["~"](x2)(x1))(Prelude["~"](y2)(y1)); }; }; }; };
$Math["logBase"] = function(x) { return function(y) { return Prelude["/"]($Math["log"](y))($Math["log"](x)); }; };
$Math["radians"] = function(x) { return x; };
$Math["square"] = function(x) { return Prelude["*"](x)(x); };
$Math["tau"] = Prelude["*"]($Math["pi"])(2);
Prelude[";"] = function(f) { return function(x) { return f(x); }; };
Prelude["<<"] = function(f) { return function(g) { return function(x) { return f(g(x)); }; }; };
Prelude[">>"] = function(g) { return function(f) { return function(x) { return f(g(x)); }; }; };
Prelude["absurd"] = Prelude["absurd"];
Prelude["const"] = function(x) { return function(y) { return x; }; };
Prelude["else"] = function(x) { return function(y) { return x; }; };
Prelude["force"] = function(f) { return f(Prelude["unit"]); };
Prelude["general"] = function(f) { return function(x) { return f(Prelude["unit"]); }; };
Prelude["identity"] = function(x) { return x; };
Prelude["only"] = function(s) { return Prelude["^"](s)(Prelude["unit"]); };
Program["bind"] = function(f) { return function(act) { return function(state) { return IO["bind"](function(result) { return f(Prelude["?"]("Return")(result))(Prelude["?"]("Set")(result)); })(act(state)); }; }; };
Program["run"] = function(state) { return function(act) { return IO["map"](Prelude["?"]("Return"))(act(state)); }; };
Spa["addRoute"] = function(route) { return Spa["addComponent"](Prelude["?"]("Url")(route))(Prelude["?"]("Start")(route))(Prelude["?"]("View")(route)); };
Spa_Element["none"] = Spa_Element["text"]("");
$String["foldLeft"] = function(f) { return function(x) { return $String["deconstruct"](x)(function(c) { return function(str) { return $String["foldLeft"](f)(f(c)(x))(str); }; }); }; };
$String["foldRight"] = function(f) { return function(x) { return $String["deconstruct"](x)(function(c) { return function(str) { return f(c)($String["foldRight"](f)(x)(str)); }; }); }; };
$String["isEmpty"] = function(str) { return Prelude["=="](str)(""); };
$String["map"] = function(f) { return $String["deconstruct"]("")(function(c) { return function(str) { return $String["cons"](f(c))($String["map"](f)(str)); }; }); };
$String["mapIndexN"] = function(x) { return function(f) { return $String["deconstruct"]("")(function(c) { return function(str) { return $String["cons"](f(x)(c))($String["mapIndexN"](Prelude["+"](x)(1))(f)(str)); }; }); }; };
Variant["bind"] = function(s) { return function(f) { return Prelude["match"](s)(f)(Prelude["embed"](s)); }; };
Variant["map"] = function(s) { return function(f) { return Prelude["match"](s)(function(x) { return Prelude["^"](s)(f(x)); })(Prelude["embed"](s)); }; };
IO["map3"] = function(f) { return function(act1) { return function(act2) { return IO["apply"](IO["map2"](f)(act1)(act2)); }; }; };
List[":"] = function(x) { return function(xs) { return List["makeList"](Prelude["^"]("Cons")(Prelude[";"](Prelude[":="]("Head")(x))(Prelude[";"](Prelude[":="]("Tail")(xs))(Prelude["unit"])))); }; };
List["deconstruct"] = function(x) { return function(f) { return function(xs) { return Prelude["match"]("Cons")(function(r) { return f(Prelude["?"]("Head")(r))(Prelude["?"]("Tail")(r)); })(Prelude["else"](x))(List["getList"](xs)); }; }; };
List["empty"] = List["makeList"](Prelude["only"]("Empty"));
Main["init"] = Prelude[";"](Prelude[":="]("Input")(""))(Prelude[";"](Prelude[":="]("Message")(""))(Prelude[";"](Prelude[":="]("Modulo")(2))(Prelude["unit"])));
$Math["degrees"] = function(x) { return Prelude["/"](Prelude["*"](x)($Math["tau"]))(360); };
$Math["turns"] = function(x) { return Prelude["*"](x)($Math["tau"]); };
Prelude["!="] = function(s) { return function(x) { return function(r) { return Prelude[";"](Prelude[":="](s)(x))(Prelude["delete"](s)(r)); }; }; };
Prelude["&"] = function(x) { return function(y) { return Prelude[";"](Prelude[":="]("First")(x))(Prelude[";"](Prelude[":="]("Second")(y))(Prelude["unit"])); }; };
Prelude["false"] = Prelude["only"]("False");
Prelude["if"] = function(c) { return function(x) { return function(y) { return Prelude["match"]("True")(x)(Prelude["general"](y))(c); }; }; };
Prelude["true"] = Prelude["only"]("True");
Program["fromIO"] = function(act) { return function(state) { return IO["map"](function(x) { return Prelude[";"](Prelude[":="]("Set")(state))(Prelude[";"](Prelude[":="]("Return")(x))(Prelude["unit"])); })(act); }; };
Program["getBy"] = function(f) { return function(state) { return IO["pure"](Prelude[";"](Prelude[":="]("Set")(state))(Prelude[";"](Prelude[":="]("Return")(f(state)))(Prelude["unit"]))); }; };
Program["modify"] = function(f) { return function(state) { return IO["pure"](Prelude[";"](Prelude[":="]("Set")(f(state)))(Prelude[";"](Prelude[":="]("Return")(Prelude["unit"]))(Prelude["unit"]))); }; };
Program["then"] = function(act2) { return function(act1) { return Program["bind"](function(_x) { return act2; })(act1); }; };
Result["bind"] = Variant["bind"]("Just");
Result["default"] = function(x) { return Prelude["match"]("Just")(Prelude["identity"])(Prelude["else"](x)); };
Result["map"] = Variant["map"]("Just");
Result["nothing"] = Prelude["only"]("Error");
Spa_Property["attribute"] = function($name) { return function(value) { return Spa_Property["makeProperty"](Prelude["^"]("Attribute")(Prelude[";"](Prelude[":="]("Name")($name))(Prelude[";"](Prelude[":="]("Value")(value))(Prelude["unit"])))); }; };
Spa_Property["concat"] = Prelude["<<"](Spa_Property["makeProperty"])(Prelude["^"]("Multiple"));
Spa_Property["listener"] = function($event) { return function(callback) { return Spa_Property["makeProperty"](Prelude["^"]("Listener")(Prelude[";"](Prelude[":="]("Event")($event))(Prelude[";"](Prelude[":="]("Callback")(callback))(Prelude["unit"])))); }; };
Spa_Property["style"] = function($name) { return function(value) { return Spa_Property["makeProperty"](Prelude["^"]("Style")(Prelude[";"](Prelude[":="]("Name")($name))(Prelude[";"](Prelude[":="]("Value")(value))(Prelude["unit"])))); }; };
$String["mapIndex"] = $String["mapIndexN"](0);
Variant["apply"] = function(s) { return function(vf) { return function(vx) { return Prelude["match"](s)(function(f) { return Variant["map"](s)(f)(vx); })(Prelude["embed"](s))(vf); }; }; };
IO["map4"] = function(f) { return function(act1) { return function(act2) { return function(act3) { return IO["apply"](IO["map3"](f)(act1)(act2)(act3)); }; }; }; };
List["++"] = function(xs) { return function(ys) { return List["deconstruct"](ys)(function(x) { return function(xt) { return List[":"](x)(List["++"](xt)(ys)); }; })(xs); }; };
List["findN"] = function(n) { return function(x) { return List["deconstruct"](List["empty"])(function(y) { return function(ys) { return (function() { var indexes = List["findN"](Prelude["+"](n)(1))(x)(ys); return Prelude["if"](Prelude["=="](x)(y))(function(_x) { return List[":"](n)(indexes); })(Prelude["else"](indexes)); })(); }; }); }; };
List["foldLeft"] = function(f) { return function(n) { return List["deconstruct"](n)(function(x) { return function(xs) { return List["foldLeft"](f)(f(x)(n))(xs); }; }); }; };
List["foldRight"] = function(f) { return function(n) { return List["deconstruct"](n)(function(x) { return function(xs) { return f(x)(List["foldRight"](f)(n)(xs)); }; }); }; };
List["get"] = function(n) { return List["deconstruct"](Result["nothing"])(function(x) { return function(xs) { return Prelude["if"](Prelude["<"](n)(0))(function(_x) { return Result["nothing"]; })(Prelude["else"](Prelude["if"](Prelude["=="](n)(0))(function(_x) { return Prelude["^"]("Just")(x); })(Prelude["else"](List["get"](Prelude["~"](n)(1))(xs))))); }; }); };
List["head"] = List["deconstruct"](Result["nothing"])(function(x) { return function(xs) { return Prelude["^"]("Just")(x); }; });
List["isEmpty"] = List["deconstruct"](Prelude["false"])(function(x) { return function(xs) { return Prelude["true"]; }; });
List["length"] = List["deconstruct"](0)(function(x) { return function(xs) { return Prelude["+"](1)(List["length"](xs)); }; });
List["map"] = function(f) { return List["deconstruct"](List["empty"])(function(x) { return function(xs) { return List[":"](f(x))(List["map"](f)(xs)); }; }); };
List["mapIndexN"] = function(n) { return function(f) { return List["deconstruct"](List["empty"])(function(x) { return function(xs) { return List[":"](f(n)(x))(List["mapIndexN"](Prelude["+"](n)(1))(f)(xs)); }; }); }; };
List["single"] = function(x) { return List[":"](x)(List["empty"]); };
List["some"] = function(f) { return List["deconstruct"](Prelude["false"])(function(x) { return function(xs) { return Prelude["if"](f(x))(function(_x) { return Prelude["true"]; })(function(_x) { return List["some"](f)(xs); }); }; }); };
List["tail"] = List["deconstruct"](Result["nothing"])(function(x) { return function(xs) { return Prelude["^"]("Just")(xs); }; });
List["zipApply"] = function(fs) { return function(xs) { return List["deconstruct"](List["empty"])(function(f) { return function(ft) { return List["deconstruct"](List["empty"])(function(x) { return function(xt) { return List[":"](f(x))(List["zipApply"](ft)(xt)); }; })(xs); }; })(fs); }; };
Main["inputEdit"] = function(input) { return Program["modify"](Prelude["!="]("Input")(input)); };
Main["message"] = function(modulo) { return function(input) { return Prelude["match"]("Just")(Prelude[">>"](Prelude["floor"])(function(num) { return Prelude["if"](Prelude["=="](Prelude["mod"](modulo)(num))(0))(function(_x) { return "that's numberwang!"; })(function(_x) { return "that isn't numberwang"; }); }))(Prelude["else"]("that isn't a number"))($String["toFloat"](input)); }; };
Main["paragraph"] = function(str) { return Spa_Element["node"]("p")(List["empty"])(List[":"](Spa_Element["text"](str))(List["empty"])); };
Prelude["#="] = function(s) { return function(f) { return function(r) { return Prelude[";"](Prelude["!="](s)(f(Prelude["?"](s)(r))))(r); }; }; };
Prelude["and"] = function(x) { return function(y) { return Prelude["match"]("True")(y)(function(_x) { return Prelude["false"]; })(x); }; };
Prelude["compare"] = function(x) { return function(y) { return Prelude["if"](Prelude["=="](x)(y))(function(_x) { return Prelude["only"]("Equal"); })(Prelude["else"](Prelude["if"](Prelude["<"](x)(y))(function(_x) { return Prelude["only"]("Less"); })(Prelude["else"](Prelude["only"]("Greater"))))); }; };
Prelude["max"] = function(x) { return function(y) { return Prelude["if"](Prelude[">"](x)(y))(function(_x) { return x; })(function(_x) { return y; }); }; };
Prelude["min"] = function(x) { return function(y) { return Prelude["if"](Prelude["<"](x)(y))(function(_x) { return x; })(function(_x) { return y; }); }; };
Prelude["not"] = Prelude["match"]("True")(function(_x) { return Prelude["false"]; })(function(_x) { return Prelude["true"]; });
Prelude["or"] = function(x) { return function(y) { return Prelude["match"]("True")(function(_x) { return Prelude["true"]; })(Prelude["general"](y))(x); }; };
Prelude["trunc"] = function(x) { return Prelude["if"](Prelude["<"](x)(0))(function(_x) { return Prelude["ceil"](x); })(function(_x) { return Prelude["floor"](x); }); };
Program["apply"] = function(act1) { return function(act2) { return function(state) { return IO["bind"](function(result1) { return IO["bind"](function(result2) { return IO["pure"](Prelude[";"](Prelude["!="]("Return")(Prelude["?"]("Return")(result1)(Prelude["?"]("Return")(result2))))(result2)); })(act2(Prelude["?"]("Set")(result1))); })(act1(state)); }; }; };
Program["get"] = Program["getBy"](Prelude["identity"]);
Program["pure"] = Prelude["<<"](Program["fromIO"])(IO["pure"]);
Program["put"] = function(state) { return Program["modify"](function(_x) { return state; }); };
Result["apply"] = Variant["apply"]("Just");
Spa["setTitle"] = Prelude["<<"](Program["fromIO"])(Spa["setTitleIO"]);
Spa_Event["preventDefault"] = Prelude["<<"](Program["fromIO"])(Spa_Event["preventDefaultIO"]);
Spa_Event["stopPropagation"] = Prelude["<<"](Program["fromIO"])(Spa_Event["stopPropagationIO"]);
Spa_Property["onBlur"] = Prelude["<<"](Spa_Property["listener"]("onblur"))(Prelude["const"]);
Spa_Property["onClick"] = Prelude["<<"](Spa_Property["listener"]("onclick"))(Prelude["const"]);
Spa_Property["onDoubleClick"] = Prelude["<<"](Spa_Property["listener"]("ondblclick"))(Prelude["const"]);
Spa_Property["onFocus"] = Prelude["<<"](Spa_Property["listener"]("onfocus"))(Prelude["const"]);
Spa_Property["onMouseDown"] = Prelude["<<"](Spa_Property["listener"]("onmousedown"))(Prelude["const"]);
Spa_Property["onMouseEnter"] = Prelude["<<"](Spa_Property["listener"]("onmouseenter"))(Prelude["const"]);
Spa_Property["onMouseLeave"] = Prelude["<<"](Spa_Property["listener"]("onmouseleave"))(Prelude["const"]);
Spa_Property["onMouseOut"] = Prelude["<<"](Spa_Property["listener"]("onmouseout"))(Prelude["const"]);
Spa_Property["onMouseOver"] = Prelude["<<"](Spa_Property["listener"]("onmouseover"))(Prelude["const"]);
Spa_Property["onMouseUp"] = Prelude["<<"](Spa_Property["listener"]("onmousedown"))(Prelude["const"]);
$String["count"] = function(f) { return (function() { var add = function(c) { return function(x) { return Prelude["if"](f(c))(function(_x) { return Prelude["+"](x)(1); })(function(_x) { return x; }); }; }; return $String["foldRight"](add)(0); })(); };
$String["filter"] = function(f) { return (function() { var add = function(c) { return function(str) { return Prelude["if"](f(c))(function(_x) { return $String["cons"](c)(str); })(function(_x) { return str; }); }; }; return $String["foldRight"](add)(""); })(); };
$String["get"] = function(x) { return $String["deconstruct"](Result["nothing"])(function(c) { return function(str) { return Prelude["if"](Prelude["<"](x)(0))(function(_x) { return Result["nothing"]; })(Prelude["else"](Prelude["if"](Prelude["=="](x)(0))(function(_x) { return Prelude["^"]("Just")(c); })(Prelude["else"]($String["get"](Prelude["~"](x)(1))(str))))); }; }); };
$String["head"] = $String["deconstruct"](Result["nothing"])(function(c) { return function(str) { return Prelude["^"]("Just")(c); }; });
$String["some"] = function(f) { return $String["deconstruct"](Prelude["false"])(function(c) { return function(str) { return Prelude["if"](f(c))(function(_x) { return Prelude["true"]; })(function(_x) { return $String["some"](f)(str); }); }; }); };
$String["tail"] = $String["deconstruct"](Result["nothing"])(function(c) { return function(str) { return Prelude["^"]("Just")(str); }; });
Variant["map2"] = function(s) { return function(f) { return function(v) { return Variant["apply"](s)(Variant["map"](s)(f)(v)); }; }; };
IO["sequence"] = List["foldRight"](IO["map2"](List[":"]))(IO["pure"](List["empty"]));
List["all"] = function(f) { return List["deconstruct"](Prelude["true"])(function(x) { return function(xs) { return Prelude["if"](Prelude["not"](f(x)))(function(_x) { return Prelude["false"]; })(function(_x) { return List["all"](f)(xs); }); }; }); };
List["apply"] = function(fs) { return function(xs) { return List["deconstruct"](List["empty"])(function(f) { return function(ft) { return List["++"](List["map"](f)(xs))(List["apply"](ft)(xs)); }; })(fs); }; };
List["concat"] = List["foldRight"](List["++"])(List["empty"]);
List["contains"] = function(x) { return List["some"](function(_x) { return Prelude["=="](_x)(x); }); };
List["count"] = function(f) { return (function() { var add = function(x) { return function(n) { return Prelude["if"](f(x))(function(_x) { return Prelude["+"](n)(1); })(function(_x) { return n; }); }; }; return List["foldRight"](add)(0); })(); };
List["filter"] = function(f) { return (function() { var add = function(x) { return function(xs) { return Prelude["if"](f(x))(function(_x) { return List[":"](x)(xs); })(function(_x) { return xs; }); }; }; return List["foldRight"](add)(List["empty"]); })(); };
List["find"] = List["findN"](0);
List["mapIndex"] = List["mapIndexN"](0);
List["mapResult"] = function(f) { return (function() { var add = function(x) { return function(xs) { return Prelude["match"]("Just")(function(_x) { return List[":"](_x)(xs); })(Prelude["else"](xs))(f(x)); }; }; return List["foldRight"](add)(List["empty"]); })(); };
List["partition"] = function(f) { return (function() { var add = function(x) { return function(xs) { return Prelude["if"](f(x))(function(_x) { return Prelude[";"](Prelude["#="]("Pass")(List[":"](x)))(xs); })(function(_x) { return Prelude[";"](Prelude["#="]("Fail")(List[":"](x)))(xs); }); }; }; return List["foldRight"](add)(Prelude[";"](Prelude[":="]("Pass")(List["empty"]))(Prelude[";"](Prelude[":="]("Fail")(List["empty"]))(Prelude["unit"]))); })(); };
List["product"] = List["foldRight"](Prelude["*"])(1);
List["reverse"] = List["deconstruct"](List["empty"])(function(x) { return function(xs) { return List["++"](List["reverse"](xs))(List["single"](x)); }; });
List["separate"] = (function() { var add = function(x) { return function(xs) { return Prelude[";"](Prelude["#="]("First")(List[":"](Prelude["?"]("First")(x))))(Prelude[";"](Prelude["#="]("Second")(List[":"](Prelude["?"]("Second")(x))))(xs)); }; }; return List["foldRight"](add)(Prelude["&"](List["empty"])(List["empty"])); })();
List["sum"] = List["foldRight"](Prelude["+"])(0);
List["zip2"] = function(f) { return function(xs) { return List["zipApply"](List["map"](f)(xs)); }; };
Prelude["/="] = function(x) { return function(y) { return Prelude["not"](Prelude["=="](x)(y)); }; };
Prelude["<="] = function(x) { return function(y) { return Prelude["or"](Prelude["<"](x)(y))(function(_x) { return Prelude["=="](x)(y); }); }; };
Prelude[">="] = function(x) { return function(y) { return Prelude["or"](Prelude[">"](x)(y))(function(_x) { return Prelude["=="](x)(y); }); }; };
Prelude["isInfinite"] = function(x) { return Prelude["not"](Prelude["or"](Prelude["isFinite"](x))(function(_x) { return Prelude["isNaN"](x); })); };
Program["map"] = function(f) { return function(act) { return function(state) { return IO["map"](Prelude["#="]("Return")(f))(act(state)); }; }; };
Program["none"] = Program["pure"](Prelude["unit"]);
Result["map2"] = Variant["map2"]("Just");
Spa["addRoutes"] = Prelude[">>"](List["map"](Spa["addRoute"]))(List["foldRight"](Prelude[">>"])(Prelude["identity"]));
Spa["document"] = function(init) { return function(route) { return Spa["application"](init)("/")(List["single"](Prelude[";"](Prelude[":="]("Url")("/"))(route))); }; };
Spa_Element["addProperty"] = function(prop) { return Prelude["match"]("Style")(function(style) { return Spa_Element["addStyle"](Prelude["?"]("Name")(style))(Prelude["?"]("Value")(style)); })(Prelude["match"]("Attribute")(function(attr) { return Spa_Element["addAttribute"](Prelude["?"]("Name")(attr))(Prelude["?"]("Value")(attr)); })(Prelude["match"]("Multiple")(Prelude[">>"](List["map"](Spa_Element["addProperty"]))(List["foldRight"](Prelude[">>"])(Prelude["identity"])))(Prelude["match"]("Listener")(function(lis) { return Spa_Element["addListener"](Prelude["?"]("Event")(lis))(Prelude["?"]("Callback")(lis)); })(Prelude["absurd"]))))(Spa_Property["getProperty"](prop)); };
Spa_Property["onSubmit"] = function(callback) { return Spa_Property["listener"]("onsubmit")(function($event) { return Program["then"](callback)(Spa_Event["stopPropagation"]($event)); }); };
$String["all"] = function(f) { return $String["deconstruct"](Prelude["true"])(function(c) { return function(str) { return Prelude["if"](Prelude["not"](f(c)))(function(_x) { return Prelude["false"]; })(function(_x) { return $String["all"](f)(str); }); }; }); };
$String["concat"] = List["foldRight"]($String["<>"])("");
$String["join"] = function(sep) { return (function() { var append = function(str1) { return function(str2) { return Prelude["if"]($String["isEmpty"](str2))(function(_x) { return str1; })(function(_x) { return $String["<>"]($String["<>"](str1)(sep))(str2); }); }; }; return List["foldRight"](append)(""); })(); };
$String["partition"] = function(f) { return (function() { var add = function(c) { return function(str) { return Prelude["if"](f(c))(function(_x) { return Prelude[";"](Prelude["#="]("Pass")($String["cons"](c)))(str); })(function(_x) { return Prelude[";"](Prelude["#="]("Fail")($String["cons"](c)))(str); }); }; }; return $String["foldRight"](add)(Prelude[";"](Prelude[":="]("Pass")(""))(Prelude[";"](Prelude[":="]("Fail")(""))(Prelude["unit"]))); })(); };
Variant["map3"] = function(s) { return function(f) { return function(v1) { return function(v2) { return Variant["apply"](s)(Variant["map2"](s)(f)(v1)(v2)); }; }; }; };
Variant["sequence"] = function(s) { return List["foldRight"](Variant["map2"](s)(List[":"]))(Prelude["^"](s)(List["empty"])); };
IO["sequenceMap"] = function(f) { return function(xs) { return IO["sequence"](List["map"](f)(xs)); }; };
List["concatMap"] = function(f) { return function(xs) { return List["concat"](List["map"](f)(xs)); }; };
List["drop"] = function(n) { return function(xs) { return Prelude["if"](Prelude["<="](n)(0))(function(_x) { return xs; })(function(_x) { return List["deconstruct"](List["empty"])(function(x) { return function(xt) { return List["drop"](Prelude["~"](n)(1))(xt); }; })(xs); }); }; };
List["map2"] = function(f) { return function(xs) { return List["apply"](List["map"](f)(xs)); }; };
List["range"] = function(m) { return function(n) { return Prelude["if"](Prelude["<="](n)(m))(function(_x) { return List["empty"]; })(function(_x) { return List[":"](m)(List["range"](Prelude["+"](m)(1))(n)); }); }; };
List["repeat"] = function(n) { return function(x) { return Prelude["if"](Prelude["<="](n)(0))(function(_x) { return List["empty"]; })(function(_x) { return List[":"](x)(List["repeat"](Prelude["~"](n)(1))(x)); }); }; };
List["sortBy"] = function(f) { return List["deconstruct"](List["empty"])(function(x) { return function(xs) { return (function() { var half = List["partition"](function(y) { return Prelude["<"](f(y))(f(x)); })(xs); return List["++"](List["sortBy"](f)(Prelude["?"]("Pass")(half)))(List["++"](List["single"](x))(List["sortBy"](f)(Prelude["?"]("Fail")(half)))); })(); }; }); };
List["sortWith"] = function(f) { return List["deconstruct"](List["empty"])(function(x) { return function(xs) { return (function() { var half = List["partition"](function(y) { return Prelude["=="](f(y)(x))(Prelude["only"]("Less")); })(xs); return List["++"](List["sortWith"](f)(Prelude["?"]("Pass")(half)))(List["++"](List["single"](x))(List["sortWith"](f)(Prelude["?"]("Fail")(half)))); })(); }; }); };
List["take"] = function(n) { return function(xs) { return Prelude["if"](Prelude["<="](n)(0))(function(_x) { return List["empty"]; })(function(_x) { return List["deconstruct"](List["empty"])(function(x) { return function(xt) { return List[":"](x)(List["take"](Prelude["~"](n)(1))(xt)); }; })(xs); }); }; };
List["zip3"] = function(f) { return function(xs1) { return function(xs2) { return List["zipApply"](List["zip2"](f)(xs1)(xs2)); }; }; };
Main["changeMessage"] = Program["modify"](function(state) { return (function() { var input = Prelude["?"]("Input")(state); return (function() { var modulo = Prelude["?"]("Modulo")(state); return Prelude[";"](Prelude["!="]("Message")(Main["message"](modulo)(input)))(Prelude[";"](Prelude["!="]("Modulo")(Prelude["if"](Prelude[">="](modulo)(8))(function(_x) { return 2; })(function(_x) { return Prelude["+"](modulo)(1); })))(state)); })(); })(); });
Prelude["constrain"] = function(x) { return function(y) { return function(z) { return Prelude["if"](Prelude["<="](z)(x))(function(_x) { return x; })(Prelude["else"](Prelude["if"](Prelude[">="](z)(y))(function(_x) { return y; })(Prelude["else"](z)))); }; }; };
Program["map2"] = function(f) { return function(act) { return Program["apply"](Program["map"](f)(act)); }; };
Result["map3"] = Variant["map3"]("Just");
Result["sequence"] = Variant["sequence"]("Just");
Spa_Element["addProperties"] = Prelude[">>"](List["map"](Spa_Element["addProperty"]))(List["foldRight"](Prelude[">>"])(Prelude["identity"]));
Spa_Property["onCheck"] = function(callback) { return Spa_Property["listener"]("onchange")(function($event) { return Prelude["match"]("Just")(callback)(Prelude["else"](Program["none"]))(Spa_Event["boolField"](List[":"]("target")(List[":"]("checked")(List["empty"])))($event)); }); };
Spa_Property["onInput"] = function(callback) { return Spa_Property["listener"]("oninput")(function($event) { return Prelude["match"]("Just")(function(input) { return Program["then"](callback(input))(Spa_Event["stopPropagation"]($event)); })(Prelude["else"](Program["none"]))(Spa_Event["stringField"](List[":"]("target")(List[":"]("value")(List["empty"])))($event)); }); };
Spa_Property["onKeyDown"] = function(callback) { return Spa_Property["listener"]("onkeydown")(function($event) { return Prelude["match"]("Just")(callback)(Prelude["else"](Program["none"]))(Spa_Event["stringField"](List[":"]("key")(List["empty"]))($event)); }); };
Spa_Property["onKeyUp"] = function(callback) { return Spa_Property["listener"]("onkeyup")(function($event) { return Prelude["match"]("Just")(callback)(Prelude["else"](Program["none"]))(Spa_Event["stringField"](List[":"]("key")(List["empty"]))($event)); }); };
$String["concatMap"] = function(f) { return function(xs) { return $String["concat"](List["map"](f)(xs)); }; };
$String["dropLeft"] = function(x) { return function(str) { return Prelude["if"](Prelude["<="](x)(0))(function(_x) { return str; })(function(_x) { return $String["slice"](x)($String["length"](str))(str); }); }; };
$String["dropRight"] = function(x) { return function(str) { return Prelude["if"](Prelude["<="](x)(0))(function(_x) { return str; })(function(_x) { return $String["slice"](0)(Prelude["negate"](x))(str); }); }; };
$String["joinMap"] = function(sep) { return function(f) { return function(xs) { return $String["join"](sep)(List["map"](f)(xs)); }; }; };
$String["padLeft"] = function(x) { return function(str) { return Prelude["if"](Prelude[">="]($String["length"](str))(x))(function(_x) { return str; })(function(_x) { return $String["<>"](" ")($String["padLeft"](Prelude["~"](x)(1))(str)); }); }; };
$String["padRight"] = function(x) { return function(str) { return Prelude["if"](Prelude[">="]($String["length"](str))(x))(function(_x) { return str; })(function(_x) { return $String["<>"]($String["padRight"](Prelude["~"](x)(1))(str))(" "); }); }; };
$String["repeat"] = function(n) { return function(str) { return Prelude["if"](Prelude["<="](n)(0))(function(_x) { return ""; })(function(_x) { return $String["<>"](str)($String["repeat"](Prelude["~"](n)(1))(str)); }); }; };
$String["takeLeft"] = function(x) { return function(str) { return Prelude["if"](Prelude["<="](x)(0))(function(_x) { return ""; })(function(_x) { return $String["slice"](0)(x)(str); }); }; };
$String["takeRight"] = function(x) { return function(str) { return Prelude["if"](Prelude["<="](x)(0))(function(_x) { return ""; })(function(_x) { return $String["slice"](Prelude["negate"](x))($String["length"](str))(str); }); }; };
Variant["map4"] = function(s) { return function(f) { return function(v1) { return function(v2) { return function(v3) { return Variant["apply"](s)(Variant["map3"](s)(f)(v1)(v2)(v3)); }; }; }; }; };
Variant["sequenceMap"] = function(s) { return function(f) { return function(xs) { return Variant["sequence"](s)(List["map"](f)(xs)); }; }; };
List["map3"] = function(f) { return function(xs1) { return function(xs2) { return List["apply"](List["map2"](f)(xs1)(xs2)); }; }; };
List["sort"] = List["sortBy"](Prelude["identity"]);
List["zip4"] = function(f) { return function(xs1) { return function(xs2) { return function(xs3) { return List["zipApply"](List["zip3"](f)(xs1)(xs2)(xs3)); }; }; }; };
Main["inputField"] = Spa_Element["node"]("input")(List[":"](Spa_Property["onInput"](Main["inputEdit"]))(List[":"](Spa_Property["attribute"]("placeholder")("type numbers here"))(List["empty"])))(List["empty"]);
Main["submitButton"] = Spa_Element["node"]("button")(List[":"](Spa_Property["onClick"](Main["changeMessage"]))(List["empty"]))(List[":"](Spa_Element["text"]("submit"))(List["empty"]));
Program["map3"] = function(f) { return function(act1) { return function(act2) { return Program["apply"](Program["map2"](f)(act1)(act2)); }; }; };
Program["sequence"] = List["foldRight"](Program["map2"](List[":"]))(Program["pure"](List["empty"]));
Result["map4"] = Variant["map4"]("Just");
Result["sequenceMap"] = Variant["sequenceMap"]("Just");
$String["find"] = function(sub) { return function(str) { return (function() { var matches = function(i) { return $String["startsWith"](sub)($String["dropLeft"](i)(str)); }; return List["filter"](matches)(List["range"](0)($String["length"](str))); })(); }; };
List["map4"] = function(f) { return function(xs1) { return function(xs2) { return function(xs3) { return List["apply"](List["map3"](f)(xs1)(xs2)(xs3)); }; }; }; };
Main["view"] = function(state) { return Spa_Element["node"]("div")(List["empty"])(List[":"](Main["inputField"])(List[":"](Main["submitButton"])(List[":"](Main["paragraph"](Prelude["?"]("Message")(state)))(List["empty"])))); };
Program["map4"] = function(f) { return function(act1) { return function(act2) { return function(act3) { return Program["apply"](Program["map3"](f)(act1)(act2)(act3)); }; }; }; };
Program["sequenceMap"] = function(f) { return function(xs) { return Program["sequence"](List["map"](f)(xs)); }; };
Main["main"] = Spa["document"](Main["init"])(Prelude[";"](Prelude[":="]("Start")(Spa["setTitle"]("numberwang")))(Prelude[";"](Prelude[":="]("View")(Main["view"]))(Prelude["unit"])));
Main["main"]();