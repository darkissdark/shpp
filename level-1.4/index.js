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

  if (birthDate > today) return noDataMessage;

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) age--;

  if (age < 1) {
    const daysDiff = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    if (daysDiff < 30)
      return pluralizeUkrainian(daysDiff, ["день", "дні", "днів"]);
    const monthsDiff = Math.floor(daysDiff / 30);
    return pluralizeUkrainian(monthsDiff, ["місяць", "місяці", "місяців"]);
  }

  return pluralizeUkrainian(age, ["рік", "роки", "років"]);
}

function pluralizeUkrainian(count, [one, few, many]) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${count} ${few}`;
  return `${count} ${many}`;
}

function getColorLabel(color) {
  return `<span class="square" style="background: ${color}"></span> ${
    ntc.name(color)[1] || noDataMessage
  }`;
}

async function fetchData(apiUrl) {
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
}

async function DataTable(config) {
  const { parent, columns, apiUrl } = config;
  if (!config.data && apiUrl) {
    try {
      const response = await fetchData(apiUrl);
      config.data = Object.entries(response.data).map(([id, value]) => ({
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

  addButton.addEventListener("click", () => showForm({ mode: "add", config }));

  tbody.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;

    const id = button.dataset.id;
    const row = config.data?.find((item) => item.id === id);

    if (!row) {
      console.warn("Row not found for id:", id);
      return;
    }

    if (button.classList.contains("remove")) {
      deleteItem(id, button.closest("tr"), config.apiUrl);
    } else if (button.classList.contains("edit")) {
      showForm({ mode: "edit", config, row });
    }
  });

  renderTableBody(config.data, tbody, columns, config);

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
  const headerRow = document.createElement("tr");

  columns.forEach((col) => {
    const th = document.createElement("th");
    th.textContent = col.title;
    headerRow.appendChild(th);
  });

  const thActions = document.createElement("th");
  thActions.textContent = "Дії";
  headerRow.appendChild(thActions);

  thead.appendChild(headerRow);
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  return { table, tbody, addButton };
}

function renderTableBody(data, tbody, columns, config) {
  tbody.innerHTML = "";
  data.forEach((row) => {
    const tr = document.createElement("tr");

    columns.forEach((col) => {
      const td = document.createElement("td");
      const value =
        typeof col.value === "function"
          ? col.value(row)
          : row[col.value] || noDataMessage;
      td.innerHTML = value;
      tr.appendChild(td);
    });

    const tdActions = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Редагувати";
    editBtn.className = "edit";
    editBtn.dataset.id = row.id;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Видалити";
    removeBtn.className = "remove";
    removeBtn.dataset.id = row.id;

    tdActions.append(editBtn, removeBtn);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  });

  config.data = data;

  setTimeout(() => {
    const images = document.querySelectorAll(`table img`);
    images.forEach((img) => {
      img.onerror = function () {
        this.src =
          "https://t4.ftcdn.net/jpg/00/65/77/27/240_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg";
        this.alt = "Image not found";
      };
    });
  }, 0);
}

function deleteItem(id, tr, apiUrl) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to delete item");
      tr.remove();
    })
    .catch((err) => console.error("Error deleting item:", err));
}

function showForm({ mode, config, row = {} }) {
  const { columns, apiUrl, parent } = config;
  const modal = document.createElement("div");
  modal.className = "modal";

  const form = document.createElement("form");
  form.className = `modal-form ${mode}-form`;
  form.setAttribute("novalidate", true);

  columns.forEach((column) => {
    const inputs = Array.isArray(column.input) ? column.input : [column.input];
    inputs.forEach((input) => {
      const label = document.createElement("label");
      label.textContent = input.label || column.title;

      if (input.type === "select") {
        const select = document.createElement("select");
        select.name = input.name;
        select.required = input.required !== false;

        input.options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (row[input.name] === option) opt.selected = true;
          select.appendChild(opt);
        });
        label.appendChild(select);
      } else {
        const inputEl = document.createElement("input");
        inputEl.type = input.type;
        inputEl.name = input.name || column.value;
        inputEl.required = input.required !== false;
        if (input.placeholder) inputEl.placeholder = input.placeholder;

        if (input.type === "date" && row[input.name]) {
          inputEl.value = new Date(row[input.name]).toISOString().split("T")[0];
        } else {
          inputEl.value = row[inputEl.name] || "";
        }

        label.appendChild(inputEl);
      }

      form.appendChild(label);
    });
  });

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = mode === "add" ? "Додати" : "Зберегти";
  form.appendChild(submitBtn);
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
        data[el.name] = el.type === "number" ? parseFloat(el.value) : el.value;
      }
    });

    if (!isValid) return;

    try {
      const url = mode === "edit" ? `${apiUrl}/${row.id}` : apiUrl;
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit form");

      const newDataRaw = await fetchData(apiUrl);
      config.data = Object.entries(newDataRaw.data).map(([id, val]) => ({
        id,
        ...val,
      }));

      const tbody = document.querySelector(`${parent} tbody`);
      renderTableBody(config.data, tbody, columns, config);

      modal.remove();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });
}
