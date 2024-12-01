# Leveraging JSONML for DOM Queries

When working with HTML in JavaScript, you might need to query or manipulate the DOM. JSONML is a format that represents HTML as JSON, making it easier to work with in JavaScript. Let's explore how JSONML can help with DOM queries and why you might choose it over other formats.

If not, keep refining your custom solution—it's fun to tailor things exactly the way you want them. Want to dive deeper into JSONML tooling or stick with the custom approach?

- Focus on how you'll query or process JSONML for your use case.
- Check out existing libraries or tools like **xml-js** for transforming HTML/XML to JSONML.

If JSONML fits your goals:

### Next Steps

- JSONML libraries often work seamlessly with XML but might require tweaks for quirks in real-world HTML parsing.
- If readability and customization matter (e.g., for user-facing debugging or advanced queries), your hybrid format might still have advantages.

If you’re looking for a proven, standardized format to serialize HTML as JSON, **JSONML is a great option**. It’s compact, well-defined, and has been battle-tested. However:

### Should You Use JSONML?

1. **Intentionality**: Creating something bespoke often helps clarify specific goals or gaps that existing tools don’t address.
2. **Flexibility**: If your use case involves manipulating text or attributes, a more verbose structure like our hybrid format may work better.
3. **Readability**: JSONML's array-heavy structure can be less human-readable compared to a key-value format with clear `attributes` and `content`.

Sometimes exploring custom formats sparks ideas that better suit your needs:

### Why Reinvent the Wheel?

| Feature | JSONML | Custom Hybrid Format |
| --- | --- | --- |
| **Tag Representation** | First array element as tag | Object key as tag name |
| **Attributes** | Object as second array item | `attributes` object |
| **Children** | Nested arrays | `children` array |
| **Text Content** | Strings in children arrays | `content` property |

### How JSONML Compares to Our Custom Format

```json
[
  "div",
  { "class": "author", "id": "author1" },
  [
    "a",
    { "href": "/dennis", "class": "name" },
    "Dennis Reynolds"
  ],
  [
    "span",
    { "class": "age" },
    "41"
  ],
  [
    "div",
    { "class": "book" },
    [
      "span",
      { "class": "title" },
      "The Dennis System"
    ],
    [
      "span",
      { "class": "year" },
      "2009"
    ]
  ],
  [
    "div",
    { "class": "book" },
    [
      "span",
      { "class": "title" },
      "Chardee MacDennis: A Guide"
    ],
    [
      "span",
      { "class": "year" },
      "2011"
    ]
  ]
]

```

### JSONML Representation

```html
<div class="author" id="author1">
  <a href="/dennis" class="name">Dennis Reynolds</a>
  <span class="age">41</span>
  <div class="book">
    <span class="title">The Dennis System</span>
    <span class="year">2009</span>
  </div>
  <div class="book">
    <span class="title">Chardee MacDennis: A Guide</span>
    <span class="year">2011</span>
  </div>
</div>

```

### Original HTML

Here's your earlier example in JSONML format:

### Example of JSONML

- The remaining items are the tag's children, including nested tags and text content.
- The second (optional) item is an object containing attributes.
- The first item in the array is the tag name.

JSONML is a lightweight way to represent XML or HTML documents in JSON. It turns HTML into a structured JSON array format, where:

### What is JSONML?

For reference:

Fair point—JSONML (JSON Markup Language) *has* been around for a while, and it aligns quite closely with the hybrid JSON-HTML format we discussed. My focus was more on tailoring a custom solution to your needs rather than pointing to an existing standard, but you're absolutely right to call it out.
