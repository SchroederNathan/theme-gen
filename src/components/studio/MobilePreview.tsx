"use client";

import { PhoneFrame } from "./mobile/PhoneFrame";
import { WalletScreen } from "./mobile/WalletScreen";
import { ExploreScreen } from "./mobile/ExploreScreen";
import { PlayerScreen } from "./mobile/PlayerScreen";

export default function MobilePreview() {
  return (
    <div className="flex flex-col items-center gap-16 lg:flex-row lg:flex-wrap lg:items-start lg:justify-center lg:gap-12">
      <PhoneFrame label="Wallet">
        <WalletScreen />
      </PhoneFrame>
      <PhoneFrame label="Explore">
        <ExploreScreen />
      </PhoneFrame>
      <PhoneFrame label="Player">
        <PlayerScreen />
      </PhoneFrame>
    </div>
  );
}
