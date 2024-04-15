import sharp from "sharp";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const imageUrls = req.body.images;
	const compressedImages = await downloadAndCompressImages(imageUrls);

	res.status(200).json({ compressedImages });
}

const downloadAndCompressImages = async (imageUrls: string[]) => {
	try {
		const imageResponses = await Promise.all(
			imageUrls.map((url) =>
				axios.get(url, { responseType: "arraybuffer" }),
			),
		);

		return await Promise.all(
			imageResponses.map(async (res: any) => {
				const buffer = Buffer.from(res.data);
				const compressedBuffer = await sharp(buffer)
					.resize({ width: 200 })
					.jpeg({ quality: 50 }) // Adjust dimensions as needed
					.toBuffer();
				return compressedBuffer.toString("base64");
			}),
		);
	} catch (error) {
		console.error("Error downloading or compressing images:", error);
		throw error;
	}
};
