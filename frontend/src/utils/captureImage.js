import html2canvas from "html2canvas";

export const capturePlanAsImage = async (elementId, fileName) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID "${elementId}" not found.`);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      useCORS: true, // 외부 리소스 허용
      scrollX: 0, // 수평 스크롤 초기화
      scrollY: -window.scrollY, // 스크롤 위치를 포함
      windowWidth: document.documentElement.scrollWidth, // 전체 페이지 너비
      windowHeight: document.documentElement.scrollHeight, // 전체 페이지 높이
      scale: 2, // 이미지 품질 향상
    });

    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("캡처 실패: ", error);
  }
};
