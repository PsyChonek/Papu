import { paymentData } from '$lib/payment';
import type { Participant } from '$lib/types/participant';
import QRCode from 'qrcode';

interface SlackImage {
	name: string;
	value: number;
	image_url: string;
}

export async function generateQRCode(participants: Participant[], iban: string): Promise<string> {
	let qrCodesData: SlackImage[] = [];

	for (const participant of participants) {
		var data = paymentData(iban, participant.total, `Payment for ${participant.name} from Papu`, participant.variableSymbol);

		// Generate QR code into variable NOT CANVAS
		const qrCodeBase64Url = await QRCode.toDataURL(data, {
			errorCorrectionLevel: 'H',
			color: {
				dark: '#000000', // Black dots
				light: '#f3f4f6' // Transparent background
			},
			width: 200
		});

		qrCodesData.push({
			name: participant.name,
			value: participant.total,
			image_url: qrCodeBase64Url
		});
	}

	const width: number = 220 * participants.length + 10;
	const height: number = 300;

	const combinedBase64Images = await combineBase64Images(qrCodesData, width, height);

	if (!combinedBase64Images) {
		console.error('Combined base64 images not set');
		return '';
	}

	return combinedBase64Images;
}

function combineBase64Images(slackImages: SlackImage[], width: number, height: number): Promise<string> {
	return new Promise((resolve) => {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');

		if (!context) {
			console.error('Canvas context not set');
			resolve('');
			return;
		}

		canvas.width = width;
		canvas.height = height;

		// Fill white background
		canvas.style.backgroundColor = 'white';
		context.fillStyle = '#f3f4f6';
		context.fillRect(0, 0, canvas.width, canvas.height);

		let x = 10;
		let y = 40;
		for (const slackImage of slackImages) {
			const image = new Image();
			image.src = slackImage.image_url;

			image.onload = () => {
				// draw name
				context.font = '20px Arial';
				context.fillStyle = 'black';
				context.textAlign = 'center';
				context.fillText(slackImage.name, x + 110, y);

				// draw qr code
				context.drawImage(image, x, y + 20, 210, 200);

				// draw rectangle around qr code rounded
				const radius = 20;

				context.strokeStyle = '#f9731655';
				context.lineWidth = 2;
				context.beginPath();
				context.moveTo(x + radius, y + 20);
				context.lineTo(x + 210 - radius, y + 20);
				context.quadraticCurveTo(x + 210, y + 20, x + 210, y + 20 + radius);
				context.lineTo(x + 210, y + 20 + 200 - radius);
				context.quadraticCurveTo(x + 210, y + 20 + 200, x + 210 - radius, y + 20 + 200);
				context.lineTo(x + radius, y + 20 + 200);
				context.quadraticCurveTo(x, y + 20 + 200, x, y + 20 + 200 - radius);
				context.lineTo(x, y + 20 + radius);
				context.quadraticCurveTo(x, y + 20, x + radius, y + 20);

				context.stroke();

				// draw text
				context.fillText(slackImage.value.toFixed() + ' Kč', x + 110, y + 250);

				x += 220;

				if (x >= width) {
					resolve(canvas.toDataURL('image/png'));
				}
			};
		}
	});
}
