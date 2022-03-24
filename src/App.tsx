import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { TodoItem } from "./components/TodoItem/TodoItem.component";
import { uuidv4 } from "./core/shared/uuid";
import { Todo } from "./core/types/Todo.types";

export function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);
  const [progress, setProgress] = useState(0);

  const isAllChecked = selectedTodos.length === todos.length;
  const isIndeterminate = selectedTodos.length > 0 && !isAllChecked;

  useEffect(() => {
    const todos = localStorage.getItem("todos");
    if (todos) {
      setTodos(JSON.parse(todos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    setSelectedTodos(todos.filter((todo) => todo.isSelected));
  }, [todos]);

  useEffect(() => {
    setProgress(
      (todos.filter((todo) => todo.isCompleted).length / todos.length) * 100
    );
  }, [selectedTodos, todos]);

  function handleAddTask(event: FormEvent) {
    event.preventDefault();

    if (!input.trim()) {
      return;
    }

    const newTodo: Todo = {
      id: uuidv4(),
      title: input,
      isCompleted: false,
      isSelected: false,
    };

    setTodos([...todos, newTodo]);
    setInput("");
  }

  function handleRemoveTodo(id: string) {
    const newTodos = [...todos];
    const index = newTodos.findIndex((todo) => todo.id === id);
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }

  function handleToggleTodo(id: string) {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);

    if (todo) {
      todo.isCompleted = !todo.isCompleted;
    }

    setTodos(newTodos);
  }

  function handleToggleSelectedTodos() {
    const newTodos = [...todos];
    newTodos.forEach((todo) => {
      todo.isCompleted = !todo.isCompleted;
    });

    setTodos(newTodos);
  }

  function handleSelectTodo(id: string) {
    const newTodos = [...todos];
    const todo = newTodos.find((todo) => todo.id === id);

    if (todo) {
      todo.isSelected = !todo.isSelected;
    }

    setTodos(newTodos);
  }

  function handleSelectAllTodos() {
    const newTodos = [...todos];
    newTodos.forEach((todo) => {
      todo.isSelected = !isAllChecked;
    });

    setTodos(newTodos);
  }

  function handleRemoveSelectedTodos() {
    const newTodos = [...todos];
    const newSelectedTodos = [...selectedTodos];

    newSelectedTodos.forEach((todo) => {
      newTodos.splice(newTodos.indexOf(todo), 1);
    });

    setTodos(newTodos);
    setSelectedTodos([]);
  }

  return (
    <Box px={16} py={16}>
      <Box maxW={520} mx="auto">
        <Heading>Todo List</Heading>

        <Stack
          as="form"
          onSubmit={handleAddTask}
          spacing="12px"
          direction="row"
          mt="24px"
        >
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" colorScheme="blue">
            Add Task
          </Button>
        </Stack>

        {!todos.length && (
          <Box textAlign="center" mt="24px">
            {" "}
            No Todos{" "}
          </Box>
        )}

        {todos.length && (
          <>
            {/* Progress */}
            <Box mt="24px" bg="gray.200" h="12px" borderRadius="6px">
              <Box
                h="100%"
                w={`${progress}%`}
                bg="green.500"
                borderRadius="6px"
                transition="all"
                transitionDuration="0.3s"
              ></Box>
            </Box>

            {/* Actions */}
            <HStack mt="24px" spacing="12px" alignItems="center">
              <Checkbox
                onChange={handleSelectAllTodos}
                isChecked={isAllChecked}
                isIndeterminate={isIndeterminate}
              >
                Select All
              </Checkbox>
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                isDisabled={!selectedTodos.length}
                onClick={handleRemoveSelectedTodos}
              >
                Remove Selected
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="green"
                isDisabled={!selectedTodos.length}
                onClick={handleToggleSelectedTodos}
              >
                {todos.every((todo) => todo.isCompleted)
                  ? "Uncomplete all todos"
                  : "Complete all todos"}
              </Button>
            </HStack>

            {/* Todos */}
            <Stack spacing="12px" mt="24px" direction="column">
              {todos.map((todo, index) => (
                <TodoItem
                  key={index}
                  todo={todo}
                  onRemove={handleRemoveTodo}
                  onToggle={handleToggleTodo}
                  onSelected={handleSelectTodo}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}
