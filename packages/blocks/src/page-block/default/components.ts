import { BLOCK_ID_ATTR } from '@blocksuite/global/config';
import { html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { styleMap } from 'lit/directives/style-map.js';

import { toolTipStyle } from '../../components/tooltip/tooltip.js';
import type { EmbedBlockModel } from '../../embed-block/embed-model.js';
import {
  CaptionIcon,
  CopyIcon,
  DeleteIcon,
  DownloadIcon,
  LineWrapIcon,
} from '../icons.js';
import type {
  CodeBlockOption,
  DefaultPageSignals,
  EmbedEditingState,
} from './default-page-block.js';
import {
  copyCode,
  copyImage,
  deleteCodeBlock,
  downloadImage,
  focusCaption,
  toggleWrap,
} from './utils.js';

export function FrameSelectionRect(
  rect: DOMRect | null,
  scroll: {
    left: number;
    top: number;
  }
) {
  if (rect === null) return null;

  const style = {
    left: scroll.left + rect.left + 'px',
    top: scroll.top + rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
  };
  return html`
    <style>
      .affine-page-frame-selection-rect {
        position: absolute;
        background: var(--affine-selected-color);
        z-index: 1;
        pointer-events: none;
      }
    </style>
    <div
      class="affine-page-frame-selection-rect"
      style=${styleMap(style)}
    ></div>
  `;
}

export function EmbedSelectedRectsContainer(
  rects: { left: number; top: number; width: number; height: number }[]
) {
  return html`
    <style>
      .affine-page-selected-embed-rects-container > div {
        position: fixed;
        border: 2px solid var(--affine-primary-color);
      }
    </style>
    <div class="affine-page-selected-embed-rects-container resizable">
      ${rects.map(rect => {
        const style = {
          position: 'absolute',
          display: 'block',
          left: rect.left + 'px',
          top: rect.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
        };
        return html`
          <div class="resizes" style=${styleMap(style)}>
            <div class="resize top-left"></div>
            <div class="resize top-right"></div>
            <div class="resize bottom-left"></div>
            <div class="resize bottom-right"></div>
          </div>
        `;
      })}
    </div>
  `;
}

export function SelectedRectsContainer(
  rects: DOMRect[],
  scroll: {
    left: number;
    top: number;
  }
) {
  return html`
    <style>
      .affine-page-selected-rects-container > div {
        background: var(--affine-selected-color);
        z-index: 1;
        pointer-events: none;
        border-radius: 5px;
      }
    </style>
    <div class="affine-page-selected-rects-container">
      ${repeat(rects, rect => {
        const style = {
          position: 'absolute',
          display: 'block',
          left: scroll.left + rect.left + 'px',
          top: scroll.top + rect.top + 'px',
          width: rect.width + 'px',
          height: rect.height + 'px',
        };
        return html` <div style=${styleMap(style)}></div>`;
      })}
    </div>
  `;
}

export function EmbedEditingContainer(
  embedEditingState: EmbedEditingState | null,
  signals: DefaultPageSignals
) {
  if (!embedEditingState) return null;

  const style = {
    left: embedEditingState.position.x + 'px',
    top: embedEditingState.position.y + 'px',
  };

  return html`
    <style>
      .affine-embed-editing-state-container > div {
          position: fixed;
          z-index: 1;
      }

      ${toolTipStyle}
    </style>

    <div class="affine-embed-editing-state-container">
      <div style=${styleMap(style)} class="embed-editing-state">
        <format-bar-button
          class="has-tool-tip"
          width="100%"
          @click=${() => {
            focusCaption(embedEditingState.model);
            signals.updateEmbedRects.emit([]);
          }}
        >
          ${CaptionIcon}
          <tool-tip inert tip-position="right" role="tooltip">Caption</tool-tip>
        </format-bar-button>
        <format-bar-button
          class="has-tool-tip"
          width="100%"
          @click=${() => {
            downloadImage(embedEditingState.model);
          }}
        >
          ${DownloadIcon}
          <tool-tip inert tip-position="right" role="tooltip"
            >Download
          </tool-tip>
        </format-bar-button>
        <format-bar-button
          class="has-tool-tip"
          width="100%"
          @click=${() => {
            copyImage(embedEditingState.model as EmbedBlockModel);
          }}
        >
          ${CopyIcon}
          <tool-tip inert tip-position="right" role="tooltip"
            >Copy to clipboard
          </tool-tip>
        </format-bar-button>
        <format-bar-button
          class="has-tool-tip"
          width="100%"
          @click="${() => {
            embedEditingState.model.page.deleteBlock(embedEditingState.model);
            signals.updateEmbedRects.emit([]);
          }}"
        >
          ${DeleteIcon}
          <tool-tip inert tip-position="right" role="tooltip">Delete</tool-tip>
        </format-bar-button>
      </div>
    </div>
  `;
}

export function CodeBlockOptionContainer(
  codeBlockOption: CodeBlockOption | null
) {
  if (!codeBlockOption) {
    return html``;
  }
  const style = {
    left: codeBlockOption.position.x + 'px',
    top: codeBlockOption.position.y + 'px',
  };
  const syntaxElem = document.querySelector(
    `[${BLOCK_ID_ATTR}="${codeBlockOption.model.id}"] .ql-syntax`
  );
  if (!syntaxElem) {
    return html``;
  }
  const isWrapped = syntaxElem.classList.contains('wrap');
  return html`
    <style>
      .affine-codeblock-option-container > div {
          position: fixed;
          z-index: 1;
      }

      ${toolTipStyle}
    </style>

    <div class="affine-codeblock-option-container">
      <div style=${styleMap(style)} class="code-block-option">
        <format-bar-button
          class="has-tool-tip"
          @click=${() => copyCode(codeBlockOption)}
        >
          ${CopyIcon}
          <tool-tip inert tip-position="right" role="tooltip"
            >Copy to Clipboard
          </tool-tip>
        </format-bar-button>
        <format-bar-button
          class="has-tool-tip ${isWrapped ? 'filled' : ''}"
          @click=${() => toggleWrap(codeBlockOption)}
        >
          ${LineWrapIcon}
          <tool-tip inert tip-position="right" role="tooltip"
            >Wrap code
          </tool-tip>
        </format-bar-button>
        <format-bar-button
          class="has-tool-tip"
          @click=${() => deleteCodeBlock(codeBlockOption)}
        >
          ${DeleteIcon}
          <tool-tip inert tip-position="right" role="tooltip">Delete </tool-tip>
        </format-bar-button>
      </div>
    </div>
  `;
}
