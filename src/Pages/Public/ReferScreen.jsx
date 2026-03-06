import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CommonHeader from "../../Components/CommonHeader";
import { BRAND_NAME } from "../../Utils/Constant";
import {
  MdWhatsapp,
  MdContentCopy,
  MdCheck,
  MdPeople,
  MdCardGiftcard,
  MdTrendingUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { getSettingFunc } from "../../Utils/CommonFunc";

const ReferScreen = () => {
  const navigate = useNavigate();
  const { ProfileData } = useSelector((state) => state.LoginSlice.profile);
  const [copied, setCopied] = useState(false);
  const [referralAmount, setReferralAmount] = useState(0);
  const referralCode = ProfileData?.Data?.referalId || "LOADING...";
  const isLoading = referralCode === "LOADING...";

  const shareMessage = useMemo(() => {
    return `💎 ${BRAND_NAME} - India's Fastest Recharge App

🚀 Services:
✅ Mobile & DTH Recharge
✅ Bill Payments (Electricity, Gas, Water)
✅ Instant Cashback & Rewards

🎁 EXCLUSIVE OFFER FOR YOU:
Use Referral Code: *${referralCode}*
Get ₹10 Bonus on ₹100+ wallet recharge!

📲 Download Now:
https://play.google.com/store/apps/details?id=com.billbro.app

🔒 100% Safe & Secure | ⚡ Lightning Fast | 🏆 10,000+ Happy Users`;
  }, [referralCode]);

  // ✅ Same logic
  const handleCopyCode = useCallback(() => {
    if (isLoading) return;
    navigator.clipboard
      .writeText(referralCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy:", err));
  }, [referralCode, isLoading]);

  const handleWhatsAppShare = useCallback(() => {
    if (isLoading) return;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  }, [isLoading, shareMessage]);

  const handleGetReferAmount = async () => {
    const settings = await getSettingFunc();
    setReferralAmount(settings?.referAmount || 0);
  };

  useEffect(() => {
    handleGetReferAmount();
  }, []);

  return (
    <div className="min-h-screen bg-theme-base">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-theme-header backdrop-blur-xl border-b border-theme">
        <CommonHeader
          title={"Refer & Earn"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Content */}
      <div className="pt-20 pb-[140px] px-3 sm:px-4 max-w-xl mx-auto">
        {/* Hero (White modern, clean) */}
        <div className="rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
          {/* Top strip */}
          <div className="px-5 py-5 bg-slate-900 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                  Invite friends
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  Earn rewards together
                </h2>
                <p className="mt-1 text-sm text-white/80 font-semibold">
                  Share your code. They add money. Both get rewarded.
                </p>
              </div>

              <div className="shrink-0 h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                <MdCardGiftcard className="text-3xl" />
              </div>
            </div>
          </div>

          {/* Reward strip */}
          <div className="px-5 py-5 bg-theme-card">
            <div className="rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-wider text-emerald-700 uppercase mb-1.5">
                    You Earn
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-4xl font-black text-emerald-900">₹{referralAmount}</p>
                    <MdTrendingUp className="text-emerald-600 text-2xl" />
                  </div>
                  <p className="mt-2 text-xs text-theme-secondary font-semibold">
                    Per referral on ₹100+ add
                  </p>
                </div>
                <div className="text-5xl opacity-20">🎁</div>
              </div>
            </div>

            {/* Small note */}
            <div className="mt-4 rounded-2xl border border-theme bg-theme-card-2 p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <MdPeople className="text-xl" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-theme-primary">
                    Unlimited referrals
                  </p>
                  <p className="mt-1 text-xs text-theme-secondary leading-relaxed">
                    Refer as many friends as you want — rewards keep adding up.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="mt-4 rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <div className="p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-theme-secondary uppercase">
                  Your referral code
                </p>
                <p className="mt-1 text-sm font-black text-theme-primary">
                  Tap to copy
                </p>
              </div>

              <div className="shrink-0 rounded-full border border-theme bg-theme-card-2 px-3 py-1.5">
                <p className="text-[11px] font-bold text-theme-secondary flex items-center gap-1.5">
                  <MdPeople className="text-theme-secondary" />0 friends
                </p>
              </div>
            </div>

            <button
              onClick={handleCopyCode}
              disabled={isLoading}
              className={[
                "mt-4 w-full rounded-2xl border border-dashed p-5 transition",
                "bg-theme-card-2 border-theme hover:bg-theme-card active:scale-[0.99]",
                isLoading ? "opacity-60 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    className={[
                      "text-center font-black tracking-[0.3em] sm:tracking-[0.35em] font-mono",
                      "text-2xl sm:text-3xl",
                      isLoading ? "text-theme-muted" : "text-theme-primary",
                    ].join(" ")}
                  >
                    {referralCode}
                  </p>

                  <p
                    className={[
                      "mt-3 text-center text-xs font-semibold",
                      copied ? "text-emerald-700" : "text-theme-secondary",
                    ].join(" ")}
                  >
                    {copied
                      ? "✓ Copied to clipboard"
                      : isLoading
                      ? "Loading your code..."
                      : "Tap anywhere to copy"}
                  </p>
                </div>

                {!isLoading && (
                  <div className="shrink-0">
                    <div
                      className={[
                        "h-12 w-12 rounded-2xl flex items-center justify-center border",
                        copied
                          ? "bg-emerald-600 border-emerald-600"
                          : "bg-slate-900 border-slate-900",
                      ].join(" ")}
                    >
                      {copied ? (
                        <MdCheck className="text-white text-2xl" />
                      ) : (
                        <MdContentCopy className="text-white text-2xl" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-4 rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <div className="p-5">
            <p className="text-[11px] font-semibold tracking-widest text-theme-secondary uppercase">
              How it works
            </p>
            <h3 className="mt-1 text-base font-black text-theme-primary">
              3 simple steps
            </h3>

            <div className="mt-4 space-y-3">
              <Step
                no="01"
                title="Share your code"
                desc="Send your referral code on WhatsApp or any messaging app."
              />
              <Step
                no="02"
                title="Friend signs up"
                desc="They register using your code."
              />
              <Step
                no="03"
                title="You get ₹10"
                desc="When your friend adds ₹100 or more to wallet."
              />
            </div>
          </div>
        </div>

        {/* Benefits (responsive grid) */}
        <div className="mt-4 rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <div className="p-5">
            <p className="text-[11px] font-semibold tracking-widest text-theme-secondary uppercase text-center">
              Benefits
            </p>
            <h3 className="mt-1 text-base font-black text-theme-primary text-center">
              Why refer?
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniCard emoji="🚀" title="Unlimited earnings" />
              <MiniCard emoji="⚡" title="Fast rewards" />
              <MiniCard emoji="🎁" title="Extra benefits" />
              <MiniCard emoji="🤝" title="Help friends" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA (safe-area ready + responsive) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-theme-header backdrop-blur-xl border-t border-theme">
        <div className="max-w-xl mx-auto px-3 sm:px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
          <button
            onClick={handleWhatsAppShare}
            disabled={isLoading}
            className={[
              "w-full rounded-2xl py-4 font-black flex items-center justify-center gap-2 transition",
              isLoading
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99]",
            ].join(" ")}
          >
            <MdWhatsapp size={22} />
            Share on WhatsApp
          </button>

          {/* Secondary action (copy) for small screens usability */}
          <button
            onClick={handleCopyCode}
            disabled={isLoading}
            className={[
              "mt-2 w-full rounded-2xl py-3 font-black flex items-center justify-center gap-2 transition border",
              isLoading
                ? "border-slate-200 text-slate-400 cursor-not-allowed"
                : "border-theme text-theme-primary hover:bg-theme-card-2 active:scale-[0.99]",
            ].join(" ")}
          >
            {copied ? <MdCheck size={20} /> : <MdContentCopy size={20} />}
            {copied ? "Copied" : "Copy code"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Step = ({ no, title, desc }) => {
  return (
    <div className="rounded-2xl border border-theme bg-theme-card-2 p-4 flex items-start gap-3">
      <div className="shrink-0 h-11 w-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black">
        {no}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black text-theme-primary">{title}</p>
        <p className="mt-1 text-xs text-theme-secondary leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const MiniCard = ({ emoji, title }) => {
  return (
    <div className="rounded-2xl border border-theme bg-theme-card p-4 text-center">
      <div className="text-2xl">{emoji}</div>
      <p className="mt-2 text-xs font-black text-theme-primary">{title}</p>
    </div>
  );
};

export default ReferScreen;
