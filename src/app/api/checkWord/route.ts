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

  

  return relatedWords;
}


function mergeAndCount(arr: { word: string; index: number }[], tempArr: { word: string; index: number }[], left: number, mid: number, right: number) {
  let i = left;   // Starting index for left subarray
  let j = mid + 1; // Starting index for right subarray
  let k = left;   // Starting index to be sorted
  let invCount = 0;

  // Conditions are checked to ensure that i doesn't exceed mid and j doesn't exceed right
  while (i <= mid && j <= right) {
    if (arr[i].index <= arr[j].index) {
      tempArr[k++] = arr[i++];
    } else {
      tempArr[k++] = arr[j++];
      invCount = invCount + (mid - i + 1);
    }
  }

  // Copy the remaining elements of left subarray, if any
  while (i <= mid) {
    tempArr[k++] = arr[i++];
  }

  // Copy the remaining elements of right subarray, if any
  while (j <= right) {
    tempArr[k++] = arr[j++];
  }

  // Copy the sorted subarray into Original array
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

// Função para comparar a similaridade entre correctRelatedWords e relatedWords
function checkSimilarity(correctRelatedWords: string[], relatedWords: string[]): number {
  // Ordena a lista correctRelatedWords conforme a lista relatedWords
  const orderedCorrectWords = relatedWords.map(word => ({
    word,
    index: correctRelatedWords.indexOf(word),
  }));
  console.log(orderedCorrectWords);
  // Conta o número de inversões
  const inversionCount = getInversionCount(orderedCorrectWords);

  return inversionCount;
}

