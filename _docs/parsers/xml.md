## 1. Overview & Purpose
| Component | Source File |
| :--- | :--- |
| XmlParser | [src/parsers/xml.ts](/src/parsers/xml.ts) |

This component provides a small, forgiving parser capable of reading and structuring XML content, specifically designed to handle formats like COLLADA files. Its primary responsibility is to transform a raw XML string into a structured, in-memory representation defined by the `XmlElement` interface, correctly handling nested elements, attributes, text content, and special XML constructs like comments and CDATA sections.

This parser acts as a foundational data ingestion utility within the application architecture. It takes raw source data and converts it into the `XmlElement` data model, which can then be consumed by higher-level services or components that require structured XML data, such as those found in [Data Processing Services](/services/data_processing.md).

## 2. Public API & Interfaces
| Entity | Type | Description |
| :--- | :--- | :--- |
| `XmlElement` | Interface | Defines the structure for a parsed XML element, including its tag name, attributes, children, and internal text content. |
| `parseXml` | Function | Parses a raw XML string into the root `XmlElement` object. |
| `xmlChild` | Function | Finds the first child element within a given element that matches the specified tag name. |
| `xmlChildren` | Function | Retrieves all child elements within a given element that match the specified tag name. |
| `xmlDescendants` | Function | Recursively finds all descendant elements matching the specified tag name, performing a depth-first traversal. |

## 3. Implementation Details & Side Effects
- **Core Logic:** The `parseXml` function uses a stack-based, iterative approach to process the XML string sequentially. It manages the current parsing context using the `stack` and tracks text segments using `texts`. It handles various XML features (comments, CDATA, processing instructions) by skipping or capturing content appropriately. The `decode` helper function manages entity replacement, while `findTagEnd` correctly locates the closing `>` while respecting quoted attribute values.
- **Side Effects:** None. The function operates purely on the input string and constructs immutable data structures.
- **Error Handling:** The parser is designed to be forgiving. In cases of malformed XML (e.g., missing closing tags), it attempts to close elements based on the stack state, tolerating unclosed children rather than throwing parsing errors.

## 4. Dependencies & Configuration
**Environment & Configuration:**
No environment variables or external configurations required.

**Module Dependencies:**
- **Standard/External:** None.
- **Internal:** None.