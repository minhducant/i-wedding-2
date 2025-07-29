import { Box, Circle, Image } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";

const pulse = keyframes`
  0%   { transform: scale(1); }
  50%  { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

const shakeAndPulse = keyframes`
  0% { transform: scale(1) rotate(0deg); }
  20% { transform: scale(1.1) rotate(2deg); }
  40% { transform: scale(0.95) rotate(-2deg); }
  60% { transform: scale(1.05) rotate(1deg); }
  80% { transform: scale(0.97) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const slideOutLeft = keyframes`
  0% { transform: translateX(0); opacity: 1; }
  100% { transform: translateX(-100%); opacity: 0; }
`;

const slideInRight = keyframes`
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
`;

export default function FloatingWidget() {
  const [isMessenger, setIsMessenger] = useState(true);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const [showIcon, setShowIcon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSlidingOut(true); // trigger slide-out

      setTimeout(() => {
        setShowIcon(false); // ẩn icon cũ
        setIsMessenger((prev) => !prev); // đổi icon

        setTimeout(() => {
          setShowIcon(true); // hiện icon mới
          setIsSlidingOut(false); // reset state
        }, 10); // Delay nhỏ để trigger animation in
      }, 300); // Thời gian slide out
    }, 3000); // Đổi icon mỗi 3s

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      className="border border-blue-400 fixed bottom-[5%] right-[1%] border-2"
      rounded="md"
      p={2}
      bg="white"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={4}
      w="fit-content"
      animation={`${pulse} 2s ease-in-out infinite`}
    >
      <Box
        animation={`${shakeAndPulse} 1.5s ease-in-out infinite`}
        onClick={() => {}}
      >
        <Image src="/icon-question.png" boxSize="50px" />
      </Box>
      <Circle size="40px" bg="gray.200" overflow="hidden" position="relative">
        {showIcon && (
          <Box
            key={isMessenger ? "messenger" : "zalo"}
            animation={
              isSlidingOut
                ? `${slideOutLeft} 0.3s ease`
                : `${slideInRight} 0.3s ease`
            }
            position="absolute"
          >
            {isMessenger ? (
              <Image src={"/messenger.svg"} boxSize="30px" />
            ) : (
              <Image src="/zalo.svg" width={"20px"} height={"20px"} />
            )}
          </Box>
        )}
      </Circle>
    </Box>
  );
}
