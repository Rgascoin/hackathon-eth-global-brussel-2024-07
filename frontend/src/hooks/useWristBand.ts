// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { execHaloCmdWeb } from '@arx-research/libhalo/api/web';

const useWristBand = () => {
	async function callWristband(action: 'get_pkeys') {
		try {
			// --- request NFC command execution ---
			// eslint-disable-next-line @typescript-eslint/return-await
			return await execHaloCmdWeb({ name: action, keyNo: 1 });
		} catch (e) {
			// the command has failed, display error to the user
			return `Error: ${String(e)}`;
		}
	}

	return { callWristband };
};

export default useWristBand;
