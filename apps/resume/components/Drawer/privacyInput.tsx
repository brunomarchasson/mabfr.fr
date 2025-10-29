import { useTranslation } from "@/i18n/provider";
import { useQueryState } from "nuqs";
import React, { useState } from "react";
import { LockClosedIcon } from "./icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

function PrivacyInput({isUnlocked}: { isUnlocked: boolean }) {
  const [secret, setSecret] = useState("");
  const { t } = useTranslation();
  const [, setToken] = useQueryState("token", { shallow: false });


  const lock = () => {
    setToken(null);
  };

  const unlock = () => {
    if (secret) {
      setToken(secret);
      setSecret("");
    }
  };

  const handlePrivacyAction = () => {
    if (isUnlocked) {
      lock();
    } else {
      unlock();
    }
  };
  return (
    <div>
      <h3 className="px-1 text-sm font-semibold mb-2 flex items-center gap-1.5">
        <LockClosedIcon className="w-4 h-4" />
        {t("Drawer.privacy")}
      </h3>
      {/* <div className="grid  p-2 bg-card rounded-lg"> */}
        <div className="grid auto-flow-col gap-2 w-full bg-card rounded-lg ">
          {!isUnlocked &&
          <Input
            type="password"
            placeholder={t("Drawer.enterPassword")}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePrivacyAction()}
            // className="flex-grow w-full px-3 py-2 text-sm rounded-md focus:ring-2 outline-none transition"
            aria-label={t("Drawer.unlock")}
            disabled={isUnlocked}
          />}
          <Button
            onClick={handlePrivacyAction}
            className="w-full"
          >
            {isUnlocked ? t("Drawer.lock") : t("Drawer.unlock")}
          </Button>
        <p className="text-xs  px-1">
          {isUnlocked ? t("Drawer.unlockedMessage") : t("Drawer.lockedMessage")}
        </p>
        {/* </div> */}
        </div>
    </div>
  );
}

export default PrivacyInput;