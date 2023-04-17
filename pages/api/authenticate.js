var ethUtil = require("ethereumjs-util");
var sigUtil = require("eth-sig-util");

const jwt = require("jsonwebtoken");
import prisma from "@/lib/prisma";

import NextCors from "nextjs-cors";

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const data = JSON.parse(req.body);
  console.log(data);
  //   if (
  //     data === undefined ||
  //     data.walletAddress === null ||
  //     data.walletAddress === undefined ||
  //     data.signature === undefined ||
  //     data.signature === null
  //   ) {
  //     res.status(403).json({ err: "Missing parameters" });
  //     return;
  //   }
  const result = await prisma.user.findFirst({
    where: {
      walletAddress: data.walletAddress,
    },
  });
  console.log(result);
  if (
    result === undefined ||
    result.nonce === undefined ||
    result.nonce === null
  ) {
    res.status(403).json({ err: "User not found" });
    return;
  }
  const msg = "nonce:" + result.nonce;
  console.log(data.signature);
  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, "utf8"));
  const address = sigUtil.recoverPersonalSignature({
    data: msgBufferHex,
    sig: data.signature,
  });
  if (address.toLowerCase() === data.walletAddress.toLowerCase()) {
    const token = jwt.sign({ sub: result.walletAddress }, "secretKey", {
      expiresIn: "7d",
    });
    const w = await prisma.user.update({
      where: {
        walletAddress: data.walletAddress,
      },
      data: {
        verified: true,
      },
    });
    res.status(200).json({
      result: true,
      token: token,
      name: result.name,
      email: result.email,
    });
  } else {
    res.status(403).json({ err: "Invalid signature" });
  }
}
