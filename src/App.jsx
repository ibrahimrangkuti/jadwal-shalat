import React, { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("Banten");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Kab. Tangerang");
  const [schedule, setSchedule] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    getStates();

    const intervalId = setInterval(() => {
      updateTime();
    }, 1000);

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
    } catch (error) {}
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
      const today = new Date().toISOString().slice(0, 10);
      // console.log(jadwal[today]);
      setSchedule(jadwal[today]);
    } catch (error) {}
  };

  return (
    <div className="container mx-auto mt-4">
      <h3 className="text-2xl">Jadwal Shalat</h3>
      <h2 className="text-4xl font-semibold">
        {selectedCity ? selectedCity : ""}
      </h2>
      <form className="mt-5 lg:mt-8 flex flex-col lg:flex-row gap-3">
        <div className="w-full">
          <label htmlFor="state">Provinsi</label>
          <select
            id="state"
            className="w-full h-10 px-3 py-2 mt-2 focus:ring-1 focus:ring-slate-400 rounded outline-none shadow font-semibold"
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
          <label htmlFor="city">Kabupaten / Kota</label>
          <select
            id="city"
            className="w-full h-10 px-3 py-2 mt-2 focus:ring-1 focus:ring-slate-400 rounded outline-none shadow font-semibold"
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
      <p className="my-5 text-xl font-semibold lg:text-left text-center">
        {schedule ? schedule.tanggal : null} |{" "}
        {schedule ? time.toLocaleTimeString() : null}
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-5">
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Imsak</h2>
            <span className="text-4xl font-semibold">{schedule.imsak}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Subuh</h2>
            <span className="text-4xl font-semibold">{schedule.subuh}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Terbit</h2>
            <span className="text-4xl font-semibold">{schedule.terbit}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Dhuha</h2>
            <span className="text-4xl font-semibold">{schedule.dhuha}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Dzuhur</h2>
            <span className="text-4xl font-semibold">{schedule.dzuhur}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Ashar</h2>
            <span className="text-4xl font-semibold">{schedule.ashar}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Maghrib</h2>
            <span className="text-4xl font-semibold">{schedule.maghrib}</span>
          </div>
        </div>
        <div className="bg-white w-full h-40 p-6 rounded-lg shadow-md flex items-center">
          <div>
            <h2 className="text-xl">Isya</h2>
            <span className="text-4xl font-semibold">{schedule.isya}</span>
          </div>
        </div>
      </div>

      <footer className="text-center mt-16">
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
    </div>
  );
}
