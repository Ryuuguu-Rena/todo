let tasks = [];
let solvedTasks = [];
let sortMode = 'creationDate';
let textBeforeChange = '';

let renderTasks = () => {
    todo_list.textContent = '';
    tasks.forEach((elem) => {
        let TodoElem = document.createElement('div');
        TodoElem.className = 'todo_elem';
        TodoElem.addEventListener('click', (event) => {
            if(event.target.classList.contains('todo_switch'))
                switchCheck(event.target)
            else
                openTaskEditor(event.target)
        });
        let TodoSwitch = document.createElement('div');
        TodoSwitch.className = 'todo_switch';
        let TodoTask = document.createElement('div');
        TodoTask.className = 'todo_task';
        TodoTask.innerHTML = elem.text;

        todo_list.append(TodoElem);
        TodoElem.append(TodoSwitch);
        TodoElem.append(TodoTask);
    })
}
let renderSolvedTasks = () => {
    todo_solved_list.textContent = '';
    solvedTasks.forEach((elem) => {
        let TodoElem = document.createElement('div');
        TodoElem.className = 'todo_elem';
        let TodoSwitch = document.createElement('div');
        TodoSwitch.className = 'todo_switch checked';
        TodoSwitch.addEventListener('click', switchCheck);
        let TodoTask = document.createElement('div');
        TodoTask.className = 'todo_task solved';
        TodoTask.innerHTML = elem.text;

        todo_solved_list.append(TodoElem);
        TodoElem.append(TodoSwitch);
        TodoElem.append(TodoTask);
    })
}

let sortTasks = () => {
    if(sortMode == 'creationDate'){
        tasks.sort((a, b) => b.date - a.date);
        renderTasks()
    }
    else if(sortMode == 'alphabet'){
        tasks.sort((a, b) => a.text > b.text ? 1 : -1);
        renderTasks()
    }
}

let switchCheck = (elem) => {
    let parent = elem.parentNode;
    let taskId;
    parent.remove()
    if(elem.classList.contains('checked')){
        taskId = solvedTasks.findIndex(item => item.text == parent.lastChild.innerHTML);
        tasks.push(solvedTasks[taskId]);
        solvedTasks.splice(taskId, 1);
        sortTasks()
    }
    else{
        taskId = tasks.findIndex(item => item.text == parent.lastChild.innerHTML);
        solvedTasks.push(tasks[taskId]);
        tasks.splice(taskId, 1);
        todo_solved_list.prepend(parent)
    }
    elem.classList.toggle('checked');
    elem.nextSibling.classList.toggle('solved')
}

let createTask = () => {
    tasks.push({
        text: task_inp.value,
        date: Date.now()
    });
    sortTasks();
    task_inp.value = '';
    task_inp.blur()
}

let openTaskEditor = (elem) => {
    if (elem.classList.contains('todo_elem'))
        change_text_inp.value = textBeforeChange = elem.lastChild.innerHTML
    else
        change_text_inp.value = textBeforeChange = elem.innerHTML
    todo_change_task_window.style.display = 'block'
}

task_inp.addEventListener('focus', () => {
    task_inp.placeholder = '';
    todo_task_creater.style.background = '#fff'
})
task_inp.addEventListener('keydown', (event) => {
    if (event.code == 'Enter' && task_inp.value)
        createTask()
})
task_create.addEventListener('click', () => {
    if (task_inp.value)
        createTask()
})
task_inp.addEventListener('blur', () => {
    task_inp.placeholder = 'Добавить задачу';
    todo_task_creater.style.background = '#fffa'
})


settings_btn_container.addEventListener('click', () => {
    todo_settings_modal_window.style.display = 'block'
})
todo_settings_modal_window.addEventListener('click', (event) => {
    if (event.target.id == 'todo_settings_modal_window')
        todo_settings_modal_window.style.display = 'none'
})

settings_sort.addEventListener('mouseover', () => {
    todo_sort_container.style.display = 'block'
})
settings_sort.addEventListener('mouseout', () => {
    todo_sort_container.style.display = null
})
sort_alphabet.addEventListener('click', () => {
    sortMode = 'alphabet';
    sortTasks();
})
sort_creation_date.addEventListener('click', () => {
    sortMode = 'creationDate';
    sortTasks();
})

settings_save.addEventListener('click', () => {
    let file = new Blob(
        [JSON.stringify({
            "tasks": tasks,
            "solvedTasks": solvedTasks
        })],
        {type: 'application/json'}
    )
    let link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'tasks.json';
    link.click();
    URL.revokeObjectURL(file)
})
settings_upload.addEventListener('click', () => {
    let file;
    let input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = async (event) => {
        file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            json = JSON.parse(reader.result);
            console.log(json)
            tasks = json.tasks;
            solvedTasks = json.solvedTasks;
            sortTasks();
            renderSolvedTasks()
        }
    }
})

change_close_container.addEventListener('click', () => {
    todo_change_task_window.style = null;
    textBeforeChange = ''
})
change_text_inp.addEventListener('change', () => {
    if (tasks.find(item => item.text == textBeforeChange)){
        tasks.find(item => item.text == textBeforeChange).text = change_text_inp.value;
        textBeforeChange = change_text_inp.value;
        sortTasks()
    }
    else{
        solvedTasks.find(item => item.text == textBeforeChange).text = change_text_inp.value;
        textBeforeChange = change_text_inp.value;
        renderSolvedTasks()
    }
})
delete_task_container.addEventListener('click', () => {
    if (tasks.find(item => item.text == change_text_inp.value)){
        tasks.splice(tasks.findIndex(item => item.text == change_text_inp.value), 1);
        sortTasks()
    }
    else{
        solvedTasks.splice(solvedTasks.findIndex(item => item.text == change_text_inp.value), 1);
        renderSolvedTasks()
    }
    todo_change_task_window.style = null;
    textBeforeChange = ''
})