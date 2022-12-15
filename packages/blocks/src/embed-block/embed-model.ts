import { BaseBlockModel, IBaseBlockProps, Page } from '@blocksuite/store';

type EmbedType = 'image' | 'video' | 'audio' | 'file';
export interface EmbedBlockProps extends IBaseBlockProps {
  flavour: string;
  type: EmbedType;
  sourceId: string;
  width?: number;
  height?: number;
  caption?: string;
}

export class EmbedBlockModel extends BaseBlockModel implements EmbedBlockProps {
  static version = [1, 0] as [number, number];
  flavour = 'affine:embed' as const;

  width: number;
  height: number;
  type: EmbedType;
  sourceId: string;
  caption: string;

  constructor(page: Page, props: Partial<EmbedBlockProps>) {
    super(page, props);
    this.type = props.type ?? 'image';
    this.caption = props.caption ?? 'image';
    this.sourceId = props.sourceId ?? '';
    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
  }
}
