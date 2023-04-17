// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import NextCors from "nextjs-cors";

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const data = req.body;
  if (data.walletAddress == null || data.walletAddress == undefined)
    res.status(403).json({ err: "no wallet address" });

  const temp_id = makeid(6);
  try {
    const result = await prisma.user.update({
      where: {
        walletAddress: data.walletAddress,
      },
      data: {
        nonce: temp_id,
      },
    });
    res.status(200).json(temp_id);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured " });
  }
}
