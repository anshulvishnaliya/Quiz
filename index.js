const todoList = document.getElementById('todo-list');
const addRowButton = document.getElementById('add-row-btn');
const paginationContainer = document.getElementById('pagination');
const itemsPerPage = 5;

let currentPage = 1;

function addTodo() {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
    <td contenteditable="true"></td>
    <td contenteditable="true"></td>
    <td><input type="date"></td>
    <td><button class="status-toggle">Pending</button></td>
    <td>
      <select>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </td>
    <td>
      <button class="edit-button">Save</button>
      <button class="delete-button">Delete</button>
    </td>
  `;
    todoList.appendChild(newRow);
    updatePagination();
}

function editRow(row) {
    const cells = row.getElementsByTagName('td');

    // i <= 1 because we only need Title and Description to edit 
    for (let i = 0; i <= 1; i++) {
        cells[i].setAttribute('contenteditable', 'true');
    }

    // Used to manipulate date again
    const dueDateCell = cells[2];
    const dueDateValue = dueDateCell.textContent;
    dueDateCell.innerHTML = `<input type="date" value="${dueDateValue}">`;

    // Used to manipulate status again
    const statusCell = cells[3];
    const statusText = statusCell.textContent;
    statusCell.innerHTML = `<button class="status-toggle">${statusText}</button>`;

    // Used to manipulate priority again
    const priorityCell = cells[4];
    const priorityText = priorityCell.textContent;
    priorityCell.innerHTML = `
    <select>
       <option value="low" ${priorityText === 'low' ? 'selected' : ''}>Low</option>
       <option value="medium" ${priorityText === 'medium' ? 'selected' : ''}>Medium</option>
       <option value="high" ${priorityText === 'high' ? 'selected' : ''}>High</option>
    </select>
  `;
}

function saveRow(row) {
    const cells = row.getElementsByTagName('td');
    for (let i = 0; i < cells.length - 1; i++) {
        cells[i].setAttribute('contenteditable', 'false');
    }

    // Used to save date as a text
    const dueDateCell = cells[2];
    const dueDateInput = dueDateCell.querySelector('input[type="date"]');
    dueDateCell.textContent = dueDateInput.value;

    // Used to save selected status as a text
    const statusCell = cells[3];
    const statusButton = statusCell.querySelector('.status-toggle');
    statusCell.textContent = statusButton.textContent;

    // Used to save selected priority as a text
    const priorityCell = cells[4];
    const prioritySelect = priorityCell.querySelector('select');
    priorityCell.textContent = prioritySelect.value;
}

function deleteRow(row) {
    row.remove();
    updatePagination();
}

function toggleStatus(button) {
    const statusButton = button.querySelector('.status-toggle');
    const currentStatus = statusButton.textContent;

    if (currentStatus === 'Pending') {
        statusButton.textContent = 'Completed';
    } else {
        statusButton.textContent = 'Pending';
    }
}

function updatePagination() {
    const numRows = todoList.children.length;
    const numPages = Math.ceil(numRows / itemsPerPage);
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= numPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.addEventListener('click', () => goToPage(i));
        paginationContainer.appendChild(pageButton);
    }
}

function goToPage(page) {
    currentPage = page;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const rows = todoList.children;
    for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = (i >= startIndex && i < endIndex) ? 'table-row' : 'none';
    }
}

addRowButton.addEventListener('click', addTodo);

document.addEventListener('DOMContentLoaded', () => {
    updatePagination();
    goToPage(currentPage);

    todoList.addEventListener('click', (event) => {
        const clickedElement = event.target;

        if (clickedElement.classList.contains('status-toggle')) {
            toggleStatus(clickedElement.parentElement);
        } else if (clickedElement.classList.contains('edit-button')) {
            const row = clickedElement.parentElement.parentElement;
            if (clickedElement.textContent === 'Edit') {
                editRow(row);
                clickedElement.textContent = 'Save';
            } else {
                saveRow(row);
                clickedElement.textContent = 'Edit';
            }
        } else if (clickedElement.classList.contains('delete-button')) {
            const row = clickedElement.parentElement.parentElement;
            deleteRow(row);
        }
    });
});