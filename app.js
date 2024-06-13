let todoList = [];
let currentFilter = "all";
let sortOrder = "asc";
let editMode = false;
let editId = null;

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  if (todo.completed) {
    li.classList.add("completed");
  }
  li.dataset.id = todo.id;

  const header = document.createElement("div");
  header.className = "todo-item-header";

  const checkboxContainer = document.createElement("div");
  checkboxContainer.className = "checkbox";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.addEventListener("change", () => markComplete(todo.id));
  checkboxContainer.appendChild(checkbox);

  header.appendChild(checkboxContainer);

  const title = document.createElement("h2");
  title.textContent = todo.title;
  if (todo.completed) {
    title.style.textDecoration = "line-through";
  }
  header.appendChild(title);

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "button-group";

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-button";
  deleteButton.addEventListener("click", () => deleteTodoItem(todo.id));
  buttonGroup.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.className = "edit-button";
  editButton.addEventListener("click", () => startEditTodoItem(todo.id));
  buttonGroup.appendChild(editButton);

  header.appendChild(buttonGroup);
  li.appendChild(header);

  const description = document.createElement("p");
  const words = todo.description.split(" ");

  if (words.length > 6) {
    const truncatedDescription = words.slice(0, 6).join(" ") + "... ";
    const fullDescription = todo.description;

    description.textContent = truncatedDescription;
    const seeMoreLink = document.createElement("a");
    seeMoreLink.href = "#";
    seeMoreLink.textContent = "See more";
    seeMoreLink.addEventListener("click", (e) => {
      e.preventDefault();
      description.textContent = fullDescription;
      seeMoreLink.remove();
    });

    description.appendChild(seeMoreLink);
  } else {
    description.textContent = todo.description;
  }

  li.appendChild(description);

  const dueDate = document.createElement("p");
  dueDate.textContent = formatDueDate(todo.dueDate);
  li.appendChild(dueDate);

  return li;
}

function renderTodoList() {
  const todoListContainer = document.getElementById("todo-list");
  todoListContainer.innerHTML = "";

  let filteredList = [];

  if (currentFilter === "all") {
    filteredList = todoList;
  } else if (currentFilter === "completed") {
    filteredList = todoList.filter((todo) => todo.completed);
  } else if (currentFilter === "in-progress") {
    filteredList = todoList.filter((todo) => !todo.completed);
  }

  filteredList.sort((a, b) => {
    const dateA = new Date(a.dueDate);
    const dateB = new Date(b.dueDate);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  filteredList.forEach((todo) => {
    const todoElement = createTodoElement(todo);
    todoListContainer.appendChild(todoElement);
  });

  toggleControlsVisibility();
}

function addTodoItem(title, description, dueDate) {
  const newTodo = {
    id: Date.now(),
    title: title,
    description: description,
    dueDate: dueDate,
    completed: false,
  };
  todoList.unshift(newTodo);
  renderTodoList();
}

function deleteTodoItem(id) {
  todoList = todoList.filter((todo) => todo.id !== id);
  renderTodoList();
}

function markComplete(id) {
  const todoIndex = todoList.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todoList[todoIndex].completed = !todoList[todoIndex].completed;
  }
  renderTodoList();
}

function startEditTodoItem(id) {
  const todo = todoList.find((todo) => todo.id === id);
  if (todo) {
    document.getElementById("title").value = todo.title;
    document.getElementById("description").value = todo.description;
    document.getElementById("due-date").value = new Date(todo.dueDate)
      .toISOString()
      .slice(0, 16);
    document.getElementById("add-button").textContent = "Update Todo";
    document.getElementById("todo-form").classList.remove("hidden");
    document.getElementById("show-form-button").textContent = "- Hide Form";
    editMode = true;
    editId = id;
  }
}

function updateTodoItem(id, title, description, dueDate) {
  const todoIndex = todoList.findIndex((todo) => todo.id === id);
  if (todoIndex !== -1) {
    todoList[todoIndex].title = title;
    todoList[todoIndex].description = description;
    todoList[todoIndex].dueDate = dueDate;
  }
  renderTodoList();
}

function setFilter(filter) {
  currentFilter = filter;
  renderTodoList();
}

function setSortOrder(order) {
  sortOrder = order;
  renderTodoList();
}

function formatDueDate(dueDate) {
  const date = new Date(dueDate);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow at ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  }
}

function toggleControlsVisibility() {
  const controls = document.querySelector(".controls");
  if (todoList.length > 1) {
    controls.classList.remove("hidden");
  } else {
    controls.classList.add("hidden");
  }
}

document.getElementById("add-button").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("due-date").value;

  if (title && dueDate) {
    if (editMode) {
      updateTodoItem(editId, title, description, dueDate);
      editMode = false;
      editId = null;
      document.getElementById("add-button").textContent = "Add Todo";
    } else {
      addTodoItem(title, description, dueDate);
    }
    document.getElementById("todo-form").reset();
    document.getElementById("todo-form").classList.add("hidden");
    document.getElementById("show-form-button").textContent = "+ Add Todo";
  } else {
    alert("Please fill in all required fields.");
  }
});

document.getElementById("show-form-button").addEventListener("click", () => {
  const form = document.getElementById("todo-form");
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    document.getElementById("show-form-button").textContent = "- Hide Form";
  } else {
    form.classList.add("hidden");
    document.getElementById("show-form-button").textContent = "+ Add Todo";
  }
});

document.getElementById("filter-all").addEventListener("click", () => {
  setFilter("all");
});

document.getElementById("filter-completed").addEventListener("click", () => {
  setFilter("completed");
});

document.getElementById("filter-in-progress").addEventListener("click", () => {
  setFilter("in-progress");
});

document.getElementById("sort-asc").addEventListener("click", () => {
  setSortOrder("asc");
});

document.getElementById("sort-desc").addEventListener("click", () => {
  setSortOrder("desc");
});

document.getElementById("due-date").addEventListener("input", () => {
  const dueDateInput = document.getElementById("due-date");
  const currentDate = new Date();
  const selectedDate = new Date(dueDateInput.value);

  if (selectedDate < currentDate.setHours(0, 0, 0, 0)) {
    alert("Please select a future date.");
    dueDateInput.value = "";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  renderTodoList();
});
