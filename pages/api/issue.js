// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import { PrismaClient } from "@prisma/client";
import NextCors from "nextjs-cors";
import prisma from "@/lib/prisma";
var CryptoJS = require("crypto-js");
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
  let key = makeid(8);

  try {
    const result0 = await prisma.user.findFirst({
      where: {
        walletAddress: data.walletAddress,
      },
    });
    if (result0 == null) {
      res.status(403).json({ err: "User not registered" });
    }
    const result2 = await prisma.user.findFirst({
      where: {
        id: data.id,
      },
    });
    var ciphertext = CryptoJS.AES.encrypt(
      result2.name +
        "##" +
        data.course +
        "##" +
        data.grade +
        "##" +
        result0.name,
      key
    ).toString();
    const result1 = await prisma.certificate.create({
      data: {
        course: data.course,
        grade: data.grade,
        issuedBy: result0.name,
        decKey: key,
        userId: data.id,
      },
    });

    res
      .status(200)
      .json({ enc: ciphertext, wallet: result2.walletAddress, id: result1 });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while adding a new food." });
  }
}
