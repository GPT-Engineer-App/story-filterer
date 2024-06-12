import React, { useState, useEffect } from "react";
import {
  Container,
  Text,
  VStack,
  Box,
  Link,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun, FaSearch } from "react-icons/fa";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("black", "white");

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/newstories.json")
      .then((response) => response.json())
      .then((storyIds) => {
        const top10StoryIds = storyIds.slice(0, 10);
        return Promise.all(
          top10StoryIds.map((id) =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(
              (response) => response.json()
            )
          )
        );
      })
      .then((stories) => {
        setStories(stories);
        setFilteredStories(stories);
      })
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  const handleSearch = () => {
    const filtered = stories.filter((story) =>
      story.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredStories(filtered);
  };

  return (
    <Container
      centerContent
      maxW="container.md"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={bgColor}
      color={textColor}
    >
      <VStack spacing={4} width="100%">
        <Box width="100%" textAlign="right">
          <IconButton
            aria-label="Toggle dark mode"
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            onClick={toggleColorMode}
          />
        </Box>
        <Text fontSize="2xl">Hacker News Stories</Text>
        <InputGroup>
          <Input
            placeholder="Search by keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<FaSearch />}
              onClick={handleSearch}
            />
          </InputRightElement>
        </InputGroup>
        {filteredStories.map((story) => (
          <Box
            key={story.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            width="100%"
            bg={useColorModeValue("white", "gray.700")}
          >
            <Text fontSize="lg" fontWeight="bold">
              {story.title}
            </Text>
            <Text>Upvotes: {story.score}</Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;