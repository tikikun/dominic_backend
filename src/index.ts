import express, { Request, Response } from "express";
import * as fs from "fs";

const app = express();

app.use(express.json());


app.get("/downloadfile", async (req: Request, res: Response) => {
  const uri = String(req.query.uri);
  const folderName = req.query.folderName ? String(req.query.folderName) : '';
  console.log(folderName)
  if (!uri) {
    return res.send(
      JSON.stringify({
        message: "Uri is required to download thing",
      })
    );
  }

  console.log(req.method, req.url, `Here is the uri for the file ${uri}`);

  try {
    const aria_response = await sendMagnetToAria2c(uri,folderName);
    if ("error" in aria_response) {
      console.log("send the issue");
      res.send(
        JSON.stringify({
          message: `There is error,Issue:${aria_response.error.message}`,
        })
      );
    } else {
      res.send(
        JSON.stringify({
          message: `Success, the job ID is: ${aria_response.id  }`,
        })
      );
    }
  } catch (error) {
    console.log(error);
    res.send(
      JSON.stringify({
        message: `There is strange error, here is log ${error}`,
      })
    );
  }
});

/**
 * Lists the contents of a directory and returns the result as a JSON response.
 *
 * @param req - Express.js request object
 * @param res - Express.js response object
 *
 * @returns JSON response with a list of filenames in the directory. In case of an error, returns a JSON response with a 500 status code and an error message.
 */
app.get("/listfiles", (req: Request, res: Response) => {
  try {
    const files = fs.readdirSync("/Volumes/Tuandisk");
    const folders = [];
    for (const file of files) {
      const stats = fs.statSync(`/Volumes/Tuandisk/${file}`);
      if (stats.isDirectory()) {
        folders.push(file);
      }
    }
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get("/alantest", async (req: Request, res: Response, next) => {
  console.log("thunghiem auth");
  res.send("thunghiem nay ");
});


app.get('/downloads', async (req, res) => {
  try {
    const response = await fetch('http://localhost:6800/jsonrpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: 'aria2.tellActive',
        id: 'downloads',
        jsonrpc: '2.0'
      })
    });
    const data = await response.json();
    res.json(data.result);
  } catch (err) {
    res.status(500).json({ err });
  }
});



app.listen(3000, () => {
  console.log("Server listening on port 3000");
});



async function sendMagnetToAria2c(uri: string, folder: string) {
  const rootDir = '/Volumes/Tuandisk';
  const aria2cUrl = "http://localhost:6800/jsonrpc";
  const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  console.log(`${rootDir}/${folder}`)
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: id,
      method: "aria2.addUri",
      params: [[uri], {dir: `${rootDir}/${folder}`}],
    }),
  };

  const response = await fetch(aria2cUrl, options);
  const data = await response.json();
  console.log(data);
  return data;
}