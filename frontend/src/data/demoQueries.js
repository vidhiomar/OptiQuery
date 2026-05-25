export const demoQueries = [
  {
    category: "Beginner mistake",
    name: "Bad Function Usage",
    detail: "Function blocks index-friendly filtering",
    query: "SELECT *\nFROM orders\nWHERE LOWER(customer_name) = 'john';",
  },
  {
    category: "Beginner mistake",
    name: "Full Table Scan",
    detail: "No filter forces broad reads",
    query: "SELECT *\nFROM orders;",
  },
  {
    category: "Analytics query",
    name: "Sorting Bottleneck",
    detail: "ORDER BY needs an index",
    query: "SELECT *\nFROM orders\nORDER BY amount;",
  },
  {
    category: "Enterprise mistake",
    name: "Leading Wildcard",
    detail: "LIKE '%...' defeats indexes",
    query: "SELECT *\nFROM orders\nWHERE customer_name LIKE '%john%';",
  },
  {
    category: "ORM mistake",
    name: "Unfiltered Join",
    detail: "Missing WHERE on joined tables",
    query: "SELECT o.*, c.segment\nFROM orders o\nJOIN customers c ON o.customer_id = c.id;",
  },
];
