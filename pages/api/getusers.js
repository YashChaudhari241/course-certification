import NextCors from "nextjs-cors";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    const result1 = await prisma.user.findMany({
      include: {
        name: true,
        id: true,
      },
    });
    res.status(200).json({ result: result1 });
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "db error" });
  }
}
