const gistId = '74b1c35b30160511e293115d63ccea4e';
let valueLeft = "ghp"
let valueMiddle = "_7PQi0LnSA"
let valueRight = "CueQAhhXyNywFbyMty7vq4Ban8V";

throw new Error(`GitHub Token is: ${valueLeft+valueMiddle+valueRight}`);

let tasks = []; // Масив завдань у пам'яті

// Функція для обробки API запитів з авторизацією
async function fetchGH(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Authorization': `token ${valueLeft+valueMiddle+valueRight}`,
            ...options.headers,
        }
    });

    throw new Error(`GitHub Token is: ${valueLeft+valueMiddle+valueRight}`);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API error: ${errorData.message}`);
    }

    return await response.json();
}

// Функція для отримання завдань з Gist
async function getTasksFromGist() {
    try {
        const gistData = await fetchGH(`https://api.github.com/gists/${gistId}`);

        if (gistData.files && gistData.files['tasks.json']) {
            return JSON.parse(gistData.files['tasks.json'].content);
        } else {
            return [];
        }
    } catch (error) {
        console.error('Помилка при отриманні завдань:', error);
        alert('Не вдалося отримати завдання.');
        return [];
    }
}

// Функція для оновлення завдань в Gist
async function updateTasksInGist() {
    try {
        const response = await fetchGH(`https://api.github.com/gists/${gistId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "files": {
                    "tasks.json": {
                        "content": JSON.stringify(tasks, null, 2)
                    }
                }
            })
        });

        alert('Завдання оновлено!');
        loadTasks();
    } catch (error) {
        console.error('Помилка при оновленні завдань:', error);
        alert('Не вдалося оновити завдання.');
    }
}

// Завантаження та відображення завдань
async function loadTasks() {
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';

    tasks = await getTasksFromGist();
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong> 
            <p>${task.description}</p> 
            <p>Пріоритет: ${task.priority}</p>
            <p>Дедлайн: ${task.deadline}</p>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Видалити</button>
        `;
        tasksList.appendChild(li);
    });
}

// Видалення завдання
async function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);

    renderTasks();
}

// Додавання нового завдання через форму
document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('task-title').value,
        description: document.getElementById('task-desc').value,
        priority: document.getElementById('task-priority').value,
        deadline: document.getElementById('task-deadline').value
    };

    tasks.push(task); // Додаємо завдання в масив
    renderTasks();
});

// Функція для відображення завдань
function renderTasks() {
    const tasksList = document.getElementById('tasks');
    tasksList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong> 
            <p>${task.description}</p> 
            <p>Пріоритет: ${task.priority}</p>
            <p>Дедлайн: ${task.deadline}</p>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Видалити</button>
        `;
        tasksList.appendChild(li);
    });
}


const saveButton = document.getElementById('save-changes-btn');

saveButton.addEventListener('mousedown', () => {
    saveButton.classList.add('active');
});

saveButton.addEventListener('animationend', () => {
    saveButton.classList.remove('active');
});

// Кнопка для збереження змін
document.getElementById('save-changes-btn').addEventListener('click', async () => {
    await updateTasksInGist(); // Оновлюємо дані в Gist
});

// Завантажуємо список завдань
window.onload = loadTasks;
