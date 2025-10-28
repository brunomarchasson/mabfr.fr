import { headers } from "next/headers";
import puppeteer from "puppeteer";
import { type NextRequest, NextResponse } from "next/server";
import { getResumeData } from "@/lib/resume";

async function launchBrowser() {
  return puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--disable-gpu",
    ],
  });
}

async function getPageContent(url: string) {
  const browser = await launchBrowser();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

  // Wait for the main resume content to be available
  await page.waitForSelector('[data-testid="resume-content"], #resume-content', { timeout: 15000 });

  return { page, browser };
}

async function getPDF(url: string) {
  const { page, browser } = await getPageContent(url);

  await page.emulateMediaType('print');

  // Inject CSS to force animations off and content to be visible
  await page.addStyleTag({
    content: `
      * {
        transition: none !important;
        animation: none !important;
      }
      /* Target elements hidden by framer-motion */
      [style*="opacity: 0"] {
        opacity: 1 !important;
        transform: none !important;
        visibility: visible !important;
      }
    `
  });

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    // margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
  });

  await browser.close();

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume.pdf"`,
    },
  });
}

async function getHTML(url: string) {
  try {
    const { page, browser } = await getPageContent(url);

    const resumeHtml = await page.$eval('[data-testid="resume-content"], #resume-content', el => el.outerHTML);
    
    const links = await page.$$eval('link[rel="stylesheet"]', links => links.map(link => link.href));
    const styles = await page.$$eval('style', styles => styles.map(style => style.innerHTML));

    const stylePromises = Array.isArray(links) ? links.map(async (linkUrl) => {
      try {
        const cssResponse = await fetch(linkUrl);
        if (!cssResponse.ok) return '';
        let cssText = await cssResponse.text();
        
        const fontFaceRegex = /@font-face\s*{[^}]*}/g;
        const urlRegex = /url\((.*?)\)/g;
        const fontFaceRules = cssText.match(fontFaceRegex);

        if (fontFaceRules) {
            for (const rule of fontFaceRules) {
                let newRule = rule;
                const urls = rule.match(urlRegex);
                if (urls) {
                    for (const urlString of urls) {
                        const urlMatch = urlString.match(/url\((.*?)\)/);
                        if (urlMatch && urlMatch[1]) {
                            const path = urlMatch[1].replace(/['"]/g, '');
                            const fontUrl = new URL(path, linkUrl).href;
                            try {
                                const fontResponse = await fetch(fontUrl);
                                if (fontResponse.ok) {
                                    const fontBuffer = await fontResponse.arrayBuffer();
                                    const base64Font = Buffer.from(fontBuffer).toString('base64');
                                    const mimeType = fontResponse.headers.get('content-type') || 'font/otf';
                                    const newDataUri = `url(data:${mimeType};base64,${base64Font})`;
                                    newRule = newRule.replace(urlString, newDataUri);
                                }
                            } catch (e) {
                                console.error(`Failed to fetch font: ${fontUrl}`, e);
                            }
                        }
                    }
                }
                cssText = cssText.replace(rule, newRule);
            }
        }
        return cssText;
      } catch (e) {
        console.error(`Failed to fetch style: ${linkUrl}`, e);
        return '';
      }
    }) : [];

    const linkedStyles = await Promise.all(stylePromises);
    const allStyles = linkedStyles.join('\n') + '\n' + styles.join('\n');

    const finalHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Resume</title>
          <style>${allStyles}</style>
        </head>
        <body>
          ${resumeHtml}
        </body>
      </html>
    `;

    await browser.close();

    return new NextResponse(finalHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="resume.html"`,
      },
    });
  } catch (error) {
    console.error("Error in getHTML:", error);
    throw error; // Re-throw to be caught by the top-level POST handler
  }
}

async function getJSON(locale: string, token?: string) {
  const resume = await getResumeData(locale, token);
  const jsonString = JSON.stringify(resume.resumeData, null, 2);

  return new NextResponse(jsonString, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="resume.json"`,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { format, locale, token } = await request.json();
    const headersStore = await headers();
    const url = headersStore.get("referer");

    if (!url) {
      return NextResponse.json({ error: "Referer URL not found" }, { status: 400 });
    }

    switch (format) {
      case "pdf":
        return await getPDF(url);
      case "html":
        return await getHTML(url);
      case "json":
        return await getJSON(locale, token);
      default:
        return NextResponse.json({ error: "Invalid format specified" }, { status: 400 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate download", details: errorMessage },
      { status: 500 }
    );
  }
}