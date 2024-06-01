export default class PlatformUtil {
    public static isMobile(): boolean {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    public static isIOS(): boolean {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}