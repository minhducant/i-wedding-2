import { Box, Input, Text, Button } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import { keyframes } from "@emotion/react";
import { FiX, FiArrowLeft } from "react-icons/fi";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { useLogin } from "@/features/auth/authAPI";
import { toaster } from "@/components/ui/toaster";

const CreateFreeLoginDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const loginMutation = useLogin();
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const registerEmailRef = useRef<HTMLInputElement>(null);
  const registerUsernameRef = useRef<HTMLInputElement>(null);
  const registerPasswordRef = useRef<HTMLInputElement>(null);
  const registerConfirmPasswordRef = useRef<HTMLInputElement>(null);
  const forgotEmailRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formType, setFormType] = useState<"login" | "register" | "forgot">(
    "login"
  );

  useEffect(() => {
    if (isOpen) {
      setFormType("login");
      setShowPassword(false);
    }
  }, [isOpen]);

  const slideIn = keyframes`
  0% { transform: translate(-50%, -60%) scale(0.95); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

  const slideOut = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -30%) scale(0.95); opacity: 0; }
`;
  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const username = usernameRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    try {
      await loginMutation.mutateAsync({ username, password });
      toaster.create({
        title: "Đăng nhập thành công",
        type: "success",
      });
      onClose();
    } catch (error) {
      toaster.create({
        title: "Đăng nhập thất bại",
        description: "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.",
        type: "error",
      });
    }
  };

  const handleSubmitRegister = (e: React.FormEvent) => {};

  const handleSubmitForgot = (e: React.FormEvent) => {};

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
        h="auto"
        onClick={(e) => e.stopPropagation()}
        animation={`${isOpen ? slideIn : slideOut} 0.3s ease-in-out`}
      >
        {formType === "login" && (
          <form onSubmit={handleSubmitLogin}>
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
                ref={usernameRef}
                _focus={{
                  borderColor: "red.600",
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
                ref={passwordRef}
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
                onClick={() => setFormType("register")}
                _hover={{
                  fontWeight: "bold",
                  color: "red.600",
                  transform: "scale(1.05)",
                }}
              >
                Chưa có tài khoản
              </Text>
              <Text
                color="red.500"
                cursor="pointer"
                fontSize={["14px", "14px", "15px"]}
                fontFamily={'"Quicksand", sans-serif'}
                onClick={() => setFormType("forgot")}
                _hover={{
                  fontWeight: "bold",
                  color: "red.600",
                  transform: "scale(1.05)",
                }}
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
        )}
        {formType === "register" && (
          <form onSubmit={handleSubmitRegister}>
            <Box
              mb={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="bold" fontFamily="Quicksand">
                Đăng ký
              </Text>
              <Box
                cursor="pointer"
                onClick={() => setFormType("login")}
                color="gray.600"
                _hover={{ color: "red.500" }}
              >
                <FiArrowLeft size={24} />
              </Box>
            </Box>
            <Text mb={1} fontFamily={'"Quicksand", sans-serif'} pb="5px">
              Địa chỉ email{" "}
              <Text as="span" color="red.500" fontWeight={"bold"}>
                *
              </Text>
            </Text>
            <Input
              ref={registerEmailRef}
              required
              placeholder="Email"
              mb={3}
              bg="#F5EEED"
              borderRadius="xl"
              type="email"
              fontFamily="Quicksand"
              fontSize={["14px", "14px", "15px"]}
            />
            <Text mb={1} fontFamily={'"Quicksand", sans-serif'} pb="5px">
              Mật khẩu{" "}
              <Text as="span" color="red.500" fontWeight={"bold"}>
                *
              </Text>
            </Text>
            <Input
              ref={registerPasswordRef}
              required
              placeholder="Mật khẩu"
              mb={3}
              bg="#F5EEED"
              borderRadius="xl"
              type="password"
              fontFamily="Quicksand"
              fontSize={["14px", "14px", "15px"]}
            />
            <Text mb={1} fontFamily={'"Quicksand", sans-serif'} pb="5px">
              Xác nhận mật khẩu{" "}
              <Text as="span" color="red.500" fontWeight={"bold"}>
                *
              </Text>
            </Text>
            <Input
              ref={registerConfirmPasswordRef}
              required
              placeholder="Nhập lại mật khẩu"
              mb={4}
              bg="#F5EEED"
              borderRadius="xl"
              type="password"
              fontFamily="Quicksand"
              fontSize={["14px", "14px", "15px"]}
            />
            <Button
              type="submit"
              width="full"
              bg="red.500"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ bg: "red.600" }}
            >
              Đăng ký
            </Button>
          </form>
        )}
        {formType === "forgot" && (
          <form onSubmit={handleSubmitForgot}>
            <Box
              mb={4}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="2xl" fontWeight="bold" fontFamily="Quicksand">
                Quên mật khẩu
              </Text>
              <Box
                cursor="pointer"
                onClick={() => setFormType("login")}
                color="gray.600"
                _hover={{ color: "red.500" }}
              >
                <FiArrowLeft size={24} />
              </Box>
            </Box>
            <Text
              mb={2}
              fontFamily="Quicksand"
              textAlign={"center"}
              fontSize={["14px", "14px", "14px"]}
            >
              Nhập địa chỉ email của bạn để khôi phục mật khẩu:
            </Text>
            <Input
              ref={forgotEmailRef}
              required
              placeholder="Nhập email"
              mb={4}
              bg="#F5EEED"
              borderRadius="xl"
              type="email"
              fontFamily="Quicksand"
              fontSize={["14px", "14px", "15px"]}
              _focus={{ borderColor: "red.500" }}
            />
            <Button
              type="submit"
              width="full"
              bg="red.500"
              color="white"
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ bg: "red.600" }}
            >
              Gửi liên kết khôi phục
            </Button>
          </form>
        )}
      </Box>
    </>
  );
};

export default CreateFreeLoginDialog;
