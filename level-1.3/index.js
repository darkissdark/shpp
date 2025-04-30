document.addEventListener("DOMContentLoaded", function () {
  showTask();

  const config1 = {
    parent: "#usersTable",
    columns: [
      { title: "Ім’я", value: "name" },
      { title: "Прізвище", value: "surname" },
      { title: "Вік", value: "age" },
    ],
  };

  const users = [
    { id: 30050, name: "Вася", surname: "Петров", age: 12 },
    { id: 30051, name: "Вася", surname: "Васечкін", age: 15 },
  ];

  DataTable(config1, users);

  new Tabulator("#tabulator", {
    data: users,
    layout: "fitColumns",
    columns: config1.columns.map((col) => ({
      title: col.title,
      field: col.value,
    })),
  });
});

function showTask() {
  document.querySelectorAll(".task.active").forEach((task) => {
    task.classList.remove("active");
  });

  const selectedTaskId = document.getElementById("taskSelector").value;
  document.getElementById(selectedTaskId).classList.add("active");
}

function DataTable(config, data) {
  const parent = document.querySelector(config.parent);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  parent.appendChild(table);
  table.appendChild(thead);
  thead.appendChild(tr);
  table.appendChild(tbody);

  config.columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column.title;
    th.classList.add("sortable");

    addSortListener(th, column, data, tbody, config);

    tr.appendChild(th);
  });

  renderTableBody(data, tbody, config);
}

function addSortListener(th, column, data, tbody, config) {
  th.addEventListener("click", () => {
    const isAsc = !th.classList.contains("asc");

    const getSorter = (val) =>
      typeof val === "number"
        ? (a, b) => a - b
        : (a, b) => String(a).localeCompare(String(b), "uk");

    const sortedData = [...data].sort((a, b) => {
      const sorter = getSorter(a[column.value]);
      return isAsc
        ? sorter(a[column.value], b[column.value])
        : sorter(b[column.value], a[column.value]);
    });

    document.querySelectorAll(".sortable").forEach((header) => {
      header.classList.remove("asc", "desc");
    });
    th.classList.add(isAsc ? "asc" : "desc");

    tbody.innerHTML = "";
    renderTableBody(sortedData, tbody, config);
  });
}

function renderTableBody(data, tbody, config) {
  data.forEach((row) => {
    const tr = document.createElement("tr");
    config.columns.forEach((column) => {
      const td = document.createElement("td");
      td.textContent = row[column.value];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
