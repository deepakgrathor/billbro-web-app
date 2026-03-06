import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageBaseURL } from "../../Utils/Constant";
import { fetchServiceList } from "../../Redux/Slices/ServiceSlice/ServiceSlice";
import API from "../../Redux/API";
import Loader from "../../Components/Loader";
import CommonHeader from "../../Components/CommonHeader";
import { useNavigate } from "react-router-dom";
import {
  MdPhone,
  MdTv,
  MdElectricBolt,
  MdTrendingUp,
  MdCardGiftcard,
  MdSearch,
  MdInfo,
  MdChevronRight,
} from "react-icons/md";

const CommissionList = () => {
  const [load, setLoad] = useState(false);
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [operatorsArr, setOperatorsArr] = useState([
    {
      id: 0,
      title: "Airtel",
      img: "https://ik.imagekit.io/43tomntsa/airtel.webp",
      code: "airtel",
    },
    {
      id: 1,
      title: "Jio",
      img: "https://ik.imagekit.io/43tomntsa/Jio.webp",
      code: "jio",
    },
    {
      id: 2,
      title: "VI",
      img: "https://ik.imagekit.io/43tomntsa/VI.webp",
      code: "vi",
    },
    {
      id: 3,
      title: "BSNL",
      img: "https://ik.imagekit.io/43tomntsa/Bsnl.webp",
      code: "bsnl",
    },
  ]);

  const [dthOperatorArr, setDTHOperatorArr] = useState([
    {
      id: 1,
      img: "https://ik.imagekit.io/43tomntsa/airtel.webp",
      title: "AIRTEL DTH",
    },
    {
      id: 2,
      img: "https://ik.imagekit.io/43tomntsa/DishTV.webp",
      title: "DISH TV",
    },
    {
      id: 3,
      img: "https://ik.imagekit.io/43tomntsa/SunDirect.webp",
      title: "SUN DIRECT",
    },
    {
      id: 4,
      img: "https://ik.imagekit.io/43tomntsa/TataPlay.webp",
      title: "TATA PLAY",
    },
    {
      id: 5,
      img: "https://ik.imagekit.io/43tomntsa/VideoCon.webp",
      title: "VIDEOCON DTH",
    },
  ]);

  const { serviceList } = useSelector((state) => state.ServiceSlice.service);

  const serviceNames = useMemo(
    () => [
      "Postpaid",
      "Electricity",
      "Fastag",
      "LPG",
      "Insurance",
      "Landline",
      "Broadband",
    ],
    [],
  );

  const getPercentData = (name) =>
    serviceList?.Data?.find((a) => a.name === name);

  const BBPSArr = useMemo(() => {
    return serviceNames.map((name) => {
      const data = getPercentData(name);
      return {
        img: data?.icon,
        title: data?.name,
        margin: data?.percent,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceList, serviceNames]);

  const fetchDTHPercent = getPercentData("DTH");
  const fetchGooglePlayPercent = serviceList?.Data?.find(
    (a) => a._id === "661061ecda6832bf278254e1",
  )?.percent;

  useEffect(() => {
    if (fetchDTHPercent) {
      const updatedOperators = dthOperatorArr.map((operator) => ({
        ...operator,
        margin: fetchDTHPercent.percent || 0,
      }));

      const isDifferent = !updatedOperators.every(
        (operator, index) => operator.margin === dthOperatorArr[index].margin,
      );

      if (isDifferent) setDTHOperatorArr(updatedOperators);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDTHPercent]);

  useEffect(() => {
    const FetchRechargeOperatorPercent = async () => {
      setLoad(true);
      try {
        const res = await API.get("cyrus/recharge-operator-percent");
        const updatedOperators = operatorsArr.map((operator) => ({
          ...operator,
          margin: res.data[operator.code] || 0,
        }));
        setOperatorsArr(updatedOperators);
      } catch (error) {
        console.error("Error fetching recharge operator percent:", error);
      } finally {
        setLoad(false);
      }
    };

    FetchRechargeOperatorPercent();
    dispatch(fetchServiceList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return {
        prepaid: operatorsArr,
        dth: dthOperatorArr,
        bbps: BBPSArr,
      };
    }
    const contains = (s) => (s || "").toLowerCase().includes(q);

    return {
      prepaid: operatorsArr.filter((x) => contains(x.title)),
      dth: dthOperatorArr.filter((x) => contains(x.title)),
      bbps: BBPSArr.filter((x) => contains(x.title)),
    };
  }, [query, operatorsArr, dthOperatorArr, BBPSArr]);

  const totalOperators = operatorsArr.length + dthOperatorArr.length;

  const Section = ({ icon, title, meta, children }) => (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-base font-black text-theme-primary leading-tight">
              {title}
            </p>
            {meta && (
              <p className="text-[11px] text-theme-secondary font-semibold">
                {meta}
              </p>
            )}
          </div>
        </div>
        <div className="text-[11px] font-bold text-theme-secondary bg-theme-card-2 border border-theme px-3 py-1.5 rounded-full shrink-0">
          View
        </div>
      </div>
      {children}
    </div>
  );

  const CommissionRow = ({ item, type = "percentage" }) => {
    const value =
      type === "bbps" ? `₹${item.margin ?? 0}` : `${item.margin ?? 0}%`;

    return (
      <div className="bg-theme-card border border-theme rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-hidden">
        <div className="p-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-theme-card-2 border border-theme flex items-center justify-center shrink-0">
            <img
              src={type === "bbps" ? `${ImageBaseURL}${item.img}` : item.img}
              alt={item.title}
              className="h-8 w-8 object-contain"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-theme-primary truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-theme-secondary font-semibold">
              Commission rate
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <div className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm">
              {value}
            </div>
            {/* <div className="h-9 w-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <MdChevronRight className="text-slate-500" />
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-theme-base">
      {/* Header */}
      <div className="fixed top-0 w-full z-50 bg-theme-header backdrop-blur-xl border-b border-theme">
        <CommonHeader
          title={"Commission Chart"}
          handleclick={() => navigate(-1)}
        />
      </div>

      {/* Body */}
      <div className="pt-16 pb-8 px-3 sm:px-4 max-w-xl mt-3 mx-auto">
        {/* Hero */}
        <div className="rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.08)] overflow-hidden">
          <div className="p-5 bg-slate-900 text-white">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-widest text-white/70 uppercase">
                  Live commission rates
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight">
                  Earn on every transaction
                </p>
                <p className="mt-1 text-sm text-white/80 font-semibold">
                  Rates vary by operator & service.
                </p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                <MdTrendingUp className="text-3xl" />
              </div>
            </div>
          </div>

          {/* Search + Stats */}
          <div className="p-5">
            <div className="flex items-center gap-2 bg-theme-card-2 border border-theme rounded-2xl px-4 py-3">
              <MdSearch className="text-theme-secondary text-xl shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search operator or service..."
                className="w-full bg-transparent outline-none text-sm font-semibold text-theme-primary placeholder:text-theme-muted"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-theme bg-theme-card-2 p-3 text-center">
                <p className="text-lg font-black text-theme-primary">
                  {totalOperators}
                </p>
                <p className="text-[10px] font-semibold text-theme-secondary uppercase tracking-widest">
                  Operators
                </p>
              </div>
              <div className="rounded-2xl border border-theme bg-theme-card-2 p-3 text-center">
                <p className="text-lg font-black text-emerald-700">Instant</p>
                <p className="text-[10px] font-semibold text-theme-secondary uppercase tracking-widest">
                  Credit
                </p>
              </div>
              <div className="rounded-2xl border border-theme bg-theme-card-2 p-3 text-center">
                <p className="text-lg font-black text-theme-primary">24/7</p>
                <p className="text-[10px] font-semibold text-theme-secondary uppercase tracking-widest">
                  Live
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <Section
          icon={<MdPhone size={20} />}
          title="Mobile Prepaid"
          meta={`${filtered.prepaid.length} operators`}
        >
          <div className="space-y-3">
            {filtered.prepaid.map((item) => (
              <CommissionRow key={item.id} item={item} type="percentage" />
            ))}
            {filtered.prepaid.length === 0 && (
              <EmptyState text="No prepaid operators found." />
            )}
          </div>
        </Section>

        <Section
          icon={<MdTv size={20} />}
          title="DTH Recharge"
          meta={`${filtered.dth.length} operators`}
        >
          <div className="space-y-3">
            {filtered.dth.map((item) => (
              <CommissionRow key={item.id} item={item} type="percentage" />
            ))}
            {filtered.dth.length === 0 && (
              <EmptyState text="No DTH operators found." />
            )}
          </div>
        </Section>

        {/* <Section
          icon={<MdElectricBolt size={20} />}
          title="Bill Payments"
          meta="Flat rate (₹)"
        >
          <div className="space-y-3">
            {filtered.bbps.map((item, idx) => (
              <CommissionRow key={idx} item={item} type="bbps" />
            ))}
            {filtered.bbps.length === 0 && <EmptyState text="No bill services found." />}
          </div>
        </Section> */}

        {/* <Section
          icon={<MdCardGiftcard size={20} />}
          title="Others"
          meta="Gift card"
        >
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] overflow-hidden">
              <div className="p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_Play_2022_icon.svg/1856px-Google_Play_2022_icon.svg.png"
                    alt="Google Play"
                    className="h-8 w-8 object-contain"
                    loading="lazy"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-900">
                    Google Play
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Gift card
                  </p>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="px-3 py-2 rounded-xl bg-emerald-600 text-white font-black text-sm">
                    {fetchGooglePlayPercent ?? 0}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section> */}

        {/* Info */}
        <div className="mt-5 rounded-3xl border border-theme bg-theme-card shadow-[0_18px_55px_rgba(2,6,23,0.06)]">
          <div className="p-5 flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <MdInfo className="text-xl" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-theme-primary">
                Commission Info
              </p>
              <p className="mt-1 text-xs text-theme-secondary leading-relaxed">
                Commission is credited instantly after a successful transaction.
                Rates may vary based on operator/service and amount.
              </p>
            </div>
          </div>
        </div>
      </div>

      {load && <Loader />}
    </div>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="rounded-2xl border border-theme bg-theme-card-2 p-4 text-center">
      <p className="text-sm font-bold text-theme-secondary">{text}</p>
      <p className="mt-1 text-xs text-theme-muted">Try a different search.</p>
    </div>
  );
};

export default CommissionList;
