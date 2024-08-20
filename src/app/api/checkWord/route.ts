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
    const result = checkSimilarity(correctRelatedWords, relatedWords);

    await browser.close();
    return Response.json({
      result: false,
      similarity: result, 

    });
  } catch (error) {
    console.error('Error checking word:', error);
    return Response.error();
  }

};



async function getRelatedWords(browser: Browser, word: string) {
  const page = await browser.newPage();
  const baseUrl = `https://dicionariocriativo.com.br`;

  try {
    await page.goto(`${baseUrl}/analogico/${word}`);
    await page.waitForSelector('.blockList > .grid-100', { timeout: 5000 });
  } catch (error) {
    console.error(`Failed to load the initial page for word: ${word}`, error);
    return []; 
  }

  const relatedWordsSet = new Set<string>();

  try {
    const relatedWords = await page.evaluate(() => {
      const relatedWordsDivs = document.querySelectorAll('.blockList > .grid-100 > a') as NodeListOf<HTMLAnchorElement>;
      const words = [] as string[];

      relatedWordsDivs.forEach(relatedWordsDiv => {
        const relatedWord = relatedWordsDiv.innerText;
        words.push(relatedWord);
      });

      return words;
    });

    relatedWords.forEach(word => relatedWordsSet.add(word));
  } catch (error) {
    console.error(`Failed to extract related words from the initial page for word: ${word}`, error);
  }

  console.log("Got related words", Array.from(relatedWordsSet));

  const additionalPagesLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('#typeChange > .hlist > li > a') as NodeListOf<HTMLAnchorElement>;
    const urls = [] as string[];

    links.forEach(link => {
      const isDisabled = link.classList.contains('disabled');
      const isActive = link.classList.contains('active');
      if (!isDisabled && !isActive) {
        urls.push(link.href);
      }
    });

    return urls;
  });

  for (const url of additionalPagesLinks) {
    console.log("Visiting", url);
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForSelector('.blockList > .grid-100', { timeout: 5000 });

      const moreRelatedWords = await page.evaluate(() => {
        const relatedWordsDivs = document.querySelectorAll('.blockList > .grid-100 > a') as NodeListOf<HTMLAnchorElement>;
        const words = [] as string[];

        relatedWordsDivs.forEach(relatedWordsDiv => {
          const relatedWord = relatedWordsDiv.innerText;
          words.push(relatedWord);
        });

        return words;
      });

      moreRelatedWords.forEach(word => relatedWordsSet.add(word));
    } catch (error) {
      console.error(`Failed to load or extract related words from page: ${url}`, error);
    }
  }

  const uniqueRelatedWords = Array.from(relatedWordsSet);
  console.log(uniqueRelatedWords);
  return uniqueRelatedWords;
}


function mergeAndCount(arr: { word: string; index: number }[], tempArr: { word: string; index: number }[], left: number, mid: number, right: number) {
  let i = left;
  let j = mid;
  let k = left;

  console.log("mergeAndCount", left, mid, right);

  let invCount = 0;

  while (i <= mid && j <= right) {
    if (arr[i].index <= arr[j].index) {
      tempArr[k++] = arr[i++];
    } else {
      tempArr[k++] = arr[j++];
      invCount = invCount + (mid - i);
    }
  }

  while (i <= mid) {
    tempArr[k++] = arr[i++];
  }

  while (j <= right) {
    tempArr[k++] = arr[j++];
  }

  for (i = left; i <= right; i++) {
    arr[i] = tempArr[i];
  }

  return invCount;
}


function countInversions(arr: { word: string; index: number }[], tempArr: { word: string; index: number }[], left: number, right: number): number {
  let invCount = 0;
  if (right > left) {
    const mid = Math.floor((right + left) / 2);

    invCount += countInversions(arr, tempArr, left, mid);
    invCount += countInversions(arr, tempArr, mid + 1, right);
    invCount += mergeAndCount(arr, tempArr, left, mid + 1, right);
  }
  return invCount;
}

function getInversionCount(arr: { word: string; index: number }[]): number {
  const tempArr = [...arr];
  return countInversions(arr, tempArr, 0, arr.length - 1);
}

function interpretSimilarity(inversionCount: number, matchedWordsCount: number, totalWords: number, correctTotalWords: number): number {
  if (matchedWordsCount === 0) {
    return 0;
  }

  const maxInversions = (matchedWordsCount * (matchedWordsCount - 1)) / 2;

  const orderSimilarity = 1 - (inversionCount / maxInversions);

  const proportionSimilarity = matchedWordsCount / Math.max(totalWords, correctTotalWords);

  const similarity = (orderSimilarity + proportionSimilarity) / 2;

  return similarity;
}
function checkSimilarity(correctRelatedWords: string[], relatedWords: string[]): number {
  const orderedCorrectWords = relatedWords.map(word => ({
    word,
    index: correctRelatedWords.indexOf(word),
  })).filter(word => word.index !== -1);
  console.log("orderedCorrectWords", orderedCorrectWords);
  const inversionCount = getInversionCount(orderedCorrectWords);

  console.log("inversionCount", inversionCount, orderedCorrectWords.length);

  const similarity = interpretSimilarity(inversionCount, orderedCorrectWords.length, relatedWords.length, correctRelatedWords.length);
  console.log("similarity", similarity);
  return similarity;
}

