/**
 * Simple markdown-like text formatter
 */
export class TextFormatter {
  static format(text, format = "text") {
    switch (format) {
      case "markdown":
        return TextFormatter.formatMarkdown(text);
      case "code":
        return TextFormatter.formatCode(text);
      default:
        return TextFormatter.escapeHtml(text);
    }
  }

  static formatMarkdown(text) {
    let formatted = TextFormatter.escapeHtml(text);

    // Headers
    formatted = formatted.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    formatted = formatted.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    formatted = formatted.replace(/^### (.+)$/gm, "<h3>$1</h3>");

    // Bold
    formatted = formatted.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic
    formatted = formatted.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Inline code
    formatted = formatted.replace(/`(.+?)`/g, "<code>$1</code>");

    // Lists
    formatted = formatted.replace(/^- (.+)$/gm, "<li>$1</li>");
    formatted = formatted.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    // Line breaks
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
  }

  static formatCode(text) {
    const escaped = TextFormatter.escapeHtml(text);
    return `<pre><code>${escaped}</code></pre>`;
  }

  static escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
