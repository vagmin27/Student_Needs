import React, { useContext, useEffect, useState } from "react";
import Navbar from "../../components/Tutorials/Navbar";

import { LayoutContext } from "@/components/layouts/DashboardLayout";
import SearchTutor from "../../components/Tutorials/SearchTutor";
import TutorProfile from "../../components/Tutorials/TutorProfile";
import TutorInfo from "../../components/Tutorials/TutorInfo";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import BookModal from "../../components/Tutorials/BookModal";
import { dateHelper } from "../../utils/Tutorials/bookDates";
import { useAuth } from "@/contexts/GlobalAuthContext.jsx";
import TutorPagination from "../../components/Tutorials/TutorPagination";
import API, { getTutorAvailability } from "@/services/api/tutorialsApi.js";


function BookClass() {
  const [query, setQuery] = useState(null);
  const [search, setSearch] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const [render, setRender] = useState(1);
  const [tutorProfile, setTutorProfile] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [bookDates, setBookDates] = useState(dateHelper(4));
  const [bookClassMap, setBookClassMap] = useState(new Map());
  const [page, setPage] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [searchSize, setSearchSize] = useState(0);
  const [availability, setAvailability] = useState([]);
  // const auth = useAuth();
  const auth = useAuth();
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
  } = auth;
  const navigate = useNavigate();
  const isUnifiedLayout = useContext(LayoutContext);

  const handleQuery = (val, data, size) => {
    setQuery(val);
    setSearch(true);
    setSearchData(data);
    setSearchSize(size);
  };

  const handleReturn = () => {
    setSearch(false);
    setPage(0);
  };

  // ================= LOCAL STORAGE =================
  useEffect(() => {
    try {
      const data = window.localStorage.getItem("Current_Query");
      const rend = window.localStorage.getItem("Current_Render");
      const currData = window.localStorage.getItem("Current_Data");

      if (data !== null && data !== "null") {
        setQuery(JSON.parse(data));
        setSearch(true);
      }
      if (rend !== null && rend !== "null") {
        setRender(Number(JSON.parse(rend)));
      }
      if (currData !== null && currData !== "null") {
        setSearchData(JSON.parse(currData));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    try {
      if (query) {
        window.localStorage.setItem("Current_Query", JSON.stringify(query));
        window.localStorage.setItem("Current_Render", JSON.stringify(render));
        window.localStorage.setItem("Current_Data", JSON.stringify(searchData));
        window.localStorage.setItem(
          "Current_Data_Size",
          JSON.stringify(searchSize),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }, [query, render, searchData, searchSize]);

  // ================= BACK BUTTON =================
  useEffect(() => {
    const onBackButtonEvent = (evt) => {
      evt.preventDefault();
      window.localStorage.removeItem("Current_Query");
      window.localStorage.removeItem("Current_Render");
      window.localStorage.removeItem("Current_Data");
      window.localStorage.removeItem("Current_Data_Size");
      setSearch(false);
      setQuery(null);
      setSearchData([]);
      setSearchSize(0);
    };

    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  // ================= URL PARAMS SEARCH =================
  useEffect(() => {
    const queryParam = searchParams.get("query");
    if (queryParam && queryParam !== query) {
      handleSubmit(queryParam, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // ================= RENDER STATE =================
  useEffect(() => {
    if (search && query) setRender(2);
    else if (!search) setRender(1);
    else setRender(3);
  }, [search, query]);

  // ================= ✅ FETCH AVAILABILITY =================
  useEffect(() => {
    if (!tutorProfile?._id) return;

    const fetchAvailability = async () => {
      try {
        const res = await getTutorAvailability(tutorProfile._id);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const availableSlots = (res.data.schedule || [])?.filter((slot) => {
          const slotDate = new Date(slot.date);
          return slotDate >= today;
        });

        setAvailability(availableSlots);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailability();
  }, [tutorProfile]);

  const searchProfile = (profile) => {
    setRender(3);
    setTutorProfile(profile);
    setSearchParams({ tutorId: profile._id });
  };

  const returnToSearch = () => {
    setRender(2);
  };

  const handleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  // ================= DATE GENERATION =================
  useEffect(() => {
    if (tutorProfile && modalIsOpen) {
      const newArr = new Set(dateHelper(4));
      setBookDates([...newArr]);
    }
  }, [modalIsOpen, tutorProfile]);

  // ================= ✅ FETCH USER SCHEDULE =================
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data: resSchedule } = await API.get("/tutor/schedule");

        if (resSchedule.data?.schedule) {
          const tempMap = new Map();

          resSchedule.data.schedule.forEach((item) =>
            tempMap.set(`${item.date} ${item.time}`, item),
          );

          setBookClassMap(tempMap);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // if (auth.user) fetchSchedule();
    if (user && isAuthenticated) fetchSchedule();
  }, [user, isAuthenticated]);

  // ================= ADD CLASS =================
  const addClass = (date, time) => {
    if (bookClassMap.has(`${date} ${time}`)) {
      alert("Schedule Conflict ❌");
      return;
    }

    const tempMap = new Map(bookClassMap);

    tempMap.set(`${date} ${time}`, {
      date,
      time,
      tutor: tutorProfile.first_name,
      tutor_lastname: tutorProfile.last_name,
      subject: tutorProfile.subjects,
      tutor_ID: tutorProfile._id,
    });

    setBookClassMap(tempMap);
  };

  const removeClass = (date, time) => {
    const tempMap = new Map(bookClassMap);
    tempMap.delete(`${date} ${time}`);
    setBookClassMap(tempMap);
  };

  // ================= CONFIRM BOOKING =================
  const confirmClasses = async (selectedSlot) => {
    if (!user) {
      return alert("Login required ❌");
    }

    if (!selectedSlot) {
      return alert("Please select a time slot first.");
    }

    const params = new URLSearchParams(window.location.search);
    const tutorId = params.get("tutorId") || tutorProfile?._id;
    const tutorName = `${
      tutorProfile?.fName ||
      tutorProfile?.name ||
      tutorProfile?.first_name ||
      "Tutor"
    } ${tutorProfile?.lName || tutorProfile?.last_name || ""}`.trim();
    const subject =
      selectedSlot.subject ||
      (Array.isArray(tutorProfile?.subjects) && tutorProfile.subjects.length > 0
        ? tutorProfile.subjects[0]
        : tutorProfile?.subjects) ||
      tutorProfile?.expertise ||
      "General";

    try {
      console.table({
        tutorId,
        studentId: user?.id || user?._id,
        slotId: selectedSlot._id,
        subject,
        date: selectedSlot.date,
        time: selectedSlot.time,
      });

      const res = await API.post("/booking", {
        tutorId,
        tutorName,
        studentId: user?.id || user?._id,
        slotId: selectedSlot._id,
        subject,
        date: selectedSlot.date,
        time: selectedSlot.time,
      });

      if (
        res.data.msg === "Booking created" ||
        res.data.msg === "Booking successful"
      ) {
        alert("Booking confirmed! ✅");
        setModalIsOpen(false);
        navigate("/tutorials/profile/manageBooking");
      } else {
        alert(res.data.msg || "Booking failed ❌");
      }
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 409) {
        alert("You already booked this slot. Please choose another available slot.");
        return;
      }
      alert(err.response?.data?.msg || err.message || "Booking failed ❌");
    }
  };

  // ================= SEARCH =================
  const handleSubmit = async (searchword, newPage) => {
    if (!searchword) {
      setNotFound(true);
      return setTimeout(() => setNotFound(false), 3000);
    }

    try {
      const { data } = await API.get(`/tutors?query=${searchword}&page=${newPage}`);

      if (!data.data?.length) {
        setNotFound(true);
      } else {
        handleQuery(searchword, data.data, data.numbers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const choosePage = (cmd) => {
    const next = cmd === "next" ? page + 1 : page - 1;
    if (next >= 0) {
      setPage(next);
      handleSubmit(query, next);
    }
  };

  // ================= RENDER =================
  const renderFunc = () => {
    switch (render) {
      case 1:
        return <SearchTutor handleSubmit={handleSubmit} notFound={notFound} />;
      case 2:
        return (
          <TutorProfile
            searchData={searchData}
            searchSize={searchSize}
            query={query}
            handleReturn={handleReturn}
            searchProfile={searchProfile}
          />
        );
      case 3:
        return (
          <TutorInfo
            tutorProfile={tutorProfile}
            returnToSearch={returnToSearch}
            handleModal={handleModal}
          />
        );
      default:
        return null;
    }
  };

  if (!isInitialized || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {!isUnifiedLayout && <Navbar />}
      {isUnifiedLayout && (
        <div className="px-2 pt-2 flex flex-wrap gap-4">

          <Link
            to="/tutorials/home"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            ← Tutorials home
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-6xl flex-grow">
        <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] min-h-[400px]">{renderFunc()}</div>


        {render === 2 && <TutorPagination choosePage={choosePage} />}

        {render === 3 && (
          <BookModal
            open={modalIsOpen}
            handleModal={handleModal}
            addClass={addClass}
            removeClass={removeClass}
            confirmClasses={confirmClasses}
            tutorProfile={tutorProfile}
            bookDates={bookDates}
            bookClassMap={bookClassMap}
            availability={availability} // 🔥 FINAL FIX
          />
        )}
      </div>
    </div>
  );
}

export default BookClass;
