# Table Component with Sorting

This project implements a customizable table component with sorting functionality.

## Features

- Dynamic table generation
- Sortable columns
- Support for different data types (numbers and strings)
- Ukrainian language support for string sorting
- Visual indicators for sort direction

## Structure

The code is organized into three main functions:

### 1. `DataTable(config, data)`
Main function that creates and initializes the table.

**Parameters:**
- `config`: Configuration object containing:
  - `parent`: CSS selector for the table container
  - `columns`: Array of column definitions with `title` and `value` properties
- `data`: Array of objects containing the table data

### 2. `addSortListener(th, column, data, tbody, config)`
Handles sorting functionality for table headers.

**Parameters:**
- `th`: Table header element
- `column`: Column configuration object
- `data`: Array of data objects
- `tbody`: Table body element
- `config`: Table configuration object

**Features:**
- Toggles between ascending and descending sort
- Automatically detects data type (number/string)
- Uses Ukrainian locale for string comparison
- Updates visual indicators

### 3. `renderTableBody(data, tbody, config)`
Renders the table body with the provided data.

**Parameters:**
- `data`: Array of data objects to display
- `tbody`: Table body element
- `config`: Table configuration object

## Usage Example

```javascript
const config = {
  parent: "#tableContainer",
  columns: [
    { title: "Ім'я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: "age" }
  ]
};

const data = [
  { id: 1, name: "Вася", surname: "Петров", age: 12 },
  { id: 2, name: "Петро", surname: "Іванов", age: 15 }
];

DataTable(config, data);
```

## CSS Classes

The table uses the following CSS classes:

- `sortable`: Applied to sortable column headers
- `asc`: Indicates ascending sort
- `desc`: Indicates descending sort

## Dependencies

- None (vanilla JavaScript)
- CSS styles defined in the HTML file 