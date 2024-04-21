import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Stack } from "@chakra-ui/react";
import React from "react";

function UserBadge({ e, handleDelete }) {
  return (
    <Stack direction="row" padding={2} mb={-2.5} cursor={"pointer"}>
      {/* <Badge>Default</Badge> */}
      <Badge
        bg={"#f0b100"}
        color={"#000000"}
        _hover={{ backgroundColor: "red" }}
        onClick={handleDelete}
      >
        {e.name}
        <CloseIcon
          // color={"red"}
          ml={1}
          mr={1}
          mb={"2.5px"}
          boxSize={2}
        />
      </Badge>

      {/* <Badge colorScheme="purple">New</Badge> */}
    </Stack>
  );
}

export default UserBadge;
