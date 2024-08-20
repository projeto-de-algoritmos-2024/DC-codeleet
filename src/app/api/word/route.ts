import puppeteer from 'puppeteer';


export async function GET(request: Request) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseUrl = `https://dicionariocriativo.com.br/aleatoria`;

    await page.goto(`${baseUrl}`);

    console.log(page.url().split('/').pop());

    const randomWord = page.url().split('/').pop();

    await browser.close();

    return Response.json({word: randomWord});
  } catch (error) {
    console.error('Error checking word:', error);
    return Response.error();
  }

};