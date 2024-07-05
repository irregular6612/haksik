import puppeteer from "puppeteer";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";

const DB_path = "sample.html";

const url2 =
  "https://www.gist.ac.kr/kr/html/sub05/050601.html?mode=V&no=214063";
const hak2 = "050602";
let url = `https://www.gist.ac.kr/kr/html/sub05/${hak2}.html`;

const crawl = async (url) => {
  try {
    //launch browser
    const downloadPath = path.resolve("../dataset");
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: downloadPath,
    });

    //create a new page
    const page = await browser.newPage();

    //move by using url
    await page.goto(url);

    //take content(html)
    let content = await page.content();
    //load html to cheerio obj
    let $ = cheerio.load(content);

    //print total number of posts and the number of new post number
    let postDataList = $(".bd_total").find("strong");
    const totalPostNum = postDataList[0].children[0].data;
    const newPostNum = postDataList[1].children[0].data;

    if (newPostNum == 0) {
      console.log("nothing updated");
    } else {
      console.log("new data updated.");
    }
    console.log(totalPostNum, newPostNum);

    //take post list.
    const menuList = $(".bd_item_box");

    //move most recent post.
    await page.goto(url + $(menuList[0]).find("a").attr("href"), {
      waitUntil: ["domcontentloaded", "networkidle2"],
    });
    content = await page.content();
    //fs.appendFileSync(DB_path, content, (err) => console.log(err));
    $ = cheerio.load(content);

    const pdfUrl = $(
      "#txt > div.bd_container.bd_detail.bd_detail_basic > div.bd_detail_file > ul > li:nth-child(2) > a"
    ).attr("href");

    const client = await page.createCDPSession();
    ///*
    await client.send(page, {
      behavior: "allow",
      downloadPath: "../dataset",
    });
    //*/
    console.log(pdfUrl);

    await page.click(
      "#txt > div.bd_container.bd_detail.bd_detail_basic > div.bd_detail_file > ul > li:nth-child(2) > a"
    );

    /* 
    //catch iframe element
    console.log($("#pdf_file").html());

    let pdfIframe = await page.$("#pdf_file");
    let pdfIframeContentFrame = await pdfIframe.contentFrame();
    let iframeContent = await pdfIframeContentFrame.$eval(
      "#pageContainer1 > div.textLayer",
      (elem) => elem.innerHTML
    );
    fs.appendFileSync(DB_path, iframeContent, (err) => console.log(err));
    */

    await browser.close();
  } catch (err) {
    console.error(err);
  }
};

crawl(url);
/*
현재 진행 상홯 : 긁어올 사이트에 접속은 가능하나, 문제는 긁을 방법이 애매하다.
현재 사이트는 pdf를 업로드하고 이를 iframe 내부에 저장해서 사용하는 형태로 돌아가고 있는데,
페이지 소스에서 보면 div 형태에 좌표가 style에 각각 찍혀 있는 구조라, 구조로 긁어오는건 무리라 판단.
이를 긁어올 다른 방법으로 이미지 파일에서 긁어서 만들 수 있겠지만, 셀 기준을 잡기가 어려워서 날짜와 식단에 메뉴를 정리하기가 힘듦.

다른 방법으로는 


*/
