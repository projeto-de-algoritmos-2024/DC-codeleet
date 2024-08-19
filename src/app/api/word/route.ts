import puppeteer from 'puppeteer';


export async function GET(request: Request) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseUrl = `https://dicionariocriativo.com.br/aleatoria`;

    await page.goto(`${baseUrl}`);

    const randomWord = await page.evaluate(() => {
      const randomWordDiv = document.querySelector('h1 > strong') as HTMLElement;

      const randomWord = randomWordDiv.innerText;
      return randomWord;
    }); 
    await browser.close();
    return Response.json({word: randomWord});
  } catch (error) {
    console.error('Error checking word:', error);
    return Response.error();
  }

};