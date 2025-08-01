import { Box, Input, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useLogin } from "../../features/auth/authAPI";
import { toaster } from "../../components/ui/toaster";

const CreateFreeLoginDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const loginMutation = useLogin();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginMutation.mutateAsync({ username, password });
      toaster.create({
        title: "Login successful",
        type: "success",
      });
      onClose();
      // navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toaster.create({
        title: "Login failed",
        description:
          error instanceof Error ? error.message : "Please try again",
        type: "error",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={100001}
        onClick={onClose}
      />
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="xl"
        boxShadow="xl"
        zIndex={100001}
        p={6}
        width="90%"
        maxW="400px"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <Box
            mb={4}
            justifyContent="space-between"
            display="flex"
            alignItems="center"
          >
            <Text
              fontSize="2xl"
              fontWeight="bold"
              fontFamily={'"Quicksand", sans-serif'}
            >
              Đăng nhập
            </Text>
            <Box
              cursor="pointer"
              onClick={onClose}
              color="gray.600"
              _hover={{ color: "red.500" }}
            >
              <FiX size={24} />
            </Box>
          </Box>
          <Box mb={3} borderRadius="xl" pb="10px">
            <Text mb={1} fontFamily={'"Quicksand", sans-serif'} pb="5px">
              Địa chỉ email{" "}
              <Text as="span" color="red.500" fontWeight={"bold"}>
                *
              </Text>
            </Text>
            <Input
              required
              bg="#F5EEED"
              borderRadius="xl"
              autoComplete="off"
              placeholder="Nhập địa chỉ email"
              fontFamily={'"Quicksand", sans-serif'}
              onChange={(e) => setUsername(e.target.value)}
              _focus={{
                borderColor: "red.600", // Đổi màu viền khi focus
              }}
            />
          </Box>
          <Box mb={3} pb="10px" position="relative">
            <Text mb={1} fontFamily={'"Quicksand", sans-serif'} pb="5px">
              Mật khẩu{" "}
              <Text as="span" color="red.500" fontWeight={"bold"}>
                *
              </Text>
            </Text>
            <Input
              required
              type={showPassword ? "text" : "password"}
              bg="#F5EEED"
              borderRadius="xl"
              autoComplete="off"
              placeholder="Nhập mật khẩu"
              onChange={(e) => setPassword(e.target.value)}
              fontFamily={'"Quicksand", sans-serif'}
              pr="40px"
              _focus={{ borderColor: "red.600" }}
            />
            <Box
              position="absolute"
              top="44px"
              right="12px"
              cursor="pointer"
              color="gray.600"
              onClick={handleTogglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={4}>
            <Text
              color="red.500"
              cursor="pointer"
              fontSize={["14px", "14px", "15px"]}
              fontFamily={'"Quicksand", sans-serif'}
            >
              Chưa có tài khoản
            </Text>
            <Text
              color="red.500"
              cursor="pointer"
              fontSize={["14px", "14px", "15px"]}
              fontFamily={'"Quicksand", sans-serif'}
            >
              Quên mật khẩu
            </Text>
          </Box>
          <Button
            type="submit"
            width="full"
            bg="red.500"
            color="white"
            borderRadius="xl"
            fontWeight={"bold"}
            fontSize={["14px", "14px", "16px"]}
            fontFamily={'"Quicksand", sans-serif'}
            _hover={{ bg: "red.600" }}
            loading={loginMutation.isPending}
            loadingText="Đang đăng nhập"
          >
            Đăng nhập
          </Button>
        </form>
      </Box>
    </>
  );
};

export default CreateFreeLoginDialog;
