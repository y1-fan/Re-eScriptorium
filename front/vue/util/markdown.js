/**
 * Small, dependency-free Markdown renderer for the note editor.
 *
 * The input is escaped before any formatting is applied, so notes cannot inject
 * raw HTML. Supported syntax: headings, bold, italic, strikethrough, inline
 * code, fenced code blocks, links, ordered/unordered lists, blockquotes,
 * horizontal rules and hard line breaks.
 */

const ESCAPES = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

function safeUrl(url) {
    const value = url.trim();
    if (/^(https?:\/\/|mailto:|\/|#)/i.test(value)) {
        return value;
    }
    return "#";
}

function renderInline(raw) {
    let text = escapeHtml(raw);

    // inline code first, so its content is not formatted further
    const codes = [];
    text = text.replace(/`([^`]+)`/g, (match, code) => {
        codes.push(code);
        return `\u0000${codes.length - 1}\u0000`;
    });

    // links [label](url)
    text = text.replace(
        /\[([^\]]+)\]\(([^)\s]+)\)/g,
        (match, label, url) =>
            `<a href="${escapeHtml(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}</a>`
    );

    text = text
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/__([^_]+)__/g, "<strong>$1</strong>")
        .replace(/~~([^~]+)~~/g, "<del>$1</del>")
        .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
        .replace(/(^|[^_])_([^_\n]+)_/g, "$1<em>$2</em>");

    // restore inline code
    text = text.replace(/\u0000(\d+)\u0000/g, (match, index) => `<code>${codes[index]}</code>`);

    // two trailing spaces or a backslash force a line break
    text = text.replace(/ {2,}\n/g, "<br>\n").replace(/\\\n/g, "<br>\n");
    return text;
}

export default function renderMarkdown(source) {
    if (!source) {
        return "";
    }
    const lines = String(source).replace(/\r\n?/g, "\n").split("\n");
    const html = [];
    let paragraph = [];
    let list = null;
    let inCode = false;
    let code = [];

    const flushParagraph = () => {
        if (paragraph.length) {
            html.push(`<p>${renderInline(paragraph.join("\n"))}</p>`);
            paragraph = [];
        }
    };
    const flushList = () => {
        if (list) {
            const items = list.items
                .map((item) => `<li>${renderInline(item)}</li>`)
                .join("");
            html.push(`<${list.type}>${items}</${list.type}>`);
            list = null;
        }
    };
    const flushAll = () => {
        flushParagraph();
        flushList();
    };

    for (const line of lines) {
        if (/^\s*```/.test(line)) {
            if (inCode) {
                html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
                code = [];
                inCode = false;
            } else {
                flushAll();
                inCode = true;
            }
            continue;
        }
        if (inCode) {
            code.push(line);
            continue;
        }
        if (!line.trim()) {
            flushAll();
            continue;
        }

        let match = /^(#{1,6})\s+(.*)$/.exec(line);
        if (match) {
            flushAll();
            const level = match[1].length;
            html.push(`<h${level}>${renderInline(match[2].trim())}</h${level}>`);
            continue;
        }
        if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) {
            flushAll();
            html.push("<hr>");
            continue;
        }
        match = /^\s*>\s?(.*)$/.exec(line);
        if (match) {
            flushAll();
            html.push(`<blockquote><p>${renderInline(match[1])}</p></blockquote>`);
            continue;
        }
        match = /^\s*[-*+]\s+(.*)$/.exec(line);
        if (match) {
            flushParagraph();
            if (!list || list.type !== "ul") {
                flushList();
                list = { type: "ul", items: [] };
            }
            list.items.push(match[1]);
            continue;
        }
        match = /^\s*\d+[.)]\s+(.*)$/.exec(line);
        if (match) {
            flushParagraph();
            if (!list || list.type !== "ol") {
                flushList();
                list = { type: "ol", items: [] };
            }
            list.items.push(match[1]);
            continue;
        }
        flushList();
        paragraph.push(line);
    }

    if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
    }
    flushAll();
    return html.join("\n");
}
