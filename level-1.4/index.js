const noDataMessage = "—";
const config1 = {
  parent: "#usersTable",
  columns: [
    {
      title: "Ім'я",
      value: "name",
      input: { type: "text", name: "name" },
    },
    {
      title: "Прізвище",
      value: "surname",
      input: { type: "text", name: "surname" },
    },
    {
      title: "Вік",
      value: (user) => getAge(user.birthday),
      input: { type: "date", name: "birthday" },
    },
    {
      title: "Фото",
      value: (user) =>
        `<img src="${user.avatar}" alt="${user.name} ${user.surname}"/>`,
      input: {
        type: "url",
        name: "avatar",
        required: true,
        placeholder: "URL",
      },
    },
  ],
  apiUrl: "https://mock-api.shpp.me/vmdedvid/users",
};
const config2 = {
  parent: "#productsTable",
  columns: [
    {
      title: "Назва",
      value: "title",
      input: { type: "text", name: "title" },
    },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        { type: "number", name: "price", label: "Ціна" },
        {
          type: "select",
          name: "currency",
          label: "Валюта",
          options: ["$", "€", "₴"],
        },
      ],
    },
    {
      title: "Колір",
      value: (product) => getColorLabel(product.color),
      input: { type: "color", name: "color" },
    },
  ],
  apiUrl: "https://mock-api.shpp.me/vmdedvid/products",
};

document.addEventListener("DOMContentLoaded", () => {
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

  if (age < 1) {
    if (monthDiff < 1 && dayDiff < 1) return noDataMessage;

    const unit =
      monthDiff < 1 ? ["день", "дні", "днів"] : ["місяць", "місяці", "місяців"];
    const value = monthDiff < 1 ? dayDiff : monthDiff;
    return pluralizeUkrainian(value, unit);
  }

  return pluralizeUkrainian(age, ["рік", "роки", "років"]);
}

function pluralizeUkrainian(count, [one, few, many]) {
  let plural = many;
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) plural = one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) plural = few;
  return `${count} ${plural}`;
}

function getColorLabel(color) {
  return `<span class="square" style="background: ${color}"></span> ${
    ntc.name(color)[1] || noDataMessage
  }`;
}

async function fetchData(apiUrl) {
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function DataTable(config) {
  const { parent, columns, apiUrl, data } = config;
  let tableData = data;

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

  const parentElement = document.querySelector(parent);
  const { table, tbody, addButton } = createTableElement(columns);

  addButton.addEventListener("click", () => showAddForm(config, columns));
  renderTableBody(tableData, tbody, columns, apiUrl);

  parentElement.innerHTML = "";
  parentElement.appendChild(table);
}

function createTableElement(columns) {
  const table = document.createElement("table");

  const caption = document.createElement("caption");
  const addButton = document.createElement("button");
  addButton.textContent = "Додати";
  addButton.className = "add-button";
  caption.appendChild(addButton);
  table.appendChild(caption);

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.title;
    tr.appendChild(th);
  });

  const thActions = document.createElement("th");
  thActions.textContent = "Дії";
  tr.appendChild(thActions);

  thead.appendChild(tr);
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  return { table, tbody, addButton };
}

function renderTableBody(data, tbody, columns, apiUrl) {
  tbody.innerHTML = "";
  data.forEach((row) => {
    const tr = document.createElement("tr");

    columns.forEach((col) => {
      const td = document.createElement("td");

      if (typeof col.value === "function") {
        td.innerHTML = col.value(row);
      } else {
        const cellValue = row[col.value];
        td.innerHTML = cellValue.length ? cellValue : noDataMessage;
      }

      tr.appendChild(td);
    });

    const tdDelete = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Видалити";
    btn.className = "remove";
    btn.dataset.id = row.id;
    tdDelete.appendChild(btn);
    tr.appendChild(tdDelete);

    tbody.appendChild(tr);
  });

  tbody.addEventListener("click", (e) => {
    if (
      e.target.tagName === "BUTTON" &&
      e.target.classList.contains("remove")
    ) {
      const tr = e.target.closest("tr");
      const id = e.target.dataset.id;
      deleteItem(id, tr, apiUrl);
    }
  });
}

function deleteItem(id, tr, apiUrl) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to delete item");
      return response.json();
    })
    .then(() => {
      tr.remove();
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
    });
}

function showAddForm(config, columns) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const form = document.createElement("form");
  form.className = "add-form";
  form.setAttribute("novalidate", true);

  columns.forEach((column) => {
    if (column.input) {
      const inputs = Array.isArray(column.input)
        ? column.input
        : [column.input];

      inputs.forEach((input) => {
        const label = document.createElement("label");
        label.textContent = input.label || column.title;

        if (input.type === "select") {
          const select = document.createElement("select");
          select.name = input.name;
          select.required = input.required !== false;

          input.options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
          });

          label.appendChild(select);
        } else {
          const inputElement = document.createElement("input");
          inputElement.type = input.type;
          inputElement.name = input.name || column.value;
          inputElement.required = input.required !== false;
          if (input.placeholder) inputElement.placeholder = input.placeholder;

          label.appendChild(inputElement);
        }

        form.appendChild(label);
      });
    }
  });

  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.textContent = "Додати";

  form.appendChild(submitButton);
  modal.appendChild(form);
  document.body.appendChild(modal);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {};
    let isValid = true;

    form.querySelectorAll("input, select").forEach((el) => {
      if (el.required && !el.value) {
        el.classList.add("error");
        isValid = false;
      } else {
        el.classList.remove("error");
        data[el.name] = el.value;
      }
    });

    if (!isValid) return;

    try {
      const response = await fetch(config.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to add item");

      const responseData = await fetchData(config.apiUrl);
      const newData = Object.entries(responseData.data).map(([id, value]) => ({
        id,
        ...value,
      }));

      const tbody = document.querySelector(`${config.parent} tbody`);
      renderTableBody(newData, tbody, config.columns, config.apiUrl);

      modal.remove();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}
