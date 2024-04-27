import { WebClient } from '@slack/web-api';
import { SLACK_API_TOKEN } from '$env/static/private';

const slack = new WebClient(SLACK_API_TOKEN);

export async function SendSlackMessage(message: string, image: string) {
	const channel = await findPapuChannel();

	if (!channel) {
		console.error('Slack channel not found');
		return;
	}

	await slackMessageWithImageToChannel(message, image, channel);

	console.log('Slack message sent');

	return;
}

async function slackMessageWithImageToChannel(message: string, image: string, channel: string): Promise<string | null> {
	// convert base64 to buffer
	const base64Data = image.split(';base64,').pop();

	if (!base64Data) {
		console.error('Base64 data not found');
		return null;
	}

	const buffer = Buffer.from(base64Data, 'base64');

	// Validate buffer
	if (!buffer) {
		console.error('Buffer not set');
		return null;
	}

	// Code to upload image to Slack
	const response = await slack.files.upload({
		file: buffer,
		channels: channel,
		filename: 'payment_qr_code.png',
		initial_comment: message
	});

	if (!response.ok) {
		console.error('Slack image upload failed');
		return null;
	}

	if (!response.file?.id) {
		console.error('Slack image ID not set');
		return null;
	}

	console.log('Slack image uploaded: ' + response.file?.id);

	return response.file?.id;
}

async function findPapuChannel(): Promise<string | null> {
	const response = await slack.conversations.list({
		types: 'public_channel,private_channel'
	});

	if (!response.ok) {
		console.error('Slack channel list failed');
		return null;
	}

	const channel = response.channels?.find((channel) => channel.name === 'papu');

	if (!channel?.id) {
		console.error('Slack channel not found');
		return null;
	}

	console.log('Slack channel found: ' + channel.id);

	return channel.id;
}
