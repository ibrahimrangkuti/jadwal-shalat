import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("Banten");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Kab. Tangerang");
  const [schedule, setSchedule] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    console.log(isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    getStates();

    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);

    const today = new Date().toISOString().slice(0, 10);
    console.log(today);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const updateTime = () => {
    setTime(new Date());
  };

  useEffect(() => {
    getCities();
  }, [selectedState]);

  useEffect(() => {
    getSchedules();
  }, [selectedState, selectedCity]);

  const getStates = async () => {
    try {
      const { data } = await axios.get(
        "https://equran.id/api/v2/imsakiyah/provinsi"
      );
      setStates(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCities = async () => {
    try {
      const { data } = await axios.post(
        "https://equran.id/api/v2/imsakiyah/kabkota",
        { provinsi: selectedState },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setCities(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSchedules = async () => {
    try {
      const { data } = await axios.post(
        "https://equran.id/api/v2/imsakiyah/jadwal",
        {
          provinsi: selectedState,
          kabKota: selectedCity,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jadwal = data.data.data;
      let currentDate = new Date();
      let offset = currentDate.getTimezoneOffset() / -60;
      let today = new Date(currentDate.getTime() + offset * 3600 * 1000)
        .toISOString()
        .slice(0, 10);
      setSchedule(jadwal[today]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    const html = document.querySelector("html");
    html.classList.toggle("dark");
  };

  return (
    <>
      <div className="container mx-auto mt-7">
        <div className="flex justify-between items-center">
          <a
            href="https://ibrahimrangkuti.github.io/jadwal-shalat"
            target="_blank"
            className="text-xl dark:text-white"
          >
            Jadwal Shalat
          </a>
          <button
            type="button"
            className={`dark:text-[#2C3333] text-white text-sm cursor-pointer bg-[#2C3333] dark:bg-white px-3 py-2 rounded-lg shadow-lg`}
            onClick={handleThemeToggle}
          >
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        <h2 className="text-4xl font-semibold dark:text-white mt-3">
          {selectedCity ? selectedCity : ""}
        </h2>
        <span className="text-lg">
          Provinsi {selectedState ? selectedState : ""}
        </span>
        <form className="mt-5 lg:mt-8 flex flex-col lg:flex-row gap-3">
          <div className="w-full">
            <label htmlFor="state" className="dark:text-white">
              Provinsi
            </label>
            <select
              id="state"
              className="w-full h-10 px-3 py-2 mt-2 focus:ring-1 focus:ring-slate-400 rounded outline-none shadow text-sm font-semibold font-comforta"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states
                ? states.map((state) => (
                    <option value={state} selected={state === selectedState}>
                      {state}
                    </option>
                  ))
                : null}
            </select>
          </div>
          <div className="w-full">
            <label htmlFor="city" className="dark:text-white">
              Kabupaten / Kota
            </label>
            <select
              id="city"
              className="w-full h-10 px-3 py-2 mt-2 focus:ring-1 focus:ring-slate-400 rounded outline-none shadow text-sm font-semibold font-comforta"
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              {cities
                ? cities.map((city) => (
                    <option value={city} selected={city === selectedCity}>
                      {city}
                    </option>
                  ))
                : null}
            </select>
          </div>
        </form>
        <p className="my-5 text-xl font-semibold font-comforta lg:text-left text-center dark:text-white">
          {schedule ? schedule.tanggal : null} |{" "}
          {schedule ? time.toLocaleTimeString() : null}
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5">
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Imsak</h2>
              <span className="text-4xl font-semibold">{schedule.imsak}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Subuh</h2>
              <span className="text-4xl font-semibold">{schedule.subuh}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Terbit</h2>
              <span className="text-4xl font-semibold">{schedule.terbit}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Dhuha</h2>
              <span className="text-4xl font-semibold">{schedule.dhuha}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Dzuhur</h2>
              <span className="text-4xl font-semibold">{schedule.dzuhur}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Ashar</h2>
              <span className="text-4xl font-semibold">{schedule.ashar}</span>
            </div>
          </div>
          <div className="bg-white w-full h-40 p-6 rounded-lg flex items-center card-border">
            <div>
              <h2 className="text-xl">Maghrib</h2>
              <span className="text-4xl font-semibold">{schedule.maghrib}</span>
            </div>
          </div>
          <div
            className={`bg-white w-full h-40 p-6 rounded-lg flex items-center card-border`}
          >
            <div>
              <h2 className="text-xl">Isya</h2>
              <span className="text-4xl font-semibold">{schedule.isya}</span>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-center dark:text-white mt-10 py-4 border-t border-slate-200">
        <p>
          Made with ❤️ by{" "}
          <a
            href="https://www.instagram.com/ranqkuty"
            className="font-semibold underline"
          >
            ibrahimrangkuti
          </a>
        </p>
      </footer>
    </>
  );
}
