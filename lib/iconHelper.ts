/**
 * Helper function to check if an icon string is a mascot image path
 */
export function isMascotImage(icon: string | undefined): boolean {
    if (!icon) return false;
    return icon.startsWith('/mascot-') || icon.startsWith('http');
}

/**
 * Icon display component props
 */
export interface IconDisplayProps {
    icon: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}
