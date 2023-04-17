// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";
import prisma from "@/lib/prisma";
// const prisma = new PrismaClient();
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
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
    res.status(403).json({ err: "Invalid email" });
  }

  try {
    const result1 = await prisma.user.findFirst({
      where: {
        walletAddress: data.walletAddress,
      },
    });
    if (result1 !== null) {
      res.status(403).json({ err: "Already exists" });
    }
    const result = await prisma.user.create({
      data: {
        ...data,
        nonce: makeid(6),
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
