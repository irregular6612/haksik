const axios = require("axios");
const convert = require("xml-js");
const fs = require("fs");

const DB = "sample.html";
//fs.writeFileSync(DB, "", (err) => console.log(err));

const hak1 = "050601";
const hak1_2 = "050603";
const hak2 = "050602";
let url = `https://www.gist.ac.kr/kr/html/sub05/${hak2}.html`;
const url2 =
  "https://www.gist.ac.kr/kr/html/sub05/050601.html?mode=V&no=214063";

let getHtml = async (url) => {
  try {
    const response = await axios.get(url);
    fs.appendFileSync(DB, response.data, (err) => console.log(err));
    console.log(response.data);
    if (response.status != 200) {
      const formattedHtml = convert.xml2json(response.body);
      console.log(formattedHtml);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

getHtml(url2);
