import { useSelector } from "react-redux";
import {
  FiUser,
  FiFileText,
  FiCalendar,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import {
  Box,
  Button,
  Popover,
  Portal,
  Text,
  HStack,
  Icon,
  VStack,
  useDisclosure,
  UseDisclosureProps,
} from "@chakra-ui/react";

import Avatar from "@/assets/icons/avatar";
import { toaster } from "@/components/ui/toaster";
import { useLogout } from "@/features/auth/authAPI";
import { selectAuth } from "@/features/auth/authSlice";
import ModalGuest from "@/components/modal/ModalGuest";
import ModalInvitation from "@/components/modal/ModalInvitation";

const AccountPopover = () => {
  const auth: any = useSelector(selectAuth);
  const logoutMutation = useLogout();
  const {
    open: openInvitation,
    onOpen: onOpenInvitation,
    onClose: onCloseInvitation,
  }: UseDisclosureProps = useDisclosure();
  const {
    open: openGuest,
    onOpen: onOpenGuest,
    onClose: onCloseGuest,
  }: UseDisclosureProps = useDisclosure();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toaster.create({
        title: "Đăng xuất thành công",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Đăng xuất thất bại",
        description: "Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại sau.",
        type: "error",
      });
    }
  };

  return (
    <>
      <ModalGuest open={openGuest} onClose={onCloseGuest} />
      <ModalInvitation open={openInvitation} onClose={onCloseInvitation} />
      <Popover.Root>
        <Popover.Trigger>
          <Button
            bg="#F6F6F6"
            color="black"
            borderRadius="3xl"
            height={10}
            borderColor={"gray.300"}
            fontWeight="semibold"
            fontFamily={'"Quicksand", sans-serif'}
            _hover={{ bg: "red.400", color: "white" }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar />
              <Text ml="5px">{auth?.user?.username || "Tài khoản"}</Text>
              <FiChevronDown />
            </Box>
          </Button>
        </Popover.Trigger>
        <Portal>
          <Popover.Positioner>
            <Popover.Content
              w="280px"
              borderRadius="xl"
              boxShadow="xl"
              overflow="hidden"
              _focus={{ outline: "none" }}
            >
              <Box
                bg="linear-gradient(to bottom, #FF6B6B, #FF8787)"
                py={4}
                px={4}
                textAlign="center"
              >
                <Box display="flex" justifyContent="center" mb={2}>
                  <Avatar size={40} />
                </Box>
                <Text
                  color="white"
                  fontWeight="medium"
                  fontFamily={'"Quicksand", sans-serif'}
                >
                  Xin chào 👋
                </Text>
                <Text
                  color="white"
                  fontWeight="bold"
                  fontFamily={'"Quicksand", sans-serif'}
                >
                  {auth?.user?.username || "Tài khoản"}
                </Text>
                <Text
                  color="white"
                  fontSize="sm"
                  fontFamily={'"Quicksand", sans-serif'}
                >
                  @{auth?.user?.username?.toLowerCase() || "admin"}
                </Text>
              </Box>
              <VStack align="stretch" px={4} py={2} bg="white">
                {[
                  {
                    icon: FiUser,
                    title: "Quản lý tài khoản",
                    desc: "Thông tin cá nhân",
                    bg: "#E0E7FF",
                    color: "#3B49DF",
                  },
                  {
                    icon: FiCalendar,
                    title: "Quản lý thiệp cưới",
                    desc: "Thiệp của bạn",
                    bg: "#FFE8E8",
                    color: "#E03B3B",
                    onClick: onOpenInvitation,
                  },
                  {
                    icon: FiFileText,
                    title: "Quản lý khách mời",
                    desc: "Danh sách khách mời",
                    bg: "#FFF4E5",
                    color: "#F59E0B",
                    onClick: onOpenGuest,
                  },
                  {
                    icon: FiSettings,
                    title: "Cài đặt",
                    desc: "Tùy chỉnh ứng dụng",
                    bg: "#E6F4EA",
                    color: "#38A169",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    px={2}
                    py={2}
                    borderRadius="md"
                    onClick={
                      item.onClick
                        ? () => {
                            item.onClick?.();
                            // onClosePopover();
                          }
                        : () =>
                            toaster.create({
                              title: "Chức năng này chưa được triển khai",
                              type: "info",
                            })
                    }
                    _hover={{ bg: "gray.100", cursor: "pointer" }}
                  >
                    <HStack>
                      <Box
                        bg={item.bg}
                        border={`1px solid ${item.bg}`}
                        borderRadius="10px"
                        p={1.5}
                        mr={"10px"}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={item.icon} boxSize={4.5} color={item.color} />
                      </Box>
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize={["13px", "13px", "15px"]}
                          fontFamily={'"Quicksand", sans-serif'}
                        >
                          {item.title}
                        </Text>
                        <Text
                          fontSize={["13px", "13px", "13px"]}
                          color="gray.500"
                          fontFamily={'"Quicksand", sans-serif'}
                        >
                          {item.desc}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                ))}
              </VStack>
              <Box h="1px" bg="gray.200" mx={5} my={1} />
              <Box px={4} py={3} bg="white">
                <Button
                  w="full"
                  bg="red.50"
                  colorScheme="red"
                  variant="outline"
                  borderRadius="xl"
                  fontWeight="bold"
                  color="red.500"
                  borderColor="red.500"
                  onClick={handleLogout}
                  fontFamily={'"Quicksand", sans-serif'}
                  _hover={{
                    bg: "red.100",
                    transform: "scale(1.02)",
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  <FiLogOut />
                  Đăng xuất
                </Button>
              </Box>
            </Popover.Content>
          </Popover.Positioner>
        </Portal>
      </Popover.Root>
    </>
  );
};

export default AccountPopover;
