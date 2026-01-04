import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment/moment";
import { getNotification } from "../../Redux/Slices/PublicSlice/PublicSlice";
import Loader from "../../Components/Loader";
import { COMPANY_LOGO, DummyAddtoWalletAvatar } from "../../Utils/Constant";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import {
  IoCheckmarkCircle,
  IoNotificationsOutline,
  IoSearchOutline,
} from "react-icons/io5";
import { MdInbox, MdFilterList } from "react-icons/md";

const ModernNotificationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { notificationList, notificationLoader } = useSelector(
    (state) => state.PublicSlice.notification
  );

  const [query, setQuery] = useState("");

  const getNotify = useCallback(() => {
    dispatch(getNotification());
  }, [dispatch]);

  useEffect(() => {
    getNotify();
  }, [getNotify]);

  const list = notificationList?.Data || [];

  // animations (lighter, smoother)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { y: 14, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
    exit: { y: 10, opacity: 0, transition: { duration: 0.18 } },
  };

  const getNotificationIcon = (item) => {
    return item.sender
      ? item.sender._id === item.recipient
        ? DummyAddtoWalletAvatar
        : DummyAddtoWalletAvatar
      : COMPANY_LOGO;
  };

  const tone = (index) => {
    const tones = [
      {
        chip: "bg-blue-50 text-blue-700 border-blue-200",
        dot: "bg-blue-500",
        line: "from-blue-500 to-cyan-500",
      },
      {
        chip: "bg-violet-50 text-violet-700 border-violet-200",
        dot: "bg-violet-500",
        line: "from-violet-500 to-fuchsia-500",
      },
      {
        chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dot: "bg-emerald-500",
        line: "from-emerald-500 to-teal-500",
      },
      {
        chip: "bg-amber-50 text-amber-800 border-amber-200",
        dot: "bg-amber-500",
        line: "from-amber-500 to-orange-500",
      },
    ];
    return tones[index % tones.length];
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    const contains = (s) => (s || "").toLowerCase().includes(q);
    return list.filter((n) => contains(n.title) || contains(n.body));
  }, [list, query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200">
        <CommonHeader
          title={"Notifications"}
          handleclick={() => navigate("/")}
        />
      </div>

      {/* Content */}
      <div className="pt-20 pb-10 px-3 sm:px-4 max-w-xl mx-auto">
        {/* Hero + Search */}
        <div className="rounded-3xl border border-slate-200 bg-white shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
          <div className="p-5 bg-slate-900 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                  Updates & alerts
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight">
                  Your Inbox
                </p>
                <p className="mt-1 text-sm text-white/80 font-semibold">
                  {notificationLoader
                    ? "Fetching latest notifications…"
                    : `${list.length} total notification${list.length === 1 ? "" : "s"}`}
                </p>
              </div>

              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <IoNotificationsOutline className="text-3xl" />
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
                <IoSearchOutline className="text-slate-500 text-xl shrink-0" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or message…"
                  className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button
                type="button"
                className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center active:scale-95 transition"
                title="Filters (UI only)"
              >
                <MdFilterList className="text-slate-600 text-xl" />
              </button>
            </div>

            {/* Small hint row */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-[11px] text-slate-500 font-semibold">
                Showing{" "}
                <span className="text-slate-900 font-black">
                  {filtered.length}
                </span>{" "}
                result{filtered.length === 1 ? "" : "s"}
              </p>
              <button
                type="button"
                onClick={getNotify}
                className="text-[11px] font-black text-slate-900 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full active:scale-95 transition"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* States */}
        {notificationLoader ? (
          <div className="flex justify-center items-center mt-10">
            <Loader />
          </div>
        ) : !list ? (
          <div className="mt-10">
            <EmptyState title="No notifications found" desc="Please try again." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No matching notifications"
              desc="Try a different search keyword."
            />
          </div>
        ) : (
          <motion.div
            className="mt-4 space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {filtered.map((item, index) => {
                const t = tone(index);
                return (
                  <motion.div
                    key={item?._id || `${index}-${item?.createdAt || ""}`}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="cursor-pointer"
                  >
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-[0_12px_40px_rgba(2,6,23,0.06)] overflow-hidden">
                      {/* Accent line */}
                      <div className={`h-1 bg-gradient-to-r ${t.line}`} />

                      <div className="p-4 flex gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
                            <img
                              src={getNotificationIcon(item)}
                              alt="icon"
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          {/* Unread dot (UI) */}
                          <span
                            className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${t.dot} ring-2 ring-white`}
                          />
                        </div>

                        {/* Text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-black text-slate-900 truncate">
                              {item?.title || "Notification"}
                            </p>

                            <span className="shrink-0 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
                              {moment(item?.createdAt).fromNow()}
                            </span>
                          </div>

                          <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                            {item?.body || ""}
                          </p>

                          {/* Footer row */}
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <div
                              className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${t.chip}`}
                            >
                              New
                            </div>

                            <button
                              type="button"
                              className="text-[10px] font-black text-slate-900 bg-slate-100 border border-slate-200 px-3 py-2 rounded-2xl active:scale-95 transition flex items-center gap-1.5"
                            >
                              <IoCheckmarkCircle className="text-base text-emerald-600" />
                              Mark as read
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ title, desc }) => {
  return (
    <motion.div
      className="bg-white border border-slate-200 rounded-3xl shadow-[0_18px_55px_rgba(2,6,23,0.06)] p-8 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mx-auto h-20 w-20 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center">
        <MdInbox className="text-4xl text-slate-400" />
      </div>
      <p className="mt-4 text-lg font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-600 font-semibold">{desc}</p>

      <div className="mt-5 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-pulse"
            style={{ animationDelay: `${i * 120}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ModernNotificationList;
