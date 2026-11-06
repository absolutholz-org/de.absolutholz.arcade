/**
 * Props for the ShareDialog component.
 */
export interface IShareDialog {
	/**
	 * Unique HTML id attribute for the dialog element.
	 */
	id: string;
	/**
	 * Controls whether the share dialog modal is visible.
	 */
	isOpen: boolean;
	/**
	 * Callback invoked when the dialog is dismissed.
	 */
	onClose: () => void;
	/**
	 * Dialog header title (e.g. "Share Arcade" or "Share Color Flood").
	 */
	title: string;
	/**
	 * Absolute or canonical URL to share and encode into the QR code.
	 */
	shareUrl: string;
	/**
	 * Optional descriptive text passed to the Web Share API (navigator.share).
	 */
	shareText?: string;
	/**
	 * Optional toast/announcement string displayed upon successful link copy.
	 */
	copySuccessMessage?: string;
}

/**
 * Props for the internal ShareContent view body.
 */
export interface ShareContentProps {
	/**
	 * URL to encode in QR code and copy to clipboard.
	 */
	shareUrl: string;
	/**
	 * Optional text for navigator.share.
	 */
	shareText?: string;
	/**
	 * Optional title passed to navigator.share.
	 */
	title?: string;
	/**
	 * Optional toast/announcement message.
	 */
	copySuccessMessage?: string;
}
