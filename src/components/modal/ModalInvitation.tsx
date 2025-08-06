import {
  Box,
  Text,
  Popover,
  Button,
  HStack,
  Select,
  Spinner,
  useBreakpointValue,
  createListCollection,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaEdit,
  FaCopy,
  FaUserEdit,
  FaShareAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import dayjs from "dayjs";
import { GrView } from "react-icons/gr";
import { IoLink } from "react-icons/io5";
import { useState, useMemo } from "react";
import { keyframes } from "@emotion/react";
import { BsArrowRepeat } from "react-icons/bs";
import { FaPencil, FaGift } from "react-icons/fa6";
import { TbWorld, TbWorldOff } from "react-icons/tb";
import { FiMoreVertical, FiX, FiTrash2 } from "react-icons/fi";

import apiClient from "@/api/apiClient";
import getTimeDiff from "@/utils/timeSince";
import GroomIcon from "@/assets/icons/groom";
import BrideIcon from "@/assets/icons/bride";
import { toaster } from "@/components/ui/toaster";
import { useInvitations } from "@/utils/useInvitations";

const slideIn = keyframes`
0% { transform: translate(-50%, -60%) scale(0.95); opacity: 0; }
100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const ModalInvitation = ({
  open,
  onClose,
  onOpenGuest,
}: {
  open: boolean;
  onClose: () => void;
  onOpenGuest?: () => void;
}) => {
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const [selected, setSelected] = useState<any>("all");
  const { invitations, loading, refetch, setLoading } = useInvitations();

  const openGuestModal = async () => {
    onClose?.();
    onOpenGuest?.();
  };

  const deletePages = async (id: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/pages/${id}`);
      refetch();
      toaster.create({
        title: "Xóa thiêp mời thành công",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Lỗi khi xóa thiệp mời",
        description: "Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toaster.create({
        title: "Đã copy link thiệp cưới",
        type: "success",
      });
    } catch (err) {
      toaster.create({
        title: "Đã có lỗi xảy ra, vui lòng thử lại sau",
        type: "error",
      });
    }
  };

  const filteredInvitations = useMemo(() => {
    switch (selected) {
      case "published":
        return invitations.filter((item: any) => item?.isPublished);
      case "unpublished":
        return invitations.filter((item: any) => !item?.isPublished);
      case "draft":
        return invitations.filter((item: any) => item?.status === "draft");
      case "completed":
        return invitations.filter((item: any) => item?.status === "completed");
      default:
        return invitations;
    }
  }, [selected, invitations]);

  const iconList = [
    { icon: FaUsers, label: "Quản lý người dùng", onClick: openGuestModal },
    {
      icon: BsArrowRepeat,
      label: "Làm mới dữ liệu",
      onClick: () => refetch(),
    },
    { icon: FiX, label: "Đóng", onClick: onClose },
  ];

  const itemAction = [
    {
      icon: GrView,
      label: "Xen thiệp",
      onClick: (item: any) => {
        window.open(item.domain, "_blank");
      },
    },
    { icon: FaEdit, label: "Chỉnh sửa", onClick: (item: any) => {} },
    {
      icon: FaShareAlt,
      label: "Chia sẻ",
      onClick: (item: any) => {
        copyToClipboard(item.domain);
      },
    },
    { icon: TbWorldOff, label: "Huỷ xuất bản", onClick: (item: any) => {} },
    {
      icon: FaUserEdit,
      label: "Cập nhật thông tin",
      onClick: (item: any) => {},
    },
    { icon: FaUsers, label: "Quản lý khách mời", onClick: (item: any) => {} },
    { icon: FaCopy, label: "Tạo bản sao", onClick: (item: any) => {} },
  ];

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "published", label: "Đã xuất bản" },
    { value: "unpublished", label: "Chưa xuất bản" },
    { value: "draft", label: "Bản nháp" },
    { value: "completed", label: "Hoàn thành" },
  ];

  const filtersMobile = createListCollection({
    items: filters,
  });

  const headerAction = [
    {
      label: "Tổng số thiệp",
      value: invitations.length,
      icon: <FaGift />,
      color: "red.400",
      bg: "#ffe5e5",
    },
    {
      label: "Đã xuất bản",
      value: invitations?.filter((item: any) => item?.isPublished).length,
      icon: <TbWorld />,
      color: "#912828",
      bg: "#f1eaea",
    },
    {
      label: "Chưa xuất bản",
      value: invitations?.filter((item: any) => !item?.isPublished).length,
      icon: <TbWorldOff />,
      color: "red.500",
      bg: "#ffe5e5",
    },
    {
      label: "Bản nháp",
      value: invitations?.filter((item: any) => item?.status === "draft")
        .length,
      icon: <FaPencil />,
      color: "olive",
      bg: "#f1ebe6",
    },
  ];

  const InvitationCard = ({ item, index }: { item: any; index: number }) => {
    const time = getTimeDiff(item.date);

    return (
      <Box
        key={index}
        className="w-full md:w-[400px] border border-gray-200 rounded-lg bg-[#FEF8F7] shadow-md mb-5 md:mb-0"
      >
        <Box className="p-3 flex items-center rounded-t-2xl">
          <Box className="cursor-pointer text-white rounded-[10px] bg-[#F1DEDD] p-2 mr-3 text-[14px] sm:text-[14px] md:text-[18px]">
            <FaGift className="text-red-500" />
          </Box>
          <Box fontFamily={'"Quicksand", sans-serif'}>
            <Text fontSize={["14px", "13px", "16px"]} fontWeight="bold">
              {item.title}
            </Text>
            <Box
              fontSize={["10px", "10px", "12px"]}
              color={item.status !== "draft" ? "green.500" : "gray.500"}
            >
              {item.status !== "draft" ? "Hoàn thành" : "Bản nháp"}
            </Box>
          </Box>
          <Popover.Root>
            <Popover.Trigger asChild>
              <Box className="cursor-pointer text-black rounded-[10px] bg-[#F1DEDD] p-2 hover:text-red-500 text-[14px] sm:text-[14px] md:text-[18px] ml-auto">
                <FiMoreVertical />
              </Box>
            </Popover.Trigger>
            <Popover.Positioner>
              <Popover.Content className="!w-[210px]  bg-white border shadow-md rounded-md border border-gray-300 !rounded-xl p-2 bg-[#FEF8F7]">
                {itemAction.map(({ icon: Icon, onClick, label }, index) => (
                  <Box
                    key={index}
                    onClick={() => onClick(item)}
                    className="flex flex-ro text-[14px] sm:text-[14px] md:text-[14px] font-[Quicksand,sans-serif] flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                  >
                    <Icon />
                    <Text className="ml-3">{label}</Text>
                  </Box>
                ))}
                <Box className="h-px bg-gray-200 mx-5 my-1" />
                <Box
                  onClick={() => {
                    if (
                      confirm(
                        `Bạn có chắc chắn muốn xóa thiệp mời ${item.title}?`
                      )
                    ) {
                      deletePages(item.id);
                    }
                  }}
                  className="flex flex-row text-[14px] sm:text-[14px] md:text-[14px] font-[Quicksand,sans-serif] items-center p-2 hover:bg-gray-100 cursor-pointer rounded-md text-red-600"
                >
                  <FiTrash2 />
                  <Text className="ml-3">Xoá</Text>
                </Box>
              </Popover.Content>
            </Popover.Positioner>
          </Popover.Root>
        </Box>
        <Box className="flex bg-white p-2 rounded-md mx-3 border border-gray-300 flex flex-row items-center font-[Quicksand] font-bold text-[14px] sm:text-[16px] md:text-[14px]]">
          <Box className="flex-1 text-right flex items-center flex-row justify-end">
            <Box className="text-right mr-2">
              <Text className="font-medium text-[12px]">Chú rể</Text>
              <Text>{item.groom}</Text>
            </Box>
            <GroomIcon />
          </Box>
          <Text className="font-bold text-red-500 text-[25px] mx-2">❤︎</Text>
          <Box className="flex-1 text-right flex items-center flex-row">
            <BrideIcon />
            <Box className="text-left ml-2">
              <Text className="font-medium text-[12px]">Cô dâu</Text>
              <Text>{item.bride}</Text>
            </Box>
          </Box>
        </Box>
        <Box className="cursor-pointer px-4 pt-2 text-green-600 text-[12px] sm:text-[12px] md:text-[13px] font-[Quicksand,sans-serif] flex items-center focus:outline-none">
          <IoLink className="text-green-600" />
          <Text
            className="ml-3 text-green-600"
            onClick={() => window.open(item.domain)}
          >
            {item.domain}
          </Text>
        </Box>
        <Box className="px-4 pt-1 text-blue-600 text-[12px] sm:text-[12px] md:text-[13px] font-[Quicksand,sans-serif] flex items-center color-bluefocus:outline-none">
          <FaCalendarAlt className="text-blue-600" />
          <Text className="ml-3 text-blue-600">
            {dayjs(item.date).format("DD/MM/YYYY HH:mm")}
          </Text>
        </Box>
        <Box className="px-4 pt-1 text-blue-600 text-[12px] sm:text-[12px] md:text-[13px] font-[Quicksand,sans-serif] flex items-center color-bluefocus:outline-none">
          <FaCalendarAlt
            className={!item.isPublished ? "text-red-500" : "text-green-500"}
          />
          <Text
            color={!item.isPublished ? "red.500" : "green.500"}
            className="ml-3"
          >
            {!item.isPublished ? "Chưa xuất bản" : "Đã xuất bản"}
          </Text>
        </Box>
        <Box className="mt-4 bg-[#FFF5F5] p-3 rounded-md mx-3 border border-[#FBC4C4] text-[#FB7185] flex flex-col items-center font-[Quicksand] font-bold">
          ❤︎ Cưới được ❤︎
          <Text fontWeight="bold" mt={2}>
            {time.days} <span style={{ fontSize: "0.7em" }}>Ngày</span>{" "}
            {time.hours} <span style={{ fontSize: "0.7em" }}>Giờ</span>{" "}
            {time.minutes} <span style={{ fontSize: "0.7em" }}>Phút</span>
          </Text>
        </Box>
        <Box className="flex flex-row gap-3 mt-6 mb-4 justify-evenly items-center px-4">
          <Button
            onClick={() => {}}
            className="!bg-red-500 !rounded-[12px] !w-[45%] !h-[35px] !font-semibold !text-[14px] !md:text-[13px] !font-[Quicksand] !hover:bg-red-600 !transition-colors !duration-200"
          >
            Chỉnh sửa
          </Button>
          <Button
            onClick={() => {}}
            className="!bg-white !text-red-500 !border !border-red-400 !rounded-[12px] !font-semibold !w-[45%] !h-[35px] !text-[13px] !md:text-[14px] !font-[Quicksand] !hover:bg-red-50 !transition-colors !duration-200"
          >
            {!item.isPublished ? "Xuất bản" : "Xem"}
          </Button>
        </Box>
      </Box>
    );
  };

  if (!open) return null;

  return (
    <Box onClick={onClose} className="fixed inset-0 bg-transparent]">
      <Box
        className="
          fixed top-1/2 left-1/2
          w-full min-h-[75vh] sm:min-h-[85vh]
          max-w-[95%] sm:max-w-[90%] md:max-w-[85%]
          bg-white rounded-2xl shadow-xl 
        "
        transform="translate(-50%, -50%)"
        onClick={(e) => e.stopPropagation()}
        animation={`${slideIn} 0.3s ease-in-out`}
      >
        <Box className="p-6 flex items-center rounded-t-2xl bg-gradient-to-r from-[#FF5C5C] to-[#FFA3A3]">
          <Box className="cursor-pointer text-white rounded-[16px] bg-[#FF8D8D] p-3 mr-4 text-[20px] sm:text-[24px] md:text-[30px]">
            <FaGift />
          </Box>
          <Box color="white" fontFamily={'"Quicksand", sans-serif'}>
            <Text fontSize={["md", "xl", "2xl"]} fontWeight="bold">
              Quản lý thiệp cưới
            </Text>
            <Text fontSize={["sm", "md", "lg"]}>Tất cả thiệp cưới của bạn</Text>
          </Box>
          <Box display="flex" gap={3} ml="auto">
            {iconList.map(({ icon: Icon, onClick }, index) => (
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
            {headerAction.map((item, idx) => (
              <Box
                key={idx}
                className="rounded-lg text-center py-4 px-1 text-sm"
                style={{ backgroundColor: item.bg }}
              >
                <Box
                  color={item.color}
                  className="text-[20px] mb-1 flex justify-center"
                >
                  {item.icon}
                </Box>
                <Text
                  color={item.color}
                  className="text-lg font-bold font-[Quicksand,sans-serif]"
                >
                  {item.value}
                </Text>
                <Text className="text-gray-600 text-[14px] pt-1 font-[Quicksand,sans-serif]">
                  {item.label}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box my={4} px={4}>
          <HStack align="center">
            <Text className="font-medium font-[Quicksand,sans-serif]">
              Bộ lọc:
            </Text>
            {isDesktop ? (
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
            ) : (
              <Select.Root
                collection={filtersMobile}
                className="!w-[83%] text-sm font-[Quicksand]"
                onValueChange={(val) => setSelected(val.value[0])}
              >
                <Select.HiddenSelect />
                <Select.Control className="!rounded-xl border border-gray-300 font-[Quicksand]">
                  <Select.Trigger className="!border-none">
                    <Select.ValueText placeholder="Chọn bộ lọc" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Select.Positioner>
                  <Select.Content className="z-[1000] bg-white border shadow-md rounded-md border border-gray-300 !rounded-xl">
                    {filters.map((framework) => (
                      <Select.Item item={framework} key={framework.value}>
                        {framework.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            )}
          </HStack>
        </Box>
        <HStack wrap="wrap" p={4} pt={0}>
          <Box
            className="w-full gap-4 max-h-[40vh] overflow-y-auto overflow-x-hidden 
            md:flex md:flex-row md:gap-4 md:overflow-y-hidden md:overflow-x-scroll md:max-h-[65vh] 
            block flex-col"
          >
            {loading ? (
              <Box className="w-full text-center pt-5 justify-center min-h-[350px]">
                <Spinner size="lg" color="red.500" />
                <Text className="mt-4 text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] font-[Quicksand,sans-serif]">
                  Đang tải thiệp cưới...
                </Text>
              </Box>
            ) : filteredInvitations?.length === 0 ? (
              <Box
                className="w-full flex mt-6 justify-center text-center text-[12px] sm:text-[13px] md:text-[14px] font-[Quicksand,sans-serif] text-gray-600"
                minH="350px"
              >
                Không có thiệp cưới nào được tìm thấy.
              </Box>
            ) : (
              filteredInvitations?.map((item: any, index: number) => (
                <InvitationCard
                  key={item.id || index}
                  index={index}
                  item={item}
                />
              ))
            )}
          </Box>
        </HStack>
      </Box>
    </Box>
  );
};

export default ModalInvitation;
