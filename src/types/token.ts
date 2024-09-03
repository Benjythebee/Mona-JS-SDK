export type InvalidWallet = {
  detail: string;
};

export type Token = {
  chainId: number;
  contract: string;
  tokenId: string;
  kind: 'erc721' | 'erc1155';
  name: string;
  image: string;
  imageSmall: string;
  imageLarge: string;
  metadata: any;
  description: string;
  rarityScore: number;
  rarityRank: number;
  supply: number;
  media: any;
  collection: {
    id: string;
    name: string;
    slug: string;
    symbol: string;
    imageUrl: string;
    tokenCount: number;
    contractDeployedAt: string;
  };
  floorAsk: {
    id: string | null;
    price: {
      amount: number | null;
      netAmount: number | null;
      currency: string | null;
    };
    maker: string | null;
    validFrom: string | null;
    validUntil: string | null;
    quantityFilled: number | null;
    quantityRemaining: number | null;
    source: string | null;
  };
  topBid: {
    id: string | null;
    price: {
      amount: number | null;
      netAmount: number | null;
      currency: string | null;
    };
    maker: string | null;
    validFrom: string | null;
    validUntil: string | null;
    quantityFilled: number | null;
    quantityRemaining: number | null;
    source: string | null;
  };
  files: any[];
  attributes: {
    key: string;
    kind: 'string' | 'number';
    value: string | number;
    tokenCount: number;
  }[];
};

export type AnimationResponse = {
  animationUrl: string;
  animationType: 'avatar' | string;
  animationFiletype: 'vrm' | string;
};


export type TokenAnimatable = Token & {animation:AnimationResponse}
