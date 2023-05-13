let switchCheck = (event) => {
    let elem = event.target;
    let parent = elem.parentNode;
    console.log(elem.nextSibling);
    parent.remove()
    if(elem.classList.contains('checked')){
        todo_list.prepend(parent)
    }
    else{
        todo_solved_list.prepend(parent)
    }
    elem.classList.toggle('checked');
    elem.nextSibling.classList.toggle('solved')
}
let createTask = () => {
    let taskArr = todo_list.childNodes;
    let ids = [];
    for(let i = 1; i < taskArr.length; i++){
        if (taskArr[i].id !== undefined){
            ids.push(+taskArr[i].id)
        }
    }
    let maxId = ids.reduce((max, current) => Math.max(max, current), 0);
    
    let TodoElem = document.createElement('div');
    TodoElem.className = 'todo_elem';
    TodoElem.id = maxId;
    let TodoSwitch = document.createElement('div');
    TodoSwitch.className = 'todo_switch';
    TodoSwitch.addEventListener('click', switchCheck);
    let TodoTask = document.createElement('div');
    TodoTask.className = 'todo_task';
    TodoTask.innerHTML = task_inp.value;

    todo_list.prepend(TodoElem);
    TodoElem.append(TodoSwitch);
    TodoElem.append(TodoTask);
    task_inp.value = '';
    task_inp.blur()
}

let switches = document.getElementsByClassName('todo_switch')

for(let i = 0; i < switches.length; i++){
    switches[i].addEventListener('click', switchCheck)
}

task_inp.addEventListener('focus', () => {
    task_inp.placeholder = '';
    todo_task_creater.style.background = '#fff'
})
task_inp.addEventListener('keydown', (event) => {
    if (event.code == 'Enter' && task_inp.value){
        createTask()
    }
})
task_create.addEventListener('click', () => {
    if (task_inp.value){
        createTask()
    }
})
task_inp.addEventListener('blur', () => {
    task_inp.placeholder = 'Добавить задачу';
    todo_task_creater.style.background = '#fffa'
})