const noDataMessage = "—";
const config1 = {
  parent: "#usersTable",
  columns: [
    { title: "Ім’я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: (user) => getAge(user.birthday) }, // функцію getAge вам потрібно створити
    {
      title: "Фото",
      value: (user) =>
        `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
    },
  ],
  apiUrl: "https://mock-api.shpp.me/<nsurname>/users",
};
const config2 = {
  parent: "#productsTable",
  columns: [
    { title: "Назва", value: "title" },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
    },
    { title: "Колір", value: (product) => getColorLabel(product.color) }, // функцію getColorLabel вам потрібно створити
  ],
  apiUrl: "https://mock-api.shpp.me/<nsurname>/products",
};

document.addEventListener("DOMContentLoaded", function () {
  showTask();
  DataTable(config1);
  DataTable(config2);
});

function showTask() {
  document.querySelectorAll(".task.active").forEach((task) => {
    task.classList.remove("active");
  });

  const selectedTaskId = document.getElementById("taskSelector").value;
  document.getElementById(selectedTaskId).classList.add("active");
}

function getAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age > 0 ? age : noDataMessage;
}

function getColorLabel(color) {
  return ntc.name(color)[1] || noDataMessage;
}

async function fetchData(apiUrl) {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function DataTable(config) {
  const { parent, columns, data, apiUrl } = config;
  let tableData = data;

  if (!tableData && apiUrl) {
    try {
      const response = await fetchData(apiUrl);
      tableData = Object.values(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }

  const parentElement = document.querySelector(parent);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  parentElement.appendChild(table);
  table.appendChild(thead);
  thead.appendChild(tr);
  table.appendChild(tbody);

  columns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column.title;
    th.classList.add("sortable");

    tr.appendChild(th);
  });

  renderTableBody(tableData, tbody, columns);
}

function renderTableBody(data, tbody, columns) {
  data.forEach((row) => {
    const tr = document.createElement("tr");
    columns.forEach((column) => {
      const td = document.createElement("td");
      if (typeof column.value === "function") {
        td.innerHTML = column.value(row);
      } else {
        td.textContent = row[column.value].length
          ? row[column.value]
          : noDataMessage;
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}
