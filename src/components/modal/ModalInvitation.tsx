import {
  Box,
  Table,
  Text,
  Button,
  HStack,
  Badge,
  Select,
  Spinner,
  useBreakpointValue,
  createListCollection,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import { FiX, FiCheck } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { FaGift } from "react-icons/fa6";
import { FaPencil } from "react-icons/fa6";
import { TbWorld, TbWorldOff } from "react-icons/tb";
import { BsArrowRepeat } from "react-icons/bs";

import apiClient from "@/api/apiClient";
import { toaster } from "@/components/ui/toaster";

const slideIn = keyframes`
0% { transform: translate(-50%, -60%) scale(0.95); opacity: 0; }
100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const ModalInvitation = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  if (!open) return null;

  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState("all");
  const [invitations, setInvitations] = useState<any>([]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async (type?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get("/pages/me");
      setInvitations(response.data.data);
      toaster.create({
        title: "Thiệp cưới đã được tải",
        description: "Danh sách thiệp cưới đã được cập nhật.",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Lỗi khi tải thiệp cưới",
        description:
          "Không thể tải danh sách thiệp cưới. Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const iconList = [
    { icon: FaUsers, label: "Quản lý người dùng" },
    {
      icon: BsArrowRepeat,
      label: "Làm mới dữ liệu",
      onClick: () => fetchInvitations(),
    },
    { icon: FiX, label: "Đóng", onClick: onClose },
  ];

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "published", label: "Đã xuất bản" },
    { value: "unpublished", label: "Chưa xuất bản" },
    { value: "draft", label: "Bản nháp" },
    { value: "completed", label: "Hoàn thành" },
  ];

  return (
    <Box onClick={onClose} className="fixed inset-0 bg-transparent z-[100001]">
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg="white"
        borderRadius="2xl"
        boxShadow="xl"
        zIndex={100001}
        width="100%"
        minH={["80vh", "80vh", "80vh"]}
        maxW={["95%", "90%", "85%"]}
        onClick={(e) => e.stopPropagation()}
        animation={`${slideIn} 0.3s ease-in-out`}
      >
        <Box
          p={6}
          display="flex"
          alignItems="center"
          borderTopLeftRadius={"2xl"}
          borderTopRightRadius={"2xl"}
          bg="linear-gradient(to right, #FF5C5C, #FFA3A3)"
        >
          <Box
            cursor="pointer"
            color="white"
            borderRadius="16px"
            bg="#FF8D8D"
            p="12px"
            mr="16px"
            fontSize={["20px", "24px", "30px"]}
          >
            <FaGift />
          </Box>
          <Box color="white" fontFamily={'"Quicksand", sans-serif'}>
            <Text fontSize={["md", "xl", "2xl"]} fontWeight="bold">
              Quản lý thiệp cưới
            </Text>
            <Text fontSize={["sm", "md", "lg"]}>Tất cả thiệp cưới của bạn</Text>
          </Box>
          <Box display="flex" gap={3} ml="auto">
            {iconList.map(({ icon: Icon, onClick, label }, index) => (
              <Box
                key={index}
                onClick={onClick}
                className="cursor-pointer text-white rounded-[8px] bg-[#FF8D8D] p-2 hover:text-red-500 text-[16px] md:text-[20px] lg:text-[24px]"
              >
                <Icon />
              </Box>
            ))}
          </Box>
        </Box>
        <Box px={4} mt={4} mb={6}>
          <Box
            display="grid"
            gridTemplateColumns={["repeat(4, 1fr)", "repeat(4, 1fr)"]}
            gap={3}
          >
            {[
              {
                label: "Tổng số thiệp",
                value: invitations.length,
                icon: <FaGift />,
                color: "red.400",
                bg: "#ffe5e5",
              },
              {
                label: "Đã xuất bản",
                value: invitations?.filter((item: any) => item?.isPublished)
                  .length,
                icon: <TbWorld />,
                color: "#912828",
                bg: "#f1eaea",
              },
              {
                label: "Chưa xuất bản",
                value: invitations?.filter((item: any) => !item?.isPublished)
                  .length,
                icon: <TbWorldOff/>,
                color: "red.500",
                bg: "#ffe5e5",
              },
              {
                label: "Bản nháp",
                value: invitations?.filter(
                  (item: any) => item?.status === "draft"
                ).length,
                icon: <FaPencil />,
                color: "olive",
                bg: "#f1ebe6",
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                bg={item.bg}
                borderRadius="lg"
                textAlign="center"
                py={4}
                px={1}
                fontSize="sm"
              >
                <Box
                  fontSize="20px"
                  color={item.color}
                  mb={1}
                  display="flex"
                  justifyContent="center"
                >
                  {item.icon}
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color={item.color}
                  fontFamily={'"Quicksand", sans-serif'}
                >
                  {item.value}
                </Text>
                <Text
                  color="gray.600"
                  fontSize={"14px"}
                  fontFamily={'"Quicksand", sans-serif'}
                  pt={1}
                >
                  {item.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box my={6} px={4}>
          <HStack align="center">
            <Text fontWeight="medium" fontFamily={'"Quicksand", sans-serif'}>
              Bộ lọc:
            </Text>
            <HStack align="center">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  size="sm"
                  variant="solid"
                  borderRadius="xl"
                  fontFamily={'"Quicksand", sans-serif'}
                  onClick={() => setSelected(filter.value)}
                  colorScheme={filter.value === selected ? "red" : "gray"}
                  fontWeight={filter.value === selected ? "bold" : "medium"}
                  bg={filter.value === selected ? "red.400" : "gray.100"}
                  color={filter.value === selected ? "white" : "gray.600"}
                  _hover={{
                    bg: filter.value === selected ? "red.500" : "gray.200",
                  }}
                >
                  {filter.label}
                </Button>
              ))}
            </HStack>
          </HStack>
        </Box>
        <HStack wrap="wrap" p={4} pt={0}>
          <Box
            display="flex"
            gap={4}
            w="100%"
            overflowX="scroll"
            overflowY="hidden"
            whiteSpace="nowrap"
          >
            {loading ? (
              <Box w="100%" textAlign="center" pt={5} justifyContent={"center"}>
                <Spinner size="lg" color="red.500" />
                <Text
                  mt={4}
                  color="gray.600"
                  fontSize={["12px", "13px", "14px"]}
                  fontFamily={'"Quicksand", sans-serif'}
                >
                  Đang tải thiệp cưới...
                </Text>
              </Box>
            ) : invitations?.length === 0 ? (
              <Box w="100%" textAlign="center" py={10}>
                <Text fontSize="lg" color="gray.600">
                  Không có thiệp cưới nào được tìm thấy.
                </Text>
              </Box>
            ) : (
              invitations?.map((item: any, idx: any) => (
                <Box
                  key={idx}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  p={4}
                  w="100%"
                  maxW="400px"
                  bg="white"
                  boxShadow="md"
                >
                  <Text fontWeight="bold" fontSize="lg" mb={1}>
                    {item.title}
                  </Text>

                  <Text fontSize="sm">
                    👰 {item.bride} & 🤵 {item.groom}
                  </Text>
                  <Text color="green.500" fontSize="sm" mt={2}>
                    🔗{" "}
                    <a href={item.link} target="_blank">
                      {item.link}
                    </a>
                  </Text>
                  <HStack mt={2} color="gray.600" fontSize="sm">
                    <Text>{item.datetime}</Text>
                  </HStack>
                  <Badge
                    mt={1}
                    colorScheme={
                      item.status === "Đã xuất bản" ? "green" : "orange"
                    }
                  >
                    {item.status}
                  </Badge>

                  <Box
                    mt={3}
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                    fontSize="sm"
                  >
                    ❤️ Cưới được: {item.countdown}
                  </Box>

                  <HStack mt={3}>
                    <Button size="sm" colorScheme="red">
                      Chỉnh sửa
                    </Button>
                    <Button size="sm" variant="outline">
                      {item.status === "Đã xuất bản" ? "Xem" : "Xuất bản"}
                    </Button>
                  </HStack>
                </Box>
              ))
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default ModalInvitation;
