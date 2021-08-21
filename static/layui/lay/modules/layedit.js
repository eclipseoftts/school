/**

 @Name：Kz.layedit 富文本编辑器
 @Author：贤心
 @Modifier:KnifeZ
 @License：MIT
 @Version: V18.11.16
 */
"use strict";
function style_html(t, e, i, n) {
    function a() {
        return this.pos = 0,
            this.token = "",
            this.current_mode = "CONTENT",
            this.tags = {
                parent: "parent1",
                parentcount: 1,
                parent1: ""
            },
            this.tag_type = "",
            this.token_text = this.last_token = this.last_text = this.token_type = "",
            this.Utils = {
                whitespace: "\n\r\t ".split(""),
                single_token: "br,input,link,meta,!doctype,basefont,base,area,hr,wbr,param,img,isindex,?xml,embed".split(","),
                extra_liners: "head,body,/html".split(","),
                in_array: function(t, e) {
                    for (var i = 0; i < e.length; i++) if (t === e[i]) return ! 0;
                    return ! 1
                }
            },
            this.get_content = function() {
                for (var t = "",
                         e = [], i = !1;
                     "<" !== this.input.charAt(this.pos);) {
                    if (this.pos >= this.input.length) return e.length ? e.join("") : ["", "TK_EOF"];
                    if (t = this.input.charAt(this.pos), this.pos++, this.line_char_count++, this.Utils.in_array(t, this.Utils.whitespace)) e.length && (i = !0),
                        this.line_char_count--;
                    else {
                        if (i) {
                            if (this.line_char_count >= this.max_char) {
                                e.push("\n");
                                for (var n = 0; n < this.indent_level; n++) e.push(this.indent_string);
                                this.line_char_count = 0
                            } else e.push(" "),
                                this.line_char_count++;
                            i = !1
                        }
                        e.push(t)
                    }
                }
                return e.length ? e.join("") : ""
            },
            this.get_script = function() {
                var t = "",
                    e = [],
                    i = new RegExp("<\/script>", "igm");
                i.lastIndex = this.pos;
                for (var n = i.exec(this.input), a = n ? n.index: this.input.length; this.pos < a;) {
                    if (this.pos >= this.input.length) return e.length ? e.join("") : ["", "TK_EOF"];
                    t = this.input.charAt(this.pos),
                        this.pos++,
                        e.push(t)
                }
                return e.length ? e.join("") : ""
            },
            this.record_tag = function(t) {
                this.tags[t + "count"] ? (this.tags[t + "count"]++, this.tags[t + this.tags[t + "count"]] = this.indent_level) : (this.tags[t + "count"] = 1, this.tags[t + this.tags[t + "count"]] = this.indent_level),
                    this.tags[t + this.tags[t + "count"] + "parent"] = this.tags.parent,
                    this.tags.parent = t + this.tags[t + "count"]
            },
            this.retrieve_tag = function(t) {
                if (this.tags[t + "count"]) {
                    for (var e = this.tags.parent; e && t + this.tags[t + "count"] !== e;) e = this.tags[e + "parent"];
                    e && (this.indent_level = this.tags[t + this.tags[t + "count"]], this.tags.parent = this.tags[e + "parent"]),
                        delete this.tags[t + this.tags[t + "count"] + "parent"],
                        delete this.tags[t + this.tags[t + "count"]],
                        1 == this.tags[t + "count"] ? delete this.tags[t + "count"] : this.tags[t + "count"]--
                }
            },
            this.get_tag = function() {
                var t = "",
                    e = [],
                    i = !1;
                do {
                    if (this.pos >= this.input.length) return e.length ? e.join("") : ["", "TK_EOF"];
                    t = this.input.charAt(this.pos), this.pos++, this.line_char_count++, this.Utils.in_array(t, this.Utils.whitespace) ? (i = !0, this.line_char_count--) : ("'" !== t && '"' !== t || e[1] && "!" === e[1] || (t += this.get_unformatted(t), i = !0), "=" === t && (i = !1), e.length && "=" !== e[e.length - 1] && ">" !== t && i && (this.line_char_count >= this.max_char ? (this.print_newline(!1, e), this.line_char_count = 0) : (e.push(" "), this.line_char_count++), i = !1), e.push(t))
                } while (">" !== t );
                var n, a = e.join("");
                n = -1 != a.indexOf(" ") ? a.indexOf(" ") : a.indexOf(">");
                var l = a.substring(1, n).toLowerCase();
                if ("/" === a.charAt(a.length - 2) || this.Utils.in_array(l, this.Utils.single_token)) this.tag_type = "SINGLE";
                else if ("script" === l) this.record_tag(l),
                    this.tag_type = "SCRIPT";
                else if ("style" === l) this.record_tag(l),
                    this.tag_type = "STYLE";
                else if ("!" === l.charAt(0)) if ( - 1 != l.indexOf("[if")) {
                    if ( - 1 != a.indexOf("!IE")) {
                        var o = this.get_unformatted("--\x3e", a);
                        e.push(o)
                    }
                    this.tag_type = "START"
                } else if ( - 1 != l.indexOf("[endif")) this.tag_type = "END",
                    this.unindent();
                else if ( - 1 != l.indexOf("[cdata[")) {
                    var o = this.get_unformatted("]]>", a);
                    e.push(o),
                        this.tag_type = "SINGLE"
                } else {
                    var o = this.get_unformatted("--\x3e", a);
                    e.push(o),
                        this.tag_type = "SINGLE"
                } else "/" === l.charAt(0) ? (this.retrieve_tag(l.substring(1)), this.tag_type = "END") : (this.record_tag(l), this.tag_type = "START"),
                this.Utils.in_array(l, this.Utils.extra_liners) && this.print_newline(!0, this.output);
                return e.join("")
            },
            this.get_unformatted = function(t, e) {
                if (e && -1 != e.indexOf(t)) return "";
                var i = "",
                    n = "",
                    a = !0;
                do {
                    if (i = this.input.charAt(this.pos), this.pos++, this.Utils.in_array(i, this.Utils.whitespace)) {
                        if (!a) {
                            this.line_char_count--;
                            continue
                        }
                        if ("\n" === i || "\r" === i) {
                            n += "\n";
                            for (var l = 0; l < this.indent_level; l++) n += this.indent_string;
                            a = !1,
                                this.line_char_count = 0;
                            continue
                        }
                    }
                    n += i, this.line_char_count++, a = !0
                } while ( - 1 == n . indexOf ( t ));
                return n
            },
            this.get_token = function() {
                var t;
                if ("TK_TAG_SCRIPT" === this.last_token) {
                    var e = this.get_script();
                    return "string" != typeof e ? e: (t = js_beautify(e, this.indent_size, this.indent_character, this.indent_level), [t, "TK_CONTENT"])
                }
                if ("CONTENT" === this.current_mode) return t = this.get_content(),
                    "string" != typeof t ? t: [t, "TK_CONTENT"];
                if ("TAG" === this.current_mode) {
                    if ("string" != typeof(t = this.get_tag())) return t;
                    return [t, "TK_TAG_" + this.tag_type]
                }
            },
            this.printer = function(t, e, i, n) {
                this.input = t || "",
                    this.output = [],
                    this.indent_character = e || " ",
                    this.indent_string = "",
                    this.indent_size = i || 2,
                    this.indent_level = 0,
                    this.max_char = n || 7e3,
                    this.line_char_count = 0;
                for (var a = 0; a < this.indent_size; a++) this.indent_string += this.indent_character;
                this.print_newline = function(t, e) {
                    if (this.line_char_count = 0, e && e.length) {
                        if (!t) for (; this.Utils.in_array(e[e.length - 1], this.Utils.whitespace);) e.pop();
                        e.push("\n");
                        for (var i = 0; i < this.indent_level; i++) e.push(this.indent_string)
                    }
                },
                    this.print_token = function(t) {
                        this.output.push(t)
                    },
                    this.indent = function() {
                        this.indent_level++
                    },
                    this.unindent = function() {
                        this.indent_level > 0 && this.indent_level--
                    }
            },
            this
    }
    var a, l;
    l = new a,
        l.printer(t, i, e);
    for (var o = !0;;) {
        var s = l.get_token();
        if (l.token_text = s[0], l.token_type = s[1], "TK_EOF" === l.token_type) break;
        switch (l.token_type) {
            case "TK_TAG_START":
            case "TK_TAG_SCRIPT":
            case "TK_TAG_STYLE":
                l.print_newline(!1, l.output),
                    l.print_token(l.token_text),
                    l.indent(),
                    l.current_mode = "CONTENT";
                break;
            case "TK_TAG_END":
                o && l.print_newline(!0, l.output),
                    l.print_token(l.token_text),
                    l.current_mode = "CONTENT",
                    o = !0;
                break;
            case "TK_TAG_SINGLE":
                l.print_newline(!1, l.output),
                    l.print_token(l.token_text),
                    l.current_mode = "CONTENT";
                break;
            case "TK_CONTENT":
                "" !== l.token_text && (o = !1, l.print_token(l.token_text)),
                    l.current_mode = "TAG"
        }
        l.last_token = l.token_type,
            l.last_text = l.token_text
    }
    return l.output.join("")
}
function js_beautify(t, e, i, n) {
    function a() {
        for (; p.length && (" " === p[p.length - 1] || p[p.length - 1] === T);) p.pop()
    }
    function l(t) {
        if (t = void 0 === t || t, a(), p.length) {
            "\n" === p[p.length - 1] && t || p.push("\n");
            for (var e = 0; e < n; e++) p.push(T)
        }
    }
    function o() {
        var t = p.length ? p[p.length - 1] : " ";
        " " !== t && "\n" !== t && t !== T && p.push(" ")
    }
    function s() {
        p.push(m)
    }
    function r() {
        n++
    }
    function c() {
        n && n--
    }
    function u(t) {
        x.push(_),
            _ = t
    }
    function d() {
        L = "DO_BLOCK" === _,
            _ = x.pop()
    }
    function f(t, e) {
        for (var i = 0; i < e.length; i++) if (e[i] === t) return ! 0;
        return ! 1
    }
    function y() {
        var t = 0,
            e = "";
        do {
            if (K >= h.length) return ["", "TK_EOF"];
            e = h.charAt(K), K += 1, "\n" === e && (t += 1)
        } while ( f ( e , k ));
        if (t > 1) for (var i = 0; i < 2; i++) l(0 === i);
        var n = 1 === t;
        if (f(e, E)) {
            if (K < h.length) for (; f(h.charAt(K), E) && (e += h.charAt(K), (K += 1) !== h.length););
            if (K !== h.length && e.match(/^[0-9]+[Ee]$/) && "-" === h.charAt(K)) {
                K += 1;
                return e += "-" + y(K)[0],
                    [e, "TK_WORD"]
            }
            return "in" === e ? [e, "TK_OPERATOR"] : [e, "TK_WORD"]
        }
        if ("(" === e || "[" === e) return [e, "TK_START_EXPR"];
        if (")" === e || "]" === e) return [e, "TK_END_EXPR"];
        if ("{" === e) return [e, "TK_START_BLOCK"];
        if ("}" === e) return [e, "TK_END_BLOCK"];
        if (";" === e) return [e, "TK_END_COMMAND"];
        if ("/" === e) {
            var a = "";
            if ("*" === h.charAt(K)) {
                if ((K += 1) < h.length) for (; ("*" !== h.charAt(K) || !h.charAt(K + 1) || "/" !== h.charAt(K + 1)) && K < h.length && (a += h.charAt(K), !((K += 1) >= h.length)););
                return K += 2,
                    ["/*" + a + "*/", "TK_BLOCK_COMMENT"]
            }
            if ("/" === h.charAt(K)) {
                for (a = e;
                     "\r" !== h.charAt(K) && "\n" !== h.charAt(K) && (a += h.charAt(K), !((K += 1) >= h.length)););
                return K += 1,
                n && l(),
                    [a, "TK_COMMENT"]
            }
        }
        if ("'" === e || '"' === e || "/" === e && ("TK_WORD" === g && "return" === b || "TK_START_EXPR" === g || "TK_END_BLOCK" === g || "TK_OPERATOR" === g || "TK_EOF" === g || "TK_END_COMMAND" === g)) {
            var o = e,
                s = !1;
            if (e = "", K < h.length) for (; (s || h.charAt(K) !== o) && (e += h.charAt(K), s = !s && "\\" === h.charAt(K), !((K += 1) >= h.length)););
            return K += 1,
            "TK_END_COMMAND" === g && l(),
                [o + e + o, "TK_STRING"]
        }
        if (f(e, C)) {
            for (; K < h.length && f(e + h.charAt(K), C) && (e += h.charAt(K), !((K += 1) >= h.length)););
            return [e, "TK_OPERATOR"]
        }
        return [e, "TK_UNKNOWN"]
    }
    var h, p, m, g, b, v, _, x, T, k, E, C, K, O, N, A, w, L, R, S;
    for (i = i || " ", e = e || 4, T = ""; e--;) T += i;
    for (h = t, v = "", g = "TK_START_EXPR", b = "", p = [], L = !1, R = !1, S = !1, k = "\n\r\t ".split(""), E = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split(""), C = "+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! !! , : ? ^ ^= |=".split(" "), O = "continue,try,throw,return,var,if,switch,case,default,for,while,break,function".split(","), _ = "BLOCK", x = [_], n = n || 0, K = 0, N = !1;;) {
        var M = y(K);
        if (m = M[0], "TK_EOF" === (w = M[1])) break;
        switch (w) {
            case "TK_START_EXPR":
                R = !1,
                    u("EXPRESSION"),
                "TK_END_EXPR" === g || "TK_START_EXPR" === g || ("TK_WORD" !== g && "TK_OPERATOR" !== g ? o() : f(v, O) && "function" !== v && o()),
                    s();
                break;
            case "TK_END_EXPR":
                s(),
                    d();
                break;
            case "TK_START_BLOCK":
                u("do" === v ? "DO_BLOCK": "BLOCK"),
                "TK_OPERATOR" !== g && "TK_START_EXPR" !== g && ("TK_START_BLOCK" === g ? l() : o()),
                    s(),
                    r();
                break;
            case "TK_END_BLOCK":
                "TK_START_BLOCK" === g ? (a(), c()) : (c(), l()),
                    s(),
                    d();
                break;
            case "TK_WORD":
                if (L) {
                    o(),
                        s(),
                        o();
                    break
                }
                if ("case" === m || "default" === m) {
                    ":" === b ?
                        function() {
                            p.length && p[p.length - 1] === T && p.pop()
                        } () : (c(), l(), r()),
                        s(),
                        N = !0;
                    break
                }
                A = "NONE",
                    "TK_END_BLOCK" === g ? f(m.toLowerCase(), ["else", "catch", "finally"]) ? (A = "SPACE", o()) : A = "NEWLINE": "TK_END_COMMAND" !== g || "BLOCK" !== _ && "DO_BLOCK" !== _ ? "TK_END_COMMAND" === g && "EXPRESSION" === _ ? A = "SPACE": "TK_WORD" === g ? A = "SPACE": "TK_START_BLOCK" === g ? A = "NEWLINE": "TK_END_EXPR" === g && (o(), A = "NEWLINE") : A = "NEWLINE",
                    "TK_END_BLOCK" !== g && f(m.toLowerCase(), ["else", "catch", "finally"]) ? l() : f(m, O) || "NEWLINE" === A ? "else" === b ? o() : ("TK_START_EXPR" !== g && "=" !== b || "function" !== m) && ("TK_WORD" !== g || "return" !== b && "throw" !== b ? "TK_END_EXPR" !== g ? "TK_START_EXPR" === g && "var" === m || ":" === b || ("if" === m && "TK_WORD" === g && "else" === v ? o() : l()) : f(m, O) && ")" !== b && l() : o()) : "SPACE" === A && o(),
                    s(),
                    v = m,
                "var" === m && (R = !0, S = !1);
                break;
            case "TK_END_COMMAND":
                s(),
                    R = !1;
                break;
            case "TK_STRING":
                "TK_START_BLOCK" === g || "TK_END_BLOCK" === g ? l() : "TK_WORD" === g && o(),
                    s();
                break;
            case "TK_OPERATOR":
                var D = !0,
                    I = !0;
                if (R && "," !== m && (S = !0, ":" === m && (R = !1)), ":" === m && N) {
                    s(),
                        l();
                    break
                }
                if (N = !1, "," === m) {
                    R ? S ? (s(), l(), S = !1) : (s(), o()) : "TK_END_BLOCK" === g ? (s(), l()) : "BLOCK" === _ ? (s(), l()) : (s(), o());
                    break
                }
                "--" === m || "++" === m ? ";" === b ? (D = !0, I = !1) : (D = !1, I = !1) : "!" === m && "TK_START_EXPR" === g ? (D = !1, I = !1) : "TK_OPERATOR" === g ? (D = !1, I = !1) : "TK_END_EXPR" === g ? (D = !0, I = !0) : "." === m ? (D = !1, I = !1) : ":" === m && (D = !!b.match(/^\d+$/)),
                D && o(),
                    s(),
                I && o();
                break;
            case "TK_BLOCK_COMMENT":
                l(),
                    s(),
                    l();
                break;
            case "TK_COMMENT":
                o(),
                    s(),
                    l();
                break;
            case "TK_UNKNOWN":
                s()
        }
        g = w,
            b = m
    }
    return p.join("")
}
layui.define(["layer", "form"],
    function(t) {
        var e = layui.$,
            i = layui.layer,
            n = layui.form,
            a = (layui.hint(), layui.device()),
            l = "layui-disabled",
            o = function() {
                var t = this;
                t.index = 0,
                    t.config = {
                        tool: ["strong", "italic", "underline", "del", "|", "left", "center", "right", "|", "link", "unlink", "face", "image"],
                        uploadImage: {
                            url: "",
                            accept: "image",
                            acceptMime: "image/*",
                            exts: "jpg|png|gif|bmp|jpeg",
                            size: "10240"
                        },
                        uploadVideo: {
                            url: "",
                            accept: "video",
                            acceptMime: "video/*",
                            exts: "mp4|flv|avi|rm|rmvb",
                            size: "20480"
                        },
                        calldel: {
                            url: ""
                        },
                        quote: {
                            style: [],
                            js: []
                        },
                        devmode: !1,
                        hideTool: [],
                        height: 280
                    }
            };
        o.prototype.set = function(t) {
            var i = this;
            return e.extend(!0, i.config, t),
                i
        },
            o.prototype.on = function(t, e) {
                return layui.onevent("layedit", t, e)
            },
            o.prototype.build = function(t, i) {
                i = i || {};
                var n = this,
                    l = n.config,
                    o = "layui-layedit",
                    r = e("string" == typeof t ? "#" + t: t),
                    c = "LAY_layedit_" + ++n.index,
                    u = r.next("." + o),
                    d = e.extend({},
                        l, i),
                    f = function() {
                        var t = [],
                            e = {};
                        return layui.each(d.hideTool,
                            function(t, i) {
                                e[i] = !0
                            }),
                            layui.each(d.tool,
                                function(i, n) {
                                    k[n] && !e[n] && t.push(k[n])
                                }),
                            t.join("")
                    } (),
                    y = e(['<div class="' + o + '">', '<div class="layui-unselect layui-layedit-tool">' + f + "</div>", '<div class="layui-layedit-iframe">', '<iframe id="' + c + '" name="' + c + '" textarea="' + t + '" frameborder="0"></iframe>', "</div>", "</div>"].join(""));
                return a.ie && a.ie < 8 ? r.removeClass("layui-hide").addClass("layui-show") : (u[0] && u.remove(), s.call(n, y, r[0], d), r.addClass("layui-hide").after(y), n.index)
            },
            o.prototype.getContent = function(t) {
                var e = r(t);
                if (e[0]) return c(e[0].document.body.innerHTML)
            },
            o.prototype.getText = function(t) {
                var i = r(t);
                if (i[0]) return e(i[0].document.body).text()
            },
            o.prototype.setContent = function(t, i, n) {
                var a = r(t);
                a[0] && (n ? e(a[0].document.body).append(i) : e(a[0].document.body).html(i), this.sync(t))
            },
            o.prototype.sync = function(t) {
                var i = r(t);
                if (i[0]) {
                    e("#" + i[1].attr("textarea")).val(c(i[0].document.body.innerHTML))
                }
            },
            o.prototype.getSelection = function(t) {
                var e = r(t);
                if (e[0]) {
                    var i = f(e[0].document);
                    return document.selection ? i.text: i.toString()
                }
            };
        var s = function(t, i, n) {
                var a = this,
                    l = t.find("iframe");
                l.css({
                    height: n.height
                }).on("load",
                    function() {
                        var o = l.contents(),
                            s = l.prop("contentWindow"),
                            r = o.find("head"),
                            c = e(["<style>", "*{margin: 0; padding: 0;}", "body{padding: 10px; line-height: 20px; overflow-x: hidden; word-wrap: break-word; font: 14px Helvetica Neue,Helvetica,PingFang SC,Microsoft YaHei,Tahoma,Arial,sans-serif; -webkit-box-sizing: border-box !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;}", "a{color:#01AAED; text-decoration:none;}a:hover{color:#c00}", "p{margin-bottom: 10px;}", "video{max-width:400px;}", '.anchor:after{content:"¿";background-color:yellow;color: red;font - weight: bold;}', "img{display: inline-block; border: none; vertical-align: middle;}", "pre{margin: 10px 0; padding: 10px; line-height: 20px; border: 1px solid #ddd; border-left-width: 6px; background-color: #F2F2F2; color: #333; font-family: Courier New; font-size: 12px;}", "</style>"].join("")),
                            d = o.find("body");
                        r.append(c),
                            d.attr("contenteditable", "true").css({
                                "min-height": n.height
                            }).html(i.value || ""),
                            u.apply(a, [s, l, i, n]),
                            m.call(a, s, t, n)
                    })
            },
            r = function(t) {
                var i = e("#LAY_layedit_" + t);
                return [i.prop("contentWindow"), i]
            },
            c = function(t) {
                return 8 == a.ie && (t = t.replace(/<.+>/g,
                    function(t) {
                        return t.toLowerCase()
                    })),
                    t
            },
            u = function(t, n, l, o) {
                var s = t.document,
                    r = e(s.body);
                r.on("keydown",
                    function(t) {
                        if (13 === t.keyCode) {
                            var e = f(s),
                                n = y(e),
                                a = n.parentNode;
                            if ("pre" === a.tagName.toLowerCase()) {
                                if (t.shiftKey) return;
                                return i.msg("请暂时用shift+enter"),
                                    !1
                            }
                            "body" === a.tagName.toLowerCase() && s.execCommand("formatBlock", !1, "<p>")
                        }
                    }),
                    e(l).parents("form").on("submit",
                        function() {
                            var t = r.html();
                            8 == a.ie && (t = t.replace(/<.+>/g,
                                function(t) {
                                    return t.toLowerCase()
                                })),
                                l.value = t
                        }),
                    r.on("paste",
                        function(e) {
                            s.execCommand("formatBlock", !1, "<p>"),
                                setTimeout(function() {
                                        d.call(t, r),
                                            l.value = r.html()
                                    },
                                    100)
                        })
            },
            d = function(t) {
                var i = this;
                i.document;
                t.find("*[style]").each(function() {
                    var t = this.style.textAlign;
                    this.removeAttribute("style"),
                        e(this).css({
                            "text-align": t || ""
                        })
                }),
                    t.find("script,link").remove()
            },
            f = function(t) {
                return t.selection ? t.selection.createRange() : t.getSelection().getRangeAt(0)
            },
            y = function(t) {
                return t.endContainer || t.parentElement().childNodes[0]
            },
            h = function(t, i, n) {
                var a = this.document,
                    l = document.createElement(t);
                for (var o in i) l.setAttribute(o, i[o]);
                if (l.removeAttribute("text"), a.selection) {
                    var s = n.text || i.text;
                    if ("a" === t && !s) return;
                    s && (l.innerHTML = s),
                        n.pasteHTML(e(l).prop("outerHTML")),
                        n.select()
                } else {
                    var s = n.toString() || i.text;
                    if ("a" === t && !s) return;
                    s && (l.innerHTML = s),
                        n.deleteContents(),
                        n.insertNode(l)
                }
            },
            p = function(t, i) {
                var n = this.document,
                    a = "layedit-tool-active",
                    o = y(f(n)),
                    s = function(e) {
                        return t.find(".layedit-tool-" + e)
                    };
                i && i[i.hasClass(a) ? "removeClass": "addClass"](a),
                    t.find(">i").removeClass(a),
                    s("unlink").addClass(l),
                    e(o).parents().each(function() {
                        var t = this.tagName.toLowerCase(),
                            e = this.style.textAlign;
                        "p" === t && ("center" === e ? s("center").addClass(a) : "right" === e ? s("right").addClass(a) : s("left").addClass(a)),
                        "a" === t && (s("link").addClass(a), s("unlink").removeClass(l))
                    })
            },
            m = function(t, n, a) {
                var o = t.document,
                    s = e(o.body),
                    r = {
                        link: function(i) {
                            var n = y(i),
                                l = e(n).parent();
                            g.call(s, {
                                    href: l.attr("href"),
                                    target: l.attr("target"),
                                    rel: l.attr("rel"),
                                    text: l.attr("text"),
                                    dmode: a.devmode
                                },
                                function(e) {
                                    var n = l[0];
                                    "A" === n.tagName ? (n.href = e.url, n.rel = e.rel, n.text = e.text) : h.call(t, "a", {
                                            target: e.target,
                                            href: e.url,
                                            rel: e.rel,
                                            text: e.text
                                        },
                                        i)
                                })
                        },
                        unlink: function(t) {
                            o.execCommand("unlink")
                        },
                        face: function(e) {
                            v.call(this,
                                function(i) {
                                    h.call(t, "img", {
                                            src: i.src,
                                            alt: i.alt
                                        },
                                        e)
                                })
                        },
                        image: function(n) {
                            var l = this;
                            layui.use("upload",
                                function(o) {
                                    var s = a.uploadImage || {};
                                    o.render({
                                        url: s.url,
                                        method: s.type,
                                        accept: s.accept,
                                        acceptMime: s.acceptMime,
                                        exts: s.exts,
                                        size: s.size,
                                        elem: e(l).find("input")[0],
                                        done: function(e) {
                                            0 == e.code ? (e.data = e.data || {},
                                                h.call(t, "img", {
                                                        src: e.data.src,
                                                        alt: e.data.title
                                                    },
                                                    n)) : i.msg(e.msg || "上传失败")
                                        }
                                    })
                                })
                        },
                        code: function(e) {
                            var i = a.codeConfig || {
                                hide: !1
                            };
                            T.call(s, {
                                    hide: i.hide,
                                    default:
                                    i.
                                        default
                                },
                                function(i) {
                                    h.call(t, "pre", {
                                            text: i.code,
                                            "lay-lang": i.lang
                                        },
                                        e)
                                })
                        },
                        image_alt: function(e) {
                            i.open({
                                type: 1,
                                id: "fly-jie-image-upload",
                                title: "图片管理",
                                shade: !1,
                                area: "485px",
                                offset: "100px",
                                skin: "layui-layer-border",
                                content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">', '<li class="layui-form-item">', '<label class="layui-form-label">图片</label>', '<button type="button" class="layui-btn" id="LayEdit_InsertImage"> <i class="layui-icon"></i>上传图片</button>', '<input type="text" name="Imgsrc" placeholder="请选择文件" style="width: 49%;position: relative;float: right;" class="layui-input">', "</li>", '<li class="layui-form-item">', '<label class="layui-form-label">描述</label>', '<input type="text" required name="altStr" placeholder="alt属性" style="width: 75%;" value="" class="layui-input">', "</li>", '<li class="layui-form-item">', '<label class="layui-form-label">宽度</label>', '<input type="text" required name="imgWidth" placeholder="width" style="width: 25%;position: relative;float: left;" value="" class="layui-input">', '<label class="layui-form-label">高度</label>', '<input type="text" required name="imgHeight" placeholder="height" style="width: 25%;" value="" class="layui-input">', "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit  class="layui-btn layedit-btn-yes"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</li>", "</ul>"].join(""),
                                success: function(n, l) {
                                    layui.use("upload",
                                        function(o) {
                                            var s, o = layui.upload,
                                                r = n.find('input[name="altStr"]'),
                                                c = n.find('input[name="Imgsrc"]'),
                                                u = a.uploadImage || {};
                                            o.render({
                                                elem: "#LayEdit_InsertImage",
                                                url: u.url,
                                                method: u.type,
                                                accept: u.accept,
                                                acceptMime: u.acceptMime,
                                                exts: u.exts,
                                                size: u.size,
                                                before: function(t) {
                                                    s = i.msg("文件上传中,请稍等哦", {
                                                        icon: 16,
                                                        shade: .3,
                                                        time: 0
                                                    })
                                                },
                                                done: function(t, e, n) {
                                                    if (i.close(s), 0 == t.code) t.data = t.data || {},
                                                        c.val(t.data.src),
                                                        r.val(t.data.name);
                                                    else var a = i.open({
                                                        type: 1,
                                                        anim: 2,
                                                        icon: 5,
                                                        title: "提示",
                                                        area: ["390px", "260px"],
                                                        offset: "t",
                                                        content: t.msg + "<div style='text-align:center;'><img src='" + t.data.src + "' style='max-height:80px'/></div><p style='text-align:center'>确定使用该文件吗？</p>",
                                                        btn: ["确定", "取消"],
                                                        yes: function() {
                                                            t.data = t.data || {},
                                                                c.val(t.data.src),
                                                                r.val(t.data.name),
                                                                i.close(a)
                                                        },
                                                        btn2: function() {
                                                            i.close(a)
                                                        }
                                                    })
                                                }
                                            }),
                                                n.find(".layui-btn-primary").on("click",
                                                    function() {
                                                        i.close(l)
                                                    }),
                                                n.find(".layedit-btn-yes").on("click",
                                                    function() {
                                                        var a = "";
                                                        "" != n.find('input[name="imgWidth"]').val() && (a += "width:" + n.find('input[name="imgWidth"]').val() + ";"),
                                                        "" != n.find('input[name="imgHeight"]').val() && (a += "height:" + n.find('input[name="imgHeight"]').val() + ";"),
                                                            h.call(t, "img", {
                                                                    src: c.val(),
                                                                    alt: r.val(),
                                                                    style: a
                                                                },
                                                                e),
                                                            i.close(l)
                                                    })
                                        })
                                }
                            })
                        },
                        video: function(n) {
                            i.open({
                                type: 1,
                                id: "fly-jie-video-upload",
                                title: "视频",
                                shade: !1,
                                area: "600px",
                                offset: "100px",
                                skin: "layui-layer-border",
                                content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">', '<li class="layui-form-item">', '<button type="button" class="layui-btn" id="LayEdit_InsertVideo"> <i class="layui-icon"></i>上传视频</button>', '<input type="text" name="video" placeholder="请选择文件" style="width: 79%;position: relative;float: right;" class="layui-input">', "</li>", '<li class="layui-form-item">', '<button type="button" class="layui-btn" id="LayEdit_InsertImage"> <i class="layui-icon"></i>上传封面</button>', '<input type="text" name="cover" placeholder="请选择文件" style="width: 79%;position: relative;float: right;" class="layui-input">', "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit  class="layui-btn layedit-btn-yes"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</li>", "</ul>"].join(""),
                                success: function(l, o) {
                                    layui.use("upload",
                                        function(s) {
                                            var r, c = l.find('input[name="video"]'),
                                                u = l.find('input[name="cover"]'),
                                                s = layui.upload,
                                                d = a.uploadImage || {},
                                                f = a.uploadVideo || {};
                                            s.render({
                                                elem: "#LayEdit_InsertImage",
                                                url: d.url,
                                                method: d.type,
                                                accept: d.accept,
                                                acceptMime: d.acceptMime,
                                                exts: d.exts,
                                                size: d.size,
                                                before: function(t) {
                                                    r = i.msg("文件上传中,请稍等哦", {
                                                        icon: 16,
                                                        shade: .3,
                                                        time: 0
                                                    })
                                                },
                                                done: function(t, e, n) {
                                                    if (i.close(r), 0 == t.code) t.data = t.data || {},
                                                        u.val(t.data.src);
                                                    else var a = i.open({
                                                        type: 1,
                                                        anim: 2,
                                                        icon: 5,
                                                        title: "提示",
                                                        area: ["390px", "260px"],
                                                        offset: "t",
                                                        content: t.msg + "<div><img src='" + t.data.src + "' style='max-height:100px'/></div><label class='layui-form-label'>确定使用该文件吗？</label>",
                                                        btn: ["确定", "取消"],
                                                        yes: function() {
                                                            t.data = t.data || {},
                                                                u.val(t.data.src),
                                                                i.close(a)
                                                        },
                                                        btn2: function() {
                                                            i.close(a)
                                                        }
                                                    })
                                                }
                                            }),
                                                s.render({
                                                    elem: "#LayEdit_InsertVideo",
                                                    url: f.url,
                                                    accept: f.accept,
                                                    acceptMime: f.acceptMime,
                                                    exts: f.exts,
                                                    size: f.size,
                                                    before: function(t) {
                                                        r = i.msg("文件上传中,请稍等哦", {
                                                            icon: 16,
                                                            shade: .3,
                                                            time: 0
                                                        })
                                                    },
                                                    done: function(t, e, n) {
                                                        if (i.close(r), 0 == t.code) t.data = t.data || {},
                                                            c.val(t.data.src);
                                                        else var a = i.open({
                                                            type: 1,
                                                            anim: 2,
                                                            icon: 5,
                                                            title: "提示",
                                                            area: ["390px", "260px"],
                                                            offset: "t",
                                                            content: t.msg + "<div><video src='" + t.data.src + "' style='max-height:100px' controls='controls'/></div>确定使用该文件吗？",
                                                            btn: ["确定", "取消"],
                                                            yes: function() {
                                                                t.data = t.data || {},
                                                                    c.val(t.data.src),
                                                                    i.close(a)
                                                            },
                                                            btn2: function() {
                                                                i.close(a)
                                                            }
                                                        })
                                                    }
                                                }),
                                                l.find(".layui-btn-primary").on("click",
                                                    function() {
                                                        i.close(o)
                                                    }),
                                                l.find(".layedit-btn-yes").on("click",
                                                    function() {
                                                        var a = y(n);
                                                        e(a).parent();
                                                        h.call(t, "p", {
                                                                text: '&nbsp;<video src="' + c.val() + '" poster="' + u.val() + '" controls="controls" >您的浏览器不支持video播放</video>&nbsp;'
                                                            },
                                                            n),
                                                            i.close(o)
                                                    })
                                        })
                                }
                            })
                        },
                        html: function(e) {
                            var n = this,
                                a = n.parentElement.nextElementSibling.firstElementChild.contentDocument.body.innerHTML;
                            a = style_html(a, 4, " ", 80),
                                i.open({
                                    type: 1,
                                    id: "knife-z-html",
                                    title: "源码模式",
                                    shade: .3,
                                    area: ["1366px", "700px"],
                                    offset: "0px",
                                    content: ['<div id ="aceHtmleditor" style="width:100%;height:80%"></div>', '<div style="text-align:center">', '<button type="button" class="layui-btn layedit-btn-yes"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</div>"].join(""),
                                    success: function(e, n) {
                                        var l = ace.edit("aceHtmleditor");
                                        l.setFontSize(14),
                                            l.session.setMode("ace/mode/html"),
                                            l.setTheme("ace/theme/tomorrow"),
                                            l.setValue(a),
                                            l.setOption("wrap", "free"),
                                            l.gotoLine(0),
                                            e.find(".layui-btn-primary").on("click",
                                                function() {
                                                    i.close(n)
                                                }),
                                            e.find(".layedit-btn-yes").on("click",
                                                function() {
                                                    t.document.body.innerHTML = l.getValue(),
                                                        i.close(n)
                                                }),
                                            window.onresize = function() {
                                                l.resize()
                                            }
                                    }
                                })
                        },
                        fullScreen: function(t) {
                            null == this.parentElement.parentElement.getAttribute("style") ? (this.parentElement.parentElement.setAttribute("style", "position: fixed;top: 0;left: 0;height: 100%;width: 100%;background-color: antiquewhite;z-index: 9999;"), this.parentElement.nextElementSibling.style = "height:100%", this.parentElement.nextElementSibling.firstElementChild.style = "height:100%") : (this.parentElement.parentElement.removeAttribute("style"), this.parentElement.nextElementSibling.removeAttribute("style"), this.parentElement.nextElementSibling.firstElementChild.style = "height:" + a.height)
                        },
                        colorpicker: function(t) {
                            _.call(this,
                                function(t) {
                                    o.execCommand("forecolor", !1, t),
                                        setTimeout(function() {
                                                s.focus()
                                            },
                                            10)
                                })
                        },
                        fontFomatt: function(t) {
                            var e = a.fontFomatt || {
                                    code: ["p", "h1", "h2", "h3", "h4", "div"],
                                    text: ["正文(p)", "一级标题(h1)", "二级标题(h2)", "三级标题(h3)", "四级标题(h4)", "块级元素(div)"]
                                },
                                i = {},
                                n = {},
                                l = e.code,
                                r = e.text,
                                c = function() {
                                    return layui.each(l,
                                        function(t, e) {
                                            i[t] = e
                                        }),
                                        i
                                } (),
                                u = function() {
                                    return layui.each(r,
                                        function(t, e) {
                                            n[t] = e
                                        }),
                                        n
                                } ();
                            x.call(this, {
                                    fonts: c,
                                    texts: u
                                },
                                function(t) {
                                    o.execCommand("formatBlock", !1, "<" + t + ">"),
                                        setTimeout(function() {
                                                s.focus()
                                            },
                                            10)
                                })
                        },
                        anchors: function(e) {
                            b.call(s, {},
                                function(i) {
                                    h.call(t, "a", {
                                            name: "#" + i.text,
                                            text: " ",
                                            class: "anchor"
                                        },
                                        e)
                                })
                        },
                        addhr: function(e) {
                            h.call(t, "hr", {},
                                e)
                        },
                        help: function() {
                            i.open({
                                type: 2,
                                title: "帮助",
                                area: ["600px", "380px"],
                                shadeClose: !0,
                                shade: .1,
                                offset: "100px",
                                skin: "layui-layer-msg",
                                content: ["http://www.layui.com/about/layedit/help.html", "no"]
                            })
                        }
                    },
                    c = n.find(".layui-layedit-tool"),
                    u = function() {
                        var i = e(this),
                            n = i.attr("layedit-event"),
                            a = i.attr("lay-command");
                        if (!i.hasClass(l)) {
                            s.focus();
                            var u = f(o),
                                d = u.commonAncestorContainer;
                            a ? (/justifyLeft|justifyCenter|justifyRight/.test(a) && "BODY" === d.parentNode.tagName && o.execCommand("formatBlock", !1, "<p>"), o.execCommand(a), setTimeout(function() {
                                    s.focus()
                                },
                                10)) : r[n] && r[n].call(this, u, o),
                                p.call(t, c, i)
                        }
                    },
                    d = /image/;
                c.find(">i").on("mousedown",
                    function() {
                        var t = e(this),
                            i = t.attr("layedit-event");
                        d.test(i) || u.call(this)
                    }).on("click",
                    function() {
                        var t = e(this),
                            i = t.attr("layedit-event");
                        d.test(i) && u.call(this)
                    }),
                    s.on("click",
                        function() {
                            p.call(t, c),
                                i.close(v.index),
                                i.close(_.index),
                                i.close(x.index)
                        }),
                    s.on("contextmenu",
                        function(t) {
                            if (null != t) switch (t.target.tagName) {
                                case "IMG":
                                    i.open({
                                        type:
                                            1,
                                        title: !1,
                                        area: "485px",
                                        offset: [t.clientY + "px", t.clientX + "px"],
                                        shadeClose: !0,
                                        content: ['<ul class="layui-form layui-form-pane" style="margin: 20px;">', '<li class="layui-form-item">', '<label class="layui-form-label">图片</label>', '<button type="button" class="layui-btn" id="LayEdit_UpdateImage"> <i class="layui-icon"></i>上传图片</button>', '<input type="text" name="Imgsrc" placeholder="请选择文件" style="width: 49%;position: relative;float: right;" value="' + t.target.src + '" class="layui-input">', "</li>", '<li class="layui-form-item">', '<label class="layui-form-label">描述</label>', '<input type="text" required name="altStr" placeholder="alt属性" style="width: 75%;" value="' + t.target.alt + '" class="layui-input">', "</li>", "</li>", '<li class="layui-form-item">', '<label class="layui-form-label">宽度</label>', '<input type="text" required name="imgWidth" placeholder="width" style="width: 25%;position: relative;float: left;" value="' + t.target.width + '" class="layui-input">', '<label class="layui-form-label">高度</label>', '<input type="text" required name="imgHeight" placeholder="height" style="width: 25%;" value="' + t.target.height + '" class="layui-input">', "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit  class="layui-btn layedit-btn-yes"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', '<button type="button" class="layui-btn layui-btn-danger" > 删除 </button>', "</li>", "</ul>"].join(""),
                                        success: function(n, l) {
                                            var o = a.uploadImage || {};
                                            return layui.use("upload",
                                                function(t) {
                                                    var e, a = n.find('input[name="altStr"]'),
                                                        l = n.find('input[name="Imgsrc"]');
                                                    t = layui.upload,
                                                        t.render({
                                                            elem: "#LayEdit_UpdateImage",
                                                            url: o.url,
                                                            method: o.type,
                                                            accept: o.accept,
                                                            acceptMime: o.acceptMime,
                                                            exts: o.exts,
                                                            size: o.size,
                                                            before: function(t) {
                                                                e = i.msg("文件上传中,请稍等哦", {
                                                                    icon: 16,
                                                                    shade: .3,
                                                                    time: 0
                                                                })
                                                            },
                                                            done: function(t, n, o) {
                                                                if (i.close(e), 0 == t.code) t.data = t.data || {},
                                                                    l.val(t.data.src),
                                                                    a.val(t.data.name);
                                                                else var s = i.open({
                                                                    type: 1,
                                                                    anim: 2,
                                                                    icon: 5,
                                                                    title: "提示",
                                                                    area: ["390px", "260px"],
                                                                    offset: "t",
                                                                    content: t.msg + "<div style='text-align:center;'><img src='" + t.data.src + "' style='max-height:80px'/></div><p style='text-align:center'>确定使用该文件吗？</p>",
                                                                    btn: ["确定", "取消"],
                                                                    yes: function() {
                                                                        t.data = t.data || {},
                                                                            l.val(t.data.src),
                                                                            a.val(t.data.name),
                                                                            i.close(s)
                                                                    },
                                                                    btn2: function() {
                                                                        i.close(s)
                                                                    }
                                                                })
                                                            }
                                                        })
                                                }),
                                                n.find(".layui-btn-primary").on("click",
                                                    function() {
                                                        i.close(l)
                                                    }),
                                                n.find(".layedit-btn-yes").on("click",
                                                    function() {
                                                        t.target.src = n.find('input[name="Imgsrc"]').val(),
                                                            t.target.alt = n.find('input[name="altStr"]').val(),
                                                            t.target.width = n.find('input[name="imgWidth"]').val(),
                                                            t.target.height = n.find('input[name="imgHeight"]').val(),
                                                            i.close(l)
                                                    }),
                                                n.find(".layui-btn-danger").on("click",
                                                    function() {
                                                        var n = a.calldel;
                                                        "" != n.url ? e.post(n.url, {
                                                                imgpath: t.target.src
                                                            },
                                                            function(e) {
                                                                t.toElement.remove()
                                                            }) : t.toElement.remove(),
                                                            i.close(l)
                                                    }),
                                                !1
                                        }
                                    });
                                    break;
                                default:
                                    var n = t.toElement,
                                        l = t.toElement.parentNode;
                                    i.open({
                                        type: 1,
                                        title: !1,
                                        offset: [t.clientY + "px", t.clientX + "px"],
                                        shadeClose: !0,
                                        content: ['<ul style="width:100px">', '<li><a type="button" class="layui-btn layui-btn-primary layui-btn-sm" style="width:80%" lay-command="left"> 居左 </a></li>', '<li><a type="button" class="layui-btn layui-btn-primary layui-btn-sm" style="width:80%" lay-command="center"> 居中 </a></li>', '<li><a type="button" class="layui-btn layui-btn-primary layui-btn-sm" style="width:80%" lay-command="right"> 居右 </a></li>', '<li><a type="button" class="layui-btn layui-btn-danger layui-btn-sm"  style="width:80%"> 删除 </a></li>', "</ul>"].join(""),
                                        success: function(o, s) {
                                            var r = a.calldel;
                                            o.find(".layui-btn-primary").on("click",
                                                function() {
                                                    var t = e(this),
                                                        a = t.attr("lay-command");
                                                    a && ("VIDEO" == n.tagName ? l.style = "text-align:" + a: n.style = "text-align:" + a),
                                                        i.close(s)
                                                }),
                                                o.find(".layui-btn-danger").on("click",
                                                    function() {
                                                        "BODY" == n.tagName ? i.msg("不能再删除了") : "VIDEO" == n.tagName ? "" != r.url ? e.post(r.url, {
                                                                filepath: t.target.src,
                                                                imgpath: t.target.poster
                                                            },
                                                            function(t) {
                                                                l.remove()
                                                            }) : l.remove() : "IMG" == n.tagName && "" != r.url ? e.post(r.url, {
                                                                para: t.target.src
                                                            },
                                                            function(t) {
                                                                n.remove()
                                                            }) : n.remove(),
                                                            i.close(s)
                                                    })
                                        }
                                    })
                            }
                            return ! 1
                        })
            },
            g = function t(e, a) {
                var l = e.dmode,
                    o = this,
                    s = i.open({
                        type: 1,
                        id: "LAY_layedit_link",
                        area: "460px",
                        offset: "100px",
                        shade: .05,
                        shadeClose: !0,
                        moveType: 1,
                        title: "超链接",
                        skin: "layui-layer-msg",
                        content: ['<ul class="layui-form" style="margin: 15px;">', '<li class="layui-form-item">', '<label class="layui-form-label" style="width: 70px;">链接地址</label>', '<div class="layui-input-block">', '<input name="url" value="' + (e.href || "") + '" autofocus="true" autocomplete="off" class="layui-input">', "</div>", "</li>", '<li class="layui-form-item">', '<label class="layui-form-label" style="width: 70px;">链接文本</label>', '<div class="layui-input-block">', '<input name="text" value="' + (e.text || "") + '" autofocus="true" autocomplete="off" class="layui-input">', "</div>", "</li>", '<li class="layui-form-item layui-hide">', '<label class="layui-form-label" style="width: 70px;">打开方式</label>', '<div class="layui-input-block">', '<input type="radio" name="target" value="_blank" class="layui-input" title="新窗口" ' + ("_blank" !== e.target && e.target ? "": "checked") + ">", '<input type="radio" name="target" value="_self" class="layui-input" title="当前窗口"' + ("_self" === e.target ? "checked": "") + ">", "</div>", "</li>", '<li class="layui-form-item layui-hide">', '<label class="layui-form-label" style="width: 70px;">rel属性</label>', '<div class="layui-input-block">', '<input type="radio" name="rel" value="nofollow" class="layui-input" title="nofollow"' + ("nofollow" !== e.rel && e.target ? "": "checked") + ">", '<input type="radio" name="rel" value="" class="layui-input" title="无" ' + ("" === e.rel ? "checked": "") + ">", "</div>", "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</li>", "</ul>"].join(""),
                        success: function(e, s) {
                            l && e.find(".layui-hide").removeClass("layui-hide");
                            n.render("radio"),
                                e.find(".layui-btn-primary").on("click",
                                    function() {
                                        i.close(s),
                                            setTimeout(function() {
                                                    o.focus()
                                                },
                                                10)
                                    }),
                                n.on("submit(layedit-link-yes)",
                                    function(e) {
                                        i.close(t.index),
                                        a && a(e.field)
                                    })
                        }
                    });
                t.index = s
            },
            b = function t(e, a) {
                var l = this,
                    o = i.open({
                        type: 1,
                        id: "LAY_layedit_addmd",
                        area: "300px",
                        offset: "100px",
                        shade: .05,
                        shadeClose: !0,
                        moveType: 1,
                        title: "添加锚点",
                        skin: "layui-layer-msg",
                        content: ['<ul class="layui-form" style="margin: 15px;">', '<li class="layui-form-item">', '<label class="layui-form-label" style="width: 60px;">名称</label>', '<div class="layui-input-block" style="margin-left: 90px">', '<input name="text" value="' + (e.name || "") + '" autofocus="true" autocomplete="off" class="layui-input">', "</div>", "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit lay-filter="layedit-link-yes" class="layui-btn"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</li>", "</ul>"].join(""),
                        success: function(e, o) {
                            n.render("radio"),
                                e.find(".layui-btn-primary").on("click",
                                    function() {
                                        i.close(o),
                                            setTimeout(function() {
                                                    l.focus()
                                                },
                                                10)
                                    }),
                                n.on("submit(layedit-link-yes)",
                                    function(e) {
                                        i.close(t.index),
                                        a && a(e.field)
                                    })
                        }
                    });
                t.index = o
            },
            v = function t(n) {
                var a = function() {
                    var t = ["[微笑]", "[嘻嘻]", "[哈哈]", "[可爱]", "[可怜]", "[挖鼻]", "[吃惊]", "[害羞]", "[挤眼]", "[闭嘴]", "[鄙视]", "[爱你]", "[泪]", "[偷笑]", "[亲亲]", "[生病]", "[太开心]", "[白眼]", "[右哼哼]", "[左哼哼]", "[嘘]", "[衰]", "[委屈]", "[吐]", "[哈欠]", "[抱抱]", "[怒]", "[疑问]", "[馋嘴]", "[拜拜]", "[思考]", "[汗]", "[困]", "[睡]", "[钱]", "[失望]", "[酷]", "[色]", "[哼]", "[鼓掌]", "[晕]", "[悲伤]", "[抓狂]", "[黑线]", "[阴险]", "[怒骂]", "[互粉]", "[心]", "[伤心]", "[猪头]", "[熊猫]", "[兔子]", "[ok]", "[耶]", "[good]", "[NO]", "[赞]", "[来]", "[弱]", "[草泥马]", "[神马]", "[囧]", "[浮云]", "[给力]", "[围观]", "[威武]", "[奥特曼]", "[礼物]", "[钟]", "[话筒]", "[蜡烛]", "[蛋糕]"],
                        e = {};
                    return layui.each(t,
                        function(t, i) {
                            e[i] = layui.cache.dir + "images/face/" + t + ".gif"
                        }),
                        e
                } ();
                return t.hide = t.hide ||
                    function(n) {
                        "face" !== e(n.target).attr("layedit-event") && i.close(t.index)
                    },
                    t.index = i.tips(function() {
                        var t = [];
                        return layui.each(a,
                            function(e, i) {
                                t.push('<li title="' + e + '"><img src="' + i + '" alt="' + e + '"/></li>')
                            }),
                        '<ul class="layui-clear">' + t.join("") + "</ul>"
                    } (), this, {
                        tips: 1,
                        time: 0,
                        skin: "layui-box layui-util-face",
                        maxWidth: 500,
                        success: function(l, o) {
                            l.css({
                                marginTop: -4,
                                marginLeft: -10
                            }).find(".layui-clear>li").on("click",
                                function() {
                                    n && n({
                                        src: a[this.title],
                                        alt: this.title
                                    }),
                                        i.close(o)
                                }),
                                e(document).off("click", t.hide).on("click", t.hide)
                        }
                    })
            },
            _ = function t(n) {
                var a = function() {
                    var t = ["#fff", "#000", "#800000", "#ffb800", "#1e9fff", "#5fb878", "#ff5722", "#999999", "#01aaed", "#cc0000", "#ff8c00", "#ffd700", "#90ee90", "#00ced1", "#1e90ff", "#c71585", "#00babd", "#ff7800"],
                        e = {};
                    return layui.each(t,
                        function(t, i) {
                            e[i] = i
                        }),
                        e
                } ();
                return t.hide = t.hide ||
                    function(n) {
                        "colorpicker" !== e(n.target).attr("layedit-event") && i.close(t.index)
                    },
                    t.index = i.tips(function() {
                        var t = [];
                        return layui.each(a,
                            function(e, i) {
                                t.push('<li title="' + i + '" style="background-color:' + i + '"><span style="background-' + i + '" alt="' + e + '"/></li>')
                            }),
                        '<ul class="layui-clear">' + t.join("") + "</ul>"
                    } (), this, {
                        tips: 1,
                        time: 0,
                        skin: "layui-box layui-util-face",
                        success: function(a, l) {
                            a.css({
                                marginTop: -4,
                                marginLeft: -10
                            }).find(".layui-clear>li").on("click",
                                function() {
                                    n && n(this.title),
                                        i.close(l)
                                }),
                                e(document).off("click", t.hide).on("click", t.hide)
                        }
                    })
            },
            x = function t(n, a) {
                t.hide = t.hide ||
                    function(n) {
                        "fontFomatt" !== e(n.target).attr("layedit-event") && i.close(t.index)
                    },
                    t.index = i.tips(function() {
                        var t = [];
                        return layui.each(n.fonts,
                            function(e, i) {
                                t.push('<li title="' + n.fonts[e] + '"><' + n.fonts[e] + ">" + n.texts[e] + "</" + n.fonts[e] + "></li>")
                            }),
                        '<ul class="layui-clear" style="width: max-content;">' + t.join("") + "</ul>"
                    } (), this, {
                        tips: 1,
                        time: 0,
                        skin: "layui-box layui-util-font",
                        success: function(l, o) {
                            l.css({
                                marginTop: -4,
                                marginLeft: -10
                            }).find(".layui-clear>li").on("click",
                                function() {
                                    a && a(this.title, n.fonts),
                                        i.close(o)
                                }),
                                e(document).off("click", t.hide).on("click", t.hide)
                        }
                    })
            },
            T = function t(e, a) {
                var l = ['<li class="layui-form-item objSel">', '<label class="layui-form-label">请选择语言</label>', '<div class="layui-input-block">', '<select name="lang">', '<option value="JavaScript">JavaScript</option>', '<option value="HTML">HTML</option>', '<option value="CSS">CSS</option>', '<option value="Java">Java</option>', '<option value="PHP">PHP</option>', '<option value="C#">C#</option>', '<option value="Python">Python</option>', '<option value="Ruby">Ruby</option>', '<option value="Go">Go</option>', "</select>", "</div>", "</li>"].join("");
                e.hide && (l = ['<li class="layui-form-item" style="display:none">', '<label class="layui-form-label">请选择语言</label>', '<div class="layui-input-block">', '<select name="lang">', '<option value="' + e.
                    default + '" selected="selected">', e.
                    default, "</option>", "</select>", "</div>", "</li>"].join(""));
                var o = this,
                    s = i.open({
                        type: 1,
                        id: "LAY_layedit_code",
                        area: "550px",
                        shade: .05,
                        shadeClose: !0,
                        offset: "100px",
                        moveType: 1,
                        title: "插入代码",
                        skin: "layui-layer-msg",
                        content: ['<ul class="layui-form layui-form-pane" style="margin: 15px;">', l, '<li class="layui-form-item layui-form-text">', '<label class="layui-form-label">代码</label>', '<div class="layui-input-block">', '<textarea name="code" lay-verify="required" autofocus="true" class="layui-textarea" style="height: 200px;"></textarea>', "</div>", "</li>", '<li class="layui-form-item" style="text-align: center;">', '<button type="button" lay-submit lay-filter="layedit-code-yes" class="layui-btn"> 确定 </button>', '<button style="margin-left: 20px;" type="button" class="layui-btn layui-btn-primary"> 取消 </button>', "</li>", "</ul>"].join(""),
                        success: function(l, s) {
                            n.render("select"),
                                l.find(".layui-btn-primary").on("click",
                                    function() {
                                        i.close(s),
                                            o.focus()
                                    }),
                                n.on("submit(layedit-code-yes)",
                                    function(n) {
                                        i.close(t.index),
                                        a && a(n.field, e.hide, e.
                                            default)
                                    })
                        }
                    });
                t.index = s
            },
            k = {
                html: '<i class="layui-icon layedit-tool-html" title="HTML源代码"  layedit-event="html"">&#xe64b;</i><span class="layedit-tool-mid"></span>',
                strong: '<i class="layui-icon layedit-tool-b" title="加粗" lay-command="Bold" layedit-event="b"">&#xe62b;</i>',
                italic: '<i class="layui-icon layedit-tool-i" title="斜体" lay-command="italic" layedit-event="i"">&#xe644;</i>',
                underline: '<i class="layui-icon layedit-tool-u" title="下划线" lay-command="underline" layedit-event="u"">&#xe646;</i>',
                del: '<i class="layui-icon layedit-tool-d" title="删除线" lay-command="strikeThrough" layedit-event="d"">&#xe64f;</i>',
                "|": '<span class="layedit-tool-mid"></span>',
                left: '<i class="layui-icon layedit-tool-left" title="左对齐" lay-command="justifyLeft" layedit-event="left"">&#xe649;</i>',
                center: '<i class="layui-icon layedit-tool-center" title="居中对齐" lay-command="justifyCenter" layedit-event="center"">&#xe647;</i>',
                right: '<i class="layui-icon layedit-tool-right" title="右对齐" lay-command="justifyRight" layedit-event="right"">&#xe648;</i>',
                link: '<i class="layui-icon layedit-tool-link" title="插入链接" layedit-event="link"">&#xe64c;</i>',
                unlink: '<i class="layui-icon layedit-tool-unlink layui-disabled" title="清除链接" lay-command="unlink" layedit-event="unlink"" style="font-size:18px">&#xe64d;</i>',
                face: '<i class="layui-icon layedit-tool-face" title="表情" layedit-event="face"" style="font-size:18px">&#xe650;</i>',
                image: '<i class="layui-icon layedit-tool-image" title="图片" layedit-event="image" style="font-size:18px">&#xe64a;<input type="file" name="file"></i>',
                code: '<i class="layui-icon layedit-tool-code" title="插入代码" layedit-event="code" style="font-size:18px">&#xe64e;</i>',
                image_alt: '<i class="layui-icon layedit-tool-image_alt" title="图片" layedit-event="image_alt" style="font-size:18px">&#xe64a;</i>',
                video: '<i class="layui-icon layedit-tool-video" title="插入视频" layedit-event="video" style="font-size:18px">&#xe6ed;</i>',
                fullScreen: '<i class="layui-icon layedit-tool-fullScreen" title="全屏" layedit-event="fullScreen"style="font-size:18px">&#xe638;</i>',
                colorpicker: '<i class="layui-icon layedit-tool-colorpicker" title="字体颜色选择" layedit-event="colorpicker" style="font-size:18px">&#xe66a;</i>',
                fontFomatt: '<i class="layui-icon layedit-tool-fontFomatt" title="段落格式" layedit-event="fontFomatt" style="font-size:18px">&#xe639;</i>',
                fontFamily: '<i class="layui-icon layedit-tool-fontFamily" title="字体" layedit-event="fontFamily" style="font-size:18px">&#xe702;</i>',
                addhr: '<i class="layui-icon layui-icon-chart layedit-tool-addhr" title="添加水平线" layedit-event="addhr" style="font-size:18px"></i>',
                anchors: '<i class="layui-icon layedit-tool-anchors" title="添加锚点" layedit-event="anchors" style="font-size:18px">&#xe60b;</i>',
                help: '<i class="layui-icon layedit-tool-help" title="帮助" layedit-event="help">&#xe607;</i>'
            },
            E = new o;
        n.render(),
            t("layedit", E)
    });