import { AppId } from '../../types';
import { APP_REGISTRY } from '../../registry/AppRegistry';

// Re-exporting metadata structure from registry for the sidebar components
export const APP_METADATA = APP_REGISTRY;

export const PINNED_APPS: AppId[] = [
  AppId.PAPER_WRITER,
  AppId.WEB_TV,
  AppId.SHOPPER,
  AppId.WEB_STUDIO,
  AppId.ANALYTICS
];