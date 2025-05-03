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
  apiUrl: "https://mock-api.shpp.me/vmdedvid/users",
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
  apiUrl: "https://mock-api.shpp.me/vmdedvid/products",
};

document.addEventListener("DOMContentLoaded", function () {
  DataTable(config1);
  DataTable(config2);
});

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
  let tableColumns = columns;

  if (!tableData && apiUrl) {
    try {
      const response = await fetchData(apiUrl);
      tableData = Object.entries(response.data).map(([id, value]) => ({
        id,
        ...value,
      }));
    } catch (error) {
      console.error("Error fetching data:", error);
      return;
    }
  }

  tableColumns = [
    ...tableColumns,
    {
      title: "Дії",
      value: (item) =>
        `<button class="remove" data-id="${item.id}">Видалити</button>`,
    },
  ];

  const parentElement = document.querySelector(parent);
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const tr = document.createElement("tr");

  tableColumns.forEach((column) => {
    const th = document.createElement("th");
    th.textContent = column.title;
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  table.appendChild(thead);
  table.appendChild(tbody);
  parentElement.appendChild(table);

  renderTableBody(tableData, tbody, tableColumns, apiUrl);
}

function renderTableBody(data, tbody, tableColumns, apiUrl) {
  data.forEach((row) => {
    const tr = document.createElement("tr");

    tableColumns.forEach((column) => {
      const td = document.createElement("td");
      if (typeof column.value === "function") {
        td.innerHTML = column.value(row);
      } else {
        td.textContent = row[column.value]?.length
          ? row[column.value]
          : noDataMessage;
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  tbody.addEventListener("click", (event) => {
    const target = event.target;
    const tr = target.closest("tr");
    if (target.tagName === "BUTTON" && target.dataset.id.length) {
      deleteItem(target.dataset.id, tr, apiUrl);
    }
  });
}

function deleteItem(id, tr, apiUrl) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      return response.json();
    })
    .then(() => {
      tr.remove();
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
    });
}
