const sharp = require("sharp");
const path = require("path");

async function cropImage(inputPath, outputPath, cropOptions) {
  try {
    await sharp(inputPath).extract(cropOptions).toFile(outputPath);

    console.log(`Image cropped and saved to ${outputPath}`);
  } catch (error) {
    console.error("Error cropping image:", error);
  }
}

// 사용 예시
const inputPath = "dataset/주간메뉴표(0701-0707).jpg";
const outputPath = "dataset/output.jpg";

// 자를 영역 설정 (x, y, width, height)
const cropOptions = {
  left: 126,
  top: 111,
  width: 50,
  height: 9,
};

cropImage(inputPath, outputPath, cropOptions)
  .then(() => console.log("Cropping complete"))
  .catch((error) => console.error("Cropping failed:", error));
