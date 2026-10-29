'use client';

import { useEffect, useRef } from 'react';
import { Language, translateTextNode } from '@/lib/i18n';

interface TextCacheEntry {
  baseText: string;
  lastOutput: string;
}

interface AttrCacheEntry {
  basePlaceholder?: string;
  lastPlaceholder?: string;
  baseTitle?: string;
  lastTitle?: string;
}

export function AutoDomTranslator({ lang }: { lang: Language }) {
  const textCacheRef = useRef<WeakMap<Text, TextCacheEntry>>(new WeakMap());
  const attrCacheRef = useRef<WeakMap<Element, AttrCacheEntry>>(new WeakMap());
  const isApplyingRef = useRef(false);
  const langRef = useRef<Language>(lang);
  langRef.current = lang;

  useEffect(() => {
    const textCache = textCacheRef.current;
    const attrCache = attrCacheRef.current;

    const shouldSkipElement = (el: Element | null): boolean => {
      if (!el) return true;
      const tag = el.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') return true;
      if (el.closest('[data-no-translate="true"]')) return true;
      return false;
    };

    const processTextNode = (node: Text, targetLang: Language) => {
      const parent = node.parentElement;
      if (!parent || shouldSkipElement(parent)) return;
      if (parent.tagName === 'TEXTAREA') return;

      const currentVal = node.nodeValue;
      if (!currentVal || !currentVal.trim()) return;

      let entry = textCache.get(node);
      let baseText: string;

      if (entry && currentVal === entry.lastOutput) {
        baseText = entry.baseText;
      } else {
        baseText = currentVal;
      }

      const translated = translateTextNode(baseText, targetLang);
      textCache.set(node, { baseText, lastOutput: translated });

      if (node.nodeValue !== translated) {
        node.nodeValue = translated;
      }
    };

    const processElementAttrs = (el: Element, targetLang: Language) => {
      if (shouldSkipElement(el)) return;

      const placeholder = el.getAttribute('placeholder');
      const title = el.getAttribute('title');
      if (!placeholder && !title) return;

      const entry: AttrCacheEntry = attrCache.get(el) || {};

      if (placeholder && placeholder.trim()) {
        const basePlaceholder =
          entry.basePlaceholder && placeholder === entry.lastPlaceholder
            ? entry.basePlaceholder
            : placeholder;
        const translatedPlaceholder = translateTextNode(basePlaceholder, targetLang);
        entry.basePlaceholder = basePlaceholder;
        entry.lastPlaceholder = translatedPlaceholder;
        if (placeholder !== translatedPlaceholder) {
          el.setAttribute('placeholder', translatedPlaceholder);
        }
      }

      if (title && title.trim()) {
        const baseTitle =
          entry.baseTitle && title === entry.lastTitle
            ? entry.baseTitle
            : title;
        const translatedTitle = translateTextNode(baseTitle, targetLang);
        entry.baseTitle = baseTitle;
        entry.lastTitle = translatedTitle;
        if (title !== translatedTitle) {
          el.setAttribute('title', translatedTitle);
        }
      }

      attrCache.set(el, entry);
    };

    const translateSubtree = (root: Node, targetLang: Language) => {
      if (isApplyingRef.current) return;
      isApplyingRef.current = true;
      try {
        if (root.nodeType === Node.TEXT_NODE) {
          processTextNode(root as Text, targetLang);
          return;
        }

        if (root.nodeType === Node.ELEMENT_NODE) {
          processElementAttrs(root as Element, targetLang);
        }

        const walker = document.createTreeWalker(
          root,
          NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT
        );

        let currentNode: Node | null = walker.nextNode();
        while (currentNode) {
          if (currentNode.nodeType === Node.TEXT_NODE) {
            processTextNode(currentNode as Text, targetLang);
          } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
            processElementAttrs(currentNode as Element, targetLang);
          }
          currentNode = walker.nextNode();
        }
      } finally {
        isApplyingRef.current = false;
      }
    };

    // Translate entire document body on language change
    if (typeof document !== 'undefined' && document.body) {
      translateSubtree(document.body, lang);
    }

    // Observe DOM mutations (new modals, tab switches, dynamic updates)
    let rafId: number | null = null;
    const pendingNodes = new Set<Node>();

    const flushMutations = () => {
      rafId = null;
      if (pendingNodes.size === 0) return;
      const nodes = Array.from(pendingNodes);
      pendingNodes.clear();
      for (const n of nodes) {
        if (n.isConnected) {
          translateSubtree(n, langRef.current);
        }
      }
    };

    const observer = new MutationObserver((mutations) => {
      if (isApplyingRef.current) return;
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') {
          pendingNodes.add(mutation.target);
        } else if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((added) => {
            pendingNodes.add(added);
          });
        } else if (mutation.type === 'attributes') {
          pendingNodes.add(mutation.target);
        }
      }
      if (pendingNodes.size > 0 && rafId === null) {
        rafId = window.requestAnimationFrame(flushMutations);
      }
    });

    if (typeof document !== 'undefined' && document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title'],
      });
    }

    return () => {
      observer.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [lang]);

  return null;
}

