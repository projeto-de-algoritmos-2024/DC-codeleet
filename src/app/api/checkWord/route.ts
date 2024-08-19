import { NextRequest } from 'next/server';
import puppeteer, { Browser } from 'puppeteer';


export async function GET(request: NextRequest) {
  try {

    const baseWord = request.nextUrl.searchParams.get('baseWord');
    const wordToCheck = request.nextUrl.searchParams.get('word');

    if (!baseWord || !wordToCheck) {
      return Response.error();
    }

    if (baseWord === wordToCheck) {
      return Response.json({ result: true });
    }

    const browser = await puppeteer.launch();
   
    const correctRelatedWords = await getRelatedWords(browser, baseWord);
    const relatedWords = await getRelatedWords(browser, wordToCheck);

    await browser.close();
    return Response.json({
      result: false,

    });
  } catch (error) {
    console.error('Error checking word:', error);
    return Response.error();
  }

};



async function getRelatedWords(browser: Browser, word: string) {
  const page = await browser.newPage();

  const baseUrl = `https://dicionariocriativo.com.br`;

  const parsedWord = word.toLowerCase();
  const urlEncodedWord = encodeURIComponent(parsedWord);

  await page.goto(`${baseUrl}/analogico/${urlEncodedWord}`);

  await page.waitForSelector('.blockList > .grid-100');

  const relatedWords = await page.evaluate(() => {
    const relatedWordsDivs = document.querySelectorAll('.blockList > .grid-100 > a');
    const relatedWords = [] as string[];

    relatedWordsDivs.forEach(relatedWordsDiv => {
      const relatedWord = relatedWordsDiv.innerText;
      relatedWords.push(relatedWord);
    });

    return relatedWords;
  });

  console.log(relatedWords);

  return relatedWords;
}


async function checkSimilarity(relatedWords: string[], relatedWordsToCheck: string[]) {
//todo: implement
}

