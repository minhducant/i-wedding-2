import {
  Box,
  Input,
  Text,
  Button,
  Select,
  Portal,
  createListCollection,
} from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { keyframes } from "@emotion/react";

import apiClient from "@/api/apiClient";
import { toaster } from "@/components/ui/toaster";

const slideIn = keyframes`
  0% { transform: translate(-50%, -60%) scale(0.95); opacity: 0; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

const AddGuestDialog = ({
  item,
  open,
  pageId,
  onClose,
  fetchGuest,
}: {
  pageId?: any;
  item?: any;
  open: boolean;
  onClose: () => void;
  fetchGuest: () => void;
}) => {
  const isEdit = item && Object.keys(item).length > 0;
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const numberOfPeopleRef = useRef<HTMLInputElement>(null);
  const [guestOf, setGuestOf] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const defaultValue = item?.guestOf ? [item.guestOf] : [];
      setGuestOf(defaultValue);
    }
  }, [item, open]);

  const frameworks = createListCollection({
    items: [
      { label: "Cô dâu", value: "bride" },
      { label: "Chú rể", value: "groom" },
      { label: "Cả hai", value: "both" },
      { label: "Gia đình", value: "family" },
      { label: "Bạn bè", value: "friend" },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...item,
      pageId: pageId || item.pageId,
      guestOf: guestOf[0] || item.guestOf,
      phone: phoneRef?.current?.value || "",
      email: emailRef?.current?.value || "",
      fullName: nameRef?.current?.value || "",
      numberOfPeople: numberOfPeopleRef?.current?.value || 1,
    };
    try {
      if (isEdit) {
        await apiClient.put(`/guests/${item.id}`, data);
      } else {
        await apiClient.post("/guests", data);
      }
      toaster.create({
        title: isEdit
          ? "Cập nhật khách mời thành công"
          : "Thêm mới khách mời thành công",
        type: "success",
      });
      fetchGuest();
      onClose();
    } catch (error) {
      toaster.create({
        title: isEdit
          ? "Cập nhật khách mời thất bại"
          : "Cập nhật khách mời thất bại",
        description: "Vui lòng kiểm tra lại.",
        type: "error",
      });
    }
  };

  if (!open) return null;

  return (
    <>
      <Box className="fixed inset-0 bg-black/60 z-[100001]" />
      <Box
        onClick={(e) => e.stopPropagation()}
        transform="translate(-50%, -50%)"
        animation={`${slideIn} 0.3s ease-in-out`}
        className={`!fixed !top-1/2 !left-1/2  bg-white rounded-xl shadow-xl z-[100001] p-6 w-[90%] max-w-[700px] h-auto`}
      >
        <form onSubmit={handleSubmit}>
          <Box className="mb-4 flex justify-between items-center">
            <Text className="text-2xl font-bold font-[Quicksand]">
              {isEdit ? "Cập nhật khách mời" : "Thêm khách mời"}
            </Text>
            <Box
              onClick={onClose}
              className="cursor-pointer text-gray-600 hover:text-red-500"
            >
              <FiX size={24} />
            </Box>
          </Box>
          <Box className="flex flex-wrap gap-x-4">
            <Box className="w-full md:w-[48%] mb-3">
              <Text className="mb-1 pb-[5px] font-[Quicksand] text-[14px]">
                Tên khách mời{" "}
                <Text as="span" className="text-red-500 font-bold">
                  *
                </Text>
              </Text>
              <Input
                required
                ref={nameRef}
                autoComplete="off"
                placeholder="Tên khách mời"
                defaultValue={item?.fullName || ""}
                className="bg-[#F5EEED] !rounded-xl border border-gray-300 font-[Quicksand] focus:border-red-600 focus:outline-none"
              />
            </Box>
            <Box className="w-full md:w-[48%] mb-3">
              <Text className="mb-1 pb-[5px] font-[Quicksand] text-[14px]">
                Email
              </Text>
              <Input
                type="email"
                ref={emailRef}
                autoComplete="off"
                placeholder="Email"
                defaultValue={item?.email || ""}
                className="bg-[#F5EEED] !rounded-xl font-[Quicksand] pr-[40px] focus:border-red-600"
              />
            </Box>
            <Box className="w-full md:w-[48%] mb-3 mt-3">
              <Text className="mb-1 pb-[5px] font-[Quicksand] text-[14px]">
                Số điện thoại
              </Text>
              <Input
                ref={phoneRef}
                autoComplete="off"
                placeholder="Số điện thoại"
                defaultValue={item?.phone || ""}
                title="Số điện thoại không hợp lệ"
                pattern="^(0|\+84)(3|5|7|8|9)[0-9]{8}$"
                className="bg-[#F5EEED] !rounded-xl font-[Quicksand] pr-[40px] focus:border-red-600"
              />
            </Box>
            <Box className="w-full md:w-[48%] mb-3 mt-3">
              <Text className="mb-1 pb-[5px] font-[Quicksand] text-[14px]">
                Số người
              </Text>
              <Input
                type="number"
                ref={numberOfPeopleRef}
                autoComplete="off"
                placeholder="Số người"
                defaultValue={item?.numberOfPeople || 1}
                className="bg-[#F5EEED] !rounded-xl border border-gray-300 font-[Quicksand] focus:border-red-600 focus:outline-none"
              />
            </Box>
          </Box>
          <Box className="w-full mb-3 mt-3 pr-[10px] font-[Quicksand] text-[14px]">
            <Text className="mb-1 pb-[5px]">Khách mời của</Text>
            <Select.Root
              value={guestOf}
              collection={frameworks}
              onValueChange={(val) => setGuestOf(val.value)}
            >
              <Select.Control className="!rounded-xl border border-gray-300">
                <Select.Trigger className="!border-none">
                  <Select.ValueText placeholder="Chọn loại khách" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                  <Select.ClearTrigger />
                </Select.IndicatorGroup>
              </Select.Control>
              <Select.Positioner>
                <Select.Content className="z-[1000] bg-white border shadow-md rounded-md border border-gray-300 !rounded-xl">
                  {frameworks?.items?.map((item) => (
                    <Select.Item
                      item={item?.value}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer font-[Quicksand,sans-serif]"
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          </Box>
          <Box className="flex flex-row gap-3 mt-6 mb-2 justify-evenly items-center px-2">
            <Button
              type="submit"
              className="!bg-red-500 !rounded-[12px] !w-[45%] !h-[35px] !font-semibold !text-[14px] !md:text-[13px] !font-[Quicksand] !hover:bg-red-600 !transition-colors !duration-200"
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button
              onClick={onClose}
              className="!bg-white !text-red-500 !border !border-red-400 !rounded-[12px] !font-semibold !w-[45%] !h-[35px] !text-[13px] !md:text-[14px] !font-[Quicksand] !hover:bg-red-50 !transition-colors !duration-200"
            >
              Huỷ
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default AddGuestDialog;
