import { BackgroundScript } from '../runBackgroundScript/runBackgroundScript';

export async function isYouTubePage(): Promise<boolean> {
	function location() {
		return window.location.href.includes('youtube.com');
	}
	return await BackgroundScript.run(location, '');
}
