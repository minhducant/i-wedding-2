import {
  Box,
  Table,
  Text,
  Input,
  VStack,
  HStack,
  Select,
  Spinner,
  useDisclosure,
  UseDisclosureProps,
  useBreakpointValue,
  createListCollection,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useState, useEffect } from "react";
import { BsArrowRepeat } from "react-icons/bs";
import { MdFamilyRestroom } from "react-icons/md";
import { FiX, FiTrash2, FiEdit2 } from "react-icons/fi";
import { FaMale, FaFemale, FaPhoneAlt, FaMailBulk } from "react-icons/fa";
import { FaGift, FaUsers, FaPlus, FaUsersViewfinder } from "react-icons/fa6";

import apiClient from "@/api/apiClient";
import { toaster } from "@/components/ui/toaster";
import { useInvitations } from "@/utils/useInvitations";
import AddGuestDialog from "@/components/modal/ModalAddGuest";

const slideIn = keyframes`
  0% { transform: translate(-50%, -60%) scale(0.95); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  `;

const ModalGuest = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const {
    open: openAddGuest,
    onOpen: onOpenAddGuest,
    onClose: onCloseAddGeuest,
  }: UseDisclosureProps = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, md: true });
  const { invitations } = useInvitations();
  const [guest, setGuest] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterGuestOf, setFilterGuestOf] = useState("");
  const [filterPageId, setFilterPageId] = useState<any>("");
  const [selectedGuest, setSelectedGuest] = useState<any>({});

  useEffect(() => {
    fetchGuest();
  }, [filterPageId, searchText, filterGuestOf]);

  const fetchGuest = async (type?: string) => {
    try {
      setLoading(true);
      const response = await apiClient.get("/guests", {
        params: {
          search: searchText,
          pageId: filterPageId,
          guestOf: filterGuestOf,
        },
      });
      setGuest(response.data.data.data);
    } catch (error) {
      toaster.create({
        title: "Lỗi khi tải danh sách khách mời",
        description: "Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      setLoading(true);
      await apiClient.delete(`/guests/${id}`);
      fetchGuest();
      toaster.create({
        title: "Xóa khách mời thành công",
        type: "success",
      });
    } catch (error) {
      toaster.create({
        title: "Lỗi khi xóa khách mời",
        description: "Vui lòng thử lại sau.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const iconList = [
    { icon: FaPlus, label: "Thêm mới", onClick: onOpenAddGuest },
    {
      icon: BsArrowRepeat,
      label: "Làm mới dữ liệu",
      onClick: () => fetchGuest(),
    },
    { icon: FiX, label: "Đóng", onClick: onClose },
  ];

  const guestMap: Record<string, { icon: any; label: string }> = {
    bride: { icon: <FaFemale />, label: "Cô dâu" },
    groom: { icon: <FaMale />, label: "Chú rể" },
    both: { icon: "❤︎", label: "Cả hai" },
    family: { icon: <MdFamilyRestroom />, label: "Gia đình" },
    friend: { icon: <FaUsers />, label: "Bạn bè" },
  };

  const guestStyleMap: Record<string, string> = {
    bride: "bg-[#F1EDEA] text-[#B09287] border border-[#D4C4BC]",
    groom: "bg-[#E6F0F6] text-[#5C9DB3] border border-[#B3D1DE]",
    both: "bg-[#FCEAEA] text-[#EF6C6C] border border-[#FBC4C4]",
    family: "bg-[#FFF4E5] text-[#D48C00] border border-[#FFD8A8]",
    friend: "bg-[#EAF4FF] text-[#4A90E2] border border-[#B6D9FF]",
  };

  const frameworksGuest = createListCollection({
    items: [
      { label: "Cô dâu", value: "bride" },
      { label: "Chú rể", value: "groom" },
      { label: "Cả hai", value: "both" },
      { label: "Gia đình", value: "family" },
      { label: "Bạn bè", value: "friend" },
    ],
  });

  const frameworksPages = createListCollection({
    items:
      invitations?.map((item, index) => ({
        label: item?.title,
        value: item?.id,
      })) ?? [],
  });

  const headerAction = [
    {
      label: "Tổng số khách",
      value: guest.length,
      icon: <FaUsers />,
      color: "red.400",
      bg: "#ffe5e5",
    },
    {
      label: "Tổng tham gia",
      value: guest.length,
      icon: <FaUsersViewfinder />,
      color: "#912828",
      bg: "#f1eaea",
    },
    {
      label: "Khách nhà Trai",
      value: guest?.filter((item: any) => item?.guestOf === "groom").length,
      icon: <FaMale />,
      color: "red.500",
      bg: "#ffe5e5",
    },
    {
      label: "Khách nhà gái",
      value: guest?.filter((item: any) => item?.guestOf === "bride").length,
      icon: <FaFemale />,
      color: "olive",
      bg: "#f1ebe6",
    },
  ];

  if (!open) return null;

  return (
    <Box className="fixed inset-0 bg-transparent">
      <AddGuestDialog
        item={selectedGuest}
        pageId={filterPageId}
        open={openAddGuest}
        fetchGuest={fetchGuest}
        onClose={() => {
          setSelectedGuest({});
          onCloseAddGeuest();
        }}
      />
      <Box
        className="
          fixed top-1/2 left-1/2
          w-full min-h-[75vh] sm:min-h-[85vh]
          max-w-full sm:max-w-[90%] md:max-w-[85%]
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
              Quản lý khách mời
            </Text>
            <Text fontSize={["sm", "md", "lg"]}>
              Quản lý danh sách khách mời và thông tin tham dự
            </Text>
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
        <Box className="px-4 w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 font-[Quicksand,sans-serif]">
          <Input
            placeholder="Tìm kiếm theo tên"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="bg-[#F5EEED] !rounded-xl border border-gray-300 font-[Quicksand] focus:border-red-600 focus:outline-none font-bold"
          />
          <Box className="grid grid-cols-2 gap-4 md:contents">
            <Select.Root
              collection={frameworksGuest}
              onValueChange={(val) => setFilterGuestOf(val.value[0])}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 font-bold !rounded-xl">
                  <Select.ValueText placeholder="Tất cả khách" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content className="z-[1000] bg-white border shadow-md rounded-md border border-gray-300 !rounded-xl">
                  {frameworksGuest.items.map((item: any, index: number) => (
                    <Select.Item
                      key={index}
                      item={item.value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-[Quicksand,sans-serif]"
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
            <Select.Root
              collection={frameworksPages}
              onValueChange={(val) => setFilterPageId(val.value[0])}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger className="w-full border border-gray-300 rounded-md px-3 py-2 font-bold !rounded-xl">
                  <Select.ValueText placeholder="Tất cả thiệp mời" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content className="z-[1000] bg-white border shadow-md rounded-md border border-gray-300 !rounded-xl">
                  {frameworksPages.items.map((item: any, index: number) => (
                    <Select.Item
                      key={index}
                      item={item.value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-[Quicksand,sans-serif]"
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Box>
        </Box>
        <HStack wrap="wrap" p={4} pt={0}>
          {loading ? (
            <Box className="w-full text-center pt-5 justify-center min-h-[350px]">
              <Spinner size="lg" color="red.500" />
              <Text className="mt-4 text-gray-600 text-[12px] sm:text-[13px] md:text-[14px] font-[Quicksand,sans-serif]">
                Đang tải danh sách khách mời...
              </Text>
            </Box>
          ) : guest?.length === 0 ? (
            <Box
              className="w-full flex mt-6 justify-center text-center text-[12px] sm:text-[13px] md:text-[14px] font-[Quicksand,sans-serif] text-gray-600"
              minH="350px"
            >
              Không có khách mời nào được tìm thấy.
            </Box>
          ) : (
            <>
              {isDesktop ? (
                <Box w="100%" overflowX="auto">
                  <Table.Root className="w-full min-w-[1600px] border-collapse text-sm">
                    <Table.Header>
                      <Box
                        className="bg-[#FFE5E5] border border-gray-200 border-b-2 border-b-[#FF8D8D]
                            rounded-t-[16px] grid grid-cols-6 gap-4 px-[30px] py-4 text-center
                            text-[#912828] text-[14px] font-bold font-[Quicksand]"
                      >
                        <Text>Tên</Text>
                        <Text>Số điện thoại</Text>
                        <Text>Email</Text>
                        <Text>Khách của</Text>
                        <Text>Số người</Text>
                        <Text> </Text>
                      </Box>
                    </Table.Header>
                    <Table.Body>
                      <Box className="bg-[#FEF8F7] border border-gray-200 rounded-b-[16px] min-h-[300px] max-h-[400px] overflow-y-auto">
                        {guest.map((item: any) => (
                          <Box
                            key={item.id}
                            className="grid grid-cols-6 gap-4 items-center px-[30px] py-3 border-b border-gray-200 last:border-b-0 text-[14px] font-[Quicksand,sans-serif] text-center"
                          >
                            <Text className="font-bold">{item.fullName}</Text>
                            <Text>{item.phone || "Chưa có"}</Text>
                            <Text>{item.email || "Chưa có"}</Text>
                            <Box
                              className={`flex items-center justify-center w-[130px] h-full px-3 py-1 rounded-full text-sm font-semibold ml-[60px] ${
                                guestStyleMap[item?.guestOf] ??
                                "bg-gray-100 text-gray-500 border border-gray-300"
                              }`}
                            >
                              <span className="mr-2">
                                {guestMap[item?.guestOf]?.icon}
                              </span>
                              {guestMap[item?.guestOf]?.label}
                            </Box>
                            <Box className="flex items-center justify-center gap-1 font-bold">
                              <FaUsers />
                              <Text className="ml-1">
                                {item.numberOfPeople || 1}
                              </Text>
                            </Box>
                            <HStack className="justify-end">
                              <Box
                                className="cursor-pointer text-red-500 hover:text-red-700 bg-[#EAD3D2] p-2 rounded-md"
                                onClick={() => {
                                  setSelectedGuest(item);
                                  onOpenAddGuest();
                                }}
                              >
                                <FiEdit2 />
                              </Box>
                              <Box
                                className="cursor-pointer text-red-500 hover:text-red-700 bg-[#EAD3D2] p-2 rounded-md ml-2"
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Bạn có chắc chắn muốn xóa khách mời ${item.fullName}?`
                                    )
                                  ) {
                                    deleteGuest(item.id);
                                  }
                                }}
                              >
                                <FiTrash2 />
                              </Box>
                            </HStack>
                          </Box>
                        ))}
                      </Box>
                    </Table.Body>
                  </Table.Root>
                </Box>
              ) : (
                <Box className="w-full">
                  <Box
                    className="bg-[#FFE5E5] border border-gray-200 border-b-2 border-b-[#FF8D8D] 
                        rounded-t-[16px] text-[#912828] text-[16px] font-bold font-[Quicksand] 
                        py-2 px-5 flex items-center gap-2"
                  >
                    <FaUsers />
                    <Text className="ml-2">
                      Danh sách khách mời ({guest.length})
                    </Text>
                  </Box>
                  <Box className="h-[30vh] overflow-y-auto space-y-4 w-full p-4 border border-gray-200 rounded-b-[16px]">
                    {guest.map((item: any, index: number) => (
                      <Box
                        key={index}
                        className="rounded-xl border border-gray-300 p-4 shadow-md bg-[#FEF8F7] w-full font-[Quicksand,sans-serif] flex"
                      >
                        <Box>
                          <Text className="text-lg font-bold mb-1">
                            {item.fullName}
                          </Text>
                          <Box
                            className={`inline-flex items-center mb-2 px-3 py-0 rounded-full text-sm font-semibold ${
                              guestStyleMap[item?.guestOf] ??
                              "bg-gray-100 text-gray-500 border border-gray-300 min-h-[24px] min-w-[85px]"
                            }`}
                          >
                            <span className="mr-2">
                              {guestMap[item?.guestOf]?.icon}
                            </span>
                            {guestMap[item?.guestOf]?.label}
                          </Box>
                          <Box className="text-sm text-gray-600 my-1 flex  items-center ">
                            <FaPhoneAlt />
                            <Text className="ml-2">
                              {item.phone || "Chưa có"}
                            </Text>
                          </Box>
                          <Box className="text-sm text-gray-600 my-1 flex  items-center ">
                            <FaMailBulk />
                            <Text className="ml-2">
                              {item.email || "Chưa có"}
                            </Text>
                          </Box>
                          <Box className="text-sm text-gray-600 my-1 flex  items-center ">
                            <FaUsers />{" "}
                            <Text className="ml-2">
                              {item.numberOfPeople || "0"} người
                            </Text>
                          </Box>
                        </Box>
                        <VStack className="justify-center mt-4 ml-auto">
                          <Box
                            className="cursor-pointer text-red-500 hover:text-red-700 bg-[#EAD3D2] p-2 rounded-md"
                            onClick={() => {
                              setSelectedGuest(item);
                              onOpenAddGuest();
                            }}
                          >
                            <FiEdit2 />
                          </Box>
                          <Box
                            className="cursor-pointer text-red-500 hover:text-red-700 bg-[#EAD3D2] p-2 rounded-md mt-2"
                            onClick={() => {
                              if (
                                confirm(
                                  `Bạn có chắc chắn muốn xóa khách mời ${item.fullName}?`
                                )
                              ) {
                                deleteGuest(item.id);
                              }
                            }}
                          >
                            <FiTrash2 />
                          </Box>
                        </VStack>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default ModalGuest;
