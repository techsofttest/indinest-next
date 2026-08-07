import React from 'react';

function getPlainText(node: React.ReactNode): string {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return String(node);
    if (!React.isValidElement(node)) return '';

    const props = node.props as { children?: React.ReactNode };
    const children = props.children;
    if (Array.isArray(children)) return children.map(getPlainText).join(' ');
    return getPlainText(children);
}

export function calculateReadingTime(content: React.ReactNode): number {
    const text = getPlainText(content);
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.ceil(wordCount / wordsPerMinute);
}