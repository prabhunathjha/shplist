const button = document.getElementById("enter");
const input = document.getElementById("userinput");
const ul = document.querySelector("ul");
const apiUrl = "https://jsonplaceholder.typicode.com/todos";

function inputLength() {
  return input.value.length;
}

function createListElement(item) {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(item.title));
  ul.appendChild(li);

  const deleteButton = document.createElement("button");
  deleteButton.appendChild(document.createTextNode("Delete"));
  li.appendChild(deleteButton);

  deleteButton.addEventListener("click", deleteListItem.bind(null, item.id));

  const editButton = document.createElement("button");
  editButton.appendChild(document.createTextNode("Edit"));
  li.appendChild(editButton);

  editButton.addEventListener("click", editListItem.bind(null, item));

  return li;
}

function addListAfterClick() {
  if (inputLength() > 0) {
    const item = { title: input.value };
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: { type: "todos", attributes: item } })
    })
      .then(response => response.json())
      .then(data => createListElement(data.data.attributes));
    input.value = "";
  }
}

function addListAfterKeypress(event) {
  if (inputLength() > 0 && event.keyCode === 13) {
    addListAfterClick();
  }
}

function deleteListItem(id, event) {
  fetch(`${apiUrl}/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      const listItem = event.target.parentNode;
      ul.removeChild(listItem);
    });
}

function editListItem(item, event) {
  const listItem = event.target.parentNode;
  const listItemText = listItem.firstChild;
  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.value = item.title;
  listItem.replaceChild(editInput, listItemText);
  const saveButton = document.createElement("button");
  saveButton.appendChild(document.createTextNode("Save"));
  listItem.appendChild(saveButton);

  function saveEditedText() {
    const newTitle = editInput.value;
    fetch(`${apiUrl}/${item.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: { type: "todos", id: item.id, attributes: { title: newTitle } } })
    })
      .then(response => response.json())
      .then(data => {
        const newListItem = createListElement(data.data.attributes);
        ul.replaceChild(newListItem, listItem);
      });
  }

  saveButton.addEventListener("click", saveEditedText);
}

function loadList() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    data.forEach(item => createListElement(item));
    });
}


button.addEventListener("click", addListAfterClick);
input.addEventListener("keypress", addListAfterKeypress);
loadList();

input.addEventListener("keypress", addListAfterKeypress);


		  


