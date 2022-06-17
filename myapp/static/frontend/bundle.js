
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.6' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Selector.svelte generated by Svelte v3.46.6 */

    const { console: console_1$2 } = globals;

    function create_fragment$d(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("selector");
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selector', slots, []);
    	let { severityItems = [] } = $$props;
    	console.log(severityItems);
    	const writable_props = ['severityItems'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Selector> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('severityItems' in $$props) $$invalidate(0, severityItems = $$props.severityItems);
    	};

    	$$self.$capture_state = () => ({ severityItems });

    	$$self.$inject_state = $$props => {
    		if ('severityItems' in $$props) $$invalidate(0, severityItems = $$props.severityItems);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [severityItems];
    }

    class Selector extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { severityItems: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selector",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get severityItems() {
    		throw new Error("<Selector>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set severityItems(value) {
    		throw new Error("<Selector>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Tailwindcss.svelte generated by Svelte v3.46.6 */

    function create_fragment$c(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tailwindcss', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tailwindcss> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\HelperFunctions.svelte generated by Svelte v3.46.6 */

    function create_fragment$b(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getCookie(name) {
    	let cookieValue = null;

    	if (document.cookie && document.cookie !== '') {
    		const cookies = document.cookie.split(';');

    		for (let i = 0; i < cookies.length; i++) {
    			const cookie = cookies[i].trim();

    			// Does this cookie string begin with the name we want?
    			if (cookie.substring(0, name.length + 1) === name + '=') {
    				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    				break;
    			}
    		}
    	}

    	return cookieValue;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HelperFunctions', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HelperFunctions> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getCookie });
    	return [];
    }

    class HelperFunctions extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HelperFunctions",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    function isOutOfViewport (parent, container) {
        const parentBounding = parent.getBoundingClientRect();
        const boundingContainer = container.getBoundingClientRect();
        const out = {};

        out.top = parentBounding.top < 0;
        out.left = parentBounding.left < 0;
        out.bottom =
            parentBounding.bottom + boundingContainer.height >
            (window.innerHeight || document.documentElement.clientHeight);

        out.right =
            parentBounding.right >
            (window.innerWidth || document.documentElement.clientWidth);
        out.any = out.top || out.left || out.bottom || out.right;

        return out;
    }

    /* node_modules\svelte-select\src\Item.svelte generated by Svelte v3.46.6 */

    const file$a = "node_modules\\svelte-select\\src\\Item.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "";
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-ybdqo9");
    			add_location(div, file$a, 77, 0, 1836);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getOptionLabel, item, filterText*/ 7 && raw_value !== (raw_value = /*getOptionLabel*/ ctx[0](/*item*/ ctx[1], /*filterText*/ ctx[2]) + "")) div.innerHTML = raw_value;
    			if (dirty & /*itemClasses*/ 8 && div_class_value !== (div_class_value = "item " + /*itemClasses*/ ctx[3] + " svelte-ybdqo9")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Item', slots, []);
    	let { isActive = false } = $$props;
    	let { isFirst = false } = $$props;
    	let { isHover = false } = $$props;
    	let { isSelectable = false } = $$props;
    	let { getOptionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	let { filterText = '' } = $$props;
    	let itemClasses = '';

    	const writable_props = [
    		'isActive',
    		'isFirst',
    		'isHover',
    		'isSelectable',
    		'getOptionLabel',
    		'item',
    		'filterText'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Item> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('isActive' in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ('isFirst' in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ('isHover' in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ('isSelectable' in $$props) $$invalidate(7, isSelectable = $$props.isSelectable);
    		if ('getOptionLabel' in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('filterText' in $$props) $$invalidate(2, filterText = $$props.filterText);
    	};

    	$$self.$capture_state = () => ({
    		isActive,
    		isFirst,
    		isHover,
    		isSelectable,
    		getOptionLabel,
    		item,
    		filterText,
    		itemClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('isActive' in $$props) $$invalidate(4, isActive = $$props.isActive);
    		if ('isFirst' in $$props) $$invalidate(5, isFirst = $$props.isFirst);
    		if ('isHover' in $$props) $$invalidate(6, isHover = $$props.isHover);
    		if ('isSelectable' in $$props) $$invalidate(7, isSelectable = $$props.isSelectable);
    		if ('getOptionLabel' in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    		if ('filterText' in $$props) $$invalidate(2, filterText = $$props.filterText);
    		if ('itemClasses' in $$props) $$invalidate(3, itemClasses = $$props.itemClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*isActive, isFirst, isHover, item, isSelectable*/ 242) {
    			{
    				const classes = [];

    				if (isActive) {
    					classes.push('active');
    				}

    				if (isFirst) {
    					classes.push('first');
    				}

    				if (isHover) {
    					classes.push('hover');
    				}

    				if (item.isGroupHeader) {
    					classes.push('groupHeader');
    				}

    				if (item.isGroupItem) {
    					classes.push('groupItem');
    				}

    				if (!isSelectable) {
    					classes.push('notSelectable');
    				}

    				$$invalidate(3, itemClasses = classes.join(' '));
    			}
    		}
    	};

    	return [
    		getOptionLabel,
    		item,
    		filterText,
    		itemClasses,
    		isActive,
    		isFirst,
    		isHover,
    		isSelectable
    	];
    }

    class Item extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			isActive: 4,
    			isFirst: 5,
    			isHover: 6,
    			isSelectable: 7,
    			getOptionLabel: 0,
    			item: 1,
    			filterText: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Item",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get isActive() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFirst() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFirst(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isHover() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isHover(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSelectable() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSelectable(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Item>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Item>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-select\src\List.svelte generated by Svelte v3.46.6 */
    const file$9 = "node_modules\\svelte-select\\src\\List.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[42] = i;
    	return child_ctx;
    }

    // (308:4) {:else}
    function create_else_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*items*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block_2(ctx);
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();

    			if (each_1_else) {
    				each_1_else.c();
    			}
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);

    			if (each_1_else) {
    				each_1_else.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getGroupHeaderLabel, items, handleHover, handleClick, Item, filterText, getOptionLabel, value, optionIdentifier, hoverItemIndex, noOptionsMessage, hideEmptyState*/ 114390) {
    				each_value = /*items*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();

    				if (!each_value.length && each_1_else) {
    					each_1_else.p(ctx, dirty);
    				} else if (!each_value.length) {
    					each_1_else = create_else_block_2(ctx);
    					each_1_else.c();
    					each_1_else.m(each_1_anchor.parentNode, each_1_anchor);
    				} else if (each_1_else) {
    					each_1_else.d(1);
    					each_1_else = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    			if (each_1_else) each_1_else.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(308:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (285:4) {#if isVirtualList}
    function create_if_block$4(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*VirtualList*/ ctx[3];

    	function switch_props(ctx) {
    		return {
    			props: {
    				items: /*items*/ ctx[1],
    				itemHeight: /*itemHeight*/ ctx[8],
    				$$slots: {
    					default: [
    						create_default_slot,
    						({ item, i }) => ({ 41: item, 42: i }),
    						({ item, i }) => [0, (item ? 1024 : 0) | (i ? 2048 : 0)]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.items = /*items*/ ctx[1];
    			if (dirty[0] & /*itemHeight*/ 256) switch_instance_changes.itemHeight = /*itemHeight*/ ctx[8];

    			if (dirty[0] & /*Item, filterText, getOptionLabel, value, optionIdentifier, hoverItemIndex, items*/ 9814 | dirty[1] & /*$$scope, item, i*/ 11264) {
    				switch_instance_changes.$$scope = { dirty, ctx };
    			}

    			if (switch_value !== (switch_value = /*VirtualList*/ ctx[3])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(285:4) {#if isVirtualList}",
    		ctx
    	});

    	return block;
    }

    // (330:8) {:else}
    function create_else_block_2(ctx) {
    	let if_block_anchor;
    	let if_block = !/*hideEmptyState*/ ctx[11] && create_if_block_2$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*hideEmptyState*/ ctx[11]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(330:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (331:12) {#if !hideEmptyState}
    function create_if_block_2$2(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*noOptionsMessage*/ ctx[12]);
    			attr_dev(div, "class", "empty svelte-1mmk1xt");
    			add_location(div, file$9, 331, 16, 10332);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noOptionsMessage*/ 4096) set_data_dev(t, /*noOptionsMessage*/ ctx[12]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(331:12) {#if !hideEmptyState}",
    		ctx
    	});

    	return block;
    }

    // (312:12) {:else}
    function create_else_block_1$1(ctx) {
    	let div;
    	let switch_instance;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Item*/ ctx[4];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[41],
    				filterText: /*filterText*/ ctx[13],
    				getOptionLabel: /*getOptionLabel*/ ctx[6],
    				isFirst: isItemFirst(/*i*/ ctx[42]),
    				isActive: isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]),
    				isSelectable: isItemSelectable(/*item*/ ctx[41])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	function mouseover_handler_1() {
    		return /*mouseover_handler_1*/ ctx[29](/*i*/ ctx[42]);
    	}

    	function focus_handler_1() {
    		return /*focus_handler_1*/ ctx[30](/*i*/ ctx[42]);
    	}

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[31](/*item*/ ctx[41], /*i*/ ctx[42], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			t = space();
    			attr_dev(div, "class", "listItem");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$9, 312, 16, 9512);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", mouseover_handler_1, false, false, false),
    					listen_dev(div, "focus", focus_handler_1, false, false, false),
    					listen_dev(div, "click", click_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.item = /*item*/ ctx[41];
    			if (dirty[0] & /*filterText*/ 8192) switch_instance_changes.filterText = /*filterText*/ ctx[13];
    			if (dirty[0] & /*getOptionLabel*/ 64) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[6];
    			if (dirty[0] & /*items, value, optionIdentifier*/ 1538) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 6) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]);
    			if (dirty[0] & /*items*/ 2) switch_instance_changes.isSelectable = isItemSelectable(/*item*/ ctx[41]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, t);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(312:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (310:12) {#if item.isGroupHeader && !item.isSelectable}
    function create_if_block_1$2(ctx) {
    	let div;
    	let t_value = /*getGroupHeaderLabel*/ ctx[7](/*item*/ ctx[41]) + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "listGroupTitle svelte-1mmk1xt");
    			add_location(div, file$9, 310, 16, 9414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getGroupHeaderLabel, items*/ 130 && t_value !== (t_value = /*getGroupHeaderLabel*/ ctx[7](/*item*/ ctx[41]) + "")) set_data_dev(t, t_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(310:12) {#if item.isGroupHeader && !item.isSelectable}",
    		ctx
    	});

    	return block;
    }

    // (309:8) {#each items as item, i}
    function create_each_block$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block_1$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[41].isGroupHeader && !/*item*/ ctx[41].isSelectable) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(309:8) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    // (286:8) <svelte:component             this={VirtualList}             {items}             {itemHeight}             let:item             let:i>
    function create_default_slot(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Item*/ ctx[4];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*item*/ ctx[41],
    				filterText: /*filterText*/ ctx[13],
    				getOptionLabel: /*getOptionLabel*/ ctx[6],
    				isFirst: isItemFirst(/*i*/ ctx[42]),
    				isActive: isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]),
    				isHover: isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]),
    				isSelectable: isItemSelectable(/*item*/ ctx[41])
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	function mouseover_handler() {
    		return /*mouseover_handler*/ ctx[26](/*i*/ ctx[42]);
    	}

    	function focus_handler() {
    		return /*focus_handler*/ ctx[27](/*i*/ ctx[42]);
    	}

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[28](/*item*/ ctx[41], /*i*/ ctx[42], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "listItem");
    			add_location(div, file$9, 291, 12, 8620);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseover", mouseover_handler, false, false, false),
    					listen_dev(div, "focus", focus_handler, false, false, false),
    					listen_dev(div, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const switch_instance_changes = {};
    			if (dirty[1] & /*item*/ 1024) switch_instance_changes.item = /*item*/ ctx[41];
    			if (dirty[0] & /*filterText*/ 8192) switch_instance_changes.filterText = /*filterText*/ ctx[13];
    			if (dirty[0] & /*getOptionLabel*/ 64) switch_instance_changes.getOptionLabel = /*getOptionLabel*/ ctx[6];
    			if (dirty[1] & /*i*/ 2048) switch_instance_changes.isFirst = isItemFirst(/*i*/ ctx[42]);
    			if (dirty[0] & /*value, optionIdentifier*/ 1536 | dirty[1] & /*item*/ 1024) switch_instance_changes.isActive = isItemActive(/*item*/ ctx[41], /*value*/ ctx[9], /*optionIdentifier*/ ctx[10]);
    			if (dirty[0] & /*hoverItemIndex, items*/ 6 | dirty[1] & /*item, i*/ 3072) switch_instance_changes.isHover = isItemHover(/*hoverItemIndex*/ ctx[2], /*item*/ ctx[41], /*i*/ ctx[42], /*items*/ ctx[1]);
    			if (dirty[1] & /*item*/ 1024) switch_instance_changes.isSelectable = isItemSelectable(/*item*/ ctx[41]);

    			if (switch_value !== (switch_value = /*Item*/ ctx[4])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(286:8) <svelte:component             this={VirtualList}             {items}             {itemHeight}             let:item             let:i>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$4, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isVirtualList*/ ctx[5]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "listContainer svelte-1mmk1xt");
    			attr_dev(div, "style", /*listStyle*/ ctx[14]);
    			toggle_class(div, "virtualList", /*isVirtualList*/ ctx[5]);
    			add_location(div, file$9, 279, 0, 8324);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			/*div_binding*/ ctx[32](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[17], false, false, false),
    					listen_dev(window, "resize", /*computePlacement*/ ctx[18], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}

    			if (!current || dirty[0] & /*listStyle*/ 16384) {
    				attr_dev(div, "style", /*listStyle*/ ctx[14]);
    			}

    			if (dirty[0] & /*isVirtualList*/ 32) {
    				toggle_class(div, "virtualList", /*isVirtualList*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			/*div_binding*/ ctx[32](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function isItemActive(item, value, optionIdentifier) {
    	return value && value[optionIdentifier] === item[optionIdentifier];
    }

    function isItemFirst(itemIndex) {
    	return itemIndex === 0;
    }

    function isItemHover(hoverItemIndex, item, itemIndex, items) {
    	return isItemSelectable(item) && (hoverItemIndex === itemIndex || items.length === 1);
    }

    function isItemSelectable(item) {
    	return item.isGroupHeader && item.isSelectable || item.selectable || !item.hasOwnProperty('selectable'); // Default; if `selectable` was not specified, the object is selectable
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('List', slots, []);
    	const dispatch = createEventDispatcher();
    	let { container = undefined } = $$props;
    	let { VirtualList = null } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { items = [] } = $$props;
    	let { labelIdentifier = 'label' } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		if (option) return option.isCreator
    		? `Create \"${filterText}\"`
    		: option[labelIdentifier];
    	} } = $$props;

    	let { getGroupHeaderLabel = null } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { value = undefined } = $$props;
    	let { optionIdentifier = 'value' } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { noOptionsMessage = 'No options' } = $$props;
    	let { isMulti = false } = $$props;
    	let { activeItemIndex = 0 } = $$props;
    	let { filterText = '' } = $$props;
    	let { parent = null } = $$props;
    	let { listPlacement = null } = $$props;
    	let { listAutoWidth = null } = $$props;
    	let { listOffset = 5 } = $$props;
    	let isScrollingTimer = 0;
    	let isScrolling = false;
    	let prev_items;

    	onMount(() => {
    		if (items.length > 0 && !isMulti && value) {
    			const _hoverItemIndex = items.findIndex(item => item[optionIdentifier] === value[optionIdentifier]);

    			if (_hoverItemIndex) {
    				$$invalidate(2, hoverItemIndex = _hoverItemIndex);
    			}
    		}

    		scrollToActiveItem('active');

    		container.addEventListener(
    			'scroll',
    			() => {
    				clearTimeout(isScrollingTimer);

    				isScrollingTimer = setTimeout(
    					() => {
    						isScrolling = false;
    					},
    					100
    				);
    			},
    			false
    		);
    	});

    	beforeUpdate(() => {
    		if (!items) $$invalidate(1, items = []);

    		if (items !== prev_items && items.length > 0) {
    			$$invalidate(2, hoverItemIndex = 0);
    		}

    		prev_items = items;
    	});

    	function handleSelect(item) {
    		if (item.isCreator) return;
    		dispatch('itemSelected', item);
    	}

    	function handleHover(i) {
    		if (isScrolling) return;
    		$$invalidate(2, hoverItemIndex = i);
    	}

    	function handleClick(args) {
    		const { item, i, event } = args;
    		event.stopPropagation();
    		if (value && !isMulti && value[optionIdentifier] === item[optionIdentifier]) return closeList();

    		if (item.isCreator) {
    			dispatch('itemCreated', filterText);
    		} else if (isItemSelectable(item)) {
    			$$invalidate(19, activeItemIndex = i);
    			$$invalidate(2, hoverItemIndex = i);
    			handleSelect(item);
    		}
    	}

    	function closeList() {
    		dispatch('closeList');
    	}

    	async function updateHoverItem(increment) {
    		if (isVirtualList) return;
    		let isNonSelectableItem = true;

    		while (isNonSelectableItem) {
    			if (increment > 0 && hoverItemIndex === items.length - 1) {
    				$$invalidate(2, hoverItemIndex = 0);
    			} else if (increment < 0 && hoverItemIndex === 0) {
    				$$invalidate(2, hoverItemIndex = items.length - 1);
    			} else {
    				$$invalidate(2, hoverItemIndex = hoverItemIndex + increment);
    			}

    			isNonSelectableItem = !isItemSelectable(items[hoverItemIndex]);
    		}

    		await tick();
    		scrollToActiveItem('hover');
    	}

    	function handleKeyDown(e) {
    		switch (e.key) {
    			case 'Escape':
    				e.preventDefault();
    				closeList();
    				break;
    			case 'ArrowDown':
    				e.preventDefault();
    				items.length && updateHoverItem(1);
    				break;
    			case 'ArrowUp':
    				e.preventDefault();
    				items.length && updateHoverItem(-1);
    				break;
    			case 'Enter':
    				e.preventDefault();
    				if (items.length === 0) break;
    				const hoverItem = items[hoverItemIndex];
    				if (value && !isMulti && value[optionIdentifier] === hoverItem[optionIdentifier]) {
    					closeList();
    					break;
    				}
    				if (hoverItem.isCreator) {
    					dispatch('itemCreated', filterText);
    				} else {
    					$$invalidate(19, activeItemIndex = hoverItemIndex);
    					handleSelect(items[hoverItemIndex]);
    				}
    				break;
    			case 'Tab':
    				e.preventDefault();
    				if (items.length === 0) {
    					return closeList();
    				}
    				if (value && value[optionIdentifier] === items[hoverItemIndex][optionIdentifier]) return closeList();
    				$$invalidate(19, activeItemIndex = hoverItemIndex);
    				handleSelect(items[hoverItemIndex]);
    				break;
    		}
    	}

    	function scrollToActiveItem(className) {
    		if (isVirtualList || !container) return;
    		let offsetBounding;
    		const focusedElemBounding = container.querySelector(`.listItem .${className}`);

    		if (focusedElemBounding) {
    			offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
    		}

    		$$invalidate(0, container.scrollTop -= offsetBounding, container);
    	}

    	let listStyle;

    	function computePlacement() {
    		const { height, width } = parent.getBoundingClientRect();
    		$$invalidate(14, listStyle = '');
    		$$invalidate(14, listStyle += `min-width:${width}px;width:${listAutoWidth ? 'auto' : '100%'};`);

    		if (listPlacement === 'top' || listPlacement === 'auto' && isOutOfViewport(parent, container).bottom) {
    			$$invalidate(14, listStyle += `bottom:${height + listOffset}px;`);
    		} else {
    			$$invalidate(14, listStyle += `top:${height + listOffset}px;`);
    		}
    	}

    	const writable_props = [
    		'container',
    		'VirtualList',
    		'Item',
    		'isVirtualList',
    		'items',
    		'labelIdentifier',
    		'getOptionLabel',
    		'getGroupHeaderLabel',
    		'itemHeight',
    		'hoverItemIndex',
    		'value',
    		'optionIdentifier',
    		'hideEmptyState',
    		'noOptionsMessage',
    		'isMulti',
    		'activeItemIndex',
    		'filterText',
    		'parent',
    		'listPlacement',
    		'listAutoWidth',
    		'listOffset'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	const mouseover_handler = i => handleHover(i);
    	const focus_handler = i => handleHover(i);
    	const click_handler = (item, i, event) => handleClick({ item, i, event });
    	const mouseover_handler_1 = i => handleHover(i);
    	const focus_handler_1 = i => handleHover(i);
    	const click_handler_1 = (item, i, event) => handleClick({ item, i, event });

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('VirtualList' in $$props) $$invalidate(3, VirtualList = $$props.VirtualList);
    		if ('Item' in $$props) $$invalidate(4, Item$1 = $$props.Item);
    		if ('isVirtualList' in $$props) $$invalidate(5, isVirtualList = $$props.isVirtualList);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('labelIdentifier' in $$props) $$invalidate(20, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(6, getOptionLabel = $$props.getOptionLabel);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(7, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('itemHeight' in $$props) $$invalidate(8, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(2, hoverItemIndex = $$props.hoverItemIndex);
    		if ('value' in $$props) $$invalidate(9, value = $$props.value);
    		if ('optionIdentifier' in $$props) $$invalidate(10, optionIdentifier = $$props.optionIdentifier);
    		if ('hideEmptyState' in $$props) $$invalidate(11, hideEmptyState = $$props.hideEmptyState);
    		if ('noOptionsMessage' in $$props) $$invalidate(12, noOptionsMessage = $$props.noOptionsMessage);
    		if ('isMulti' in $$props) $$invalidate(21, isMulti = $$props.isMulti);
    		if ('activeItemIndex' in $$props) $$invalidate(19, activeItemIndex = $$props.activeItemIndex);
    		if ('filterText' in $$props) $$invalidate(13, filterText = $$props.filterText);
    		if ('parent' in $$props) $$invalidate(22, parent = $$props.parent);
    		if ('listPlacement' in $$props) $$invalidate(23, listPlacement = $$props.listPlacement);
    		if ('listAutoWidth' in $$props) $$invalidate(24, listAutoWidth = $$props.listAutoWidth);
    		if ('listOffset' in $$props) $$invalidate(25, listOffset = $$props.listOffset);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		createEventDispatcher,
    		onMount,
    		tick,
    		isOutOfViewport,
    		ItemComponent: Item,
    		dispatch,
    		container,
    		VirtualList,
    		Item: Item$1,
    		isVirtualList,
    		items,
    		labelIdentifier,
    		getOptionLabel,
    		getGroupHeaderLabel,
    		itemHeight,
    		hoverItemIndex,
    		value,
    		optionIdentifier,
    		hideEmptyState,
    		noOptionsMessage,
    		isMulti,
    		activeItemIndex,
    		filterText,
    		parent,
    		listPlacement,
    		listAutoWidth,
    		listOffset,
    		isScrollingTimer,
    		isScrolling,
    		prev_items,
    		handleSelect,
    		handleHover,
    		handleClick,
    		closeList,
    		updateHoverItem,
    		handleKeyDown,
    		scrollToActiveItem,
    		isItemActive,
    		isItemFirst,
    		isItemHover,
    		isItemSelectable,
    		listStyle,
    		computePlacement
    	});

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('VirtualList' in $$props) $$invalidate(3, VirtualList = $$props.VirtualList);
    		if ('Item' in $$props) $$invalidate(4, Item$1 = $$props.Item);
    		if ('isVirtualList' in $$props) $$invalidate(5, isVirtualList = $$props.isVirtualList);
    		if ('items' in $$props) $$invalidate(1, items = $$props.items);
    		if ('labelIdentifier' in $$props) $$invalidate(20, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(6, getOptionLabel = $$props.getOptionLabel);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(7, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('itemHeight' in $$props) $$invalidate(8, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(2, hoverItemIndex = $$props.hoverItemIndex);
    		if ('value' in $$props) $$invalidate(9, value = $$props.value);
    		if ('optionIdentifier' in $$props) $$invalidate(10, optionIdentifier = $$props.optionIdentifier);
    		if ('hideEmptyState' in $$props) $$invalidate(11, hideEmptyState = $$props.hideEmptyState);
    		if ('noOptionsMessage' in $$props) $$invalidate(12, noOptionsMessage = $$props.noOptionsMessage);
    		if ('isMulti' in $$props) $$invalidate(21, isMulti = $$props.isMulti);
    		if ('activeItemIndex' in $$props) $$invalidate(19, activeItemIndex = $$props.activeItemIndex);
    		if ('filterText' in $$props) $$invalidate(13, filterText = $$props.filterText);
    		if ('parent' in $$props) $$invalidate(22, parent = $$props.parent);
    		if ('listPlacement' in $$props) $$invalidate(23, listPlacement = $$props.listPlacement);
    		if ('listAutoWidth' in $$props) $$invalidate(24, listAutoWidth = $$props.listAutoWidth);
    		if ('listOffset' in $$props) $$invalidate(25, listOffset = $$props.listOffset);
    		if ('isScrollingTimer' in $$props) isScrollingTimer = $$props.isScrollingTimer;
    		if ('isScrolling' in $$props) isScrolling = $$props.isScrolling;
    		if ('prev_items' in $$props) prev_items = $$props.prev_items;
    		if ('listStyle' in $$props) $$invalidate(14, listStyle = $$props.listStyle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*parent, container*/ 4194305) {
    			{
    				if (parent && container) computePlacement();
    			}
    		}
    	};

    	return [
    		container,
    		items,
    		hoverItemIndex,
    		VirtualList,
    		Item$1,
    		isVirtualList,
    		getOptionLabel,
    		getGroupHeaderLabel,
    		itemHeight,
    		value,
    		optionIdentifier,
    		hideEmptyState,
    		noOptionsMessage,
    		filterText,
    		listStyle,
    		handleHover,
    		handleClick,
    		handleKeyDown,
    		computePlacement,
    		activeItemIndex,
    		labelIdentifier,
    		isMulti,
    		parent,
    		listPlacement,
    		listAutoWidth,
    		listOffset,
    		mouseover_handler,
    		focus_handler,
    		click_handler,
    		mouseover_handler_1,
    		focus_handler_1,
    		click_handler_1,
    		div_binding
    	];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$9,
    			create_fragment$9,
    			safe_not_equal,
    			{
    				container: 0,
    				VirtualList: 3,
    				Item: 4,
    				isVirtualList: 5,
    				items: 1,
    				labelIdentifier: 20,
    				getOptionLabel: 6,
    				getGroupHeaderLabel: 7,
    				itemHeight: 8,
    				hoverItemIndex: 2,
    				value: 9,
    				optionIdentifier: 10,
    				hideEmptyState: 11,
    				noOptionsMessage: 12,
    				isMulti: 21,
    				activeItemIndex: 19,
    				filterText: 13,
    				parent: 22,
    				listPlacement: 23,
    				listAutoWidth: 24,
    				listOffset: 25
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get container() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get VirtualList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set VirtualList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelIdentifier() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelIdentifier(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeItemIndex() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeItemIndex(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get parent() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set parent(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listPlacement() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listPlacement(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listAutoWidth() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listAutoWidth(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOffset() {
    		throw new Error("<List>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOffset(value) {
    		throw new Error("<List>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-select\src\Selection.svelte generated by Svelte v3.46.6 */

    const file$8 = "node_modules\\svelte-select\\src\\Selection.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "";

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "selection svelte-1be6cx3");
    			add_location(div, file$8, 12, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getSelectionLabel, item*/ 3 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[0](/*item*/ ctx[1]) + "")) div.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Selection', slots, []);
    	let { getSelectionLabel = undefined } = $$props;
    	let { item = undefined } = $$props;
    	const writable_props = ['getSelectionLabel', 'item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Selection> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('getSelectionLabel' in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({ getSelectionLabel, item });

    	$$self.$inject_state = $$props => {
    		if ('getSelectionLabel' in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
    		if ('item' in $$props) $$invalidate(1, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [getSelectionLabel, item];
    }

    class Selection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { getSelectionLabel: 0, item: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Selection",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get getSelectionLabel() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get item() {
    		throw new Error("<Selection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Selection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-select\src\MultiSelection.svelte generated by Svelte v3.46.6 */
    const file$7 = "node_modules\\svelte-select\\src\\MultiSelection.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (86:8) {#if !isDisabled && !multiFullItemClearable}
    function create_if_block$3(ctx) {
    	let div;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[6](/*i*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$7, 96, 20, 3026);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			attr_dev(svg, "class", "svelte-j22aje");
    			add_location(svg, file$7, 89, 16, 2774);
    			attr_dev(div, "class", "multiSelectItem_clear svelte-j22aje");
    			add_location(div, file$7, 86, 12, 2646);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(86:8) {#if !isDisabled && !multiFullItemClearable}",
    		ctx
    	});

    	return block;
    }

    // (76:0) {#each value as item, i}
    function create_each_block$2(ctx) {
    	let div1;
    	let div0;
    	let raw_value = /*getSelectionLabel*/ ctx[4](/*item*/ ctx[9]) + "";
    	let t0;
    	let t1;
    	let div1_class_value;
    	let mounted;
    	let dispose;
    	let if_block = !/*isDisabled*/ ctx[2] && !/*multiFullItemClearable*/ ctx[3] && create_if_block$3(ctx);

    	function click_handler_1(...args) {
    		return /*click_handler_1*/ ctx[7](/*i*/ ctx[11], ...args);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			attr_dev(div0, "class", "multiSelectItem_label svelte-j22aje");
    			add_location(div0, file$7, 82, 8, 2486);
    			attr_dev(div1, "class", div1_class_value = "multiSelectItem " + (/*activeValue*/ ctx[1] === /*i*/ ctx[11] ? 'active' : '') + " " + (/*isDisabled*/ ctx[2] ? 'disabled' : '') + " svelte-j22aje");
    			add_location(div1, file$7, 76, 4, 2255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div1, t0);
    			if (if_block) if_block.m(div1, null);
    			append_dev(div1, t1);

    			if (!mounted) {
    				dispose = listen_dev(div1, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*getSelectionLabel, value*/ 17 && raw_value !== (raw_value = /*getSelectionLabel*/ ctx[4](/*item*/ ctx[9]) + "")) div0.innerHTML = raw_value;
    			if (!/*isDisabled*/ ctx[2] && !/*multiFullItemClearable*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(div1, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*activeValue, isDisabled*/ 6 && div1_class_value !== (div1_class_value = "multiSelectItem " + (/*activeValue*/ ctx[1] === /*i*/ ctx[11] ? 'active' : '') + " " + (/*isDisabled*/ ctx[2] ? 'disabled' : '') + " svelte-j22aje")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(76:0) {#each value as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeValue, isDisabled, multiFullItemClearable, handleClear, getSelectionLabel, value*/ 63) {
    				each_value = /*value*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MultiSelection', slots, []);
    	const dispatch = createEventDispatcher();
    	let { value = [] } = $$props;
    	let { activeValue = undefined } = $$props;
    	let { isDisabled = false } = $$props;
    	let { multiFullItemClearable = false } = $$props;
    	let { getSelectionLabel = undefined } = $$props;

    	function handleClear(i, event) {
    		event.stopPropagation();
    		dispatch('multiItemClear', { i });
    	}

    	const writable_props = [
    		'value',
    		'activeValue',
    		'isDisabled',
    		'multiFullItemClearable',
    		'getSelectionLabel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MultiSelection> was created with unknown prop '${key}'`);
    	});

    	const click_handler = (i, event) => handleClear(i, event);
    	const click_handler_1 = (i, event) => multiFullItemClearable ? handleClear(i, event) : {};

    	$$self.$$set = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeValue' in $$props) $$invalidate(1, activeValue = $$props.activeValue);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('multiFullItemClearable' in $$props) $$invalidate(3, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('getSelectionLabel' in $$props) $$invalidate(4, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		dispatch,
    		value,
    		activeValue,
    		isDisabled,
    		multiFullItemClearable,
    		getSelectionLabel,
    		handleClear
    	});

    	$$self.$inject_state = $$props => {
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('activeValue' in $$props) $$invalidate(1, activeValue = $$props.activeValue);
    		if ('isDisabled' in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
    		if ('multiFullItemClearable' in $$props) $$invalidate(3, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('getSelectionLabel' in $$props) $$invalidate(4, getSelectionLabel = $$props.getSelectionLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		activeValue,
    		isDisabled,
    		multiFullItemClearable,
    		getSelectionLabel,
    		handleClear,
    		click_handler,
    		click_handler_1
    	];
    }

    class MultiSelection extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			value: 0,
    			activeValue: 1,
    			isDisabled: 2,
    			multiFullItemClearable: 3,
    			getSelectionLabel: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MultiSelection",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get value() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeValue() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeValue(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiFullItemClearable() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiFullItemClearable(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<MultiSelection>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<MultiSelection>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-select\src\VirtualList.svelte generated by Svelte v3.46.6 */
    const file$6 = "node_modules\\svelte-select\\src\\VirtualList.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes = dirty => ({
    	item: dirty & /*visible*/ 32,
    	i: dirty & /*visible*/ 32,
    	hoverItemIndex: dirty & /*hoverItemIndex*/ 2
    });

    const get_default_slot_context = ctx => ({
    	item: /*row*/ ctx[23].data,
    	i: /*row*/ ctx[23].index,
    	hoverItemIndex: /*hoverItemIndex*/ ctx[1]
    });

    // (153:69) Missing template
    function fallback_block$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Missing template");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(153:69) Missing template",
    		ctx
    	});

    	return block;
    }

    // (151:8) {#each visible as row (row.index)}
    function create_each_block$1(key_1, ctx) {
    	let svelte_virtual_list_row;
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], get_default_slot_context);
    	const default_slot_or_fallback = default_slot || fallback_block$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			svelte_virtual_list_row = element("svelte-virtual-list-row");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			t = space();
    			set_custom_element_data(svelte_virtual_list_row, "class", "svelte-yyenik");
    			add_location(svelte_virtual_list_row, file$6, 151, 12, 3777);
    			this.first = svelte_virtual_list_row;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_row, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(svelte_virtual_list_row, null);
    			}

    			append_dev(svelte_virtual_list_row, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, visible, hoverItemIndex*/ 16418)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_row);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(151:8) {#each visible as row (row.index)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let svelte_virtual_list_viewport;
    	let svelte_virtual_list_contents;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let svelte_virtual_list_viewport_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*visible*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*row*/ ctx[23].index;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			svelte_virtual_list_viewport = element("svelte-virtual-list-viewport");
    			svelte_virtual_list_contents = element("svelte-virtual-list-contents");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			set_custom_element_data(svelte_virtual_list_contents, "class", "svelte-yyenik");
    			add_location(svelte_virtual_list_contents, file$6, 147, 4, 3596);
    			set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			set_custom_element_data(svelte_virtual_list_viewport, "class", "svelte-yyenik");
    			add_render_callback(() => /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[18].call(svelte_virtual_list_viewport));
    			add_location(svelte_virtual_list_viewport, file$6, 142, 0, 3436);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_virtual_list_viewport, anchor);
    			append_dev(svelte_virtual_list_viewport, svelte_virtual_list_contents);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(svelte_virtual_list_contents, null);
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[16](svelte_virtual_list_contents);
    			/*svelte_virtual_list_viewport_binding*/ ctx[17](svelte_virtual_list_viewport);
    			svelte_virtual_list_viewport_resize_listener = add_resize_listener(svelte_virtual_list_viewport, /*svelte_virtual_list_viewport_elementresize_handler*/ ctx[18].bind(svelte_virtual_list_viewport));
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(svelte_virtual_list_viewport, "scroll", /*handle_scroll*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$$scope, visible, hoverItemIndex*/ 16418) {
    				each_value = /*visible*/ ctx[5];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svelte_virtual_list_contents, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
    				check_outros();
    			}

    			if (!current || dirty & /*top*/ 64) {
    				set_style(svelte_virtual_list_contents, "padding-top", /*top*/ ctx[6] + "px");
    			}

    			if (!current || dirty & /*bottom*/ 128) {
    				set_style(svelte_virtual_list_contents, "padding-bottom", /*bottom*/ ctx[7] + "px");
    			}

    			if (!current || dirty & /*height*/ 1) {
    				set_style(svelte_virtual_list_viewport, "height", /*height*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_virtual_list_viewport);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*svelte_virtual_list_contents_binding*/ ctx[16](null);
    			/*svelte_virtual_list_viewport_binding*/ ctx[17](null);
    			svelte_virtual_list_viewport_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VirtualList', slots, ['default']);
    	let { items = undefined } = $$props;
    	let { height = '100%' } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { hoverItemIndex = 0 } = $$props;
    	let { start = 0 } = $$props;
    	let { end = 0 } = $$props;
    	let height_map = [];
    	let rows;
    	let viewport;
    	let contents;
    	let viewport_height = 0;
    	let visible;
    	let mounted;
    	let top = 0;
    	let bottom = 0;
    	let average_height;

    	async function refresh(items, viewport_height, itemHeight) {
    		const { scrollTop } = viewport;
    		await tick();
    		let content_height = top - scrollTop;
    		let i = start;

    		while (content_height < viewport_height && i < items.length) {
    			let row = rows[i - start];

    			if (!row) {
    				$$invalidate(10, end = i + 1);
    				await tick();
    				row = rows[i - start];
    			}

    			const row_height = height_map[i] = itemHeight || row.offsetHeight;
    			content_height += row_height;
    			i += 1;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = (top + content_height) / end;
    		$$invalidate(7, bottom = remaining * average_height);
    		height_map.length = items.length;
    		if (viewport) $$invalidate(3, viewport.scrollTop = 0, viewport);
    	}

    	async function handle_scroll() {
    		const { scrollTop } = viewport;
    		const old_start = start;

    		for (let v = 0; v < rows.length; v += 1) {
    			height_map[start + v] = itemHeight || rows[v].offsetHeight;
    		}

    		let i = 0;
    		let y = 0;

    		while (i < items.length) {
    			const row_height = height_map[i] || average_height;

    			if (y + row_height > scrollTop) {
    				$$invalidate(9, start = i);
    				$$invalidate(6, top = y);
    				break;
    			}

    			y += row_height;
    			i += 1;
    		}

    		while (i < items.length) {
    			y += height_map[i] || average_height;
    			i += 1;
    			if (y > scrollTop + viewport_height) break;
    		}

    		$$invalidate(10, end = i);
    		const remaining = items.length - end;
    		average_height = y / end;
    		while (i < items.length) height_map[i++] = average_height;
    		$$invalidate(7, bottom = remaining * average_height);

    		if (start < old_start) {
    			await tick();
    			let expected_height = 0;
    			let actual_height = 0;

    			for (let i = start; i < old_start; i += 1) {
    				if (rows[i - start]) {
    					expected_height += height_map[i];
    					actual_height += itemHeight || rows[i - start].offsetHeight;
    				}
    			}

    			const d = actual_height - expected_height;
    			viewport.scrollTo(0, scrollTop + d);
    		}
    	}

    	onMount(() => {
    		rows = contents.getElementsByTagName('svelte-virtual-list-row');
    		$$invalidate(13, mounted = true);
    	});

    	const writable_props = ['items', 'height', 'itemHeight', 'hoverItemIndex', 'start', 'end'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VirtualList> was created with unknown prop '${key}'`);
    	});

    	function svelte_virtual_list_contents_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contents = $$value;
    			$$invalidate(4, contents);
    		});
    	}

    	function svelte_virtual_list_viewport_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			viewport = $$value;
    			$$invalidate(3, viewport);
    		});
    	}

    	function svelte_virtual_list_viewport_elementresize_handler() {
    		viewport_height = this.offsetHeight;
    		$$invalidate(2, viewport_height);
    	}

    	$$self.$$set = $$props => {
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('itemHeight' in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ('start' in $$props) $$invalidate(9, start = $$props.start);
    		if ('end' in $$props) $$invalidate(10, end = $$props.end);
    		if ('$$scope' in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		tick,
    		items,
    		height,
    		itemHeight,
    		hoverItemIndex,
    		start,
    		end,
    		height_map,
    		rows,
    		viewport,
    		contents,
    		viewport_height,
    		visible,
    		mounted,
    		top,
    		bottom,
    		average_height,
    		refresh,
    		handle_scroll
    	});

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate(11, items = $$props.items);
    		if ('height' in $$props) $$invalidate(0, height = $$props.height);
    		if ('itemHeight' in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
    		if ('hoverItemIndex' in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
    		if ('start' in $$props) $$invalidate(9, start = $$props.start);
    		if ('end' in $$props) $$invalidate(10, end = $$props.end);
    		if ('height_map' in $$props) height_map = $$props.height_map;
    		if ('rows' in $$props) rows = $$props.rows;
    		if ('viewport' in $$props) $$invalidate(3, viewport = $$props.viewport);
    		if ('contents' in $$props) $$invalidate(4, contents = $$props.contents);
    		if ('viewport_height' in $$props) $$invalidate(2, viewport_height = $$props.viewport_height);
    		if ('visible' in $$props) $$invalidate(5, visible = $$props.visible);
    		if ('mounted' in $$props) $$invalidate(13, mounted = $$props.mounted);
    		if ('top' in $$props) $$invalidate(6, top = $$props.top);
    		if ('bottom' in $$props) $$invalidate(7, bottom = $$props.bottom);
    		if ('average_height' in $$props) average_height = $$props.average_height;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*items, start, end*/ 3584) {
    			$$invalidate(5, visible = items.slice(start, end).map((data, i) => {
    				return { index: i + start, data };
    			}));
    		}

    		if ($$self.$$.dirty & /*mounted, items, viewport_height, itemHeight*/ 14340) {
    			if (mounted) refresh(items, viewport_height, itemHeight);
    		}
    	};

    	return [
    		height,
    		hoverItemIndex,
    		viewport_height,
    		viewport,
    		contents,
    		visible,
    		top,
    		bottom,
    		handle_scroll,
    		start,
    		end,
    		items,
    		itemHeight,
    		mounted,
    		$$scope,
    		slots,
    		svelte_virtual_list_contents_binding,
    		svelte_virtual_list_viewport_binding,
    		svelte_virtual_list_viewport_elementresize_handler
    	];
    }

    class VirtualList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			items: 11,
    			height: 0,
    			itemHeight: 12,
    			hoverItemIndex: 1,
    			start: 9,
    			end: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VirtualList",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get items() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hoverItemIndex() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hoverItemIndex(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get start() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set start(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get end() {
    		throw new Error("<VirtualList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set end(value) {
    		throw new Error("<VirtualList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-select\src\ClearIcon.svelte generated by Svelte v3.46.6 */

    const file$5 = "node_modules\\svelte-select\\src\\ClearIcon.svelte";

    function create_fragment$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124\n    l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z");
    			add_location(path, file$5, 8, 4, 141);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "-2 -2 50 50");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "role", "presentation");
    			add_location(svg, file$5, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ClearIcon', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ClearIcon> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class ClearIcon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ClearIcon",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    function debounce(func, wait, immediate) {
        let timeout;

        return function executedFunction() {
            let context = this;
            let args = arguments;

            let later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            let callNow = immediate && !timeout;

            clearTimeout(timeout);

            timeout = setTimeout(later, wait);

            if (callNow) func.apply(context, args);
        };
    }

    /* node_modules\svelte-select\src\Select.svelte generated by Svelte v3.46.6 */

    const { Object: Object_1, console: console_1$1 } = globals;
    const file$4 = "node_modules\\svelte-select\\src\\Select.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[103] = list[i];
    	return child_ctx;
    }

    // (902:8) {#if isFocused}
    function create_if_block_10(ctx) {
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;

    	const block = {
    		c: function create() {
    			span0 = element("span");
    			t0 = text(/*ariaSelection*/ ctx[33]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*ariaContext*/ ctx[32]);
    			attr_dev(span0, "id", "aria-selection");
    			add_location(span0, file$4, 902, 12, 24667);
    			attr_dev(span1, "id", "aria-context");
    			add_location(span1, file$4, 903, 12, 24728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span0, anchor);
    			append_dev(span0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, span1, anchor);
    			append_dev(span1, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[1] & /*ariaSelection*/ 4) set_data_dev(t0, /*ariaSelection*/ ctx[33]);
    			if (dirty[1] & /*ariaContext*/ 2) set_data_dev(t2, /*ariaContext*/ ctx[32]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(span1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(902:8) {#if isFocused}",
    		ctx
    	});

    	return block;
    }

    // (910:4) {#if Icon}
    function create_if_block_9(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*iconProps*/ ctx[18]];
    	var switch_value = /*Icon*/ ctx[17];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[0] & /*iconProps*/ 262144)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*iconProps*/ ctx[18])])
    			: {};

    			if (switch_value !== (switch_value = /*Icon*/ ctx[17])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(910:4) {#if Icon}",
    		ctx
    	});

    	return block;
    }

    // (914:4) {#if showMultiSelect}
    function create_if_block_8$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*MultiSelection*/ ctx[26];

    	function switch_props(ctx) {
    		return {
    			props: {
    				value: /*value*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[12],
    				activeValue: /*activeValue*/ ctx[30],
    				isDisabled: /*isDisabled*/ ctx[9],
    				multiFullItemClearable: /*multiFullItemClearable*/ ctx[8]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[38]);
    		switch_instance.$on("focus", /*handleFocus*/ ctx[40]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*value*/ 4) switch_instance_changes.value = /*value*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 4096) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[12];
    			if (dirty[0] & /*activeValue*/ 1073741824) switch_instance_changes.activeValue = /*activeValue*/ ctx[30];
    			if (dirty[0] & /*isDisabled*/ 512) switch_instance_changes.isDisabled = /*isDisabled*/ ctx[9];
    			if (dirty[0] & /*multiFullItemClearable*/ 256) switch_instance_changes.multiFullItemClearable = /*multiFullItemClearable*/ ctx[8];

    			if (switch_value !== (switch_value = /*MultiSelection*/ ctx[26])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("multiItemClear", /*handleMultiItemClear*/ ctx[38]);
    					switch_instance.$on("focus", /*handleFocus*/ ctx[40]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8$1.name,
    		type: "if",
    		source: "(914:4) {#if showMultiSelect}",
    		ctx
    	});

    	return block;
    }

    // (936:4) {#if !isMulti && showSelectedItem}
    function create_if_block_7$1(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*Selection*/ ctx[25];

    	function switch_props(ctx) {
    		return {
    			props: {
    				item: /*value*/ ctx[2],
    				getSelectionLabel: /*getSelectionLabel*/ ctx[12]
    			},
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "selectedItem svelte-ev85av");
    			add_location(div, file$4, 936, 8, 25550);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "focus", /*handleFocus*/ ctx[40], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty[0] & /*value*/ 4) switch_instance_changes.item = /*value*/ ctx[2];
    			if (dirty[0] & /*getSelectionLabel*/ 4096) switch_instance_changes.getSelectionLabel = /*getSelectionLabel*/ ctx[12];

    			if (switch_value !== (switch_value = /*Selection*/ ctx[25])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(936:4) {#if !isMulti && showSelectedItem}",
    		ctx
    	});

    	return block;
    }

    // (945:4) {#if showClearIcon}
    function create_if_block_6$1(ctx) {
    	let div;
    	let switch_instance;
    	let current;
    	let mounted;
    	let dispose;
    	var switch_value = /*ClearIcon*/ ctx[23];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			attr_dev(div, "class", "clearSelect svelte-ev85av");
    			attr_dev(div, "aria-hidden", "true");
    			add_location(div, file$4, 945, 8, 25789);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (switch_instance) {
    				mount_component(switch_instance, div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", prevent_default(/*handleClear*/ ctx[27]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*ClearIcon*/ ctx[23])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, div, null);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (switch_instance) destroy_component(switch_instance);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(945:4) {#if showClearIcon}",
    		ctx
    	});

    	return block;
    }

    // (954:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}
    function create_if_block_4$1(ctx) {
    	let div;

    	function select_block_type(ctx, dirty) {
    		if (/*indicatorSvg*/ ctx[22]) return create_if_block_5$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "indicator svelte-ev85av");
    			attr_dev(div, "aria-hidden", "true");
    			add_location(div, file$4, 954, 8, 26172);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, null);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(954:4) {#if !showClearIcon && (showIndicator || (showChevron && !value) || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem)))}",
    		ctx
    	});

    	return block;
    }

    // (958:12) {:else}
    function create_else_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747\n          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0\n          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502\n          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0\n          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z");
    			add_location(path, file$4, 964, 20, 26529);
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "focusable", "false");
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "svelte-ev85av");
    			add_location(svg, file$4, 958, 16, 26319);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(958:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (956:12) {#if indicatorSvg}
    function create_if_block_5$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*indicatorSvg*/ ctx[22], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*indicatorSvg*/ 4194304) html_tag.p(/*indicatorSvg*/ ctx[22]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(956:12) {#if indicatorSvg}",
    		ctx
    	});

    	return block;
    }

    // (976:4) {#if isWaiting}
    function create_if_block_3$1(ctx) {
    	let div;
    	let svg;
    	let circle;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "spinner_path svelte-ev85av");
    			attr_dev(circle, "cx", "50");
    			attr_dev(circle, "cy", "50");
    			attr_dev(circle, "r", "20");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke", "currentColor");
    			attr_dev(circle, "stroke-width", "5");
    			attr_dev(circle, "stroke-miterlimit", "10");
    			add_location(circle, file$4, 978, 16, 27078);
    			attr_dev(svg, "class", "spinner_icon svelte-ev85av");
    			attr_dev(svg, "viewBox", "25 25 50 50");
    			add_location(svg, file$4, 977, 12, 27013);
    			attr_dev(div, "class", "spinner svelte-ev85av");
    			add_location(div, file$4, 976, 8, 26979);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, circle);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(976:4) {#if isWaiting}",
    		ctx
    	});

    	return block;
    }

    // (992:4) {#if listOpen}
    function create_if_block_2$1(ctx) {
    	let switch_instance;
    	let updating_hoverItemIndex;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*listProps*/ ctx[34]];

    	function switch_instance_hoverItemIndex_binding(value) {
    		/*switch_instance_hoverItemIndex_binding*/ ctx[84](value);
    	}

    	var switch_value = /*List*/ ctx[24];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		if (/*hoverItemIndex*/ ctx[28] !== void 0) {
    			switch_instance_props.hoverItemIndex = /*hoverItemIndex*/ ctx[28];
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		binding_callbacks.push(() => bind(switch_instance, 'hoverItemIndex', switch_instance_hoverItemIndex_binding));
    		switch_instance.$on("itemSelected", /*itemSelected*/ ctx[43]);
    		switch_instance.$on("itemCreated", /*itemCreated*/ ctx[44]);
    		switch_instance.$on("closeList", /*closeList*/ ctx[45]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty[1] & /*listProps*/ 8)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*listProps*/ ctx[34])])
    			: {};

    			if (!updating_hoverItemIndex && dirty[0] & /*hoverItemIndex*/ 268435456) {
    				updating_hoverItemIndex = true;
    				switch_instance_changes.hoverItemIndex = /*hoverItemIndex*/ ctx[28];
    				add_flush_callback(() => updating_hoverItemIndex = false);
    			}

    			if (switch_value !== (switch_value = /*List*/ ctx[24])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					binding_callbacks.push(() => bind(switch_instance, 'hoverItemIndex', switch_instance_hoverItemIndex_binding));
    					switch_instance.$on("itemSelected", /*itemSelected*/ ctx[43]);
    					switch_instance.$on("itemCreated", /*itemCreated*/ ctx[44]);
    					switch_instance.$on("closeList", /*closeList*/ ctx[45]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(992:4) {#if listOpen}",
    		ctx
    	});

    	return block;
    }

    // (1002:4) {#if !isMulti || (isMulti && !showMultiSelect)}
    function create_if_block_1$1(ctx) {
    	let input_1;
    	let input_1_name_value;
    	let input_1_value_value;

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			attr_dev(input_1, "name", input_1_name_value = /*inputAttributes*/ ctx[16].name);
    			attr_dev(input_1, "type", "hidden");

    			input_1.value = input_1_value_value = /*value*/ ctx[2]
    			? /*getSelectionLabel*/ ctx[12](/*value*/ ctx[2])
    			: null;

    			attr_dev(input_1, "class", "svelte-ev85av");
    			add_location(input_1, file$4, 1002, 8, 27735);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes*/ 65536 && input_1_name_value !== (input_1_name_value = /*inputAttributes*/ ctx[16].name)) {
    				attr_dev(input_1, "name", input_1_name_value);
    			}

    			if (dirty[0] & /*value, getSelectionLabel*/ 4100 && input_1_value_value !== (input_1_value_value = /*value*/ ctx[2]
    			? /*getSelectionLabel*/ ctx[12](/*value*/ ctx[2])
    			: null)) {
    				prop_dev(input_1, "value", input_1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(1002:4) {#if !isMulti || (isMulti && !showMultiSelect)}",
    		ctx
    	});

    	return block;
    }

    // (1009:4) {#if isMulti && showMultiSelect}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let each_value = /*value*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes, value, getSelectionLabel*/ 69636) {
    				each_value = /*value*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(1009:4) {#if isMulti && showMultiSelect}",
    		ctx
    	});

    	return block;
    }

    // (1010:8) {#each value as item}
    function create_each_block(ctx) {
    	let input_1;
    	let input_1_name_value;
    	let input_1_value_value;

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			attr_dev(input_1, "name", input_1_name_value = /*inputAttributes*/ ctx[16].name);
    			attr_dev(input_1, "type", "hidden");

    			input_1.value = input_1_value_value = /*item*/ ctx[103]
    			? /*getSelectionLabel*/ ctx[12](/*item*/ ctx[103])
    			: null;

    			attr_dev(input_1, "class", "svelte-ev85av");
    			add_location(input_1, file$4, 1010, 12, 27961);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*inputAttributes*/ 65536 && input_1_name_value !== (input_1_name_value = /*inputAttributes*/ ctx[16].name)) {
    				attr_dev(input_1, "name", input_1_name_value);
    			}

    			if (dirty[0] & /*value, getSelectionLabel*/ 4100 && input_1_value_value !== (input_1_value_value = /*item*/ ctx[103]
    			? /*getSelectionLabel*/ ctx[12](/*item*/ ctx[103])
    			: null)) {
    				prop_dev(input_1, "value", input_1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(1010:8) {#each value as item}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let span;
    	let t0;
    	let t1;
    	let t2;
    	let input_1;
    	let input_1_readonly_value;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*isFocused*/ ctx[1] && create_if_block_10(ctx);
    	let if_block1 = /*Icon*/ ctx[17] && create_if_block_9(ctx);
    	let if_block2 = /*showMultiSelect*/ ctx[35] && create_if_block_8$1(ctx);

    	let input_1_levels = [
    		{
    			readOnly: input_1_readonly_value = !/*isSearchable*/ ctx[13]
    		},
    		/*_inputAttributes*/ ctx[31],
    		{ placeholder: /*placeholderText*/ ctx[36] },
    		{ style: /*inputStyles*/ ctx[14] },
    		{ disabled: /*isDisabled*/ ctx[9] }
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	let if_block3 = !/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[29] && create_if_block_7$1(ctx);
    	let if_block4 = /*showClearIcon*/ ctx[37] && create_if_block_6$1(ctx);
    	let if_block5 = !/*showClearIcon*/ ctx[37] && (/*showIndicator*/ ctx[20] || /*showChevron*/ ctx[19] && !/*value*/ ctx[2] || !/*isSearchable*/ ctx[13] && !/*isDisabled*/ ctx[9] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[29] && !/*isClearable*/ ctx[15] || !/*showSelectedItem*/ ctx[29])) && create_if_block_4$1(ctx);
    	let if_block6 = /*isWaiting*/ ctx[4] && create_if_block_3$1(ctx);
    	let if_block7 = /*listOpen*/ ctx[5] && create_if_block_2$1(ctx);
    	let if_block8 = (!/*isMulti*/ ctx[7] || /*isMulti*/ ctx[7] && !/*showMultiSelect*/ ctx[35]) && create_if_block_1$1(ctx);
    	let if_block9 = /*isMulti*/ ctx[7] && /*showMultiSelect*/ ctx[35] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			input_1 = element("input");
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			if (if_block4) if_block4.c();
    			t5 = space();
    			if (if_block5) if_block5.c();
    			t6 = space();
    			if (if_block6) if_block6.c();
    			t7 = space();
    			if (if_block7) if_block7.c();
    			t8 = space();
    			if (if_block8) if_block8.c();
    			t9 = space();
    			if (if_block9) if_block9.c();
    			attr_dev(span, "aria-live", "polite");
    			attr_dev(span, "aria-atomic", "false");
    			attr_dev(span, "aria-relevant", "additions text");
    			attr_dev(span, "class", "a11yText svelte-ev85av");
    			add_location(span, file$4, 896, 4, 24505);
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-ev85av", true);
    			add_location(input_1, file$4, 925, 4, 25244);
    			attr_dev(div, "class", div_class_value = "selectContainer " + /*containerClasses*/ ctx[21] + " svelte-ev85av");
    			attr_dev(div, "style", /*containerStyles*/ ctx[11]);
    			toggle_class(div, "hasError", /*hasError*/ ctx[10]);
    			toggle_class(div, "multiSelect", /*isMulti*/ ctx[7]);
    			toggle_class(div, "disabled", /*isDisabled*/ ctx[9]);
    			toggle_class(div, "focused", /*isFocused*/ ctx[1]);
    			add_location(div, file$4, 887, 0, 24254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    			if (if_block0) if_block0.m(span, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			append_dev(div, input_1);
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[82](input_1);
    			set_input_value(input_1, /*filterText*/ ctx[3]);
    			append_dev(div, t3);
    			if (if_block3) if_block3.m(div, null);
    			append_dev(div, t4);
    			if (if_block4) if_block4.m(div, null);
    			append_dev(div, t5);
    			if (if_block5) if_block5.m(div, null);
    			append_dev(div, t6);
    			if (if_block6) if_block6.m(div, null);
    			append_dev(div, t7);
    			if (if_block7) if_block7.m(div, null);
    			append_dev(div, t8);
    			if (if_block8) if_block8.m(div, null);
    			append_dev(div, t9);
    			if (if_block9) if_block9.m(div, null);
    			/*div_binding*/ ctx[85](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "click", /*handleWindowEvent*/ ctx[41], false, false, false),
    					listen_dev(window, "focusin", /*handleWindowEvent*/ ctx[41], false, false, false),
    					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[39], false, false, false),
    					listen_dev(input_1, "focus", /*handleFocus*/ ctx[40], false, false, false),
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[83]),
    					listen_dev(div, "click", /*handleClick*/ ctx[42], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*isFocused*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_10(ctx);
    					if_block0.c();
    					if_block0.m(span, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*Icon*/ ctx[17]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*Icon*/ 131072) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*showMultiSelect*/ ctx[35]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[1] & /*showMultiSelect*/ 16) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_8$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				(!current || dirty[0] & /*isSearchable*/ 8192 && input_1_readonly_value !== (input_1_readonly_value = !/*isSearchable*/ ctx[13])) && { readOnly: input_1_readonly_value },
    				dirty[1] & /*_inputAttributes*/ 1 && /*_inputAttributes*/ ctx[31],
    				(!current || dirty[1] & /*placeholderText*/ 32) && { placeholder: /*placeholderText*/ ctx[36] },
    				(!current || dirty[0] & /*inputStyles*/ 16384) && { style: /*inputStyles*/ ctx[14] },
    				(!current || dirty[0] & /*isDisabled*/ 512) && { disabled: /*isDisabled*/ ctx[9] }
    			]));

    			if (dirty[0] & /*filterText*/ 8 && input_1.value !== /*filterText*/ ctx[3]) {
    				set_input_value(input_1, /*filterText*/ ctx[3]);
    			}

    			toggle_class(input_1, "svelte-ev85av", true);

    			if (!/*isMulti*/ ctx[7] && /*showSelectedItem*/ ctx[29]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty[0] & /*isMulti, showSelectedItem*/ 536871040) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_7$1(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div, t4);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*showClearIcon*/ ctx[37]) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty[1] & /*showClearIcon*/ 64) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_6$1(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div, t5);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (!/*showClearIcon*/ ctx[37] && (/*showIndicator*/ ctx[20] || /*showChevron*/ ctx[19] && !/*value*/ ctx[2] || !/*isSearchable*/ ctx[13] && !/*isDisabled*/ ctx[9] && !/*isWaiting*/ ctx[4] && (/*showSelectedItem*/ ctx[29] && !/*isClearable*/ ctx[15] || !/*showSelectedItem*/ ctx[29]))) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);
    				} else {
    					if_block5 = create_if_block_4$1(ctx);
    					if_block5.c();
    					if_block5.m(div, t6);
    				}
    			} else if (if_block5) {
    				if_block5.d(1);
    				if_block5 = null;
    			}

    			if (/*isWaiting*/ ctx[4]) {
    				if (if_block6) ; else {
    					if_block6 = create_if_block_3$1(ctx);
    					if_block6.c();
    					if_block6.m(div, t7);
    				}
    			} else if (if_block6) {
    				if_block6.d(1);
    				if_block6 = null;
    			}

    			if (/*listOpen*/ ctx[5]) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty[0] & /*listOpen*/ 32) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_2$1(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(div, t8);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (!/*isMulti*/ ctx[7] || /*isMulti*/ ctx[7] && !/*showMultiSelect*/ ctx[35]) {
    				if (if_block8) {
    					if_block8.p(ctx, dirty);
    				} else {
    					if_block8 = create_if_block_1$1(ctx);
    					if_block8.c();
    					if_block8.m(div, t9);
    				}
    			} else if (if_block8) {
    				if_block8.d(1);
    				if_block8 = null;
    			}

    			if (/*isMulti*/ ctx[7] && /*showMultiSelect*/ ctx[35]) {
    				if (if_block9) {
    					if_block9.p(ctx, dirty);
    				} else {
    					if_block9 = create_if_block$2(ctx);
    					if_block9.c();
    					if_block9.m(div, null);
    				}
    			} else if (if_block9) {
    				if_block9.d(1);
    				if_block9 = null;
    			}

    			if (!current || dirty[0] & /*containerClasses*/ 2097152 && div_class_value !== (div_class_value = "selectContainer " + /*containerClasses*/ ctx[21] + " svelte-ev85av")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty[0] & /*containerStyles*/ 2048) {
    				attr_dev(div, "style", /*containerStyles*/ ctx[11]);
    			}

    			if (dirty[0] & /*containerClasses, hasError*/ 2098176) {
    				toggle_class(div, "hasError", /*hasError*/ ctx[10]);
    			}

    			if (dirty[0] & /*containerClasses, isMulti*/ 2097280) {
    				toggle_class(div, "multiSelect", /*isMulti*/ ctx[7]);
    			}

    			if (dirty[0] & /*containerClasses, isDisabled*/ 2097664) {
    				toggle_class(div, "disabled", /*isDisabled*/ ctx[9]);
    			}

    			if (dirty[0] & /*containerClasses, isFocused*/ 2097154) {
    				toggle_class(div, "focused", /*isFocused*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block7);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block7);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			/*input_1_binding*/ ctx[82](null);
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (if_block7) if_block7.d();
    			if (if_block8) if_block8.d();
    			if (if_block9) if_block9.d();
    			/*div_binding*/ ctx[85](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function convertStringItemsToObjects(_items) {
    	return _items.map((item, index) => {
    		return { index, value: item, label: `${item}` };
    	});
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let filteredItems;
    	let showSelectedItem;
    	let showClearIcon;
    	let placeholderText;
    	let showMultiSelect;
    	let listProps;
    	let ariaSelection;
    	let ariaContext;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, []);
    	const dispatch = createEventDispatcher();
    	let { id = null } = $$props;
    	let { container = undefined } = $$props;
    	let { input = undefined } = $$props;
    	let { isMulti = false } = $$props;
    	let { multiFullItemClearable = false } = $$props;
    	let { isDisabled = false } = $$props;
    	let { isCreatable = false } = $$props;
    	let { isFocused = false } = $$props;
    	let { value = null } = $$props;
    	let { filterText = '' } = $$props;
    	let { placeholder = 'Select...' } = $$props;
    	let { placeholderAlwaysShow = false } = $$props;
    	let { items = null } = $$props;
    	let { itemFilter = (label, filterText, option) => `${label}`.toLowerCase().includes(filterText.toLowerCase()) } = $$props;
    	let { groupBy = undefined } = $$props;
    	let { groupFilter = groups => groups } = $$props;
    	let { isGroupHeaderSelectable = false } = $$props;

    	let { getGroupHeaderLabel = option => {
    		return option[labelIdentifier] || option.id;
    	} } = $$props;

    	let { labelIdentifier = 'label' } = $$props;

    	let { getOptionLabel = (option, filterText) => {
    		return option.isCreator
    		? `Create \"${filterText}\"`
    		: option[labelIdentifier];
    	} } = $$props;

    	let { optionIdentifier = 'value' } = $$props;
    	let { loadOptions = undefined } = $$props;
    	let { hasError = false } = $$props;
    	let { containerStyles = '' } = $$props;

    	let { getSelectionLabel = option => {
    		if (option) return option[labelIdentifier]; else return null;
    	} } = $$props;

    	let { createGroupHeaderItem = groupValue => {
    		return { value: groupValue, label: groupValue };
    	} } = $$props;

    	let { createItem = filterText => {
    		return { value: filterText, label: filterText };
    	} } = $$props;

    	const getFilteredItems = () => {
    		return filteredItems;
    	};

    	let { isSearchable = true } = $$props;
    	let { inputStyles = '' } = $$props;
    	let { isClearable = true } = $$props;
    	let { isWaiting = false } = $$props;
    	let { listPlacement = 'auto' } = $$props;
    	let { listOpen = false } = $$props;
    	let { isVirtualList = false } = $$props;
    	let { loadOptionsInterval = 300 } = $$props;
    	let { noOptionsMessage = 'No options' } = $$props;
    	let { hideEmptyState = false } = $$props;
    	let { inputAttributes = {} } = $$props;
    	let { listAutoWidth = true } = $$props;
    	let { itemHeight = 40 } = $$props;
    	let { Icon = undefined } = $$props;
    	let { iconProps = {} } = $$props;
    	let { showChevron = false } = $$props;
    	let { showIndicator = false } = $$props;
    	let { containerClasses = '' } = $$props;
    	let { indicatorSvg = undefined } = $$props;
    	let { listOffset = 5 } = $$props;
    	let { ClearIcon: ClearIcon$1 = ClearIcon } = $$props;
    	let { Item: Item$1 = Item } = $$props;
    	let { List: List$1 = List } = $$props;
    	let { Selection: Selection$1 = Selection } = $$props;
    	let { MultiSelection: MultiSelection$1 = MultiSelection } = $$props;
    	let { VirtualList: VirtualList$1 = VirtualList } = $$props;

    	function filterMethod(args) {
    		if (args.loadOptions && args.filterText.length > 0) return;
    		if (!args.items) return [];

    		if (args.items && args.items.length > 0 && typeof args.items[0] !== 'object') {
    			args.items = convertStringItemsToObjects(args.items);
    		}

    		let filterResults = args.items.filter(item => {
    			let matchesFilter = itemFilter(getOptionLabel(item, args.filterText), args.filterText, item);

    			if (matchesFilter && args.isMulti && args.value && Array.isArray(args.value)) {
    				matchesFilter = !args.value.some(x => {
    					return x[args.optionIdentifier] === item[args.optionIdentifier];
    				});
    			}

    			return matchesFilter;
    		});

    		if (args.groupBy) {
    			filterResults = filterGroupedItems(filterResults);
    		}

    		if (args.isCreatable) {
    			filterResults = addCreatableItem(filterResults, args.filterText);
    		}

    		return filterResults;
    	}

    	function addCreatableItem(_items, _filterText) {
    		if (_filterText.length === 0) return _items;
    		const itemToCreate = createItem(_filterText);
    		if (_items[0] && _filterText === _items[0][labelIdentifier]) return _items;
    		itemToCreate.isCreator = true;
    		return [..._items, itemToCreate];
    	}

    	let { selectedValue = null } = $$props;
    	let activeValue;
    	let prev_value;
    	let prev_filterText;
    	let prev_isFocused;
    	let prev_isMulti;
    	let hoverItemIndex;

    	const getItems = debounce(
    		async () => {
    			$$invalidate(4, isWaiting = true);

    			let res = await loadOptions(filterText).catch(err => {
    				console.warn('svelte-select loadOptions error :>> ', err);
    				dispatch('error', { type: 'loadOptions', details: err });
    			});

    			if (res && !res.cancelled) {
    				if (res) {
    					if (res && res.length > 0 && typeof res[0] !== 'object') {
    						res = convertStringItemsToObjects(res);
    					}

    					$$invalidate(81, filteredItems = [...res]);
    					dispatch('loaded', { items: filteredItems });
    				} else {
    					$$invalidate(81, filteredItems = []);
    				}

    				if (isCreatable) {
    					$$invalidate(81, filteredItems = addCreatableItem(filteredItems, filterText));
    				}

    				$$invalidate(4, isWaiting = false);
    				$$invalidate(1, isFocused = true);
    				$$invalidate(5, listOpen = true);
    			}
    		},
    		loadOptionsInterval
    	);

    	function setValue() {
    		if (typeof value === 'string') {
    			$$invalidate(2, value = { [optionIdentifier]: value, label: value });
    		} else if (isMulti && Array.isArray(value) && value.length > 0) {
    			$$invalidate(2, value = value.map(item => typeof item === 'string'
    			? { value: item, label: item }
    			: item));
    		}
    	}

    	let _inputAttributes;

    	function assignInputAttributes() {
    		$$invalidate(31, _inputAttributes = Object.assign(
    			{
    				autocapitalize: 'none',
    				autocomplete: 'off',
    				autocorrect: 'off',
    				spellcheck: false,
    				tabindex: 0,
    				type: 'text',
    				'aria-autocomplete': 'list'
    			},
    			inputAttributes
    		));

    		if (id) {
    			$$invalidate(31, _inputAttributes.id = id, _inputAttributes);
    		}

    		if (!isSearchable) {
    			$$invalidate(31, _inputAttributes.readonly = true, _inputAttributes);
    		}
    	}

    	function filterGroupedItems(_items) {
    		const groupValues = [];
    		const groups = {};

    		_items.forEach(item => {
    			const groupValue = groupBy(item);

    			if (!groupValues.includes(groupValue)) {
    				groupValues.push(groupValue);
    				groups[groupValue] = [];

    				if (groupValue) {
    					groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
    						id: groupValue,
    						isGroupHeader: true,
    						isSelectable: isGroupHeaderSelectable
    					}));
    				}
    			}

    			groups[groupValue].push(Object.assign({ isGroupItem: !!groupValue }, item));
    		});

    		const sortedGroupedItems = [];

    		groupFilter(groupValues).forEach(groupValue => {
    			sortedGroupedItems.push(...groups[groupValue]);
    		});

    		return sortedGroupedItems;
    	}

    	function dispatchSelectedItem() {
    		if (isMulti) {
    			if (JSON.stringify(value) !== JSON.stringify(prev_value)) {
    				if (checkValueForDuplicates()) {
    					dispatch('select', value);
    				}
    			}

    			return;
    		}

    		if (!prev_value || JSON.stringify(value[optionIdentifier]) !== JSON.stringify(prev_value[optionIdentifier])) {
    			dispatch('select', value);
    		}
    	}

    	function setupFocus() {
    		if (isFocused || listOpen) {
    			handleFocus();
    		} else {
    			if (input) input.blur();
    		}
    	}

    	function setupMulti() {
    		if (value) {
    			if (Array.isArray(value)) {
    				$$invalidate(2, value = [...value]);
    			} else {
    				$$invalidate(2, value = [value]);
    			}
    		}
    	}

    	function setupSingle() {
    		if (value) $$invalidate(2, value = null);
    	}

    	function setupFilterText() {
    		if (filterText.length === 0) return;
    		$$invalidate(1, isFocused = true);
    		$$invalidate(5, listOpen = true);

    		if (loadOptions) {
    			getItems();
    		} else {
    			$$invalidate(5, listOpen = true);

    			if (isMulti) {
    				$$invalidate(30, activeValue = undefined);
    			}
    		}
    	}

    	beforeUpdate(async () => {
    		$$invalidate(77, prev_value = value);
    		$$invalidate(78, prev_filterText = filterText);
    		$$invalidate(79, prev_isFocused = isFocused);
    		$$invalidate(80, prev_isMulti = isMulti);
    	});

    	function checkValueForDuplicates() {
    		let noDuplicates = true;

    		if (value) {
    			const ids = [];
    			const uniqueValues = [];

    			value.forEach(val => {
    				if (!ids.includes(val[optionIdentifier])) {
    					ids.push(val[optionIdentifier]);
    					uniqueValues.push(val);
    				} else {
    					noDuplicates = false;
    				}
    			});

    			if (!noDuplicates) $$invalidate(2, value = uniqueValues);
    		}

    		return noDuplicates;
    	}

    	function findItem(selection) {
    		let matchTo = selection
    		? selection[optionIdentifier]
    		: value[optionIdentifier];

    		return items.find(item => item[optionIdentifier] === matchTo);
    	}

    	function updateValueDisplay(items) {
    		if (!items || items.length === 0 || items.some(item => typeof item !== 'object')) return;

    		if (!value || (isMulti
    		? value.some(selection => !selection || !selection[optionIdentifier])
    		: !value[optionIdentifier])) return;

    		if (Array.isArray(value)) {
    			$$invalidate(2, value = value.map(selection => findItem(selection) || selection));
    		} else {
    			$$invalidate(2, value = findItem() || value);
    		}
    	}

    	function handleMultiItemClear(event) {
    		const { detail } = event;
    		const itemToRemove = value[detail ? detail.i : value.length - 1];

    		if (value.length === 1) {
    			$$invalidate(2, value = undefined);
    		} else {
    			$$invalidate(2, value = value.filter(item => {
    				return item !== itemToRemove;
    			}));
    		}

    		dispatch('clear', itemToRemove);
    	}

    	function handleKeyDown(e) {
    		if (!isFocused) return;

    		switch (e.key) {
    			case 'ArrowDown':
    				e.preventDefault();
    				$$invalidate(5, listOpen = true);
    				$$invalidate(30, activeValue = undefined);
    				break;
    			case 'ArrowUp':
    				e.preventDefault();
    				$$invalidate(5, listOpen = true);
    				$$invalidate(30, activeValue = undefined);
    				break;
    			case 'Tab':
    				if (!listOpen) $$invalidate(1, isFocused = false);
    				break;
    			case 'Backspace':
    				if (!isMulti || filterText.length > 0) return;
    				if (isMulti && value && value.length > 0) {
    					handleMultiItemClear(activeValue !== undefined
    					? activeValue
    					: value.length - 1);

    					if (activeValue === 0 || activeValue === undefined) break;
    					$$invalidate(30, activeValue = value.length > activeValue ? activeValue - 1 : undefined);
    				}
    				break;
    			case 'ArrowLeft':
    				if (!isMulti || filterText.length > 0) return;
    				if (activeValue === undefined) {
    					$$invalidate(30, activeValue = value.length - 1);
    				} else if (value.length > activeValue && activeValue !== 0) {
    					$$invalidate(30, activeValue -= 1);
    				}
    				break;
    			case 'ArrowRight':
    				if (!isMulti || filterText.length > 0 || activeValue === undefined) return;
    				if (activeValue === value.length - 1) {
    					$$invalidate(30, activeValue = undefined);
    				} else if (activeValue < value.length - 1) {
    					$$invalidate(30, activeValue += 1);
    				}
    				break;
    		}
    	}

    	function handleFocus() {
    		$$invalidate(1, isFocused = true);
    		if (input) input.focus();
    	}

    	function handleWindowEvent(event) {
    		if (!container) return;

    		const eventTarget = event.path && event.path.length > 0
    		? event.path[0]
    		: event.target;

    		if (container.contains(eventTarget) || container.contains(event.relatedTarget)) {
    			return;
    		}

    		$$invalidate(1, isFocused = false);
    		$$invalidate(5, listOpen = false);
    		$$invalidate(30, activeValue = undefined);
    		if (input) input.blur();
    	}

    	function handleClick() {
    		if (isDisabled) return;
    		$$invalidate(1, isFocused = true);
    		$$invalidate(5, listOpen = !listOpen);
    	}

    	function handleClear() {
    		$$invalidate(2, value = undefined);
    		$$invalidate(5, listOpen = false);
    		dispatch('clear', value);
    		handleFocus();
    	}

    	onMount(() => {
    		if (isFocused && input) input.focus();
    	});

    	function itemSelected(event) {
    		const { detail } = event;

    		if (detail) {
    			$$invalidate(3, filterText = '');
    			const item = Object.assign({}, detail);

    			if (!item.isGroupHeader || item.isSelectable) {
    				if (isMulti) {
    					$$invalidate(2, value = value ? value.concat([item]) : [item]);
    				} else {
    					$$invalidate(2, value = item);
    				}

    				$$invalidate(2, value);

    				setTimeout(() => {
    					$$invalidate(5, listOpen = false);
    					$$invalidate(30, activeValue = undefined);
    				});
    			}
    		}
    	}

    	function itemCreated(event) {
    		const { detail } = event;

    		if (isMulti) {
    			$$invalidate(2, value = value || []);
    			$$invalidate(2, value = [...value, createItem(detail)]);
    		} else {
    			$$invalidate(2, value = createItem(detail));
    		}

    		dispatch('itemCreated', detail);
    		$$invalidate(3, filterText = '');
    		$$invalidate(5, listOpen = false);
    		$$invalidate(30, activeValue = undefined);
    	}

    	function closeList() {
    		$$invalidate(3, filterText = '');
    		$$invalidate(5, listOpen = false);
    	}

    	let { ariaValues = values => {
    		return `Option ${values}, selected.`;
    	} } = $$props;

    	let { ariaListOpen = (label, count) => {
    		return `You are currently focused on option ${label}. There are ${count} results available.`;
    	} } = $$props;

    	let { ariaFocused = () => {
    		return `Select is focused, type to refine list, press down to open the menu.`;
    	} } = $$props;

    	function handleAriaSelection() {
    		let selected = undefined;

    		if (isMulti && value.length > 0) {
    			selected = value.map(v => getSelectionLabel(v)).join(', ');
    		} else {
    			selected = getSelectionLabel(value);
    		}

    		return ariaValues(selected);
    	}

    	function handleAriaContent() {
    		if (!isFocused || !filteredItems || filteredItems.length === 0) return '';
    		let _item = filteredItems[hoverItemIndex];

    		if (listOpen && _item) {
    			let label = getSelectionLabel(_item);
    			let count = filteredItems ? filteredItems.length : 0;
    			return ariaListOpen(label, count);
    		} else {
    			return ariaFocused();
    		}
    	}

    	const writable_props = [
    		'id',
    		'container',
    		'input',
    		'isMulti',
    		'multiFullItemClearable',
    		'isDisabled',
    		'isCreatable',
    		'isFocused',
    		'value',
    		'filterText',
    		'placeholder',
    		'placeholderAlwaysShow',
    		'items',
    		'itemFilter',
    		'groupBy',
    		'groupFilter',
    		'isGroupHeaderSelectable',
    		'getGroupHeaderLabel',
    		'labelIdentifier',
    		'getOptionLabel',
    		'optionIdentifier',
    		'loadOptions',
    		'hasError',
    		'containerStyles',
    		'getSelectionLabel',
    		'createGroupHeaderItem',
    		'createItem',
    		'isSearchable',
    		'inputStyles',
    		'isClearable',
    		'isWaiting',
    		'listPlacement',
    		'listOpen',
    		'isVirtualList',
    		'loadOptionsInterval',
    		'noOptionsMessage',
    		'hideEmptyState',
    		'inputAttributes',
    		'listAutoWidth',
    		'itemHeight',
    		'Icon',
    		'iconProps',
    		'showChevron',
    		'showIndicator',
    		'containerClasses',
    		'indicatorSvg',
    		'listOffset',
    		'ClearIcon',
    		'Item',
    		'List',
    		'Selection',
    		'MultiSelection',
    		'VirtualList',
    		'selectedValue',
    		'ariaValues',
    		'ariaListOpen',
    		'ariaFocused'
    	];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(6, input);
    		});
    	}

    	function input_1_input_handler() {
    		filterText = this.value;
    		$$invalidate(3, filterText);
    	}

    	function switch_instance_hoverItemIndex_binding(value) {
    		hoverItemIndex = value;
    		$$invalidate(28, hoverItemIndex);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(46, id = $$props.id);
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('isMulti' in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ('multiFullItemClearable' in $$props) $$invalidate(8, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('isDisabled' in $$props) $$invalidate(9, isDisabled = $$props.isDisabled);
    		if ('isCreatable' in $$props) $$invalidate(47, isCreatable = $$props.isCreatable);
    		if ('isFocused' in $$props) $$invalidate(1, isFocused = $$props.isFocused);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('filterText' in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ('placeholder' in $$props) $$invalidate(48, placeholder = $$props.placeholder);
    		if ('placeholderAlwaysShow' in $$props) $$invalidate(49, placeholderAlwaysShow = $$props.placeholderAlwaysShow);
    		if ('items' in $$props) $$invalidate(50, items = $$props.items);
    		if ('itemFilter' in $$props) $$invalidate(51, itemFilter = $$props.itemFilter);
    		if ('groupBy' in $$props) $$invalidate(52, groupBy = $$props.groupBy);
    		if ('groupFilter' in $$props) $$invalidate(53, groupFilter = $$props.groupFilter);
    		if ('isGroupHeaderSelectable' in $$props) $$invalidate(54, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(55, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('labelIdentifier' in $$props) $$invalidate(56, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(57, getOptionLabel = $$props.getOptionLabel);
    		if ('optionIdentifier' in $$props) $$invalidate(58, optionIdentifier = $$props.optionIdentifier);
    		if ('loadOptions' in $$props) $$invalidate(59, loadOptions = $$props.loadOptions);
    		if ('hasError' in $$props) $$invalidate(10, hasError = $$props.hasError);
    		if ('containerStyles' in $$props) $$invalidate(11, containerStyles = $$props.containerStyles);
    		if ('getSelectionLabel' in $$props) $$invalidate(12, getSelectionLabel = $$props.getSelectionLabel);
    		if ('createGroupHeaderItem' in $$props) $$invalidate(60, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ('createItem' in $$props) $$invalidate(61, createItem = $$props.createItem);
    		if ('isSearchable' in $$props) $$invalidate(13, isSearchable = $$props.isSearchable);
    		if ('inputStyles' in $$props) $$invalidate(14, inputStyles = $$props.inputStyles);
    		if ('isClearable' in $$props) $$invalidate(15, isClearable = $$props.isClearable);
    		if ('isWaiting' in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ('listPlacement' in $$props) $$invalidate(63, listPlacement = $$props.listPlacement);
    		if ('listOpen' in $$props) $$invalidate(5, listOpen = $$props.listOpen);
    		if ('isVirtualList' in $$props) $$invalidate(64, isVirtualList = $$props.isVirtualList);
    		if ('loadOptionsInterval' in $$props) $$invalidate(65, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ('noOptionsMessage' in $$props) $$invalidate(66, noOptionsMessage = $$props.noOptionsMessage);
    		if ('hideEmptyState' in $$props) $$invalidate(67, hideEmptyState = $$props.hideEmptyState);
    		if ('inputAttributes' in $$props) $$invalidate(16, inputAttributes = $$props.inputAttributes);
    		if ('listAutoWidth' in $$props) $$invalidate(68, listAutoWidth = $$props.listAutoWidth);
    		if ('itemHeight' in $$props) $$invalidate(69, itemHeight = $$props.itemHeight);
    		if ('Icon' in $$props) $$invalidate(17, Icon = $$props.Icon);
    		if ('iconProps' in $$props) $$invalidate(18, iconProps = $$props.iconProps);
    		if ('showChevron' in $$props) $$invalidate(19, showChevron = $$props.showChevron);
    		if ('showIndicator' in $$props) $$invalidate(20, showIndicator = $$props.showIndicator);
    		if ('containerClasses' in $$props) $$invalidate(21, containerClasses = $$props.containerClasses);
    		if ('indicatorSvg' in $$props) $$invalidate(22, indicatorSvg = $$props.indicatorSvg);
    		if ('listOffset' in $$props) $$invalidate(70, listOffset = $$props.listOffset);
    		if ('ClearIcon' in $$props) $$invalidate(23, ClearIcon$1 = $$props.ClearIcon);
    		if ('Item' in $$props) $$invalidate(71, Item$1 = $$props.Item);
    		if ('List' in $$props) $$invalidate(24, List$1 = $$props.List);
    		if ('Selection' in $$props) $$invalidate(25, Selection$1 = $$props.Selection);
    		if ('MultiSelection' in $$props) $$invalidate(26, MultiSelection$1 = $$props.MultiSelection);
    		if ('VirtualList' in $$props) $$invalidate(72, VirtualList$1 = $$props.VirtualList);
    		if ('selectedValue' in $$props) $$invalidate(73, selectedValue = $$props.selectedValue);
    		if ('ariaValues' in $$props) $$invalidate(74, ariaValues = $$props.ariaValues);
    		if ('ariaListOpen' in $$props) $$invalidate(75, ariaListOpen = $$props.ariaListOpen);
    		if ('ariaFocused' in $$props) $$invalidate(76, ariaFocused = $$props.ariaFocused);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		createEventDispatcher,
    		onMount,
    		_List: List,
    		_Item: Item,
    		_Selection: Selection,
    		_MultiSelection: MultiSelection,
    		_VirtualList: VirtualList,
    		_ClearIcon: ClearIcon,
    		debounce,
    		dispatch,
    		id,
    		container,
    		input,
    		isMulti,
    		multiFullItemClearable,
    		isDisabled,
    		isCreatable,
    		isFocused,
    		value,
    		filterText,
    		placeholder,
    		placeholderAlwaysShow,
    		items,
    		itemFilter,
    		groupBy,
    		groupFilter,
    		isGroupHeaderSelectable,
    		getGroupHeaderLabel,
    		labelIdentifier,
    		getOptionLabel,
    		optionIdentifier,
    		loadOptions,
    		hasError,
    		containerStyles,
    		getSelectionLabel,
    		createGroupHeaderItem,
    		createItem,
    		getFilteredItems,
    		isSearchable,
    		inputStyles,
    		isClearable,
    		isWaiting,
    		listPlacement,
    		listOpen,
    		isVirtualList,
    		loadOptionsInterval,
    		noOptionsMessage,
    		hideEmptyState,
    		inputAttributes,
    		listAutoWidth,
    		itemHeight,
    		Icon,
    		iconProps,
    		showChevron,
    		showIndicator,
    		containerClasses,
    		indicatorSvg,
    		listOffset,
    		ClearIcon: ClearIcon$1,
    		Item: Item$1,
    		List: List$1,
    		Selection: Selection$1,
    		MultiSelection: MultiSelection$1,
    		VirtualList: VirtualList$1,
    		filterMethod,
    		addCreatableItem,
    		selectedValue,
    		activeValue,
    		prev_value,
    		prev_filterText,
    		prev_isFocused,
    		prev_isMulti,
    		hoverItemIndex,
    		getItems,
    		setValue,
    		_inputAttributes,
    		assignInputAttributes,
    		convertStringItemsToObjects,
    		filterGroupedItems,
    		dispatchSelectedItem,
    		setupFocus,
    		setupMulti,
    		setupSingle,
    		setupFilterText,
    		checkValueForDuplicates,
    		findItem,
    		updateValueDisplay,
    		handleMultiItemClear,
    		handleKeyDown,
    		handleFocus,
    		handleWindowEvent,
    		handleClick,
    		handleClear,
    		itemSelected,
    		itemCreated,
    		closeList,
    		ariaValues,
    		ariaListOpen,
    		ariaFocused,
    		handleAriaSelection,
    		handleAriaContent,
    		filteredItems,
    		ariaContext,
    		ariaSelection,
    		listProps,
    		showMultiSelect,
    		placeholderText,
    		showSelectedItem,
    		showClearIcon
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(46, id = $$props.id);
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('input' in $$props) $$invalidate(6, input = $$props.input);
    		if ('isMulti' in $$props) $$invalidate(7, isMulti = $$props.isMulti);
    		if ('multiFullItemClearable' in $$props) $$invalidate(8, multiFullItemClearable = $$props.multiFullItemClearable);
    		if ('isDisabled' in $$props) $$invalidate(9, isDisabled = $$props.isDisabled);
    		if ('isCreatable' in $$props) $$invalidate(47, isCreatable = $$props.isCreatable);
    		if ('isFocused' in $$props) $$invalidate(1, isFocused = $$props.isFocused);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('filterText' in $$props) $$invalidate(3, filterText = $$props.filterText);
    		if ('placeholder' in $$props) $$invalidate(48, placeholder = $$props.placeholder);
    		if ('placeholderAlwaysShow' in $$props) $$invalidate(49, placeholderAlwaysShow = $$props.placeholderAlwaysShow);
    		if ('items' in $$props) $$invalidate(50, items = $$props.items);
    		if ('itemFilter' in $$props) $$invalidate(51, itemFilter = $$props.itemFilter);
    		if ('groupBy' in $$props) $$invalidate(52, groupBy = $$props.groupBy);
    		if ('groupFilter' in $$props) $$invalidate(53, groupFilter = $$props.groupFilter);
    		if ('isGroupHeaderSelectable' in $$props) $$invalidate(54, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
    		if ('getGroupHeaderLabel' in $$props) $$invalidate(55, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
    		if ('labelIdentifier' in $$props) $$invalidate(56, labelIdentifier = $$props.labelIdentifier);
    		if ('getOptionLabel' in $$props) $$invalidate(57, getOptionLabel = $$props.getOptionLabel);
    		if ('optionIdentifier' in $$props) $$invalidate(58, optionIdentifier = $$props.optionIdentifier);
    		if ('loadOptions' in $$props) $$invalidate(59, loadOptions = $$props.loadOptions);
    		if ('hasError' in $$props) $$invalidate(10, hasError = $$props.hasError);
    		if ('containerStyles' in $$props) $$invalidate(11, containerStyles = $$props.containerStyles);
    		if ('getSelectionLabel' in $$props) $$invalidate(12, getSelectionLabel = $$props.getSelectionLabel);
    		if ('createGroupHeaderItem' in $$props) $$invalidate(60, createGroupHeaderItem = $$props.createGroupHeaderItem);
    		if ('createItem' in $$props) $$invalidate(61, createItem = $$props.createItem);
    		if ('isSearchable' in $$props) $$invalidate(13, isSearchable = $$props.isSearchable);
    		if ('inputStyles' in $$props) $$invalidate(14, inputStyles = $$props.inputStyles);
    		if ('isClearable' in $$props) $$invalidate(15, isClearable = $$props.isClearable);
    		if ('isWaiting' in $$props) $$invalidate(4, isWaiting = $$props.isWaiting);
    		if ('listPlacement' in $$props) $$invalidate(63, listPlacement = $$props.listPlacement);
    		if ('listOpen' in $$props) $$invalidate(5, listOpen = $$props.listOpen);
    		if ('isVirtualList' in $$props) $$invalidate(64, isVirtualList = $$props.isVirtualList);
    		if ('loadOptionsInterval' in $$props) $$invalidate(65, loadOptionsInterval = $$props.loadOptionsInterval);
    		if ('noOptionsMessage' in $$props) $$invalidate(66, noOptionsMessage = $$props.noOptionsMessage);
    		if ('hideEmptyState' in $$props) $$invalidate(67, hideEmptyState = $$props.hideEmptyState);
    		if ('inputAttributes' in $$props) $$invalidate(16, inputAttributes = $$props.inputAttributes);
    		if ('listAutoWidth' in $$props) $$invalidate(68, listAutoWidth = $$props.listAutoWidth);
    		if ('itemHeight' in $$props) $$invalidate(69, itemHeight = $$props.itemHeight);
    		if ('Icon' in $$props) $$invalidate(17, Icon = $$props.Icon);
    		if ('iconProps' in $$props) $$invalidate(18, iconProps = $$props.iconProps);
    		if ('showChevron' in $$props) $$invalidate(19, showChevron = $$props.showChevron);
    		if ('showIndicator' in $$props) $$invalidate(20, showIndicator = $$props.showIndicator);
    		if ('containerClasses' in $$props) $$invalidate(21, containerClasses = $$props.containerClasses);
    		if ('indicatorSvg' in $$props) $$invalidate(22, indicatorSvg = $$props.indicatorSvg);
    		if ('listOffset' in $$props) $$invalidate(70, listOffset = $$props.listOffset);
    		if ('ClearIcon' in $$props) $$invalidate(23, ClearIcon$1 = $$props.ClearIcon);
    		if ('Item' in $$props) $$invalidate(71, Item$1 = $$props.Item);
    		if ('List' in $$props) $$invalidate(24, List$1 = $$props.List);
    		if ('Selection' in $$props) $$invalidate(25, Selection$1 = $$props.Selection);
    		if ('MultiSelection' in $$props) $$invalidate(26, MultiSelection$1 = $$props.MultiSelection);
    		if ('VirtualList' in $$props) $$invalidate(72, VirtualList$1 = $$props.VirtualList);
    		if ('selectedValue' in $$props) $$invalidate(73, selectedValue = $$props.selectedValue);
    		if ('activeValue' in $$props) $$invalidate(30, activeValue = $$props.activeValue);
    		if ('prev_value' in $$props) $$invalidate(77, prev_value = $$props.prev_value);
    		if ('prev_filterText' in $$props) $$invalidate(78, prev_filterText = $$props.prev_filterText);
    		if ('prev_isFocused' in $$props) $$invalidate(79, prev_isFocused = $$props.prev_isFocused);
    		if ('prev_isMulti' in $$props) $$invalidate(80, prev_isMulti = $$props.prev_isMulti);
    		if ('hoverItemIndex' in $$props) $$invalidate(28, hoverItemIndex = $$props.hoverItemIndex);
    		if ('_inputAttributes' in $$props) $$invalidate(31, _inputAttributes = $$props._inputAttributes);
    		if ('ariaValues' in $$props) $$invalidate(74, ariaValues = $$props.ariaValues);
    		if ('ariaListOpen' in $$props) $$invalidate(75, ariaListOpen = $$props.ariaListOpen);
    		if ('ariaFocused' in $$props) $$invalidate(76, ariaFocused = $$props.ariaFocused);
    		if ('filteredItems' in $$props) $$invalidate(81, filteredItems = $$props.filteredItems);
    		if ('ariaContext' in $$props) $$invalidate(32, ariaContext = $$props.ariaContext);
    		if ('ariaSelection' in $$props) $$invalidate(33, ariaSelection = $$props.ariaSelection);
    		if ('listProps' in $$props) $$invalidate(34, listProps = $$props.listProps);
    		if ('showMultiSelect' in $$props) $$invalidate(35, showMultiSelect = $$props.showMultiSelect);
    		if ('placeholderText' in $$props) $$invalidate(36, placeholderText = $$props.placeholderText);
    		if ('showSelectedItem' in $$props) $$invalidate(29, showSelectedItem = $$props.showSelectedItem);
    		if ('showClearIcon' in $$props) $$invalidate(37, showClearIcon = $$props.showClearIcon);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*filterText, value, isMulti*/ 140 | $$self.$$.dirty[1] & /*loadOptions, items, optionIdentifier, groupBy, isCreatable*/ 405340160) {
    			$$invalidate(81, filteredItems = filterMethod({
    				loadOptions,
    				filterText,
    				items,
    				value,
    				isMulti,
    				optionIdentifier,
    				groupBy,
    				isCreatable
    			}));
    		}

    		if ($$self.$$.dirty[2] & /*selectedValue*/ 2048) {
    			{
    				if (selectedValue) console.warn('selectedValue is no longer used. Please use value instead.');
    			}
    		}

    		if ($$self.$$.dirty[1] & /*items*/ 524288) {
    			updateValueDisplay(items);
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 4) {
    			{
    				if (value) setValue();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*inputAttributes, isSearchable*/ 73728) {
    			{
    				if (inputAttributes || !isSearchable) assignInputAttributes();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isMulti*/ 128 | $$self.$$.dirty[2] & /*prev_isMulti*/ 262144) {
    			{
    				if (isMulti) {
    					setupMulti();
    				}

    				if (prev_isMulti && !isMulti) {
    					setupSingle();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132) {
    			{
    				if (isMulti && value && value.length > 1) {
    					checkValueForDuplicates();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 4) {
    			{
    				if (value) dispatchSelectedItem();
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, isMulti*/ 132 | $$self.$$.dirty[2] & /*prev_value*/ 32768) {
    			{
    				if (!value && isMulti && prev_value) {
    					dispatch('select', value);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*isFocused*/ 2 | $$self.$$.dirty[2] & /*prev_isFocused*/ 131072) {
    			{
    				if (isFocused !== prev_isFocused) {
    					setupFocus();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*filterText*/ 8 | $$self.$$.dirty[2] & /*prev_filterText*/ 65536) {
    			{
    				if (filterText !== prev_filterText) {
    					setupFilterText();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, filterText*/ 12) {
    			$$invalidate(29, showSelectedItem = value && filterText.length === 0);
    		}

    		if ($$self.$$.dirty[0] & /*showSelectedItem, isClearable, isDisabled, isWaiting*/ 536904208) {
    			$$invalidate(37, showClearIcon = showSelectedItem && isClearable && !isDisabled && !isWaiting);
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132 | $$self.$$.dirty[1] & /*placeholderAlwaysShow, placeholder*/ 393216) {
    			$$invalidate(36, placeholderText = placeholderAlwaysShow && isMulti
    			? placeholder
    			: value ? '' : placeholder);
    		}

    		if ($$self.$$.dirty[0] & /*isMulti, value*/ 132) {
    			$$invalidate(35, showMultiSelect = isMulti && value && value.length > 0);
    		}

    		if ($$self.$$.dirty[0] & /*filterText, value, isMulti, container*/ 141 | $$self.$$.dirty[1] & /*optionIdentifier, getGroupHeaderLabel, getOptionLabel*/ 218103808 | $$self.$$.dirty[2] & /*Item, noOptionsMessage, hideEmptyState, isVirtualList, VirtualList, filteredItems, itemHeight, listPlacement, listAutoWidth, listOffset*/ 526326) {
    			$$invalidate(34, listProps = {
    				Item: Item$1,
    				filterText,
    				optionIdentifier,
    				noOptionsMessage,
    				hideEmptyState,
    				isVirtualList,
    				VirtualList: VirtualList$1,
    				value,
    				isMulti,
    				getGroupHeaderLabel,
    				items: filteredItems,
    				itemHeight,
    				getOptionLabel,
    				listPlacement,
    				parent: container,
    				listAutoWidth,
    				listOffset
    			});
    		}

    		if ($$self.$$.dirty[0] & /*value, isMulti*/ 132) {
    			$$invalidate(33, ariaSelection = value ? handleAriaSelection() : '');
    		}

    		if ($$self.$$.dirty[0] & /*hoverItemIndex, isFocused, listOpen*/ 268435490 | $$self.$$.dirty[2] & /*filteredItems*/ 524288) {
    			$$invalidate(32, ariaContext = handleAriaContent());
    		}
    	};

    	return [
    		container,
    		isFocused,
    		value,
    		filterText,
    		isWaiting,
    		listOpen,
    		input,
    		isMulti,
    		multiFullItemClearable,
    		isDisabled,
    		hasError,
    		containerStyles,
    		getSelectionLabel,
    		isSearchable,
    		inputStyles,
    		isClearable,
    		inputAttributes,
    		Icon,
    		iconProps,
    		showChevron,
    		showIndicator,
    		containerClasses,
    		indicatorSvg,
    		ClearIcon$1,
    		List$1,
    		Selection$1,
    		MultiSelection$1,
    		handleClear,
    		hoverItemIndex,
    		showSelectedItem,
    		activeValue,
    		_inputAttributes,
    		ariaContext,
    		ariaSelection,
    		listProps,
    		showMultiSelect,
    		placeholderText,
    		showClearIcon,
    		handleMultiItemClear,
    		handleKeyDown,
    		handleFocus,
    		handleWindowEvent,
    		handleClick,
    		itemSelected,
    		itemCreated,
    		closeList,
    		id,
    		isCreatable,
    		placeholder,
    		placeholderAlwaysShow,
    		items,
    		itemFilter,
    		groupBy,
    		groupFilter,
    		isGroupHeaderSelectable,
    		getGroupHeaderLabel,
    		labelIdentifier,
    		getOptionLabel,
    		optionIdentifier,
    		loadOptions,
    		createGroupHeaderItem,
    		createItem,
    		getFilteredItems,
    		listPlacement,
    		isVirtualList,
    		loadOptionsInterval,
    		noOptionsMessage,
    		hideEmptyState,
    		listAutoWidth,
    		itemHeight,
    		listOffset,
    		Item$1,
    		VirtualList$1,
    		selectedValue,
    		ariaValues,
    		ariaListOpen,
    		ariaFocused,
    		prev_value,
    		prev_filterText,
    		prev_isFocused,
    		prev_isMulti,
    		filteredItems,
    		input_1_binding,
    		input_1_input_handler,
    		switch_instance_hoverItemIndex_binding,
    		div_binding
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				id: 46,
    				container: 0,
    				input: 6,
    				isMulti: 7,
    				multiFullItemClearable: 8,
    				isDisabled: 9,
    				isCreatable: 47,
    				isFocused: 1,
    				value: 2,
    				filterText: 3,
    				placeholder: 48,
    				placeholderAlwaysShow: 49,
    				items: 50,
    				itemFilter: 51,
    				groupBy: 52,
    				groupFilter: 53,
    				isGroupHeaderSelectable: 54,
    				getGroupHeaderLabel: 55,
    				labelIdentifier: 56,
    				getOptionLabel: 57,
    				optionIdentifier: 58,
    				loadOptions: 59,
    				hasError: 10,
    				containerStyles: 11,
    				getSelectionLabel: 12,
    				createGroupHeaderItem: 60,
    				createItem: 61,
    				getFilteredItems: 62,
    				isSearchable: 13,
    				inputStyles: 14,
    				isClearable: 15,
    				isWaiting: 4,
    				listPlacement: 63,
    				listOpen: 5,
    				isVirtualList: 64,
    				loadOptionsInterval: 65,
    				noOptionsMessage: 66,
    				hideEmptyState: 67,
    				inputAttributes: 16,
    				listAutoWidth: 68,
    				itemHeight: 69,
    				Icon: 17,
    				iconProps: 18,
    				showChevron: 19,
    				showIndicator: 20,
    				containerClasses: 21,
    				indicatorSvg: 22,
    				listOffset: 70,
    				ClearIcon: 23,
    				Item: 71,
    				List: 24,
    				Selection: 25,
    				MultiSelection: 26,
    				VirtualList: 72,
    				selectedValue: 73,
    				handleClear: 27,
    				ariaValues: 74,
    				ariaListOpen: 75,
    				ariaFocused: 76
    			},
    			null,
    			[-1, -1, -1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get id() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get container() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get input() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isMulti() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isMulti(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiFullItemClearable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiFullItemClearable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isDisabled() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isDisabled(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isCreatable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isCreatable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isFocused() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isFocused(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get filterText() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set filterText(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholderAlwaysShow() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholderAlwaysShow(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupBy() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupBy(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupFilter() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupFilter(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isGroupHeaderSelectable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isGroupHeaderSelectable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getGroupHeaderLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getGroupHeaderLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelIdentifier() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelIdentifier(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getOptionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getOptionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get optionIdentifier() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set optionIdentifier(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptions() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptions(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasError() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasError(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getSelectionLabel() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getSelectionLabel(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createGroupHeaderItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createGroupHeaderItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get createItem() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set createItem(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getFilteredItems() {
    		return this.$$.ctx[62];
    	}

    	set getFilteredItems(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isSearchable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isSearchable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputStyles() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputStyles(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isClearable() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isClearable(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isWaiting() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isWaiting(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listPlacement() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listPlacement(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOpen() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOpen(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isVirtualList() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isVirtualList(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loadOptionsInterval() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loadOptionsInterval(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noOptionsMessage() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noOptionsMessage(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hideEmptyState() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hideEmptyState(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputAttributes() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputAttributes(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listAutoWidth() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listAutoWidth(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemHeight() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemHeight(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Icon() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Icon(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconProps() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconProps(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showChevron() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showChevron(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showIndicator() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showIndicator(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerClasses() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerClasses(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indicatorSvg() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indicatorSvg(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get listOffset() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set listOffset(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ClearIcon() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ClearIcon(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Item() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Item(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get List() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set List(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get Selection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set Selection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get MultiSelection() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set MultiSelection(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get VirtualList() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set VirtualList(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedValue() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedValue(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get handleClear() {
    		return this.$$.ctx[27];
    	}

    	set handleClear(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaValues() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaValues(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaListOpen() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaListOpen(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaFocused() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaFocused(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const matchName = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    const iconDefaults = Object.freeze({
      left: 0,
      top: 0,
      width: 16,
      height: 16,
      rotate: 0,
      vFlip: false,
      hFlip: false
    });
    function fullIcon(data) {
      return { ...iconDefaults, ...data };
    }

    const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
      const colonSeparated = value.split(":");
      if (value.slice(0, 1) === "@") {
        if (colonSeparated.length < 2 || colonSeparated.length > 3) {
          return null;
        }
        provider = colonSeparated.shift().slice(1);
      }
      if (colonSeparated.length > 3 || !colonSeparated.length) {
        return null;
      }
      if (colonSeparated.length > 1) {
        const name2 = colonSeparated.pop();
        const prefix = colonSeparated.pop();
        const result = {
          provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
          prefix,
          name: name2
        };
        return validate && !validateIcon(result) ? null : result;
      }
      const name = colonSeparated[0];
      const dashSeparated = name.split("-");
      if (dashSeparated.length > 1) {
        const result = {
          provider,
          prefix: dashSeparated.shift(),
          name: dashSeparated.join("-")
        };
        return validate && !validateIcon(result) ? null : result;
      }
      if (allowSimpleName && provider === "") {
        const result = {
          provider,
          prefix: "",
          name
        };
        return validate && !validateIcon(result, allowSimpleName) ? null : result;
      }
      return null;
    };
    const validateIcon = (icon, allowSimpleName) => {
      if (!icon) {
        return false;
      }
      return !!((icon.provider === "" || icon.provider.match(matchName)) && (allowSimpleName && icon.prefix === "" || icon.prefix.match(matchName)) && icon.name.match(matchName));
    };

    function mergeIconData(icon, alias) {
      const result = { ...icon };
      for (const key in iconDefaults) {
        const prop = key;
        if (alias[prop] !== void 0) {
          const value = alias[prop];
          if (result[prop] === void 0) {
            result[prop] = value;
            continue;
          }
          switch (prop) {
            case "rotate":
              result[prop] = (result[prop] + value) % 4;
              break;
            case "hFlip":
            case "vFlip":
              result[prop] = value !== result[prop];
              break;
            default:
              result[prop] = value;
          }
        }
      }
      return result;
    }

    function getIconData$1(data, name, full = false) {
      function getIcon(name2, iteration) {
        if (data.icons[name2] !== void 0) {
          return Object.assign({}, data.icons[name2]);
        }
        if (iteration > 5) {
          return null;
        }
        const aliases = data.aliases;
        if (aliases && aliases[name2] !== void 0) {
          const item = aliases[name2];
          const result2 = getIcon(item.parent, iteration + 1);
          if (result2) {
            return mergeIconData(result2, item);
          }
          return result2;
        }
        const chars = data.chars;
        if (!iteration && chars && chars[name2] !== void 0) {
          return getIcon(chars[name2], iteration + 1);
        }
        return null;
      }
      const result = getIcon(name, 0);
      if (result) {
        for (const key in iconDefaults) {
          if (result[key] === void 0 && data[key] !== void 0) {
            result[key] = data[key];
          }
        }
      }
      return result && full ? fullIcon(result) : result;
    }

    function isVariation(item) {
      for (const key in iconDefaults) {
        if (item[key] !== void 0) {
          return true;
        }
      }
      return false;
    }
    function parseIconSet(data, callback, options) {
      options = options || {};
      const names = [];
      if (typeof data !== "object" || typeof data.icons !== "object") {
        return names;
      }
      if (data.not_found instanceof Array) {
        data.not_found.forEach((name) => {
          callback(name, null);
          names.push(name);
        });
      }
      const icons = data.icons;
      Object.keys(icons).forEach((name) => {
        const iconData = getIconData$1(data, name, true);
        if (iconData) {
          callback(name, iconData);
          names.push(name);
        }
      });
      const parseAliases = options.aliases || "all";
      if (parseAliases !== "none" && typeof data.aliases === "object") {
        const aliases = data.aliases;
        Object.keys(aliases).forEach((name) => {
          if (parseAliases === "variations" && isVariation(aliases[name])) {
            return;
          }
          const iconData = getIconData$1(data, name, true);
          if (iconData) {
            callback(name, iconData);
            names.push(name);
          }
        });
      }
      return names;
    }

    const optionalProperties = {
      provider: "string",
      aliases: "object",
      not_found: "object"
    };
    for (const prop in iconDefaults) {
      optionalProperties[prop] = typeof iconDefaults[prop];
    }
    function quicklyValidateIconSet(obj) {
      if (typeof obj !== "object" || obj === null) {
        return null;
      }
      const data = obj;
      if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
        return null;
      }
      for (const prop in optionalProperties) {
        if (obj[prop] !== void 0 && typeof obj[prop] !== optionalProperties[prop]) {
          return null;
        }
      }
      const icons = data.icons;
      for (const name in icons) {
        const icon = icons[name];
        if (!name.match(matchName) || typeof icon.body !== "string") {
          return null;
        }
        for (const prop in iconDefaults) {
          if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
            return null;
          }
        }
      }
      const aliases = data.aliases;
      if (aliases) {
        for (const name in aliases) {
          const icon = aliases[name];
          const parent = icon.parent;
          if (!name.match(matchName) || typeof parent !== "string" || !icons[parent] && !aliases[parent]) {
            return null;
          }
          for (const prop in iconDefaults) {
            if (icon[prop] !== void 0 && typeof icon[prop] !== typeof iconDefaults[prop]) {
              return null;
            }
          }
        }
      }
      return data;
    }

    const storageVersion = 1;
    let storage$1 = /* @__PURE__ */ Object.create(null);
    try {
      const w = window || self;
      if (w && w._iconifyStorage.version === storageVersion) {
        storage$1 = w._iconifyStorage.storage;
      }
    } catch (err) {
    }
    function shareStorage() {
      try {
        const w = window || self;
        if (w && !w._iconifyStorage) {
          w._iconifyStorage = {
            version: storageVersion,
            storage: storage$1
          };
        }
      } catch (err) {
      }
    }
    function newStorage(provider, prefix) {
      return {
        provider,
        prefix,
        icons: /* @__PURE__ */ Object.create(null),
        missing: /* @__PURE__ */ Object.create(null)
      };
    }
    function getStorage(provider, prefix) {
      if (storage$1[provider] === void 0) {
        storage$1[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerStorage = storage$1[provider];
      if (providerStorage[prefix] === void 0) {
        providerStorage[prefix] = newStorage(provider, prefix);
      }
      return providerStorage[prefix];
    }
    function addIconSet(storage2, data) {
      if (!quicklyValidateIconSet(data)) {
        return [];
      }
      const t = Date.now();
      return parseIconSet(data, (name, icon) => {
        if (icon) {
          storage2.icons[name] = icon;
        } else {
          storage2.missing[name] = t;
        }
      });
    }
    function addIconToStorage(storage2, name, icon) {
      try {
        if (typeof icon.body === "string") {
          storage2.icons[name] = Object.freeze(fullIcon(icon));
          return true;
        }
      } catch (err) {
      }
      return false;
    }
    function getIconFromStorage(storage2, name) {
      const value = storage2.icons[name];
      return value === void 0 ? null : value;
    }
    function listIcons(provider, prefix) {
      let allIcons = [];
      let providers;
      if (typeof provider === "string") {
        providers = [provider];
      } else {
        providers = Object.keys(storage$1);
      }
      providers.forEach((provider2) => {
        let prefixes;
        if (typeof provider2 === "string" && typeof prefix === "string") {
          prefixes = [prefix];
        } else {
          prefixes = storage$1[provider2] === void 0 ? [] : Object.keys(storage$1[provider2]);
        }
        prefixes.forEach((prefix2) => {
          const storage2 = getStorage(provider2, prefix2);
          const icons = Object.keys(storage2.icons).map((name) => (provider2 !== "" ? "@" + provider2 + ":" : "") + prefix2 + ":" + name);
          allIcons = allIcons.concat(icons);
        });
      });
      return allIcons;
    }

    let simpleNames = false;
    function allowSimpleNames(allow) {
      if (typeof allow === "boolean") {
        simpleNames = allow;
      }
      return simpleNames;
    }
    function getIconData(name) {
      const icon = typeof name === "string" ? stringToIcon(name, true, simpleNames) : name;
      return icon ? getIconFromStorage(getStorage(icon.provider, icon.prefix), icon.name) : null;
    }
    function addIcon(name, data) {
      const icon = stringToIcon(name, true, simpleNames);
      if (!icon) {
        return false;
      }
      const storage = getStorage(icon.provider, icon.prefix);
      return addIconToStorage(storage, icon.name, data);
    }
    function addCollection(data, provider) {
      if (typeof data !== "object") {
        return false;
      }
      if (typeof provider !== "string") {
        provider = typeof data.provider === "string" ? data.provider : "";
      }
      if (simpleNames && provider === "" && (typeof data.prefix !== "string" || data.prefix === "")) {
        let added = false;
        if (quicklyValidateIconSet(data)) {
          data.prefix = "";
          parseIconSet(data, (name, icon) => {
            if (icon && addIcon(name, icon)) {
              added = true;
            }
          });
        }
        return added;
      }
      if (typeof data.prefix !== "string" || !validateIcon({
        provider,
        prefix: data.prefix,
        name: "a"
      })) {
        return false;
      }
      const storage = getStorage(provider, data.prefix);
      return !!addIconSet(storage, data);
    }
    function iconExists(name) {
      return getIconData(name) !== null;
    }
    function getIcon(name) {
      const result = getIconData(name);
      return result ? { ...result } : null;
    }

    const defaults = Object.freeze({
      inline: false,
      width: null,
      height: null,
      hAlign: "center",
      vAlign: "middle",
      slice: false,
      hFlip: false,
      vFlip: false,
      rotate: 0
    });
    function mergeCustomisations(defaults2, item) {
      const result = {};
      for (const key in defaults2) {
        const attr = key;
        result[attr] = defaults2[attr];
        if (item[attr] === void 0) {
          continue;
        }
        const value = item[attr];
        switch (attr) {
          case "inline":
          case "slice":
            if (typeof value === "boolean") {
              result[attr] = value;
            }
            break;
          case "hFlip":
          case "vFlip":
            if (value === true) {
              result[attr] = !result[attr];
            }
            break;
          case "hAlign":
          case "vAlign":
            if (typeof value === "string" && value !== "") {
              result[attr] = value;
            }
            break;
          case "width":
          case "height":
            if (typeof value === "string" && value !== "" || typeof value === "number" && value || value === null) {
              result[attr] = value;
            }
            break;
          case "rotate":
            if (typeof value === "number") {
              result[attr] += value;
            }
            break;
        }
      }
      return result;
    }

    const unitsSplit = /(-?[0-9.]*[0-9]+[0-9.]*)/g;
    const unitsTest = /^-?[0-9.]*[0-9]+[0-9.]*$/g;
    function calculateSize(size, ratio, precision) {
      if (ratio === 1) {
        return size;
      }
      precision = precision === void 0 ? 100 : precision;
      if (typeof size === "number") {
        return Math.ceil(size * ratio * precision) / precision;
      }
      if (typeof size !== "string") {
        return size;
      }
      const oldParts = size.split(unitsSplit);
      if (oldParts === null || !oldParts.length) {
        return size;
      }
      const newParts = [];
      let code = oldParts.shift();
      let isNumber = unitsTest.test(code);
      while (true) {
        if (isNumber) {
          const num = parseFloat(code);
          if (isNaN(num)) {
            newParts.push(code);
          } else {
            newParts.push(Math.ceil(num * ratio * precision) / precision);
          }
        } else {
          newParts.push(code);
        }
        code = oldParts.shift();
        if (code === void 0) {
          return newParts.join("");
        }
        isNumber = !isNumber;
      }
    }

    function preserveAspectRatio(props) {
      let result = "";
      switch (props.hAlign) {
        case "left":
          result += "xMin";
          break;
        case "right":
          result += "xMax";
          break;
        default:
          result += "xMid";
      }
      switch (props.vAlign) {
        case "top":
          result += "YMin";
          break;
        case "bottom":
          result += "YMax";
          break;
        default:
          result += "YMid";
      }
      result += props.slice ? " slice" : " meet";
      return result;
    }
    function iconToSVG(icon, customisations) {
      const box = {
        left: icon.left,
        top: icon.top,
        width: icon.width,
        height: icon.height
      };
      let body = icon.body;
      [icon, customisations].forEach((props) => {
        const transformations = [];
        const hFlip = props.hFlip;
        const vFlip = props.vFlip;
        let rotation = props.rotate;
        if (hFlip) {
          if (vFlip) {
            rotation += 2;
          } else {
            transformations.push("translate(" + (box.width + box.left).toString() + " " + (0 - box.top).toString() + ")");
            transformations.push("scale(-1 1)");
            box.top = box.left = 0;
          }
        } else if (vFlip) {
          transformations.push("translate(" + (0 - box.left).toString() + " " + (box.height + box.top).toString() + ")");
          transformations.push("scale(1 -1)");
          box.top = box.left = 0;
        }
        let tempValue;
        if (rotation < 0) {
          rotation -= Math.floor(rotation / 4) * 4;
        }
        rotation = rotation % 4;
        switch (rotation) {
          case 1:
            tempValue = box.height / 2 + box.top;
            transformations.unshift("rotate(90 " + tempValue.toString() + " " + tempValue.toString() + ")");
            break;
          case 2:
            transformations.unshift("rotate(180 " + (box.width / 2 + box.left).toString() + " " + (box.height / 2 + box.top).toString() + ")");
            break;
          case 3:
            tempValue = box.width / 2 + box.left;
            transformations.unshift("rotate(-90 " + tempValue.toString() + " " + tempValue.toString() + ")");
            break;
        }
        if (rotation % 2 === 1) {
          if (box.left !== 0 || box.top !== 0) {
            tempValue = box.left;
            box.left = box.top;
            box.top = tempValue;
          }
          if (box.width !== box.height) {
            tempValue = box.width;
            box.width = box.height;
            box.height = tempValue;
          }
        }
        if (transformations.length) {
          body = '<g transform="' + transformations.join(" ") + '">' + body + "</g>";
        }
      });
      let width, height;
      if (customisations.width === null && customisations.height === null) {
        height = "1em";
        width = calculateSize(height, box.width / box.height);
      } else if (customisations.width !== null && customisations.height !== null) {
        width = customisations.width;
        height = customisations.height;
      } else if (customisations.height !== null) {
        height = customisations.height;
        width = calculateSize(height, box.width / box.height);
      } else {
        width = customisations.width;
        height = calculateSize(width, box.height / box.width);
      }
      if (width === "auto") {
        width = box.width;
      }
      if (height === "auto") {
        height = box.height;
      }
      width = typeof width === "string" ? width : width.toString() + "";
      height = typeof height === "string" ? height : height.toString() + "";
      const result = {
        attributes: {
          width,
          height,
          preserveAspectRatio: preserveAspectRatio(customisations),
          viewBox: box.left.toString() + " " + box.top.toString() + " " + box.width.toString() + " " + box.height.toString()
        },
        body
      };
      if (customisations.inline) {
        result.inline = true;
      }
      return result;
    }

    function buildIcon(icon, customisations) {
      return iconToSVG(fullIcon(icon), customisations ? mergeCustomisations(defaults, customisations) : defaults);
    }

    const regex = /\sid="(\S+)"/g;
    const randomPrefix = "IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
    let counter = 0;
    function replaceIDs(body, prefix = randomPrefix) {
      const ids = [];
      let match;
      while (match = regex.exec(body)) {
        ids.push(match[1]);
      }
      if (!ids.length) {
        return body;
      }
      ids.forEach((id) => {
        const newID = typeof prefix === "function" ? prefix(id) : prefix + (counter++).toString();
        const escapedID = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        body = body.replace(new RegExp('([#;"])(' + escapedID + ')([")]|\\.[a-z])', "g"), "$1" + newID + "$3");
      });
      return body;
    }

    const storage = /* @__PURE__ */ Object.create(null);
    function setAPIModule(provider, item) {
      storage[provider] = item;
    }
    function getAPIModule(provider) {
      return storage[provider] || storage[""];
    }

    function createAPIConfig(source) {
      let resources;
      if (typeof source.resources === "string") {
        resources = [source.resources];
      } else {
        resources = source.resources;
        if (!(resources instanceof Array) || !resources.length) {
          return null;
        }
      }
      const result = {
        resources,
        path: source.path === void 0 ? "/" : source.path,
        maxURL: source.maxURL ? source.maxURL : 500,
        rotate: source.rotate ? source.rotate : 750,
        timeout: source.timeout ? source.timeout : 5e3,
        random: source.random === true,
        index: source.index ? source.index : 0,
        dataAfterTimeout: source.dataAfterTimeout !== false
      };
      return result;
    }
    const configStorage = /* @__PURE__ */ Object.create(null);
    const fallBackAPISources = [
      "https://api.simplesvg.com",
      "https://api.unisvg.com"
    ];
    const fallBackAPI = [];
    while (fallBackAPISources.length > 0) {
      if (fallBackAPISources.length === 1) {
        fallBackAPI.push(fallBackAPISources.shift());
      } else {
        if (Math.random() > 0.5) {
          fallBackAPI.push(fallBackAPISources.shift());
        } else {
          fallBackAPI.push(fallBackAPISources.pop());
        }
      }
    }
    configStorage[""] = createAPIConfig({
      resources: ["https://api.iconify.design"].concat(fallBackAPI)
    });
    function addAPIProvider(provider, customConfig) {
      const config = createAPIConfig(customConfig);
      if (config === null) {
        return false;
      }
      configStorage[provider] = config;
      return true;
    }
    function getAPIConfig(provider) {
      return configStorage[provider];
    }
    function listAPIProviders() {
      return Object.keys(configStorage);
    }

    const mergeParams = (base, params) => {
      let result = base, hasParams = result.indexOf("?") !== -1;
      function paramToString(value) {
        switch (typeof value) {
          case "boolean":
            return value ? "true" : "false";
          case "number":
            return encodeURIComponent(value);
          case "string":
            return encodeURIComponent(value);
          default:
            throw new Error("Invalid parameter");
        }
      }
      Object.keys(params).forEach((key) => {
        let value;
        try {
          value = paramToString(params[key]);
        } catch (err) {
          return;
        }
        result += (hasParams ? "&" : "?") + encodeURIComponent(key) + "=" + value;
        hasParams = true;
      });
      return result;
    };

    const maxLengthCache = {};
    const pathCache = {};
    const detectFetch = () => {
      let callback;
      try {
        callback = fetch;
        if (typeof callback === "function") {
          return callback;
        }
      } catch (err) {
      }
      return null;
    };
    let fetchModule = detectFetch();
    function setFetch(fetch2) {
      fetchModule = fetch2;
    }
    function getFetch() {
      return fetchModule;
    }
    function calculateMaxLength(provider, prefix) {
      const config = getAPIConfig(provider);
      if (!config) {
        return 0;
      }
      let result;
      if (!config.maxURL) {
        result = 0;
      } else {
        let maxHostLength = 0;
        config.resources.forEach((item) => {
          const host = item;
          maxHostLength = Math.max(maxHostLength, host.length);
        });
        const url = mergeParams(prefix + ".json", {
          icons: ""
        });
        result = config.maxURL - maxHostLength - config.path.length - url.length;
      }
      const cacheKey = provider + ":" + prefix;
      pathCache[provider] = config.path;
      maxLengthCache[cacheKey] = result;
      return result;
    }
    function shouldAbort(status) {
      return status === 404;
    }
    const prepare = (provider, prefix, icons) => {
      const results = [];
      let maxLength = maxLengthCache[prefix];
      if (maxLength === void 0) {
        maxLength = calculateMaxLength(provider, prefix);
      }
      const type = "icons";
      let item = {
        type,
        provider,
        prefix,
        icons: []
      };
      let length = 0;
      icons.forEach((name, index) => {
        length += name.length + 1;
        if (length >= maxLength && index > 0) {
          results.push(item);
          item = {
            type,
            provider,
            prefix,
            icons: []
          };
          length = name.length;
        }
        item.icons.push(name);
      });
      results.push(item);
      return results;
    };
    function getPath(provider) {
      if (typeof provider === "string") {
        if (pathCache[provider] === void 0) {
          const config = getAPIConfig(provider);
          if (!config) {
            return "/";
          }
          pathCache[provider] = config.path;
        }
        return pathCache[provider];
      }
      return "/";
    }
    const send = (host, params, callback) => {
      if (!fetchModule) {
        callback("abort", 424);
        return;
      }
      let path = getPath(params.provider);
      switch (params.type) {
        case "icons": {
          const prefix = params.prefix;
          const icons = params.icons;
          const iconsList = icons.join(",");
          path += mergeParams(prefix + ".json", {
            icons: iconsList
          });
          break;
        }
        case "custom": {
          const uri = params.uri;
          path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
          break;
        }
        default:
          callback("abort", 400);
          return;
      }
      let defaultError = 503;
      fetchModule(host + path).then((response) => {
        const status = response.status;
        if (status !== 200) {
          setTimeout(() => {
            callback(shouldAbort(status) ? "abort" : "next", status);
          });
          return;
        }
        defaultError = 501;
        return response.json();
      }).then((data) => {
        if (typeof data !== "object" || data === null) {
          setTimeout(() => {
            callback("next", defaultError);
          });
          return;
        }
        setTimeout(() => {
          callback("success", data);
        });
      }).catch(() => {
        callback("next", defaultError);
      });
    };
    const fetchAPIModule = {
      prepare,
      send
    };

    function sortIcons(icons) {
      const result = {
        loaded: [],
        missing: [],
        pending: []
      };
      const storage = /* @__PURE__ */ Object.create(null);
      icons.sort((a, b) => {
        if (a.provider !== b.provider) {
          return a.provider.localeCompare(b.provider);
        }
        if (a.prefix !== b.prefix) {
          return a.prefix.localeCompare(b.prefix);
        }
        return a.name.localeCompare(b.name);
      });
      let lastIcon = {
        provider: "",
        prefix: "",
        name: ""
      };
      icons.forEach((icon) => {
        if (lastIcon.name === icon.name && lastIcon.prefix === icon.prefix && lastIcon.provider === icon.provider) {
          return;
        }
        lastIcon = icon;
        const provider = icon.provider;
        const prefix = icon.prefix;
        const name = icon.name;
        if (storage[provider] === void 0) {
          storage[provider] = /* @__PURE__ */ Object.create(null);
        }
        const providerStorage = storage[provider];
        if (providerStorage[prefix] === void 0) {
          providerStorage[prefix] = getStorage(provider, prefix);
        }
        const localStorage = providerStorage[prefix];
        let list;
        if (localStorage.icons[name] !== void 0) {
          list = result.loaded;
        } else if (prefix === "" || localStorage.missing[name] !== void 0) {
          list = result.missing;
        } else {
          list = result.pending;
        }
        const item = {
          provider,
          prefix,
          name
        };
        list.push(item);
      });
      return result;
    }

    const callbacks = /* @__PURE__ */ Object.create(null);
    const pendingUpdates = /* @__PURE__ */ Object.create(null);
    function removeCallback(sources, id) {
      sources.forEach((source) => {
        const provider = source.provider;
        if (callbacks[provider] === void 0) {
          return;
        }
        const providerCallbacks = callbacks[provider];
        const prefix = source.prefix;
        const items = providerCallbacks[prefix];
        if (items) {
          providerCallbacks[prefix] = items.filter((row) => row.id !== id);
        }
      });
    }
    function updateCallbacks(provider, prefix) {
      if (pendingUpdates[provider] === void 0) {
        pendingUpdates[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerPendingUpdates = pendingUpdates[provider];
      if (!providerPendingUpdates[prefix]) {
        providerPendingUpdates[prefix] = true;
        setTimeout(() => {
          providerPendingUpdates[prefix] = false;
          if (callbacks[provider] === void 0 || callbacks[provider][prefix] === void 0) {
            return;
          }
          const items = callbacks[provider][prefix].slice(0);
          if (!items.length) {
            return;
          }
          const storage = getStorage(provider, prefix);
          let hasPending = false;
          items.forEach((item) => {
            const icons = item.icons;
            const oldLength = icons.pending.length;
            icons.pending = icons.pending.filter((icon) => {
              if (icon.prefix !== prefix) {
                return true;
              }
              const name = icon.name;
              if (storage.icons[name] !== void 0) {
                icons.loaded.push({
                  provider,
                  prefix,
                  name
                });
              } else if (storage.missing[name] !== void 0) {
                icons.missing.push({
                  provider,
                  prefix,
                  name
                });
              } else {
                hasPending = true;
                return true;
              }
              return false;
            });
            if (icons.pending.length !== oldLength) {
              if (!hasPending) {
                removeCallback([
                  {
                    provider,
                    prefix
                  }
                ], item.id);
              }
              item.callback(icons.loaded.slice(0), icons.missing.slice(0), icons.pending.slice(0), item.abort);
            }
          });
        });
      }
    }
    let idCounter = 0;
    function storeCallback(callback, icons, pendingSources) {
      const id = idCounter++;
      const abort = removeCallback.bind(null, pendingSources, id);
      if (!icons.pending.length) {
        return abort;
      }
      const item = {
        id,
        icons,
        callback,
        abort
      };
      pendingSources.forEach((source) => {
        const provider = source.provider;
        const prefix = source.prefix;
        if (callbacks[provider] === void 0) {
          callbacks[provider] = /* @__PURE__ */ Object.create(null);
        }
        const providerCallbacks = callbacks[provider];
        if (providerCallbacks[prefix] === void 0) {
          providerCallbacks[prefix] = [];
        }
        providerCallbacks[prefix].push(item);
      });
      return abort;
    }

    function listToIcons(list, validate = true, simpleNames = false) {
      const result = [];
      list.forEach((item) => {
        const icon = typeof item === "string" ? stringToIcon(item, false, simpleNames) : item;
        if (!validate || validateIcon(icon, simpleNames)) {
          result.push({
            provider: icon.provider,
            prefix: icon.prefix,
            name: icon.name
          });
        }
      });
      return result;
    }

    // src/config.ts
    var defaultConfig = {
      resources: [],
      index: 0,
      timeout: 2e3,
      rotate: 750,
      random: false,
      dataAfterTimeout: false
    };

    // src/query.ts
    function sendQuery(config, payload, query, done) {
      const resourcesCount = config.resources.length;
      const startIndex = config.random ? Math.floor(Math.random() * resourcesCount) : config.index;
      let resources;
      if (config.random) {
        let list = config.resources.slice(0);
        resources = [];
        while (list.length > 1) {
          const nextIndex = Math.floor(Math.random() * list.length);
          resources.push(list[nextIndex]);
          list = list.slice(0, nextIndex).concat(list.slice(nextIndex + 1));
        }
        resources = resources.concat(list);
      } else {
        resources = config.resources.slice(startIndex).concat(config.resources.slice(0, startIndex));
      }
      const startTime = Date.now();
      let status = "pending";
      let queriesSent = 0;
      let lastError;
      let timer = null;
      let queue = [];
      let doneCallbacks = [];
      if (typeof done === "function") {
        doneCallbacks.push(done);
      }
      function resetTimer() {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      }
      function abort() {
        if (status === "pending") {
          status = "aborted";
        }
        resetTimer();
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function subscribe(callback, overwrite) {
        if (overwrite) {
          doneCallbacks = [];
        }
        if (typeof callback === "function") {
          doneCallbacks.push(callback);
        }
      }
      function getQueryStatus() {
        return {
          startTime,
          payload,
          status,
          queriesSent,
          queriesPending: queue.length,
          subscribe,
          abort
        };
      }
      function failQuery() {
        status = "failed";
        doneCallbacks.forEach((callback) => {
          callback(void 0, lastError);
        });
      }
      function clearQueue() {
        queue.forEach((item) => {
          if (item.status === "pending") {
            item.status = "aborted";
          }
        });
        queue = [];
      }
      function moduleResponse(item, response, data) {
        const isError = response !== "success";
        queue = queue.filter((queued) => queued !== item);
        switch (status) {
          case "pending":
            break;
          case "failed":
            if (isError || !config.dataAfterTimeout) {
              return;
            }
            break;
          default:
            return;
        }
        if (response === "abort") {
          lastError = data;
          failQuery();
          return;
        }
        if (isError) {
          lastError = data;
          if (!queue.length) {
            if (!resources.length) {
              failQuery();
            } else {
              execNext();
            }
          }
          return;
        }
        resetTimer();
        clearQueue();
        if (!config.random) {
          const index = config.resources.indexOf(item.resource);
          if (index !== -1 && index !== config.index) {
            config.index = index;
          }
        }
        status = "completed";
        doneCallbacks.forEach((callback) => {
          callback(data);
        });
      }
      function execNext() {
        if (status !== "pending") {
          return;
        }
        resetTimer();
        const resource = resources.shift();
        if (resource === void 0) {
          if (queue.length) {
            timer = setTimeout(() => {
              resetTimer();
              if (status === "pending") {
                clearQueue();
                failQuery();
              }
            }, config.timeout);
            return;
          }
          failQuery();
          return;
        }
        const item = {
          status: "pending",
          resource,
          callback: (status2, data) => {
            moduleResponse(item, status2, data);
          }
        };
        queue.push(item);
        queriesSent++;
        timer = setTimeout(execNext, config.rotate);
        query(resource, payload, item.callback);
      }
      setTimeout(execNext);
      return getQueryStatus;
    }

    // src/index.ts
    function setConfig(config) {
      if (typeof config !== "object" || typeof config.resources !== "object" || !(config.resources instanceof Array) || !config.resources.length) {
        throw new Error("Invalid Reduncancy configuration");
      }
      const newConfig = /* @__PURE__ */ Object.create(null);
      let key;
      for (key in defaultConfig) {
        if (config[key] !== void 0) {
          newConfig[key] = config[key];
        } else {
          newConfig[key] = defaultConfig[key];
        }
      }
      return newConfig;
    }
    function initRedundancy(cfg) {
      const config = setConfig(cfg);
      let queries = [];
      function cleanup() {
        queries = queries.filter((item) => item().status === "pending");
      }
      function query(payload, queryCallback, doneCallback) {
        const query2 = sendQuery(config, payload, queryCallback, (data, error) => {
          cleanup();
          if (doneCallback) {
            doneCallback(data, error);
          }
        });
        queries.push(query2);
        return query2;
      }
      function find(callback) {
        const result = queries.find((value) => {
          return callback(value);
        });
        return result !== void 0 ? result : null;
      }
      const instance = {
        query,
        find,
        setIndex: (index) => {
          config.index = index;
        },
        getIndex: () => config.index,
        cleanup
      };
      return instance;
    }

    function emptyCallback$1() {
    }
    const redundancyCache = /* @__PURE__ */ Object.create(null);
    function getRedundancyCache(provider) {
      if (redundancyCache[provider] === void 0) {
        const config = getAPIConfig(provider);
        if (!config) {
          return;
        }
        const redundancy = initRedundancy(config);
        const cachedReundancy = {
          config,
          redundancy
        };
        redundancyCache[provider] = cachedReundancy;
      }
      return redundancyCache[provider];
    }
    function sendAPIQuery(target, query, callback) {
      let redundancy;
      let send;
      if (typeof target === "string") {
        const api = getAPIModule(target);
        if (!api) {
          callback(void 0, 424);
          return emptyCallback$1;
        }
        send = api.send;
        const cached = getRedundancyCache(target);
        if (cached) {
          redundancy = cached.redundancy;
        }
      } else {
        const config = createAPIConfig(target);
        if (config) {
          redundancy = initRedundancy(config);
          const moduleKey = target.resources ? target.resources[0] : "";
          const api = getAPIModule(moduleKey);
          if (api) {
            send = api.send;
          }
        }
      }
      if (!redundancy || !send) {
        callback(void 0, 424);
        return emptyCallback$1;
      }
      return redundancy.query(query, send, callback)().abort;
    }

    const cache = {};

    function emptyCallback() {
    }
    const pendingIcons = /* @__PURE__ */ Object.create(null);
    const iconsToLoad = /* @__PURE__ */ Object.create(null);
    const loaderFlags = /* @__PURE__ */ Object.create(null);
    const queueFlags = /* @__PURE__ */ Object.create(null);
    function loadedNewIcons(provider, prefix) {
      if (loaderFlags[provider] === void 0) {
        loaderFlags[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerLoaderFlags = loaderFlags[provider];
      if (!providerLoaderFlags[prefix]) {
        providerLoaderFlags[prefix] = true;
        setTimeout(() => {
          providerLoaderFlags[prefix] = false;
          updateCallbacks(provider, prefix);
        });
      }
    }
    const errorsCache = /* @__PURE__ */ Object.create(null);
    function loadNewIcons(provider, prefix, icons) {
      function err() {
        const key = (provider === "" ? "" : "@" + provider + ":") + prefix;
        const time = Math.floor(Date.now() / 6e4);
        if (errorsCache[key] < time) {
          errorsCache[key] = time;
          console.error('Unable to retrieve icons for "' + key + '" because API is not configured properly.');
        }
      }
      if (iconsToLoad[provider] === void 0) {
        iconsToLoad[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerIconsToLoad = iconsToLoad[provider];
      if (queueFlags[provider] === void 0) {
        queueFlags[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerQueueFlags = queueFlags[provider];
      if (pendingIcons[provider] === void 0) {
        pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
      }
      const providerPendingIcons = pendingIcons[provider];
      if (providerIconsToLoad[prefix] === void 0) {
        providerIconsToLoad[prefix] = icons;
      } else {
        providerIconsToLoad[prefix] = providerIconsToLoad[prefix].concat(icons).sort();
      }
      if (!providerQueueFlags[prefix]) {
        providerQueueFlags[prefix] = true;
        setTimeout(() => {
          providerQueueFlags[prefix] = false;
          const icons2 = providerIconsToLoad[prefix];
          delete providerIconsToLoad[prefix];
          const api = getAPIModule(provider);
          if (!api) {
            err();
            return;
          }
          const params = api.prepare(provider, prefix, icons2);
          params.forEach((item) => {
            sendAPIQuery(provider, item, (data, error) => {
              const storage = getStorage(provider, prefix);
              if (typeof data !== "object") {
                if (error !== 404) {
                  return;
                }
                const t = Date.now();
                item.icons.forEach((name) => {
                  storage.missing[name] = t;
                });
              } else {
                try {
                  const parsed = addIconSet(storage, data);
                  if (!parsed.length) {
                    return;
                  }
                  const pending = providerPendingIcons[prefix];
                  parsed.forEach((name) => {
                    delete pending[name];
                  });
                  if (cache.store) {
                    cache.store(provider, data);
                  }
                } catch (err2) {
                  console.error(err2);
                }
              }
              loadedNewIcons(provider, prefix);
            });
          });
        });
      }
    }
    const loadIcons = (icons, callback) => {
      const cleanedIcons = listToIcons(icons, true, allowSimpleNames());
      const sortedIcons = sortIcons(cleanedIcons);
      if (!sortedIcons.pending.length) {
        let callCallback = true;
        if (callback) {
          setTimeout(() => {
            if (callCallback) {
              callback(sortedIcons.loaded, sortedIcons.missing, sortedIcons.pending, emptyCallback);
            }
          });
        }
        return () => {
          callCallback = false;
        };
      }
      const newIcons = /* @__PURE__ */ Object.create(null);
      const sources = [];
      let lastProvider, lastPrefix;
      sortedIcons.pending.forEach((icon) => {
        const provider = icon.provider;
        const prefix = icon.prefix;
        if (prefix === lastPrefix && provider === lastProvider) {
          return;
        }
        lastProvider = provider;
        lastPrefix = prefix;
        sources.push({
          provider,
          prefix
        });
        if (pendingIcons[provider] === void 0) {
          pendingIcons[provider] = /* @__PURE__ */ Object.create(null);
        }
        const providerPendingIcons = pendingIcons[provider];
        if (providerPendingIcons[prefix] === void 0) {
          providerPendingIcons[prefix] = /* @__PURE__ */ Object.create(null);
        }
        if (newIcons[provider] === void 0) {
          newIcons[provider] = /* @__PURE__ */ Object.create(null);
        }
        const providerNewIcons = newIcons[provider];
        if (providerNewIcons[prefix] === void 0) {
          providerNewIcons[prefix] = [];
        }
      });
      const time = Date.now();
      sortedIcons.pending.forEach((icon) => {
        const provider = icon.provider;
        const prefix = icon.prefix;
        const name = icon.name;
        const pendingQueue = pendingIcons[provider][prefix];
        if (pendingQueue[name] === void 0) {
          pendingQueue[name] = time;
          newIcons[provider][prefix].push(name);
        }
      });
      sources.forEach((source) => {
        const provider = source.provider;
        const prefix = source.prefix;
        if (newIcons[provider][prefix].length) {
          loadNewIcons(provider, prefix, newIcons[provider][prefix]);
        }
      });
      return callback ? storeCallback(callback, sortedIcons, sources) : emptyCallback;
    };
    const loadIcon = (icon) => {
      return new Promise((fulfill, reject) => {
        const iconObj = typeof icon === "string" ? stringToIcon(icon) : icon;
        loadIcons([iconObj || icon], (loaded) => {
          if (loaded.length && iconObj) {
            const storage = getStorage(iconObj.provider, iconObj.prefix);
            const data = getIconFromStorage(storage, iconObj.name);
            if (data) {
              fulfill(data);
              return;
            }
          }
          reject(icon);
        });
      });
    };

    const cacheVersion = "iconify2";
    const cachePrefix = "iconify";
    const countKey = cachePrefix + "-count";
    const versionKey = cachePrefix + "-version";
    const hour = 36e5;
    const cacheExpiration = 168;
    const config = {
      local: true,
      session: true
    };
    let loaded = false;
    const count = {
      local: 0,
      session: 0
    };
    const emptyList = {
      local: [],
      session: []
    };
    let _window = typeof window === "undefined" ? {} : window;
    function getGlobal(key) {
      const attr = key + "Storage";
      try {
        if (_window && _window[attr] && typeof _window[attr].length === "number") {
          return _window[attr];
        }
      } catch (err) {
      }
      config[key] = false;
      return null;
    }
    function setCount(storage, key, value) {
      try {
        storage.setItem(countKey, value.toString());
        count[key] = value;
        return true;
      } catch (err) {
        return false;
      }
    }
    function getCount(storage) {
      const count2 = storage.getItem(countKey);
      if (count2) {
        const total = parseInt(count2);
        return total ? total : 0;
      }
      return 0;
    }
    function initCache(storage, key) {
      try {
        storage.setItem(versionKey, cacheVersion);
      } catch (err) {
      }
      setCount(storage, key, 0);
    }
    function destroyCache(storage) {
      try {
        const total = getCount(storage);
        for (let i = 0; i < total; i++) {
          storage.removeItem(cachePrefix + i.toString());
        }
      } catch (err) {
      }
    }
    const loadCache = () => {
      if (loaded) {
        return;
      }
      loaded = true;
      const minTime = Math.floor(Date.now() / hour) - cacheExpiration;
      function load(key) {
        const func = getGlobal(key);
        if (!func) {
          return;
        }
        const getItem = (index) => {
          const name = cachePrefix + index.toString();
          const item = func.getItem(name);
          if (typeof item !== "string") {
            return false;
          }
          let valid = true;
          try {
            const data = JSON.parse(item);
            if (typeof data !== "object" || typeof data.cached !== "number" || data.cached < minTime || typeof data.provider !== "string" || typeof data.data !== "object" || typeof data.data.prefix !== "string") {
              valid = false;
            } else {
              const provider = data.provider;
              const prefix = data.data.prefix;
              const storage = getStorage(provider, prefix);
              valid = addIconSet(storage, data.data).length > 0;
            }
          } catch (err) {
            valid = false;
          }
          if (!valid) {
            func.removeItem(name);
          }
          return valid;
        };
        try {
          const version = func.getItem(versionKey);
          if (version !== cacheVersion) {
            if (version) {
              destroyCache(func);
            }
            initCache(func, key);
            return;
          }
          let total = getCount(func);
          for (let i = total - 1; i >= 0; i--) {
            if (!getItem(i)) {
              if (i === total - 1) {
                total--;
              } else {
                emptyList[key].push(i);
              }
            }
          }
          setCount(func, key, total);
        } catch (err) {
        }
      }
      for (const key in config) {
        load(key);
      }
    };
    const storeCache = (provider, data) => {
      if (!loaded) {
        loadCache();
      }
      function store(key) {
        if (!config[key]) {
          return false;
        }
        const func = getGlobal(key);
        if (!func) {
          return false;
        }
        let index = emptyList[key].shift();
        if (index === void 0) {
          index = count[key];
          if (!setCount(func, key, index + 1)) {
            return false;
          }
        }
        try {
          const item = {
            cached: Math.floor(Date.now() / hour),
            provider,
            data
          };
          func.setItem(cachePrefix + index.toString(), JSON.stringify(item));
        } catch (err) {
          return false;
        }
        return true;
      }
      if (!Object.keys(data.icons).length) {
        return;
      }
      if (data.not_found) {
        data = Object.assign({}, data);
        delete data.not_found;
      }
      if (!store("local")) {
        store("session");
      }
    };

    function toggleBrowserCache(storage, value) {
      switch (storage) {
        case "local":
        case "session":
          config[storage] = value;
          break;
        case "all":
          for (const key in config) {
            config[key] = value;
          }
          break;
      }
    }

    const separator = /[\s,]+/;
    function flipFromString(custom, flip) {
      flip.split(separator).forEach((str) => {
        const value = str.trim();
        switch (value) {
          case "horizontal":
            custom.hFlip = true;
            break;
          case "vertical":
            custom.vFlip = true;
            break;
        }
      });
    }
    function alignmentFromString(custom, align) {
      align.split(separator).forEach((str) => {
        const value = str.trim();
        switch (value) {
          case "left":
          case "center":
          case "right":
            custom.hAlign = value;
            break;
          case "top":
          case "middle":
          case "bottom":
            custom.vAlign = value;
            break;
          case "slice":
          case "crop":
            custom.slice = true;
            break;
          case "meet":
            custom.slice = false;
        }
      });
    }

    function rotateFromString(value, defaultValue = 0) {
      const units = value.replace(/^-?[0-9.]*/, "");
      function cleanup(value2) {
        while (value2 < 0) {
          value2 += 4;
        }
        return value2 % 4;
      }
      if (units === "") {
        const num = parseInt(value);
        return isNaN(num) ? 0 : cleanup(num);
      } else if (units !== value) {
        let split = 0;
        switch (units) {
          case "%":
            split = 25;
            break;
          case "deg":
            split = 90;
        }
        if (split) {
          let num = parseFloat(value.slice(0, value.length - units.length));
          if (isNaN(num)) {
            return 0;
          }
          num = num / split;
          return num % 1 === 0 ? cleanup(num) : 0;
        }
      }
      return defaultValue;
    }

    /**
     * Default SVG attributes
     */
    const svgDefaults = {
        'xmlns': 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        'aria-hidden': true,
        'role': 'img',
    };
    /**
     * Generate icon from properties
     */
    function render(
    // Icon must be validated before calling this function
    icon, 
    // Properties
    props) {
        const customisations = mergeCustomisations(defaults, props);
        const componentProps = { ...svgDefaults };
        // Create style if missing
        let style = typeof props.style === 'string' ? props.style : '';
        // Get element properties
        for (let key in props) {
            const value = props[key];
            if (value === void 0) {
                continue;
            }
            switch (key) {
                // Properties to ignore
                case 'icon':
                case 'style':
                case 'onLoad':
                    break;
                // Boolean attributes
                case 'inline':
                case 'hFlip':
                case 'vFlip':
                    customisations[key] =
                        value === true || value === 'true' || value === 1;
                    break;
                // Flip as string: 'horizontal,vertical'
                case 'flip':
                    if (typeof value === 'string') {
                        flipFromString(customisations, value);
                    }
                    break;
                // Alignment as string
                case 'align':
                    if (typeof value === 'string') {
                        alignmentFromString(customisations, value);
                    }
                    break;
                // Color: copy to style, add extra ';' in case style is missing it
                case 'color':
                    style =
                        style +
                            (style.length > 0 && style.trim().slice(-1) !== ';'
                                ? ';'
                                : '') +
                            'color: ' +
                            value +
                            '; ';
                    break;
                // Rotation as string
                case 'rotate':
                    if (typeof value === 'string') {
                        customisations[key] = rotateFromString(value);
                    }
                    else if (typeof value === 'number') {
                        customisations[key] = value;
                    }
                    break;
                // Remove aria-hidden
                case 'ariaHidden':
                case 'aria-hidden':
                    if (value !== true && value !== 'true') {
                        delete componentProps['aria-hidden'];
                    }
                    break;
                default:
                    if (key.slice(0, 3) === 'on:') {
                        // Svelte event
                        break;
                    }
                    // Copy missing property if it does not exist in customisations
                    if (defaults[key] === void 0) {
                        componentProps[key] = value;
                    }
            }
        }
        // Generate icon
        const item = iconToSVG(icon, customisations);
        // Add icon stuff
        for (let key in item.attributes) {
            componentProps[key] =
                item.attributes[key];
        }
        if (item.inline) {
            // Style overrides it
            style = 'vertical-align: -0.125em; ' + style;
        }
        // Style
        if (style !== '') {
            componentProps.style = style;
        }
        // Counter for ids based on "id" property to render icons consistently on server and client
        let localCounter = 0;
        let id = props.id;
        if (typeof id === 'string') {
            // Convert '-' to '_' to avoid errors in animations
            id = id.replace(/-/g, '_');
        }
        // Generate HTML
        return {
            attributes: componentProps,
            body: replaceIDs(item.body, id ? () => id + 'ID' + localCounter++ : 'iconifySvelte'),
        };
    }

    /**
     * Enable cache
     */
    function enableCache(storage) {
        toggleBrowserCache(storage, true);
    }
    /**
     * Disable cache
     */
    function disableCache(storage) {
        toggleBrowserCache(storage, false);
    }
    /**
     * Initialise stuff
     */
    // Enable short names
    allowSimpleNames(true);
    // Set API module
    setAPIModule('', fetchAPIModule);
    /**
     * Browser stuff
     */
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
        // Set cache and load existing cache
        cache.store = storeCache;
        loadCache();
        const _window = window;
        // Load icons from global "IconifyPreload"
        if (_window.IconifyPreload !== void 0) {
            const preload = _window.IconifyPreload;
            const err = 'Invalid IconifyPreload syntax.';
            if (typeof preload === 'object' && preload !== null) {
                (preload instanceof Array ? preload : [preload]).forEach((item) => {
                    try {
                        if (
                        // Check if item is an object and not null/array
                        typeof item !== 'object' ||
                            item === null ||
                            item instanceof Array ||
                            // Check for 'icons' and 'prefix'
                            typeof item.icons !== 'object' ||
                            typeof item.prefix !== 'string' ||
                            // Add icon set
                            !addCollection(item)) {
                            console.error(err);
                        }
                    }
                    catch (e) {
                        console.error(err);
                    }
                });
            }
        }
        // Set API from global "IconifyProviders"
        if (_window.IconifyProviders !== void 0) {
            const providers = _window.IconifyProviders;
            if (typeof providers === 'object' && providers !== null) {
                for (let key in providers) {
                    const err = 'IconifyProviders[' + key + '] is invalid.';
                    try {
                        const value = providers[key];
                        if (typeof value !== 'object' ||
                            !value ||
                            value.resources === void 0) {
                            continue;
                        }
                        if (!addAPIProvider(key, value)) {
                            console.error(err);
                        }
                    }
                    catch (e) {
                        console.error(err);
                    }
                }
            }
        }
    }
    /**
     * Check if component needs to be updated
     */
    function checkIconState(icon, state, mounted, callback, onload) {
        // Abort loading icon
        function abortLoading() {
            if (state.loading) {
                state.loading.abort();
                state.loading = null;
            }
        }
        // Icon is an object
        if (typeof icon === 'object' &&
            icon !== null &&
            typeof icon.body === 'string') {
            // Stop loading
            state.name = '';
            abortLoading();
            return { data: fullIcon(icon) };
        }
        // Invalid icon?
        let iconName;
        if (typeof icon !== 'string' ||
            (iconName = stringToIcon(icon, false, true)) === null) {
            abortLoading();
            return null;
        }
        // Load icon
        const data = getIconData(iconName);
        if (data === null) {
            // Icon needs to be loaded
            // Do not load icon until component is mounted
            if (mounted && (!state.loading || state.loading.name !== icon)) {
                // New icon to load
                abortLoading();
                state.name = '';
                state.loading = {
                    name: icon,
                    abort: loadIcons([iconName], callback),
                };
            }
            return null;
        }
        // Icon data is available
        abortLoading();
        if (state.name !== icon) {
            state.name = icon;
            if (onload && !state.destroyed) {
                onload(icon);
            }
        }
        // Add classes
        const classes = ['iconify'];
        if (iconName.prefix !== '') {
            classes.push('iconify--' + iconName.prefix);
        }
        if (iconName.provider !== '') {
            classes.push('iconify--' + iconName.provider);
        }
        return { data, classes };
    }
    /**
     * Generate icon
     */
    function generateIcon(icon, props) {
        return icon ? render(icon, props) : null;
    }
    /**
     * Internal API
     */
    const _api = {
        getAPIConfig,
        setAPIModule,
        sendAPIQuery,
        setFetch,
        getFetch,
        listAPIProviders,
        mergeParams,
    };

    /* node_modules\@iconify\svelte\dist\Icon.svelte generated by Svelte v3.46.6 */
    const file$3 = "node_modules\\@iconify\\svelte\\dist\\Icon.svelte";

    // (110:0) {#if data !== null}
    function create_if_block$1(ctx) {
    	let svg;
    	let raw_value = /*data*/ ctx[0].body + "";
    	let svg_levels = [/*data*/ ctx[0].attributes];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			set_svg_attributes(svg, svg_data);
    			add_location(svg, file$3, 110, 0, 1954);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			svg.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 1 && raw_value !== (raw_value = /*data*/ ctx[0].body + "")) svg.innerHTML = raw_value;			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [dirty & /*data*/ 1 && /*data*/ ctx[0].attributes]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(110:0) {#if data !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let if_block_anchor;
    	let if_block = /*data*/ ctx[0] !== null && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[0] !== null) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);

    	const state = {
    		// Last icon name
    		name: '',
    		// Loading status
    		loading: null,
    		// Destroyed status
    		destroyed: false
    	};

    	// Mounted status
    	let mounted = false;

    	// Callback counter
    	let counter = 0;

    	// Generated data
    	let data;

    	const onLoad = icon => {
    		// Legacy onLoad property
    		if (typeof $$props.onLoad === 'function') {
    			$$props.onLoad(icon);
    		}

    		// on:load event
    		const dispatch = createEventDispatcher();

    		dispatch('load', { icon });
    	};

    	// Increase counter when loaded to force re-calculation of data
    	function loaded() {
    		$$invalidate(3, counter++, counter);
    	}

    	// Force re-render
    	onMount(() => {
    		$$invalidate(2, mounted = true);
    	});

    	// Abort loading when component is destroyed
    	onDestroy(() => {
    		$$invalidate(1, state.destroyed = true, state);

    		if (state.loading) {
    			state.loading.abort();
    			$$invalidate(1, state.loading = null, state);
    		}
    	});

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => ({
    		enableCache,
    		disableCache,
    		iconExists,
    		getIcon,
    		listIcons,
    		shareStorage,
    		addIcon,
    		addCollection,
    		calculateSize,
    		replaceIDs,
    		buildIcon,
    		loadIcons,
    		loadIcon,
    		addAPIProvider,
    		_api,
    		onMount,
    		onDestroy,
    		createEventDispatcher,
    		checkIconState,
    		generateIcon,
    		state,
    		mounted,
    		counter,
    		data,
    		onLoad,
    		loaded
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('mounted' in $$props) $$invalidate(2, mounted = $$new_props.mounted);
    		if ('counter' in $$props) $$invalidate(3, counter = $$new_props.counter);
    		if ('data' in $$props) $$invalidate(0, data = $$new_props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		{
    			const iconData = checkIconState($$props.icon, state, mounted, loaded, onLoad);
    			$$invalidate(0, data = iconData ? generateIcon(iconData.data, $$props) : null);

    			if (data && iconData.classes) {
    				// Add classes
    				$$invalidate(
    					0,
    					data.attributes['class'] = (typeof $$props['class'] === 'string'
    					? $$props['class'] + ' '
    					: '') + iconData.classes.join(' '),
    					data
    				);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [data, state, mounted, counter];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* node_modules\svelte-split-pane\src\HSplitPane.svelte generated by Svelte v3.46.6 */
    const file$2 = "node_modules\\svelte-split-pane\\src\\HSplitPane.svelte";
    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    // (103:26)               
    function fallback_block_1$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Left Contents goes here...";
    			set_style(div, "background-color", "red");
    			add_location(div, file$2, 103, 12, 3588);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$1.name,
    		type: "fallback",
    		source: "(103:26)               ",
    		ctx
    	});

    	return block;
    }

    // (112:27)               
    function fallback_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Right Contents goes here...";
    			set_style(div, "background-color", "yellow");
    			add_location(div, file$2, 112, 12, 3921);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(112:27)               ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	const left_slot_template = /*#slots*/ ctx[10].left;
    	const left_slot = create_slot(left_slot_template, ctx, /*$$scope*/ ctx[9], get_left_slot_context);
    	const left_slot_or_fallback = left_slot || fallback_block_1$1(ctx);
    	const right_slot_template = /*#slots*/ ctx[10].right;
    	const right_slot = create_slot(right_slot_template, ctx, /*$$scope*/ ctx[9], get_right_slot_context);
    	const right_slot_or_fallback = right_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (left_slot_or_fallback) left_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if (right_slot_or_fallback) right_slot_or_fallback.c();
    			attr_dev(div0, "class", "left svelte-3n4x2c");
    			add_location(div0, file$2, 101, 4, 3511);
    			attr_dev(div1, "class", "separator svelte-3n4x2c");
    			add_location(div1, file$2, 108, 4, 3723);
    			attr_dev(div2, "class", "right svelte-3n4x2c");
    			add_location(div2, file$2, 110, 4, 3841);
    			attr_dev(div3, "class", "wrapper svelte-3n4x2c");
    			set_style(div3, "--left-panel-size", /*leftPaneSize*/ ctx[0]);
    			set_style(div3, "--right-panel-size", /*rightPaneSize*/ ctx[1]);
    			set_style(div3, "--min-left-panel-size", /*minLeftPaneSize*/ ctx[2]);
    			set_style(div3, "--min-right-panel-size", /*minRightPaneSize*/ ctx[3]);
    			add_location(div3, file$2, 100, 0, 3318);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (left_slot_or_fallback) {
    				left_slot_or_fallback.m(div0, null);
    			}

    			/*div0_binding*/ ctx[11](div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			/*div1_binding*/ ctx[12](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (right_slot_or_fallback) {
    				right_slot_or_fallback.m(div2, null);
    			}

    			/*div2_binding*/ ctx[13](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousedown", /*onMouseDown*/ ctx[7], false, false, false),
    					listen_dev(div1, "touchstart", /*onMouseDown*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (left_slot) {
    				if (left_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						left_slot,
    						left_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(left_slot_template, /*$$scope*/ ctx[9], dirty, get_left_slot_changes),
    						get_left_slot_context
    					);
    				}
    			}

    			if (right_slot) {
    				if (right_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						right_slot,
    						right_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(right_slot_template, /*$$scope*/ ctx[9], dirty, get_right_slot_changes),
    						get_right_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*leftPaneSize*/ 1) {
    				set_style(div3, "--left-panel-size", /*leftPaneSize*/ ctx[0]);
    			}

    			if (!current || dirty & /*rightPaneSize*/ 2) {
    				set_style(div3, "--right-panel-size", /*rightPaneSize*/ ctx[1]);
    			}

    			if (!current || dirty & /*minLeftPaneSize*/ 4) {
    				set_style(div3, "--min-left-panel-size", /*minLeftPaneSize*/ ctx[2]);
    			}

    			if (!current || dirty & /*minRightPaneSize*/ 8) {
    				set_style(div3, "--min-right-panel-size", /*minRightPaneSize*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_slot_or_fallback, local);
    			transition_in(right_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_slot_or_fallback, local);
    			transition_out(right_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (left_slot_or_fallback) left_slot_or_fallback.d(detaching);
    			/*div0_binding*/ ctx[11](null);
    			/*div1_binding*/ ctx[12](null);
    			if (right_slot_or_fallback) right_slot_or_fallback.d(detaching);
    			/*div2_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('HSplitPane', slots, ['left','right']);
    	let separator;

    	let { updateCallback = () => {
    		// do nothing
    		return;
    	} } = $$props;

    	let md;

    	const onMouseDown = e => {
    		e.preventDefault();
    		if (e.button !== 0) return;

    		md = {
    			e,
    			offsetLeft: separator.offsetLeft,
    			offsetTop: separator.offsetTop,
    			firstWidth: left.offsetWidth,
    			secondWidth: right.offsetWidth
    		};

    		window.addEventListener('mousemove', onMouseMove);
    		window.addEventListener('mouseup', onMouseUp);
    		window.addEventListener('touchmove', onMouseMove);
    		window.addEventListener('touchend', onMouseUp);
    	};

    	const onMouseMove = e => {
    		e.preventDefault();
    		if (e.button !== 0) return;

    		var delta = {
    			x: e.clientX - md.e.clientX,
    			y: e.clientY - md.e.clientY
    		};

    		// Prevent negative-sized elements
    		delta.x = Math.min(Math.max(delta.x, -md.firstWidth), md.secondWidth);

    		$$invalidate(4, separator.style.left = md.offsetLeft + delta.x + "px", separator);
    		$$invalidate(5, left.style.width = md.firstWidth + delta.x + "px", left);
    		$$invalidate(6, right.style.width = md.secondWidth - delta.x + "px", right);
    		updateCallback();
    	};

    	const onMouseUp = e => {
    		if (e) {
    			e.preventDefault();
    			if (e.button !== 0) return;
    		}

    		updateCallback();
    		window.removeEventListener('mousemove', onMouseMove);
    		window.removeEventListener('mouseup', onMouseUp);
    		window.removeEventListener('touchmove', onMouseMove);
    		window.removeEventListener('touchend', onMouseUp);
    	};

    	function resetSize() {
    		if (left) left.removeAttribute('style');
    		if (right) right.removeAttribute('style');
    		if (separator) separator.removeAttribute('style');
    	}

    	function onResize() {
    		onMouseUp();
    		resetSize();
    	}

    	onMount(() => {
    		window.addEventListener('resize', onResize);
    	});

    	onDestroy(() => {
    		window.removeEventListener('resize', onResize);
    	});

    	let left, right;
    	let { leftPaneSize = '50%' } = $$props;
    	let { rightPaneSize = '50%' } = $$props;
    	let { minLeftPaneSize = '0' } = $$props;
    	let { minRightPaneSize = '0' } = $$props;

    	const writable_props = [
    		'updateCallback',
    		'leftPaneSize',
    		'rightPaneSize',
    		'minLeftPaneSize',
    		'minRightPaneSize'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<HSplitPane> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			left = $$value;
    			$$invalidate(5, left);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			separator = $$value;
    			$$invalidate(4, separator);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			right = $$value;
    			$$invalidate(6, right);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('updateCallback' in $$props) $$invalidate(8, updateCallback = $$props.updateCallback);
    		if ('leftPaneSize' in $$props) $$invalidate(0, leftPaneSize = $$props.leftPaneSize);
    		if ('rightPaneSize' in $$props) $$invalidate(1, rightPaneSize = $$props.rightPaneSize);
    		if ('minLeftPaneSize' in $$props) $$invalidate(2, minLeftPaneSize = $$props.minLeftPaneSize);
    		if ('minRightPaneSize' in $$props) $$invalidate(3, minRightPaneSize = $$props.minRightPaneSize);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		separator,
    		updateCallback,
    		md,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		resetSize,
    		onResize,
    		left,
    		right,
    		leftPaneSize,
    		rightPaneSize,
    		minLeftPaneSize,
    		minRightPaneSize
    	});

    	$$self.$inject_state = $$props => {
    		if ('separator' in $$props) $$invalidate(4, separator = $$props.separator);
    		if ('updateCallback' in $$props) $$invalidate(8, updateCallback = $$props.updateCallback);
    		if ('md' in $$props) md = $$props.md;
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('right' in $$props) $$invalidate(6, right = $$props.right);
    		if ('leftPaneSize' in $$props) $$invalidate(0, leftPaneSize = $$props.leftPaneSize);
    		if ('rightPaneSize' in $$props) $$invalidate(1, rightPaneSize = $$props.rightPaneSize);
    		if ('minLeftPaneSize' in $$props) $$invalidate(2, minLeftPaneSize = $$props.minLeftPaneSize);
    		if ('minRightPaneSize' in $$props) $$invalidate(3, minRightPaneSize = $$props.minRightPaneSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*leftPaneSize*/ 1) {
    			leftPaneSize && resetSize();
    		}

    		if ($$self.$$.dirty & /*rightPaneSize*/ 2) {
    			rightPaneSize && resetSize();
    		}
    	};

    	return [
    		leftPaneSize,
    		rightPaneSize,
    		minLeftPaneSize,
    		minRightPaneSize,
    		separator,
    		left,
    		right,
    		onMouseDown,
    		updateCallback,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div2_binding
    	];
    }

    class HSplitPane extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			updateCallback: 8,
    			leftPaneSize: 0,
    			rightPaneSize: 1,
    			minLeftPaneSize: 2,
    			minRightPaneSize: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HSplitPane",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get updateCallback() {
    		throw new Error("<HSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateCallback(value) {
    		throw new Error("<HSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get leftPaneSize() {
    		throw new Error("<HSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set leftPaneSize(value) {
    		throw new Error("<HSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rightPaneSize() {
    		throw new Error("<HSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rightPaneSize(value) {
    		throw new Error("<HSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minLeftPaneSize() {
    		throw new Error("<HSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minLeftPaneSize(value) {
    		throw new Error("<HSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minRightPaneSize() {
    		throw new Error("<HSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minRightPaneSize(value) {
    		throw new Error("<HSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-split-pane\src\VSplitPane.svelte generated by Svelte v3.46.6 */
    const file$1 = "node_modules\\svelte-split-pane\\src\\VSplitPane.svelte";
    const get_down_slot_changes = dirty => ({});
    const get_down_slot_context = ctx => ({});
    const get_top_slot_changes = dirty => ({});
    const get_top_slot_context = ctx => ({});

    // (102:25)               
    function fallback_block_1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Top Contents goes here...";
    			set_style(div, "background-color", "red");
    			add_location(div, file$1, 102, 12, 3327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(102:25)               ",
    		ctx
    	});

    	return block;
    }

    // (111:26)               
    function fallback_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Down Contents goes here...";
    			set_style(div, "background-color", "yellow");
    			add_location(div, file$1, 111, 12, 3656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(111:26)               ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let current;
    	let mounted;
    	let dispose;
    	const top_slot_template = /*#slots*/ ctx[10].top;
    	const top_slot = create_slot(top_slot_template, ctx, /*$$scope*/ ctx[9], get_top_slot_context);
    	const top_slot_or_fallback = top_slot || fallback_block_1(ctx);
    	const down_slot_template = /*#slots*/ ctx[10].down;
    	const down_slot = create_slot(down_slot_template, ctx, /*$$scope*/ ctx[9], get_down_slot_context);
    	const down_slot_or_fallback = down_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (top_slot_or_fallback) top_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if (down_slot_or_fallback) down_slot_or_fallback.c();
    			attr_dev(div0, "class", "top svelte-17b2l51");
    			add_location(div0, file$1, 100, 4, 3253);
    			attr_dev(div1, "class", "separator svelte-17b2l51");
    			add_location(div1, file$1, 107, 4, 3461);
    			attr_dev(div2, "class", "down svelte-17b2l51");
    			add_location(div2, file$1, 109, 4, 3579);
    			attr_dev(div3, "class", "wrapper svelte-17b2l51");
    			set_style(div3, "--top-panel-size", /*topPanelSize*/ ctx[0]);
    			set_style(div3, "--down-panel-size", /*downPanelSize*/ ctx[1]);
    			set_style(div3, "--min-top-panel-size", /*minTopPaneSize*/ ctx[2]);
    			set_style(div3, "--min-down-panel-size", /*minDownPaneSize*/ ctx[3]);
    			add_location(div3, file$1, 99, 0, 3067);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (top_slot_or_fallback) {
    				top_slot_or_fallback.m(div0, null);
    			}

    			/*div0_binding*/ ctx[11](div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			/*div1_binding*/ ctx[12](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (down_slot_or_fallback) {
    				down_slot_or_fallback.m(div2, null);
    			}

    			/*div2_binding*/ ctx[13](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousedown", /*onMouseDown*/ ctx[7], false, false, false),
    					listen_dev(div1, "touchstart", /*onMouseDown*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (top_slot) {
    				if (top_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						top_slot,
    						top_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(top_slot_template, /*$$scope*/ ctx[9], dirty, get_top_slot_changes),
    						get_top_slot_context
    					);
    				}
    			}

    			if (down_slot) {
    				if (down_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						down_slot,
    						down_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(down_slot_template, /*$$scope*/ ctx[9], dirty, get_down_slot_changes),
    						get_down_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*topPanelSize*/ 1) {
    				set_style(div3, "--top-panel-size", /*topPanelSize*/ ctx[0]);
    			}

    			if (!current || dirty & /*downPanelSize*/ 2) {
    				set_style(div3, "--down-panel-size", /*downPanelSize*/ ctx[1]);
    			}

    			if (!current || dirty & /*minTopPaneSize*/ 4) {
    				set_style(div3, "--min-top-panel-size", /*minTopPaneSize*/ ctx[2]);
    			}

    			if (!current || dirty & /*minDownPaneSize*/ 8) {
    				set_style(div3, "--min-down-panel-size", /*minDownPaneSize*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(top_slot_or_fallback, local);
    			transition_in(down_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(top_slot_or_fallback, local);
    			transition_out(down_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (top_slot_or_fallback) top_slot_or_fallback.d(detaching);
    			/*div0_binding*/ ctx[11](null);
    			/*div1_binding*/ ctx[12](null);
    			if (down_slot_or_fallback) down_slot_or_fallback.d(detaching);
    			/*div2_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('VSplitPane', slots, ['top','down']);
    	let separator;

    	let { updateCallback = () => {
    		// do nothing
    		return;
    	} } = $$props;

    	let md;

    	const onMouseDown = e => {
    		e.preventDefault();
    		if (e.button !== 0) return;

    		md = {
    			e,
    			offsetLeft: separator.offsetLeft,
    			offsetTop: separator.offsetTop,
    			firstHeight: top.offsetHeight,
    			secondHeight: down.offsetHeight
    		};

    		window.addEventListener('mousemove', onMouseMove);
    		window.addEventListener('mouseup', onMouseUp);
    		window.addEventListener('touchmove', onMouseMove);
    		window.addEventListener('touchend', onMouseUp);
    	};

    	const onMouseMove = e => {
    		e.preventDefault();
    		if (e.button !== 0) return;

    		var delta = {
    			x: e.clientX - md.e.clientX,
    			y: e.clientY - md.e.clientY
    		};

    		// Prevent negative-sized elements
    		delta.y = Math.min(Math.max(delta.y, -md.firstHeight), md.secondHeight);

    		$$invalidate(4, separator.style.top = md.offsetTop + delta.y + "px", separator);
    		$$invalidate(5, top.style.height = md.firstHeight + delta.y + "px", top);
    		$$invalidate(6, down.style.height = md.secondHeight - delta.y + "px", down);
    		updateCallback();
    	};

    	const onMouseUp = e => {
    		if (e) {
    			e.preventDefault();
    			if (e.button !== 0) return;
    		}

    		updateCallback();
    		window.removeEventListener('mousemove', onMouseMove);
    		window.removeEventListener('mouseup', onMouseUp);
    		window.removeEventListener('touchmove', onMouseMove);
    		window.removeEventListener('touchend', onMouseUp);
    	};

    	function resetSize() {
    		if (top) top.removeAttribute('style');
    		if (down) down.removeAttribute('style');
    		if (separator) separator.removeAttribute('style');
    	}

    	function onResize() {
    		onMouseUp();
    		resetSize();
    	}

    	onMount(() => {
    		window.addEventListener('resize', onResize);
    	});

    	onDestroy(() => {
    		window.removeEventListener('resize', onResize);
    	});

    	let top, down;
    	let { topPanelSize = '50%' } = $$props;
    	let { downPanelSize = '50%' } = $$props;
    	let { minTopPaneSize = '0' } = $$props;
    	let { minDownPaneSize = '0' } = $$props;

    	const writable_props = [
    		'updateCallback',
    		'topPanelSize',
    		'downPanelSize',
    		'minTopPaneSize',
    		'minDownPaneSize'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<VSplitPane> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			top = $$value;
    			$$invalidate(5, top);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			separator = $$value;
    			$$invalidate(4, separator);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			down = $$value;
    			$$invalidate(6, down);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('updateCallback' in $$props) $$invalidate(8, updateCallback = $$props.updateCallback);
    		if ('topPanelSize' in $$props) $$invalidate(0, topPanelSize = $$props.topPanelSize);
    		if ('downPanelSize' in $$props) $$invalidate(1, downPanelSize = $$props.downPanelSize);
    		if ('minTopPaneSize' in $$props) $$invalidate(2, minTopPaneSize = $$props.minTopPaneSize);
    		if ('minDownPaneSize' in $$props) $$invalidate(3, minDownPaneSize = $$props.minDownPaneSize);
    		if ('$$scope' in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		separator,
    		updateCallback,
    		md,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		resetSize,
    		onResize,
    		top,
    		down,
    		topPanelSize,
    		downPanelSize,
    		minTopPaneSize,
    		minDownPaneSize
    	});

    	$$self.$inject_state = $$props => {
    		if ('separator' in $$props) $$invalidate(4, separator = $$props.separator);
    		if ('updateCallback' in $$props) $$invalidate(8, updateCallback = $$props.updateCallback);
    		if ('md' in $$props) md = $$props.md;
    		if ('top' in $$props) $$invalidate(5, top = $$props.top);
    		if ('down' in $$props) $$invalidate(6, down = $$props.down);
    		if ('topPanelSize' in $$props) $$invalidate(0, topPanelSize = $$props.topPanelSize);
    		if ('downPanelSize' in $$props) $$invalidate(1, downPanelSize = $$props.downPanelSize);
    		if ('minTopPaneSize' in $$props) $$invalidate(2, minTopPaneSize = $$props.minTopPaneSize);
    		if ('minDownPaneSize' in $$props) $$invalidate(3, minDownPaneSize = $$props.minDownPaneSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*topPanelSize*/ 1) {
    			topPanelSize && resetSize();
    		}

    		if ($$self.$$.dirty & /*downPanelSize*/ 2) {
    			downPanelSize && resetSize();
    		}
    	};

    	return [
    		topPanelSize,
    		downPanelSize,
    		minTopPaneSize,
    		minDownPaneSize,
    		separator,
    		top,
    		down,
    		onMouseDown,
    		updateCallback,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div2_binding
    	];
    }

    class VSplitPane extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			updateCallback: 8,
    			topPanelSize: 0,
    			downPanelSize: 1,
    			minTopPaneSize: 2,
    			minDownPaneSize: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "VSplitPane",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get updateCallback() {
    		throw new Error("<VSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set updateCallback(value) {
    		throw new Error("<VSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get topPanelSize() {
    		throw new Error("<VSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set topPanelSize(value) {
    		throw new Error("<VSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get downPanelSize() {
    		throw new Error("<VSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set downPanelSize(value) {
    		throw new Error("<VSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minTopPaneSize() {
    		throw new Error("<VSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minTopPaneSize(value) {
    		throw new Error("<VSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minDownPaneSize() {
    		throw new Error("<VSplitPane>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minDownPaneSize(value) {
    		throw new Error("<VSplitPane>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /* @license
    Papa Parse
    v5.3.2
    https://github.com/mholt/PapaParse
    License: MIT
    */

    var papaparse_min = createCommonjsModule(function (module, exports) {
    !function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var i=(t=t||{}).dynamicTyping||!1;M(i)&&(t.dynamicTypingFunction=i,i={});if(t.dynamicTyping=i,t.transform=!!M(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var r=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(i=f.URL||f.webkitURL||null,r=s.toString(),b.BLOB_URL||(b.BLOB_URL=i.createObjectURL(new Blob(["(",r,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var i,r;return t.onmessage=_,t.id=h++,a[t.id]=t}();return r.userStep=t.step,r.userChunk=t.chunk,r.userComplete=t.complete,r.userError=t.error,t.step=M(t.step),t.chunk=M(t.chunk),t.complete=M(t.complete),t.error=M(t.error),delete t.worker,void r.postMessage({input:e,config:t,workerId:r.id})}var n=null;b.NODE_STREAM_INPUT,"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&M(e.read)&&M(e.on)?n=new g(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var n=!1,_=!0,m=",",y="\r\n",s='"',a=s+s,i=!1,r=null,o=!1;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(m=t.delimiter);("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(n=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(i=t.skipEmptyLines);"string"==typeof t.newline&&(y=t.newline);"string"==typeof t.quoteChar&&(s=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");r=t.columns;}void 0!==t.escapeChar&&(a=t.escapeChar+s);("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(o=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/);}();var h=new RegExp(j(s),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,i);if("object"==typeof e[0])return u(r||Object.keys(e[0]),e,i)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||r),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],i);throw new Error("Unable to serialize unrecognized input");function u(e,t,i){var r="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(r+=m),r+=v(e[a],a);0<t.length&&(r+=y);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(i&&!n&&(u="greedy"===i?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===i&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(r+=m);var g=n&&s?e[p]:p;r+=v(t[o][g],p);}o<t.length-1&&(!i||0<h&&!f)&&(r+=y);}}return r}function v(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var i=!1;o&&"string"==typeof e&&o.test(e)&&(e="'"+e,i=!0);var r=e.toString().replace(h,a);return (i=i||!0===n||"function"==typeof n&&n(e,t)||Array.isArray(n)&&n[t]||function(e,t){for(var i=0;i<t.length;i++)if(-1<e.indexOf(t[i]))return !0;return !1}(r,b.BAD_DELIMITERS)||-1<r.indexOf(m)||" "===r.charAt(0)||" "===r.charAt(r.length-1))?s+r+s:r}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=i,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=g,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var i=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},i)});}),e(),this;function e(){if(0!==h.length){var e,t,i,r,n=h[0];if(M(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,i=n.inputElem,r=s.reason,void(M(o.error)&&o.error({name:e},t,i,r));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){M(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else M(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new i(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&M(this._config.beforeFirstChunk)){var i=this._config.beforeFirstChunk(e);void 0!==i&&(e=i);}this.isFirstChunk=!1,this._halted=!1;var r=this._partialLine+e;this._partialLine="";var n=this._handle.parse(r,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=r.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(M(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!M(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){M(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var r;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),n||(r.onload=v(this._chunkLoaded,this),r.onerror=v(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)r.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var i=this._start+this._config.chunkSize-1;r.setRequestHeader("Range","bytes="+this._start+"-"+i);}try{r.send(this._config.downloadRequestBody);}catch(e){this._chunkError(e.message);}n&&0===r.status&&this._chunkError();}},this._chunkLoaded=function(){4===r.readyState&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:r.responseText.length,this._finished=!this._config.chunkSize||this._start>=function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substring(t.lastIndexOf("/")+1))}(r),this.parseChunk(r.responseText)));},this._chunkError=function(e){var t=r.statusText||e;this._sendError(new Error(t));};}function c(e){var r,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((r=new FileReader).onload=v(this._chunkLoaded,this),r.onerror=v(this._chunkError,this)):r=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var i=r.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:i}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(r.error);};}function p(e){var i;u.call(this,e=e||{}),this.stream=function(e){return i=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,t=this._config.chunkSize;return t?(e=i.substring(0,t),i=i.substring(t)):(e=i,i=""),this._finished=!i,this.parseChunk(e)}};}function g(e){u.call(this,e=e||{});var t=[],i=!0,r=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){r&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):i=!0;},this._streamData=v(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),i&&(i=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=v(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=v(function(){this._streamCleanUp(),r=!0,this._streamData("");},this),this._streamCleanUp=v(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function i(m){var a,o,h,r=Math.pow(2,53),n=-r,s=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,u=/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/,t=this,i=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(M(m.step)){var p=m.step;m.step=function(e){if(c=e,_())g();else {if(g(),0===c.data.length)return;i+=e.data.length,m.preview&&i>m.preview?o.abort():(c.data=c.data[0],p(c,t));}};}function y(e){return "greedy"===m.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function g(){return c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),m.skipEmptyLines&&(c.data=c.data.filter(function(e){return !y(e)})),_()&&function(){if(!c)return;function e(e,t){M(m.transformHeader)&&(e=m.transformHeader(e,t)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!m.header&&!m.dynamicTyping&&!m.transform)return c;function e(e,t){var i,r=m.header?{}:[];for(i=0;i<e.length;i++){var n=i,s=e[i];m.header&&(n=i>=l.length?"__parsed_extra":l[i]),m.transform&&(s=m.transform(s,n)),s=v(n,s),"__parsed_extra"===n?(r[n]=r[n]||[],r[n].push(s)):r[n]=s;}return m.header&&(i>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+i,f+t):i<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+i,f+t)),r}var t=1;!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);m.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return m.header&&0===l.length}function v(e,t){return i=e,m.dynamicTypingFunction&&void 0===m.dynamicTyping[i]&&(m.dynamicTyping[i]=m.dynamicTypingFunction(i)),!0===(m.dynamicTyping[i]||m.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<r)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var i;}function k(e,t,i,r){var n={type:e,code:t,message:i};void 0!==r&&(n.row=r),c.errors.push(n);}this.parse=function(e,t,i){var r=m.quoteChar||'"';if(m.newline||(m.newline=function(e,t){e=e.substring(0,1048576);var i=new RegExp(j(t)+"([^]*?)"+j(t),"gm"),r=(e=e.replace(i,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<r[0].length;if(1===r.length||s)return "\n";for(var a=0,o=0;o<r.length;o++)"\n"===r[o][0]&&a++;return a>=r.length/2?"\r\n":"\r"}(e,r)),h=!1,m.delimiter)M(m.delimiter)&&(m.delimiter=m.delimiter(e),c.meta.delimiter=m.delimiter);else {var n=function(e,t,i,r,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:r,delimiter:f,newline:t,preview:10}).parse(e),g=0;g<p.data.length;g++)if(i&&y(p.data[g]))c++;else {var _=p.data[g].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(m.delimiter=s),bestDelimiter:s}}(e,m.newline,m.skipEmptyLines,m.comments,m.delimitersToGuess);n.successful?m.delimiter=n.bestDelimiter:(h=!0,m.delimiter=b.DefaultDelimiter),c.meta.delimiter=m.delimiter;}var s=w(m);return m.preview&&m.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,i),g(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=M(m.chunk)?"":a.substring(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(t.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,M(m.complete)&&m.complete(c),a="";};}function j(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var S,O=(e=e||{}).delimiter,x=e.newline,I=e.comments,T=e.step,D=e.preview,A=e.fastMode,L=S=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(L=e.escapeChar),("string"!=typeof O||-1<b.BAD_DELIMITERS.indexOf(O))&&(O=","),I===O)throw new Error("Comment character same as delimiter");!0===I?I="#":("string"!=typeof I||-1<b.BAD_DELIMITERS.indexOf(I))&&(I=!1),"\n"!==x&&"\r"!==x&&"\r\n"!==x&&(x="\n");var F=0,z=!1;this.parse=function(r,t,i){if("string"!=typeof r)throw new Error("Input must be a string");var n=r.length,e=O.length,s=x.length,a=I.length,o=M(T),h=[],u=[],f=[],d=F=0;if(!r)return C();if(A||!1!==A&&-1===r.indexOf(S)){for(var l=r.split(x),c=0;c<l.length;c++){if(f=l[c],F+=f.length,c!==l.length-1)F+=x.length;else if(i)return C();if(!I||f.substring(0,a)!==I){if(o){if(h=[],k(f.split(O)),R(),z)return C()}else k(f.split(O));if(D&&D<=c)return h=h.slice(0,D),C(!0)}}return C()}for(var p=r.indexOf(O,F),g=r.indexOf(x,F),_=new RegExp(j(L)+j(S),"g"),m=r.indexOf(S,F);;)if(r[F]!==S)if(I&&0===f.length&&r.substring(F,F+a)===I){if(-1===g)return C();F=g+s,g=r.indexOf(x,F),p=r.indexOf(O,F);}else if(-1!==p&&(p<g||-1===g))f.push(r.substring(F,p)),F=p+e,p=r.indexOf(O,F);else {if(-1===g)break;if(f.push(r.substring(F,g)),w(g+s),o&&(R(),z))return C();if(D&&h.length>=D)return C(!0)}else for(m=F,F++;;){if(-1===(m=r.indexOf(S,m+1)))return i||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:F}),E();if(m===n-1)return E(r.substring(F,m).replace(_,S));if(S!==L||r[m+1]!==L){if(S===L||0===m||r[m-1]!==L){-1!==p&&p<m+1&&(p=r.indexOf(O,m+1)),-1!==g&&g<m+1&&(g=r.indexOf(x,m+1));var y=b(-1===g?p:Math.min(p,g));if(r.substr(m+1+y,e)===O){f.push(r.substring(F,m).replace(_,S)),r[F=m+1+y+e]!==S&&(m=r.indexOf(S,F)),p=r.indexOf(O,F),g=r.indexOf(x,F);break}var v=b(g);if(r.substring(m+1+v,m+1+v+s)===x){if(f.push(r.substring(F,m).replace(_,S)),w(m+1+v+s),p=r.indexOf(O,F),m=r.indexOf(S,F),o&&(R(),z))return C();if(D&&h.length>=D)return C(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:F}),m++;}}else m++;}return E();function k(e){h.push(e),d=F;}function b(e){var t=0;if(-1!==e){var i=r.substring(m+1,e);i&&""===i.trim()&&(t=i.length);}return t}function E(e){return i||(void 0===e&&(e=r.substring(F)),f.push(e),F=n,k(f),o&&R()),C()}function w(e){F=e,k(f),f=[],g=r.indexOf(x,F);}function C(e){return {data:h,errors:u,meta:{delimiter:O,linebreak:x,aborted:z,truncated:!!e,cursor:d+(t||0)}}}function R(){T(C()),h=[],u=[];}},this.abort=function(){z=!0;},this.getCharIndex=function(){return F};}function _(e){var t=e.data,i=a[t.workerId],r=!1;if(t.error)i.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){r=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:y,resume:y};if(M(i.userStep)){for(var s=0;s<t.results.data.length&&(i.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!r);s++);delete t.results;}else M(i.userChunk)&&(i.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!r&&m(t.workerId,t.results);}function m(e,t){var i=a[e];M(i.userComplete)&&i.userComplete(t),i.terminate(),delete a[e];}function y(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var i in e)t[i]=w(e[i]);return t}function v(e,t){return function(){e.apply(t,arguments);}}function M(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var i=b.parse(t.input,t.config);i&&f.postMessage({workerId:b.WORKER_ID,results:i,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(g.prototype=Object.create(u.prototype)).constructor=g,b});
    });

    /* src\App.svelte generated by Svelte v3.46.6 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    // (297:8) {#if usingForm()}
    function create_if_block_8(ctx) {
    	let div;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			button.textContent = "Clear fields";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out");
    			add_location(button, file, 298, 10, 10691);
    			attr_dev(div, "class", "text-center mt-5");
    			add_location(div, file, 297, 9, 10650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*clearFields*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(297:8) {#if usingForm()}",
    		ctx
    	});

    	return block;
    }

    // (310:11) {#if files}
    function create_if_block_7(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "X";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mb-1 ml-2 inline-block px-1 py-1 bg-gray-800 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out");
    			add_location(button, file, 310, 12, 11505);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[26], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(310:11) {#if files}",
    		ctx
    	});

    	return block;
    }

    // (341:10) {:else}
    function create_else_block_1(ctx) {
    	let button;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Predict Effort";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out pointer-events-none opacity-60");
    			button.disabled = true;
    			add_location(button, file, 341, 11, 13704);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(341:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (339:10) {#if usingForm() && completeForm() && !calculating}
    function create_if_block_6(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Predict Effort";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md hover:bg-[#02215a] hover:shadow-lg focus:bg-[#02215a] focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out");
    			add_location(button, file, 339, 11, 13334);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[30], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(339:10) {#if usingForm() && completeForm() && !calculating}",
    		ctx
    	});

    	return block;
    }

    // (331:9) {#if files && !calculating}
    function create_if_block_4(ctx) {
    	let show_if;
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (dirty[0] & /*usingForm*/ 8192) show_if = null;
    		if (show_if == null) show_if = !!/*usingForm*/ ctx[13]();
    		if (show_if) return create_if_block_5;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx, [-1, -1]);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx, dirty)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(331:9) {#if files && !calculating}",
    		ctx
    	});

    	return block;
    }

    // (335:10) {:else}
    function create_else_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Predict Effort";
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md hover:bg-[#02215a] hover:shadow-lg focus:bg-[#02215a] focus:shadow-lg focus:outline-none focus:ring-0 transition duration-150 ease-in-out");
    			add_location(button, file, 335, 11, 12888);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[29], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(335:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (332:10) {#if usingForm()}
    function create_if_block_5(ctx) {
    	let p;
    	let t1;
    	let button;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "You can only send one story or multiple.";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Predict Effort";
    			add_location(p, file, 332, 11, 12527);
    			button.disabled = true;
    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "mt-16 mx-auto inline-block px-20 py-5 bg-[#023185] text-white text-lg leading-snug uppercase rounded shadow-md focus:outline-none focus:ring-0 transition duration-150 ease-in-out pointer-events-none opacity-60");
    			add_location(button, file, 333, 11, 12586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(332:10) {#if usingForm()}",
    		ctx
    	});

    	return block;
    }

    // (345:9) {#if errorMessage}
    function create_if_block_3(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*errorMessage*/ ctx[9]);
    			attr_dev(p, "class", "text-warning text-center text-xl text-bold mt-10");
    			add_location(p, file, 345, 10, 14046);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*errorMessage*/ 512) set_data_dev(t, /*errorMessage*/ ctx[9]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(345:9) {#if errorMessage}",
    		ctx
    	});

    	return block;
    }

    // (350:9) {#if calculating}
    function create_if_block_2(ctx) {
    	let div;
    	let span;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span = element("span");
    			span.textContent = "Loading...";
    			attr_dev(span, "class", "visually-hidden");
    			add_location(span, file, 351, 11, 14316);
    			attr_dev(div, "class", "mt-10 spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full");
    			attr_dev(div, "role", "status");
    			add_location(div, file, 350, 10, 14200);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(350:9) {#if calculating}",
    		ctx
    	});

    	return block;
    }

    // (366:54) 
    function create_if_block_1(ctx) {
    	let div;
    	let h5;
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h5 = element("h5");
    			t0 = text(/*resultOneStory*/ ctx[10]);
    			t1 = text(" days");
    			attr_dev(h5, "class", "text-2xl font-black text-[#023185] leading-tight mb-2");
    			add_location(h5, file, 367, 11, 15099);
    			attr_dev(div, "class", "text-center mt-10");
    			add_location(div, file, 366, 10, 15056);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*resultOneStory*/ 1024) set_data_dev(t0, /*resultOneStory*/ ctx[10]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(366:54) ",
    		ctx
    	});

    	return block;
    }

    // (355:9) {#if calculationsOver && returnFile}
    function create_if_block(ctx) {
    	let div2;
    	let div0;
    	let a0;
    	let icon;
    	let t0;
    	let div1;
    	let a1;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				icon: "ci:download",
    				color: "#0fa958",
    				style: "font-size: 77px"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			a1 = element("a");
    			a1.textContent = "Download csv file";
    			attr_dev(a0, "href", "javascript:void(0)");
    			add_location(a0, file, 357, 30, 14607);
    			attr_dev(div0, "class", "mt-10");
    			add_location(div0, file, 357, 11, 14588);
    			attr_dev(a1, "class", "text-xl text-[#12A64D]");
    			attr_dev(a1, "href", "javascript:void(0)");
    			add_location(a1, file, 361, 16, 14836);
    			add_location(div1, file, 361, 11, 14831);
    			attr_dev(div2, "class", "flex flex-col text-center justify-center items-center");
    			add_location(div2, file, 355, 10, 14452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			mount_component(icon, a0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, a1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(a0, "click", /*downloadCSV*/ ctx[17], false, false, false),
    					listen_dev(a1, "click", /*downloadCSV*/ ctx[17], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(355:9) {#if calculationsOver && returnFile}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwindcss;
    	let t0;
    	let body;
    	let header;
    	let div1;
    	let div0;
    	let t1;
    	let a1;
    	let svg0;
    	let g;
    	let path0;
    	let path1;
    	let t2;
    	let a0;
    	let t4;
    	let nav;
    	let a2;
    	let t6;
    	let a3;
    	let t8;
    	let button;
    	let t9;
    	let svg1;
    	let path2;
    	let path3;
    	let t10;
    	let main;
    	let div18;
    	let div5;
    	let div4;
    	let div2;
    	let h1;
    	let t12;
    	let h3;
    	let t14;
    	let p0;
    	let t15;
    	let br0;
    	let t16;
    	let br1;
    	let t17;
    	let br2;
    	let t18;
    	let t19;
    	let div3;
    	let img;
    	let img_src_value;
    	let t20;
    	let div17;
    	let div16;
    	let div15;
    	let div10;
    	let section0;
    	let form;
    	let label0;
    	let t22;
    	let input0;
    	let t23;
    	let div7;
    	let label1;
    	let t25;
    	let div6;
    	let select0;
    	let updating_value;
    	let t26;
    	let div9;
    	let label2;
    	let t28;
    	let div8;
    	let select1;
    	let updating_value_1;
    	let t29;
    	let label3;
    	let t31;
    	let textarea0;
    	let t32;
    	let label4;
    	let t34;
    	let textarea1;
    	let t35;
    	let show_if_1 = /*usingForm*/ ctx[13]();
    	let t36;
    	let div14;
    	let section1;
    	let div13;
    	let div12;
    	let div11;
    	let label5;
    	let t38;
    	let t39;
    	let input1;
    	let t40;
    	let show_if;
    	let t41;
    	let t42;
    	let t43;
    	let current_block_type_index;
    	let if_block5;
    	let t44;
    	let footer;
    	let div20;
    	let div19;
    	let t45;
    	let p1;
    	let t46;
    	let a4;
    	let t48;
    	let span;
    	let a5;
    	let svg2;
    	let path4;
    	let t49;
    	let a6;
    	let svg3;
    	let path5;
    	let t50;
    	let a7;
    	let svg4;
    	let rect;
    	let path6;
    	let t51;
    	let a8;
    	let svg5;
    	let path7;
    	let circle;
    	let current;
    	let mounted;
    	let dispose;
    	tailwindcss = new Tailwindcss({ $$inline: true });

    	function select0_value_binding(value) {
    		/*select0_value_binding*/ ctx[22](value);
    	}

    	let select0_props = {
    		id: "Severity",
    		items: /*severityItems*/ ctx[14]
    	};

    	if (/*severityText*/ ctx[1] !== void 0) {
    		select0_props.value = /*severityText*/ ctx[1];
    	}

    	select0 = new Select({ props: select0_props, $$inline: true });
    	binding_callbacks.push(() => bind(select0, 'value', select0_value_binding));

    	function select1_value_binding(value) {
    		/*select1_value_binding*/ ctx[23](value);
    	}

    	let select1_props = {
    		id: "Priority",
    		items: /*priorityItems*/ ctx[15]
    	};

    	if (/*priorityText*/ ctx[2] !== void 0) {
    		select1_props.value = /*priorityText*/ ctx[2];
    	}

    	select1 = new Select({ props: select1_props, $$inline: true });
    	binding_callbacks.push(() => bind(select1, 'value', select1_value_binding));
    	let if_block0 = show_if_1 && create_if_block_8(ctx);
    	let if_block1 = /*files*/ ctx[5] && create_if_block_7(ctx);

    	function select_block_type(ctx, dirty) {
    		if (dirty[0] & /*usingForm, completeForm, calculating*/ 12544) show_if = null;
    		if (/*files*/ ctx[5] && !/*calculating*/ ctx[8]) return create_if_block_4;
    		if (show_if == null) show_if = !!(/*usingForm*/ ctx[13]() && /*completeForm*/ ctx[12]() && !/*calculating*/ ctx[8]);
    		if (show_if) return create_if_block_6;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx, [-1, -1]);
    	let if_block2 = current_block_type(ctx);
    	let if_block3 = /*errorMessage*/ ctx[9] && create_if_block_3(ctx);
    	let if_block4 = /*calculating*/ ctx[8] && create_if_block_2(ctx);
    	const if_block_creators = [create_if_block, create_if_block_1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*calculationsOver*/ ctx[7] && /*returnFile*/ ctx[6]) return 0;
    		if (/*calculationsOver*/ ctx[7] && /*resultOneStory*/ ctx[10]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_2(ctx))) {
    		if_block5 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			body = element("body");
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			t1 = space();
    			a1 = element("a");
    			svg0 = svg_element("svg");
    			g = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			t2 = space();
    			a0 = element("a");
    			a0.textContent = "EffortPredictor";
    			t4 = space();
    			nav = element("nav");
    			a2 = element("a");
    			a2.textContent = "History";
    			t6 = space();
    			a3 = element("a");
    			a3.textContent = "Account";
    			t8 = space();
    			button = element("button");
    			t9 = text("Log Out\n\t\t\t\t");
    			svg1 = svg_element("svg");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t10 = space();
    			main = element("main");
    			div18 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Effort Predictor";
    			t12 = space();
    			h3 = element("h3");
    			h3.textContent = "for a given story";
    			t14 = space();
    			p0 = element("p");
    			t15 = text("Results are given in total days of work. ");
    			br0 = element("br");
    			t16 = space();
    			br1 = element("br");
    			t17 = text("\n\n\t\t\t\t\t\t\t*If stories are given in a csv file,\n\t\t\t\t\t\t\tcolumns should be ");
    			br2 = element("br");
    			t18 = text(" in order exactly as shown here (Top to bottom).");
    			t19 = space();
    			div3 = element("div");
    			img = element("img");
    			t20 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			div10 = element("div");
    			section0 = element("section");
    			form = element("form");
    			label0 = element("label");
    			label0.textContent = "IssueKey";
    			t22 = space();
    			input0 = element("input");
    			t23 = space();
    			div7 = element("div");
    			label1 = element("label");
    			label1.textContent = "Severity";
    			t25 = space();
    			div6 = element("div");
    			create_component(select0.$$.fragment);
    			t26 = space();
    			div9 = element("div");
    			label2 = element("label");
    			label2.textContent = "Priority";
    			t28 = space();
    			div8 = element("div");
    			create_component(select1.$$.fragment);
    			t29 = space();
    			label3 = element("label");
    			label3.textContent = "Summary";
    			t31 = space();
    			textarea0 = element("textarea");
    			t32 = space();
    			label4 = element("label");
    			label4.textContent = "Description";
    			t34 = space();
    			textarea1 = element("textarea");
    			t35 = space();
    			if (if_block0) if_block0.c();
    			t36 = space();
    			div14 = element("div");
    			section1 = element("section");
    			div13 = element("div");
    			div12 = element("div");
    			div11 = element("div");
    			label5 = element("label");
    			label5.textContent = "Multiple stories in a csv file?*";
    			t38 = space();
    			if (if_block1) if_block1.c();
    			t39 = space();
    			input1 = element("input");
    			t40 = space();
    			if_block2.c();
    			t41 = space();
    			if (if_block3) if_block3.c();
    			t42 = space();
    			if (if_block4) if_block4.c();
    			t43 = space();
    			if (if_block5) if_block5.c();
    			t44 = space();
    			footer = element("footer");
    			div20 = element("div");
    			div19 = element("div");
    			t45 = space();
    			p1 = element("p");
    			t46 = text("© 2022 EffortPredictor —\n\t\t\t\t\n\t\t\t\t");
    			a4 = element("a");
    			a4.textContent = "@DedicatedCoders";
    			t48 = space();
    			span = element("span");
    			a5 = element("a");
    			svg2 = svg_element("svg");
    			path4 = svg_element("path");
    			t49 = space();
    			a6 = element("a");
    			svg3 = svg_element("svg");
    			path5 = svg_element("path");
    			t50 = space();
    			a7 = element("a");
    			svg4 = svg_element("svg");
    			rect = svg_element("rect");
    			path6 = svg_element("path");
    			t51 = space();
    			a8 = element("a");
    			svg5 = svg_element("svg");
    			path7 = svg_element("path");
    			circle = svg_element("circle");
    			attr_dev(div0, "class", "w-0 h-0 right-0 top-0 border-t-0 border-l-0 border-r-[250px] border-b-[250px] border-solid border-r-cemex-red border-y-transparent border-l-transparent absolute z-0");
    			add_location(div0, file, 154, 3, 4315);
    			attr_dev(path0, "class", "shrink svelte-dhisve");
    			set_style(path0, "fill", "#FFFFFF");
    			set_style(path0, "fill-opacity", "1");
    			attr_dev(path0, "d", "m -399.69329,127.2779 20.14157,-0.004 -0.12532,0.16378 -45.78858,54.41665 -19.78427,0.0346 45.5566,-54.61115 z");
    			attr_dev(path0, "id", "path2884");
    			attr_dev(path0, "sodipodi:nodetypes", "cccccccccccscccccscccccccccccccccccccccscccsscccccscccsccccccccccsssssccccccccccsccccccccccssssscccccsssssccccccccccssscccccccccscccccccsssssccccccccscccccccccccccccccccccccccccccc");
    			add_location(path0, file, 160, 8, 5023);
    			attr_dev(path1, "class", "shrink svelte-dhisve");
    			set_style(path1, "fill", "#FFFFFF");
    			set_style(path1, "fill-opacity", "1");
    			attr_dev(path1, "d", "m -471.6055,181.84225 45.4664,-54.49499 20.16591,0 -0.17379,0.18798 -45.80667,54.42663 -9.87711,0 c -9.4002,0 -9.87217,-0.006 -9.77474,-0.11962 z");
    			attr_dev(path1, "id", "path2884-1");
    			attr_dev(path1, "sodipodi:nodetypes", "ccccccc");
    			add_location(path1, file, 161, 6, 5419);
    			attr_dev(g, "inkscape:label", "Layer 1");
    			attr_dev(g, "inkscape:groupmode", "layer");
    			attr_dev(g, "id", "layer1");
    			attr_dev(g, "transform", "translate(471.61508,-127.2739)");
    			add_location(g, file, 159, 5, 4904);
    			attr_dev(svg0, "width", "200.94008");
    			attr_dev(svg0, "height", "54.687969");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "stroke", "currentColor");
    			attr_dev(svg0, "stroke-linecap", "round");
    			attr_dev(svg0, "stroke-linejoin", "round");
    			attr_dev(svg0, "stroke-width", "2");
    			attr_dev(svg0, "class", "w-14 h-14 text-white p-2 bg-cemex-red rounded-full");
    			attr_dev(svg0, "viewBox", "0 0 24 24");
    			add_location(svg0, file, 158, 4, 4643);
    			attr_dev(a0, "class", "ml-3 text-xl text-gray-900 hover:text-gray-900");
    			attr_dev(a0, "href", "http://127.0.0.1:8000/");
    			add_location(a0, file, 164, 4, 5698);
    			attr_dev(a1, "class", "flex title-font font-bold items-center text-gray-900 mb-4 md:mb-0 z-20");
    			add_location(a1, file, 157, 3, 4556);
    			attr_dev(a2, "class", "mr-5 hover:text-gray-900 text-gray-900");
    			attr_dev(a2, "href", "http://127.0.0.1:8000/history/");
    			add_location(a2, file, 168, 4, 6009);
    			attr_dev(a3, "class", "mr-5 hover:text-gray-900 text-gray-900");
    			attr_dev(a3, "href", "http://127.0.0.1:8000/account/");
    			add_location(a3, file, 170, 4, 6163);
    			attr_dev(nav, "class", "md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-400 z-20 flex flex-wrap items-center text-base justify-center");
    			add_location(nav, file, 166, 3, 5817);
    			attr_dev(path2, "d", "M7 6a1 1 0 0 0 0-2H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h2a1 1 0 0 0 0-2H6V6z");
    			add_location(path2, file, 174, 5, 6661);
    			attr_dev(path3, "d", "M20.82 11.42l-2.82-4a1 1 0 0 0-1.39-.24 1 1 0 0 0-.24 1.4L18.09 11H10a1 1 0 0 0 0 2h8l-1.8 2.4a1 1 0 0 0 .2 1.4 1 1 0 0 0 .6.2 1 1 0 0 0 .8-.4l3-4a1 1 0 0 0 .02-1.18z");
    			add_location(path3, file, 175, 5, 6751);
    			attr_dev(svg1, "fill", "none");
    			attr_dev(svg1, "stroke", "currentColor");
    			attr_dev(svg1, "stroke-linecap", "round");
    			attr_dev(svg1, "stroke-linejoin", "round");
    			attr_dev(svg1, "stroke-width", "2");
    			attr_dev(svg1, "class", "w-4 h-4 ml-1");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			add_location(svg1, file, 173, 4, 6511);
    			attr_dev(button, "type", "button");
    			attr_dev(button, "onclick", "location.href='http://127.0.0.1:8000/accounts/logout'");
    			attr_dev(button, "class", "z-20 inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0");
    			add_location(button, file, 172, 3, 6276);
    			attr_dev(div1, "class", "mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center z-30");
    			add_location(div1, file, 153, 2, 4231);
    			attr_dev(header, "class", "text-gray-600 body-font z-20 relative");
    			add_location(header, file, 152, 1, 4174);
    			attr_dev(h1, "class", "appTitle");
    			add_location(h1, file, 185, 7, 7132);
    			attr_dev(h3, "class", "appSubT");
    			add_location(h3, file, 186, 7, 7183);
    			add_location(br0, file, 188, 51, 7279);
    			add_location(br1, file, 188, 56, 7284);
    			add_location(br2, file, 191, 25, 7359);
    			add_location(p0, file, 188, 7, 7235);
    			add_location(div2, file, 184, 6, 7119);
    			if (!src_url_equal(img.src, img_src_value = "https://pbs.twimg.com/media/DN9_SfwV4AATQXt.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Cemex-Go");
    			attr_dev(img, "width", "130");
    			attr_dev(img, "height", "135");
    			attr_dev(img, "class", "object-fill w-auto");
    			add_location(img, file, 195, 7, 7475);
    			attr_dev(div3, "class", "mt-10 w-40");
    			add_location(div3, file, 194, 6, 7443);
    			attr_dev(div4, "class", "flex flex-col items-center");
    			add_location(div4, file, 183, 5, 7072);
    			attr_dev(div5, "class", "px-6 md:w-1/3");
    			add_location(div5, file, 182, 3, 7039);
    			attr_dev(label0, "for", "IssueKey");
    			attr_dev(label0, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label0, file, 207, 9, 7844);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 mb-5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none");
    			attr_dev(input0, "name", "IssueKey");
    			attr_dev(input0, "id", "IssueKey");
    			attr_dev(input0, "placeholder", "Enter IssueKey");
    			add_location(input0, file, 208, 9, 7943);
    			attr_dev(label1, "for", "Severity");
    			attr_dev(label1, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label1, file, 233, 10, 8562);
    			attr_dev(div6, "class", "select-container");
    			add_location(div6, file, 234, 10, 8662);
    			attr_dev(div7, "class", "mb-0");
    			add_location(div7, file, 232, 9, 8533);
    			attr_dev(label2, "for", "Priority");
    			attr_dev(label2, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label2, file, 241, 10, 8861);
    			attr_dev(div8, "class", "select-container");
    			add_location(div8, file, 242, 10, 8961);
    			add_location(div9, file, 240, 9, 8845);
    			attr_dev(label3, "for", "Summary");
    			attr_dev(label3, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label3, file, 249, 9, 9150);
    			attr_dev(textarea0, "class", "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 mb-5 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none");
    			attr_dev(textarea0, "name", "Summary");
    			attr_dev(textarea0, "id", "Summary");
    			attr_dev(textarea0, "cols", "30");
    			attr_dev(textarea0, "rows", "5");
    			attr_dev(textarea0, "placeholder", "Enter story summary");
    			add_location(textarea0, file, 250, 9, 9247);
    			attr_dev(label4, "for", "Description");
    			attr_dev(label4, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label4, file, 273, 9, 9880);
    			attr_dev(textarea1, "class", "form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none");
    			attr_dev(textarea1, "name", "Description");
    			attr_dev(textarea1, "id", "Description");
    			attr_dev(textarea1, "cols", "30");
    			attr_dev(textarea1, "rows", "5");
    			attr_dev(textarea1, "placeholder", "Enter story description");
    			add_location(textarea1, file, 274, 9, 9985);
    			attr_dev(form, "id", "historyForm");
    			add_location(form, file, 206, 8, 7811);
    			attr_dev(section0, "class", "");
    			add_location(section0, file, 205, 7, 7784);
    			attr_dev(div10, "class", "md:w-2/5 mt-16 px-6");
    			add_location(div10, file, 204, 6, 7742);
    			attr_dev(label5, "for", "fileUpload");
    			attr_dev(label5, "class", "form-label inline-block mb-1 text-gray-700");
    			add_location(label5, file, 308, 11, 11354);
    			attr_dev(div11, "class", "flex flex-row items-center");
    			add_location(div11, file, 307, 10, 11302);
    			attr_dev(input1, "class", "form-control block w-fit px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none");
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "id", "fileUpload");
    			attr_dev(input1, "name", "file");
    			attr_dev(input1, "accept", ".csv");
    			add_location(input1, file, 313, 10, 11909);
    			add_location(div12, file, 306, 9, 11286);
    			attr_dev(div13, "class", "flex-col flex justify-center items-center mt-44");
    			add_location(div13, file, 305, 8, 11215);
    			attr_dev(section1, "class", "flex items-center justify-center");
    			add_location(section1, file, 304, 7, 11156);
    			attr_dev(div14, "class", "px-52 sm:px-6 w-3/5");
    			add_location(div14, file, 303, 6, 11115);
    			attr_dev(div15, "class", "flex flex-wrap");
    			add_location(div15, file, 203, 5, 7707);
    			add_location(div16, file, 202, 4, 7696);
    			attr_dev(div17, "class", "mt-4 w-2/3");
    			add_location(div17, file, 201, 3, 7667);
    			attr_dev(div18, "class", "flex flex-wrap");
    			add_location(div18, file, 181, 2, 7007);
    			attr_dev(main, "class", "flex-grow z-20");
    			add_location(main, file, 180, 1, 6975);
    			attr_dev(div19, "class", "w-0 h-0 left-0 bottom-0 border-t-0 border-l-0 border-r-[250px] border-b-[250px] border-solid border-b-[#023185] border-x-transparent border-t-transparent absolute z-0");
    			add_location(div19, file, 380, 3, 15458);
    			attr_dev(a4, "href", "javascript:void(0)");
    			attr_dev(a4, "class", "text-gray-600 ml-1");
    			attr_dev(a4, "rel", "noopener noreferrer");
    			attr_dev(a4, "target", "_blank");
    			add_location(a4, file, 385, 4, 15888);
    			attr_dev(p1, "class", "text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4 z-20");
    			add_location(p1, file, 383, 3, 15701);
    			attr_dev(path4, "d", "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z");
    			add_location(path4, file, 391, 5, 16322);
    			attr_dev(svg2, "fill", "currentColor");
    			attr_dev(svg2, "stroke-linecap", "round");
    			attr_dev(svg2, "stroke-linejoin", "round");
    			attr_dev(svg2, "stroke-width", "2");
    			attr_dev(svg2, "class", "w-5 h-5");
    			attr_dev(svg2, "viewBox", "0 0 24 24");
    			add_location(svg2, file, 390, 4, 16191);
    			attr_dev(a5, "class", "text-gray-500");
    			add_location(a5, file, 389, 4, 16161);
    			attr_dev(path5, "d", "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z");
    			add_location(path5, file, 397, 5, 16643);
    			attr_dev(svg3, "fill", "currentColor");
    			attr_dev(svg3, "stroke-linecap", "round");
    			attr_dev(svg3, "stroke-linejoin", "round");
    			attr_dev(svg3, "stroke-width", "2");
    			attr_dev(svg3, "class", "w-5 h-5");
    			attr_dev(svg3, "viewBox", "0 0 24 24");
    			add_location(svg3, file, 396, 4, 16512);
    			attr_dev(a6, "class", "ml-3 text-gray-500");
    			add_location(a6, file, 395, 4, 16477);
    			attr_dev(rect, "width", "20");
    			attr_dev(rect, "height", "20");
    			attr_dev(rect, "x", "2");
    			attr_dev(rect, "y", "2");
    			attr_dev(rect, "rx", "5");
    			attr_dev(rect, "ry", "5");
    			add_location(rect, file, 403, 5, 17079);
    			attr_dev(path6, "d", "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01");
    			add_location(path6, file, 404, 5, 17147);
    			attr_dev(svg4, "fill", "none");
    			attr_dev(svg4, "stroke", "currentColor");
    			attr_dev(svg4, "stroke-linecap", "round");
    			attr_dev(svg4, "stroke-linejoin", "round");
    			attr_dev(svg4, "stroke-width", "2");
    			attr_dev(svg4, "class", "w-5 h-5");
    			attr_dev(svg4, "viewBox", "0 0 24 24");
    			add_location(svg4, file, 402, 4, 16934);
    			attr_dev(a7, "class", "ml-3 text-gray-500");
    			add_location(a7, file, 401, 4, 16899);
    			attr_dev(path7, "stroke", "none");
    			attr_dev(path7, "d", "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z");
    			add_location(path7, file, 410, 5, 17484);
    			attr_dev(circle, "cx", "4");
    			attr_dev(circle, "cy", "4");
    			attr_dev(circle, "r", "2");
    			attr_dev(circle, "stroke", "none");
    			add_location(circle, file, 411, 5, 17606);
    			attr_dev(svg5, "fill", "currentColor");
    			attr_dev(svg5, "stroke", "currentColor");
    			attr_dev(svg5, "stroke-linecap", "round");
    			attr_dev(svg5, "stroke-linejoin", "round");
    			attr_dev(svg5, "stroke-width", "0");
    			attr_dev(svg5, "class", "w-5 h-5");
    			attr_dev(svg5, "viewBox", "0 0 24 24");
    			add_location(svg5, file, 409, 4, 17331);
    			attr_dev(a8, "class", "ml-3 text-gray-500");
    			add_location(a8, file, 408, 4, 17296);
    			attr_dev(span, "class", "inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start z-20");
    			add_location(span, file, 387, 3, 16018);
    			attr_dev(div20, "class", "px-7 py-0 mx-auto flex items-center sm:flex-row flex-col z-50");
    			add_location(div20, file, 379, 2, 15379);
    			attr_dev(footer, "class", "text-gray-600 body-font relative z-20");
    			add_location(footer, file, 378, 1, 15322);
    			attr_dev(body, "class", "flex flex-col h-full");
    			add_location(body, file, 151, 0, 4137);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, body, anchor);
    			append_dev(body, header);
    			append_dev(header, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, a1);
    			append_dev(a1, svg0);
    			append_dev(svg0, g);
    			append_dev(g, path0);
    			append_dev(g, path1);
    			append_dev(a1, t2);
    			append_dev(a1, a0);
    			append_dev(div1, t4);
    			append_dev(div1, nav);
    			append_dev(nav, a2);
    			append_dev(nav, t6);
    			append_dev(nav, a3);
    			append_dev(div1, t8);
    			append_dev(div1, button);
    			append_dev(button, t9);
    			append_dev(button, svg1);
    			append_dev(svg1, path2);
    			append_dev(svg1, path3);
    			append_dev(body, t10);
    			append_dev(body, main);
    			append_dev(main, div18);
    			append_dev(div18, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, h1);
    			append_dev(div2, t12);
    			append_dev(div2, h3);
    			append_dev(div2, t14);
    			append_dev(div2, p0);
    			append_dev(p0, t15);
    			append_dev(p0, br0);
    			append_dev(p0, t16);
    			append_dev(p0, br1);
    			append_dev(p0, t17);
    			append_dev(p0, br2);
    			append_dev(p0, t18);
    			append_dev(div4, t19);
    			append_dev(div4, div3);
    			append_dev(div3, img);
    			append_dev(div18, t20);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, div10);
    			append_dev(div10, section0);
    			append_dev(section0, form);
    			append_dev(form, label0);
    			append_dev(form, t22);
    			append_dev(form, input0);
    			set_input_value(input0, /*issueKeyText*/ ctx[0]);
    			append_dev(form, t23);
    			append_dev(form, div7);
    			append_dev(div7, label1);
    			append_dev(div7, t25);
    			append_dev(div7, div6);
    			mount_component(select0, div6, null);
    			append_dev(form, t26);
    			append_dev(form, div9);
    			append_dev(div9, label2);
    			append_dev(div9, t28);
    			append_dev(div9, div8);
    			mount_component(select1, div8, null);
    			append_dev(form, t29);
    			append_dev(form, label3);
    			append_dev(form, t31);
    			append_dev(form, textarea0);
    			set_input_value(textarea0, /*summaryText*/ ctx[3]);
    			append_dev(form, t32);
    			append_dev(form, label4);
    			append_dev(form, t34);
    			append_dev(form, textarea1);
    			set_input_value(textarea1, /*descriptionText*/ ctx[4]);
    			append_dev(section0, t35);
    			if (if_block0) if_block0.m(section0, null);
    			append_dev(div15, t36);
    			append_dev(div15, div14);
    			append_dev(div14, section1);
    			append_dev(section1, div13);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, label5);
    			append_dev(div11, t38);
    			if (if_block1) if_block1.m(div11, null);
    			append_dev(div12, t39);
    			append_dev(div12, input1);
    			/*input1_binding*/ ctx[28](input1);
    			append_dev(div13, t40);
    			if_block2.m(div13, null);
    			append_dev(div13, t41);
    			if (if_block3) if_block3.m(div13, null);
    			append_dev(div13, t42);
    			if (if_block4) if_block4.m(div13, null);
    			append_dev(div13, t43);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div13, null);
    			}

    			append_dev(body, t44);
    			append_dev(body, footer);
    			append_dev(footer, div20);
    			append_dev(div20, div19);
    			append_dev(div20, t45);
    			append_dev(div20, p1);
    			append_dev(p1, t46);
    			append_dev(p1, a4);
    			append_dev(div20, t48);
    			append_dev(div20, span);
    			append_dev(span, a5);
    			append_dev(a5, svg2);
    			append_dev(svg2, path4);
    			append_dev(span, t49);
    			append_dev(span, a6);
    			append_dev(a6, svg3);
    			append_dev(svg3, path5);
    			append_dev(span, t50);
    			append_dev(span, a7);
    			append_dev(a7, svg4);
    			append_dev(svg4, rect);
    			append_dev(svg4, path6);
    			append_dev(span, t51);
    			append_dev(span, a8);
    			append_dev(a8, svg5);
    			append_dev(svg5, path7);
    			append_dev(svg5, circle);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[21]),
    					listen_dev(textarea0, "input", /*textarea0_input_handler*/ ctx[24]),
    					listen_dev(textarea1, "input", /*textarea1_input_handler*/ ctx[25]),
    					listen_dev(input1, "change", /*change_handler*/ ctx[27], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*issueKeyText*/ 1 && input0.value !== /*issueKeyText*/ ctx[0]) {
    				set_input_value(input0, /*issueKeyText*/ ctx[0]);
    			}

    			const select0_changes = {};

    			if (!updating_value && dirty[0] & /*severityText*/ 2) {
    				updating_value = true;
    				select0_changes.value = /*severityText*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			select0.$set(select0_changes);
    			const select1_changes = {};

    			if (!updating_value_1 && dirty[0] & /*priorityText*/ 4) {
    				updating_value_1 = true;
    				select1_changes.value = /*priorityText*/ ctx[2];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			select1.$set(select1_changes);

    			if (dirty[0] & /*summaryText*/ 8) {
    				set_input_value(textarea0, /*summaryText*/ ctx[3]);
    			}

    			if (dirty[0] & /*descriptionText*/ 16) {
    				set_input_value(textarea1, /*descriptionText*/ ctx[4]);
    			}

    			if (dirty[0] & /*usingForm*/ 8192) show_if_1 = /*usingForm*/ ctx[13]();

    			if (show_if_1) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_8(ctx);
    					if_block0.c();
    					if_block0.m(section0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*files*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_7(ctx);
    					if_block1.c();
    					if_block1.m(div11, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx, dirty)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div13, t41);
    				}
    			}

    			if (/*errorMessage*/ ctx[9]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_3(ctx);
    					if_block3.c();
    					if_block3.m(div13, t42);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (/*calculating*/ ctx[8]) {
    				if (if_block4) ; else {
    					if_block4 = create_if_block_2(ctx);
    					if_block4.c();
    					if_block4.m(div13, t43);
    				}
    			} else if (if_block4) {
    				if_block4.d(1);
    				if_block4 = null;
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block5) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block5 = if_blocks[current_block_type_index];

    					if (!if_block5) {
    						if_block5 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block5.c();
    					} else {
    						if_block5.p(ctx, dirty);
    					}

    					transition_in(if_block5, 1);
    					if_block5.m(div13, null);
    				} else {
    					if_block5 = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);
    			transition_in(if_block5);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			transition_out(if_block5);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(body);
    			destroy_component(select0);
    			destroy_component(select1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*input1_binding*/ ctx[28](null);
    			if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let usingForm;
    	let completeForm;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let blueColor = '#023185';
    	let redColor = '#E3303D';
    	let files;
    	let returnFile;
    	let calculationsOver = false;
    	let calculating = false;
    	let issueKeyText;
    	let severityText;
    	let priorityText;
    	let summaryText;
    	let descriptionText;
    	let errorMessage;
    	let newFileName;
    	let resultOneStory;
    	let tempVar;

    	let severityItems = [
    		{ value: 'Minor', label: 'Minor' },
    		{ value: 'Trivial', label: 'Trivial' },
    		{ value: 'Major', label: 'Major' }
    	];

    	let priorityItems = [
    		{ value: 'Lowest', label: 'Lowest' },
    		{ value: 'Low', label: 'Low' },
    		{ value: 'Medium', label: 'Medium' },
    		{ value: 'High', label: 'High' }
    	];

    	const csrftoken = getCookie('csrftoken');
    	console.log(csrftoken);

    	function uploadHelper(formData, name) {
    		fetch('http://127.0.0.1:8000/calculate/', {
    			method: 'POST',
    			body: formData,
    			headers: { 'X-CSRFToken': csrftoken }
    		}).then(response => {
    			if (response.ok) {
    				if (name != "csvSubmit") {
    					response.json().then(function (estimation) {
    						$$invalidate(10, resultOneStory = estimation['Prediction']);
    						$$invalidate(7, calculationsOver = true);
    						$$invalidate(8, calculating = false);
    					});
    				} else {
    					response.text().then(function (text) {
    						console.log(typeof text);
    						$$invalidate(6, returnFile = text);
    						$$invalidate(7, calculationsOver = true);
    						$$invalidate(8, calculating = false);
    					});
    				}
    			} else {
    				console.error('Error:', response.statusText);

    				response.text().then(function (text) {
    					var obj = JSON.parse(text);
    					$$invalidate(8, calculating = false);
    					$$invalidate(9, errorMessage = obj['Error']);
    				});
    			}
    		}).catch(error => {
    			console.error('Error:', error);
    			$$invalidate(8, calculating = false);
    			$$invalidate(9, errorMessage = error);
    		});
    	}

    	//Uploading file to backend
    	function upload(name) {
    		$$invalidate(8, calculating = true);
    		$$invalidate(6, returnFile = undefined);
    		$$invalidate(10, resultOneStory = undefined);
    		$$invalidate(9, errorMessage = undefined);
    		console.log("Hola");
    		let formData = new FormData();

    		if (name == "csvSubmit") {
    			newFileName = files[0].name.substring(0, files[0].name.lastIndexOf('.')) + "_results.csv";
    			formData.append('dataFile', files[0]);
    			formData.append('fileName', newFileName);
    		} else {
    			formData.append('IssueKey', issueKeyText);
    			formData.append('Severity', severityText.value);
    			formData.append('Priority', priorityText.value);
    			formData.append('Summary', summaryText);
    			formData.append('Description', descriptionText);
    		}

    		formData.append('damName', name);
    		uploadHelper(formData, name);
    	}

    	function downloadCSV() {
    		var blob = new Blob([returnFile]);

    		if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveBlob(blob, newFileName); else {
    			var a = window.document.createElement("a"); // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
    			a.href = window.URL.createObjectURL(blob, { type: "text/plain" });
    			a.download = newFileName;
    			document.body.appendChild(a);
    			a.click(); // IE: "Access is denied"; see: https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
    			document.body.removeChild(a);
    		}
    	}

    	const onFileSelected = e => {
    		$$invalidate(7, calculationsOver = false);

    		if (!e.target.files[0]) {
    			console.log("Something");
    			$$invalidate(5, files = undefined);
    		} else {
    			$$invalidate(5, files = e.target.files);
    			$$invalidate(6, returnFile = undefined);
    		}
    	};

    	function clearFields() {
    		$$invalidate(0, issueKeyText = undefined);
    		$$invalidate(1, severityText = undefined);
    		$$invalidate(2, priorityText = undefined);
    		$$invalidate(3, summaryText = undefined);
    		$$invalidate(4, descriptionText = undefined);
    	}

    	const clearFile = e => {
    		$$invalidate(5, files = undefined);
    		$$invalidate(6, returnFile = undefined);
    		$$invalidate(11, tempVar.value = '', tempVar);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		issueKeyText = this.value;
    		$$invalidate(0, issueKeyText);
    	}

    	function select0_value_binding(value) {
    		severityText = value;
    		$$invalidate(1, severityText);
    	}

    	function select1_value_binding(value) {
    		priorityText = value;
    		$$invalidate(2, priorityText);
    	}

    	function textarea0_input_handler() {
    		summaryText = this.value;
    		$$invalidate(3, summaryText);
    	}

    	function textarea1_input_handler() {
    		descriptionText = this.value;
    		$$invalidate(4, descriptionText);
    	}

    	const click_handler = e => clearFile(e);
    	const change_handler = e => onFileSelected(e);

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tempVar = $$value;
    			$$invalidate(11, tempVar);
    		});
    	}

    	const click_handler_1 = () => upload("csvSubmit");
    	const click_handler_2 = () => upload("formSubmit");

    	$$self.$capture_state = () => ({
    		Selector,
    		Tailwindcss,
    		HelperFunctions,
    		getCookie,
    		Select,
    		Icon,
    		HSplitPane,
    		VSplitPane,
    		Papa: papaparse_min,
    		blueColor,
    		redColor,
    		files,
    		returnFile,
    		calculationsOver,
    		calculating,
    		issueKeyText,
    		severityText,
    		priorityText,
    		summaryText,
    		descriptionText,
    		errorMessage,
    		newFileName,
    		resultOneStory,
    		tempVar,
    		severityItems,
    		priorityItems,
    		csrftoken,
    		uploadHelper,
    		upload,
    		downloadCSV,
    		onFileSelected,
    		clearFields,
    		clearFile,
    		completeForm,
    		usingForm
    	});

    	$$self.$inject_state = $$props => {
    		if ('blueColor' in $$props) blueColor = $$props.blueColor;
    		if ('redColor' in $$props) redColor = $$props.redColor;
    		if ('files' in $$props) $$invalidate(5, files = $$props.files);
    		if ('returnFile' in $$props) $$invalidate(6, returnFile = $$props.returnFile);
    		if ('calculationsOver' in $$props) $$invalidate(7, calculationsOver = $$props.calculationsOver);
    		if ('calculating' in $$props) $$invalidate(8, calculating = $$props.calculating);
    		if ('issueKeyText' in $$props) $$invalidate(0, issueKeyText = $$props.issueKeyText);
    		if ('severityText' in $$props) $$invalidate(1, severityText = $$props.severityText);
    		if ('priorityText' in $$props) $$invalidate(2, priorityText = $$props.priorityText);
    		if ('summaryText' in $$props) $$invalidate(3, summaryText = $$props.summaryText);
    		if ('descriptionText' in $$props) $$invalidate(4, descriptionText = $$props.descriptionText);
    		if ('errorMessage' in $$props) $$invalidate(9, errorMessage = $$props.errorMessage);
    		if ('newFileName' in $$props) newFileName = $$props.newFileName;
    		if ('resultOneStory' in $$props) $$invalidate(10, resultOneStory = $$props.resultOneStory);
    		if ('tempVar' in $$props) $$invalidate(11, tempVar = $$props.tempVar);
    		if ('severityItems' in $$props) $$invalidate(14, severityItems = $$props.severityItems);
    		if ('priorityItems' in $$props) $$invalidate(15, priorityItems = $$props.priorityItems);
    		if ('completeForm' in $$props) $$invalidate(12, completeForm = $$props.completeForm);
    		if ('usingForm' in $$props) $$invalidate(13, usingForm = $$props.usingForm);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*issueKeyText, severityText, priorityText, summaryText, descriptionText*/ 31) {
    			$$invalidate(13, usingForm = () => {
    				return issueKeyText || severityText || priorityText || summaryText || descriptionText;
    			});
    		}

    		if ($$self.$$.dirty[0] & /*issueKeyText, severityText, priorityText, summaryText, descriptionText*/ 31) {
    			$$invalidate(12, completeForm = () => {
    				return issueKeyText && severityText && priorityText && summaryText && descriptionText;
    			});
    		}
    	};

    	return [
    		issueKeyText,
    		severityText,
    		priorityText,
    		summaryText,
    		descriptionText,
    		files,
    		returnFile,
    		calculationsOver,
    		calculating,
    		errorMessage,
    		resultOneStory,
    		tempVar,
    		completeForm,
    		usingForm,
    		severityItems,
    		priorityItems,
    		upload,
    		downloadCSV,
    		onFileSelected,
    		clearFields,
    		clearFile,
    		input0_input_handler,
    		select0_value_binding,
    		select1_value_binding,
    		textarea0_input_handler,
    		textarea1_input_handler,
    		click_handler,
    		change_handler,
    		input1_binding,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
