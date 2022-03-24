import {
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { TodoItem } from "./components/TodoItem/TodoItem.component";
import { uuidv4 } from "./core/shared/uuid";
import { Todo } from "./core/types/Todo.types";

export function App() {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [selectedTodos, setSelectedTodos] = useState<Todo[]>([]);
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSelectedTodo, setLastSelectedTodo] = useState<Todo | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const isAllChecked = selectedTodos.length === todos.length;
  const isIndeterminate = selectedTodos.length > 0 && !isAllChecked;
  const isAllCompleted = todos.every((todo) => todo.isCompleted);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftKeyPressed(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Shift") {
        setIsShiftKeyPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
  }, [todos]);

  // Search todos by title
  useEffect(() => {
    const filteredTodos = todos.filter((todo) =>
      todo.title.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTodos(filteredTodos);
  }, [todos, searchValue]);

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

  function handleToggleCompleteSelectedTodos() {
    const newTodos = [...todos];
    newTodos.forEach((todo) => {
      if (selectedTodos.includes(todo)) {
        todo.isCompleted = !todo.isCompleted;
      }
    });

    setTodos(newTodos);
  }

  function handleToggleCompleteTodos() {
    const newTodos = [...todos];

    newTodos.forEach((todo) => {
      todo.isCompleted = !isAllCompleted;
    });

    setTodos(newTodos);
  }

  function handleToggleSelectTodo(todo: Todo) {
    const newTodos = [...todos];

    setLastSelectedTodo(todo);

    if (isShiftKeyPressed && lastSelectedTodo) {
      const lastSelectedTodoindex = newTodos.findIndex(
        (t) => t.id === lastSelectedTodo.id
      );
      const currentTodoIndex = newTodos.findIndex((t) => t.id === todo.id);

      const startIndex = Math.min(lastSelectedTodoindex, currentTodoIndex);
      const endIndex = Math.max(lastSelectedTodoindex, currentTodoIndex);

      const isSelected =
        !lastSelectedTodo.isSelected && !todo.isSelected
          ? true
          : lastSelectedTodo.isSelected;

      for (let i = startIndex; i <= endIndex; i++) {
        newTodos[i].isSelected = isSelected;
      }
    } else {
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

  function handleSearchTodos(event: ChangeEvent<HTMLInputElement>) {
    setSearchValue(event.target.value);
  }

  return (
    <Box px={16} py={16}>
      <Box maxW={520} mx="auto">
        <Heading>Taskks</Heading>

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
            <Box>
              <HStack mt="24px" spacing="12px" alignItems="center">
                <Checkbox
                  onChange={handleSelectAllTodos}
                  isChecked={isAllChecked}
                  isIndeterminate={isIndeterminate}
                >
                  Select All
                </Checkbox>

                <Menu>
                  <MenuButton as={Button} rightIcon={<FiChevronDown />}>
                    Actions
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      isDisabled={!selectedTodos.length}
                      onClick={handleRemoveSelectedTodos}
                    >
                      Remove Select
                    </MenuItem>
                    <MenuItem
                      isDisabled={!selectedTodos.length}
                      onClick={handleToggleCompleteSelectedTodos}
                    >
                      Toggle Complete Select
                    </MenuItem>
                    <MenuItem onClick={handleToggleCompleteTodos}>
                      {isAllCompleted ? "Uncomplete All" : "Complete All"}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>

              <Input value={searchValue} onChange={handleSearchTodos} />
            </Box>

            {/* Todos */}
            <Stack spacing="12px" mt="24px" direction="column">
              {todos.map((todo, index) => (
                <TodoItem
                  key={index}
                  todo={todo}
                  onRemove={handleRemoveTodo}
                  onToggle={handleToggleTodo}
                  onSelected={handleToggleSelectTodo}
                />
              ))}
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
}
