import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function SearchLoading() {
  return (
    <Stack
      mt={"10px"}
      overflow={"hidden"}
      color={"red"}
      bg={"#121212"}
      display={"flex"}
      justifyContent={"space-between"}
    >
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      {/* <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" />
      <Skeleton height="50px" startColor="#222222" endColor="#1f1f1f" /> */}
      {/* <Skeleton height="30px" />
      <Skeleton height="30px" />
      <Skeleton height="30px" />
      <Skeleton height="30px" />
      <Skeleton height="30px" />
      <Skeleton height="30px" /> */}
    </Stack>
  );
}

export default SearchLoading;
