const STORAGE_KEY = 'todo-list-v1';

let todos = [];
let searchPhrase = '';
let editingId = null;

const elements = {
    list: document.getElementById('todo-list'),
    form: document.getElementById('add-form'),
    newTask: document.getElementById('new-task'),
    newDeadline: document.getElementById('new-deadline'),
    error: document.getElementById('error-message'),
    search: document.getElementById('search'),
};

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    try {
        todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        todos = [];
    }
}

function formatDeadline(deadline) {
    if (!deadline) return '';
    const d = new Date(deadline);
    if (isNaN(d)) return '';
    return d.toLocaleString('pl-PL', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function highlight(text, query) {
    if (!query || query.length < 2) return text;
    return text.replace(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<span class="highlight">$1</span>');
}

function isFutureOrEmpty(dateStr) {
    if (!dateStr) return true;
    const now = new Date();
    const dt = new Date(dateStr);
    return dt > now;
}

function validateInput(text, deadline) {
    if (text.length < 3) return 'Zadanie musi mieć co najmniej 3 znaki.';
    if (text.length > 255) return 'Zadanie nie może mieć więcej niż 255 znaków.';
    if (deadline && !isFutureOrEmpty(deadline)) return 'Termin musi być pusty lub w przyszłości.';
    return '';
}
function formatDateForInput(date) {
    const pad = n => n.toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1); // Miesiące od 0 do 11
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}
function render() {
    elements.list.innerHTML = '';

    let filtered = todos;
    if (searchPhrase.length >= 2) {
        filtered = todos.filter(t => t.text.toLowerCase().includes(searchPhrase.toLowerCase()));
    }

    filtered.forEach((todo) => {
        const li = document.createElement('li');
        li.className = 'todo-item';
        if (todo.checked) li.classList.add('done');
        li.dataset.id = todo.id;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = !!todo.checked;
        checkbox.className = 'todo-checkbox';
        checkbox.addEventListener('change', () => {
            todo.checked = checkbox.checked;
            saveTodos();
            render();
        });

        if (editingId === todo.id) {
            const editWrapper = document.createElement('div');
            editWrapper.className = 'edit-container';
        
            const input = document.createElement('input');
            input.type = 'text';
            input.value = todo.text;
            input.maxLength = 255;
            input.className = 'edit-input';
            input.addEventListener('keydown', ev => {
                if (ev.key === 'Enter') finishEdit(input, deadlineInput, todo);
                if (ev.key === 'Escape') {
                    editingId = null;
                    render();
                }
            });
        
            const deadlineInput = document.createElement('input');
            deadlineInput.type = 'datetime-local';
            deadlineInput.value = todo.deadline ? formatDateForInput(new Date(todo.deadline)) : '';
            deadlineInput.className = 'edit-deadline';
        
            editWrapper.appendChild(input);
            editWrapper.appendChild(deadlineInput);
        
            li.appendChild(checkbox);
            li.appendChild(editWrapper);
            setTimeout(() => input.focus(), 0);
        } else {
            const content = document.createElement('span');
            content.className = 'content';
            content.innerHTML = highlight(todo.text, searchPhrase);
            content.addEventListener('click', (ev) => {
                ev.stopPropagation();
                editingId = todo.id;
                render();
            });
            li.appendChild(checkbox);
            li.appendChild(content);
        }

        if (todo.deadline) {
            const deadline = document.createElement('span');
            deadline.className = 'deadline';
            deadline.textContent = formatDeadline(todo.deadline);
            li.appendChild(deadline);
        }

        const del = document.createElement('button');
        del.className = 'delete-btn';
        del.title = "Usuń";
        del.innerHTML = '🗑️';
        del.addEventListener('click', (ev) => {
            ev.stopPropagation();
            todos = todos.filter(t => t.id !== todo.id);
            saveTodos();
            render();
        });
        li.appendChild(del);

        elements.list.appendChild(li);
    });
}

function finishEdit(input, deadlineInput, todo) {
    const newText = input.value.trim();
    const newDeadline = deadlineInput.value ? new Date(deadlineInput.value).toISOString() : null;
    const error = validateInput(newText, newDeadline);
    if (error) {
        elements.error.textContent = error;
        input.focus();
        return;
    }
    todo.text = newText;
    todo.deadline = newDeadline;
    saveTodos();
    elements.error.textContent = '';
    editingId = null;
    render();
}

elements.form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = elements.newTask.value.trim();
    const deadline = elements.newDeadline.value;
    const error = validateInput(text, deadline);
    if (error) {
        elements.error.textContent = error;
        return;
    }
    todos.push({ id: Date.now() + Math.random(), text, deadline, checked: false });
    saveTodos();
    elements.newTask.value = '';
    elements.newDeadline.value = '';
    elements.error.textContent = '';
    render();
});

elements.search.addEventListener('input', function () {
    searchPhrase = elements.search.value.trim();
    render();
});

elements.newTask.addEventListener('input', () => elements.error.textContent = '');
elements.newDeadline.addEventListener('input', () => elements.error.textContent = '');

document.addEventListener('mousedown', function (e) {
    const editingContainer = document.querySelector('.edit-container');
    if (editingContainer && !editingContainer.contains(e.target)) {
        const input = editingContainer.querySelector('.edit-input');
        const deadlineInput = editingContainer.querySelector('.edit-deadline');
        const todo = todos.find(t => t.id === editingId);
        if (input && deadlineInput && todo) {
            finishEdit(input, deadlineInput, todo);
        } else {
            editingId = null;
            render();
        }
    }
});

window.addEventListener('DOMContentLoaded', function () {
    loadTodos();
    render();
});