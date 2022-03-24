import { Box, Checkbox, HStack, IconButton } from "@chakra-ui/react";
import { FiCheck, FiTrash, FiXCircle } from "react-icons/fi";
import { Todo } from "../../core/types/Todo.types";

interface TodoItemProps {
  todo: Todo;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
  onSelected: (id: string) => void;
}

export function TodoItem({
  todo,
  onRemove,
  onToggle,
  onSelected,
}: TodoItemProps) {
  return (
    <Box
      p="16px"
      d="flex"
      justifyContent="space-between"
      alignItems="center"
      borderStyle="solid"
      borderWidth="1px"
      borderColor="gray.200"
      borderRadius={6}
      bg={todo.isCompleted ? "green.500" : "white"}
    >
      <Checkbox
        isChecked={todo.isSelected}
        onChange={() => onSelected(todo.id)}
        color={todo.isCompleted ? "white" : "gray.500"}
        fontWeight={todo.isCompleted ? "medium" : "regular"}
      >
        {todo.title}
      </Checkbox>

      {/* Actions Wrapper */}
      <HStack spacing="8px">
        <IconButton
          aria-label="Complete Todo"
          colorScheme={todo.isCompleted ? "gray" : "green"}
          icon={todo.isCompleted ? <FiXCircle /> : <FiCheck />}
          onClick={() => onToggle(todo.id)}
        />
        <IconButton
          aria-label="Remove Todo Item"
          colorScheme="red"
          icon={<FiTrash />}
          onClick={() => onRemove(todo.id)}
        />
      </HStack>
    </Box>
  );
}
