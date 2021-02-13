
import { Container, Grid, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import { v1 } from 'uuid';
import AddItemForm from '../common/addItemForm/addItemForm';
import Header from '../header/header';
import TodoLists from '../todoLists/todoLists';
import classes from './App.module.scss';


let todoListId1 = v1()
let todoListId2 = v1();
const todoLists = [
  { id: todoListId1, title: "What to learn", filter: "all" as FilterType },
  { id: todoListId2, title: "What to do", filter: "all" as FilterType },
];

let todosTasks = {
  [todoListId1]: [
    { id: v1(), title: "HTML", isDone: false },
    { id: v1(), title: "React", isDone: false },
    { id: v1(), title: "Redux", isDone: false },
    { id: v1(), title: "Rest", isDone: false },
  ],
  [todoListId2]: [
    { id: v1(), title: "rrrr", isDone: false },
    { id: v1(), title: "ssss", isDone: false },
  ],
};


export type TasksType = typeof todosTasks[0]
export type ItemType = typeof todosTasks[0][0];
export type FilterType = 'all' | 'active' | 'completed'
export type TaskStateType = {
  [key: string]: Array<ItemType>
}

export type TodoListsType = {
  id:string, title:string, filter: FilterType
}

function App() {

  const [tasks, setTasks] = useState<TaskStateType>(todosTasks)
  const[todos, setTodos] = useState<Array<TodoListsType>>(todoLists)

  const onItemDelete = (id: string, todoId:string) => {
    let todolistTasks = tasks[todoId]
    tasks[todoId] = todolistTasks.filter((el) => el.id !== id)
    setTasks({...tasks})
  }

  const onFilterHandler = (arr: TasksType, filter: FilterType) => {
    switch (filter) {
      case "all": {
        return arr;
      }
      case "active": {
        return arr.filter((el) => !el.isDone);
      }
      case "completed": {
        return arr.filter((el) => el.isDone);
      }
      default:
        return arr;
    }
  };

  const onFilterChange = (value: FilterType, todoListId: string) => {
    let todoList = todos.find((el)=> el.id === todoListId)
    if (todoList) { todoList.filter = value }
    setTodos([...todos])
  }

  const addTask = (value: string, todoListId: string) => {
    const newtask = { id: v1(), title: value, isDone: false };
    let todolistTasks = tasks[todoListId];
    tasks[todoListId] = [newtask, ...todolistTasks]
    setTasks({ ...tasks });
  };

  const changeStatus = (id: string, isDone: boolean, todoListId: string) => {
    let todolistTasks = tasks[todoListId];
    let task = todolistTasks.find((el) => el.id === id);
    if (task) {
      task.isDone = isDone;
      setTasks({...tasks});
    }
  };
  const removeTodoList = (todoListId: string) => {
    setTodos(todos.filter((el) => el.id !== todoListId))
    delete tasks[todoListId]
    setTasks({...tasks})
  }
  const onTodoAdded = (title: string) => {
   let newTodoId = v1()
    let newList: TodoListsType = { id: newTodoId, title, filter: "all" };
    setTodos([...todos, newList])
    setTasks({...tasks, [newTodoId]:[]})
  }
  const changeTitle = (todoListId: string, todoId: string, title: string) => {
    let todoList = tasks[todoListId]
    let task = todoList.find((el) => el.id === todoId);
    if (task) {
      task.title = title
      setTasks({ ...tasks });
    }
  }
  const changeTodoName = (todoListId: string, title: string) => {
    let todo = todos.find((el) => el.id === todoListId)
    if (todo) {
      todo.title = title
      setTodos([...todos])
    }
  }
  return (
    <div className={classes.App}>
      <Header />
      <Container fixed>
        <Grid container style={{ padding: "30px", justifyContent: "center" }}>
          <AddItemForm
            addTitle={onTodoAdded}
            name={"todo"}
            placeholder="Type todo name to start"
          />
        </Grid>
        <Grid
          container
          spacing={3}
          style={{ marginTop: "50px" }}
          direction="row"
          justify="space-between"
        >
          {todos.map((el) => {
            return (
              <Grid item style={{ width: "500px" }}>
                <Paper style={{ padding: "10px" }}>
                  <TodoLists
                    key={el.id}
                    todoListId={el.id}
                    title={el.title}
                    tasks={onFilterHandler(tasks[el.id], el.filter)}
                    onItemDelete={onItemDelete}
                    changeFilter={onFilterChange}
                    active={el.filter}
                    onAdded={addTask}
                    changeStatus={changeStatus}
                    removeTodoList={removeTodoList}
                    changeTitle={changeTitle}
                    changeTodoName={changeTodoName}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </div>
  );
}

export default App;
