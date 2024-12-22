"use client";
import Image from "next/image";
import styles from "./home.module.css";
import "./globals.css";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import ClientWrapper from "@/utils/clientWrapper";
import { useGlobal } from "@/utils/global";
import axios from "axios";
import { DateTime } from "luxon";
import { Html5Qrcode } from "html5-qrcode";
import { getAccessToken } from "./login/Tokens";
import useApi from '../utils/api';


import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Подключаем плагин Filler для заливки
);

export default function Home() {
  const { user, auth, logout } = useGlobal();
  const [camerabutton, setcamerabutton] = useState(false);
  const [boxleft, setboxleft] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [opensort, setopensort] = useState(false);
  const [sort1, setsort1] = useState(true);
  const [sort2, setsort2] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [btnmain, setbtnmain] = useState(true);
  const [btnreport, setbtnreport] = useState(false);
  const [btncontrol, setbtncontrol] = useState(false);
  const [btnsettings, setbtnsettings] = useState(false);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "По цене",
        data: [],
        borderColor: "#BA8AFF",
        backgroundColor: "rgba(171, 112, 255, 0.3)", // Полупрозрачный цвет заливки
        fill: "origin",
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  });

  const [chartData2, setChartData2] = useState({
    labels: [],
    datasets: [
      {
        label: "По количеству продаж",
        data: [],
        borderColor: "#D2F902",
        backgroundColor: "rgba(210, 249, 2, 0.3)", // Полупрозрачный цвет заливки
        fill: true,
        tension: 0.3,
        pointRadius: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.tcats.uz/api/crm/admin/stats/"
        );
        const apiData = response.data.data;

        const labels = apiData.map((item) => item.date);
        const amounts = apiData.map((item) => item.amount);
        const counts = apiData.map((item) => item.count);

        setChartData((prevData) => ({
          ...prevData,
          labels,
          datasets: [{ ...prevData.datasets[0], data: amounts }],
        }));
        setChartData2((prevData) => ({
          ...prevData,
          labels,
          datasets: [{ ...prevData.datasets[0], data: counts }],
        }));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: "#B36DFF",
        borderColor: "#B36DFF",
      },
    },
    interaction: {
      intersect: false,
    },
    tension: 0.4,
  };

  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      filler: {
        propagate: false,
      },
    },
    scales: {
      x: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
      y: {
        title: {
          display: false,
        },
        grid: {
          display: true,
          color: "#E5E7EB33",
        },
      },
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: "#8BA501",
        borderColor: "#D2F902",
      },
    },
    interaction: {
      intersect: false,
    },
    tension: 0.4,
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const clickcamerabutton = () => {
    setcamerabutton(!camerabutton);
  };

  const clickboxleftbutton = () => {
    setboxleft(!boxleft);
  };

  const clickopensort = () => {
    setopensort(!opensort);
  };
  const clicksort1 = () => {
    if (!sort1) {
      // Проверяем, неактивна ли кнопка
      setsort1(true); // Активируем первую кнопку
      setsort2(false); // Деактивируем вторую кнопку
    }
  };

  const clicksort2 = () => {
    if (!sort2) {
      // Проверяем, неактивна ли кнопка
      setsort2(true); // Активируем вторую кнопку
      setsort1(false); // Деактивируем первую кнопку
    }
  };

  // Обновление времени каждую секунду

  useEffect(() => {
    const interval = setInterval(() => {
      const uzbTime = DateTime.now()
        .setZone("Asia/Tashkent")
        .toLocaleString(DateTime.TIME_24_WITH_SECONDS);
      setTime(uzbTime); // Установка текущего времени
    }, 1000);

    return () => clearInterval(interval); // Очистка интервала
  }, []);

  useEffect(() => {
    // Установка текущей даты в формате День.Месяц.Год
    const uzbDate = DateTime.now()
      .setZone("Asia/Tashkent")
      .toLocaleString(DateTime.DATE_FULL); // Формат: "12 декабря 2024 г."
    setDate(uzbDate);
  }, []);

  const clickbtnmain = () => {
    if (!btnmain) {
      setbtnmain(true);
      setbtnreport(false);
      setbtncontrol(false);
      setbtnsettings(false);
    }
  };

  const clickbtnreport = () => {
    if (!btnreport) {
      setbtnmain(false);
      setbtnreport(true);
      setbtncontrol(false);
      setbtnsettings(false);
    }
  };
  const clickbtncontrol = () => {
    if (!btncontrol) {
      setbtnmain(false);
      setbtnreport(false);
      setbtncontrol(true);
      setbtnsettings(false);
    }
  };
  const clickbtnsettings = () => {
    if (!btnsettings) {
      setbtnmain(false);
      setbtnreport(false);
      setbtncontrol(false);
      setbtnsettings(true);
    }
  };

  // -------------------------------------------------------------------------
  const [isEnabled, setIsEnabled] = useState(false); // Флаг включения сканера
  const [qrMessage, setQrMessage] = useState(""); // Считанное сообщение QR-кода
  const [cameras, setCameras] = useState([]); // Список камер
  const [selectedCamera, setSelectedCamera] = useState(""); // Выбранная камера
  const [scanStatus, setScanStatus] = useState(""); // Статус сканирования
  const [error, setError] = useState(""); // Ошибки
  const api = useApi(); // Инстанс API

  // Получение списка камер при загрузке компонента
  useEffect(() => {
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices); // Устанавливаем список камер
          setSelectedCamera(devices[0].id); // Устанавливаем первую камеру по умолчанию
        } else {
          setError("Камеры не найдены");
        }
      })
      .catch((err) => {
        console.error("Ошибка получения списка камер:", err);
        setError("Не удалось получить доступ к камерам");
      });
  }, []);

  useEffect(() => {
    let html5QrCode;

    // Функция отправки данных на сервер
    const sendScannedData = async (ticketId) => {
      try {
        const response = await api.post(
          "/api/partner_tickets/cashier/scanner/",
          { ticket_id: ticketId }
        );
    
        if (response.status === 200) {
          console.log("Данные успешно отправлены:", response.data);
          setScanStatus("Успешно отсканировано!"); // Успешный статус
          setQrMessage(`Успешно отсканировано!`); // Успешно отсканированный QR-код
        } else if (response.status === 400) {
          console.log("Ошибка отправленных данных:", response.data);
          setScanStatus("QR код уже использован!"); // Ошибка: QR код уже использован
          setQrMessage("Ошибка: QR код уже использован!"); // Отображение ошибки
        }else if (response.status === 404) {
          console.log("Ошибка отправленных данных:", response.data);
          setScanStatus("QR кода не сушествует!"); // Ошибка: QR код уже использован
          setQrMessage("QR кода не сушествует!"); // Отображение ошибки
        } else {
          console.error("Ошибка при отправке данных:", response.status, response.statusText);
          setScanStatus(`Ошибка: ${response.status} ${response.statusText}`);
          setQrMessage(`Ошибка: ${response.status} ${response.statusText}`); // Отображение ошибки
        }
      } catch (error) {
        console.error("Ошибка запроса:", error);
        setScanStatus("Ошибка: данный QR-Code уже использован или не существует!");
        setQrMessage("Ошибка: данный QR-Code уже использован или не существует!"); // Отображение ошибки
      }
    };
    
    // Успешное считывание QR-кода
    const qrCodeSuccess = (decodedText) => {
      console.log("QR-код успешно считан");
      setIsEnabled(false); // Остановка сканера
      sendScannedData(decodedText); // Отправка данных
    };
    
    // Ошибка считывания QR-кода
    const qrCodeError = (error) => {
      console.warn("Ошибка считывания QR-кода:", error);
      setQrMessage("Ошибка при считывании QR-кода."); // Отображение ошибки
    };

    // Инициализация сканера
    if (isEnabled && selectedCamera) {
      html5QrCode = new Html5Qrcode("qrCodeContainer");
      html5QrCode
        .start(
          { deviceId: { exact: selectedCamera } }, // Используем выбранную камеру
          {
            fps: 10, // Кадры в секунду
            // qrbox: { width: 250, height: 250 }, // Размер области сканирования
          },
          qrCodeSuccess,
          qrCodeError
        )
        .catch((err) => {
          console.error("Ошибка запуска сканера:", err);
          setScanStatus("Ошибка запуска сканера");
        });
    }

    // Очистка при размонтировании
    return () => {
      if (html5QrCode) {
        html5QrCode.stop().then(() => html5QrCode.clear());
      }
    };
  }, [isEnabled, selectedCamera]);

  // ---------------------------------------------------------------------

  const [getUserInfo, setGetUserInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getAccessToken(); // Получаем токен из хранилища
      try {
        const response = await fetch("https://api.tcats.uz/api/auth/staff/", {
          method: "GET", // Метод должен быть 'GET'
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
          },
        });
  
        if (!response.ok) {
          // Обработка ошибок ответа
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json(); // Парсим JSON из ответа
        setGetUserInfo(data); // Устанавливаем данные в состояние
      } catch (error) {
        console.error("Ошибка при запросе данных:", error);
        setGetUserInfo(null); // Устанавливаем null при ошибке
      }
    };
  
    fetchData();
  }, []);


  const [getUserStat, setGetUserStat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = getAccessToken(); // Получаем токен из хранилища
      try {
        const response = await fetch("https://api.tcats.uz/api/partner_tickets/get-all-scans/", {
          method: "GET", // Метод должен быть 'GET'
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
          },
        });
  
        if (!response.ok) {
          // Обработка ошибок ответа
          throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json(); // Парсим JSON из ответа
        setGetUserStat(data); // Устанавливаем данные в состояние
      } catch (error) {
        console.error("Ошибка при запросе данных:", error);
        setGetUserStat(null); // Устанавливаем null при ошибке
      }
    };
  
    fetchData();
  }, []);
  return (
    <ClientWrapper>
      <section
        className={styles.rootcontaioner}
        style={{
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <section className={styles.containerrow}>
          <AnimatePresence>
            <motion.div
              initial={boxleft ? { width: 207 } : { width: 298 }}
              animate={boxleft ? { width: 298 } : { width: 207 }}
              transition={{ duration: 0.1, ease: "linear" }}
              className={styles.boxleftclosed}
            >
              <div className={styles.boxlefttopclosed}>
                <div className={styles.boxlogocrm}>
                  <div className={styles.boxlogoopen}>
                    <Image
                      src="/logo closed.svg"
                      alt="logo"
                      width={58}
                      height={58}
                    />
                    <AnimatePresence>
                      <motion.img
                        initial={{ display: "none", opacity: 0, x: -10 }}
                        animate={
                          boxleft
                            ? { display: "block", opacity: 1, x: 0 }
                            : { display: "none", opacity: 0, x: -10 }
                        }
                        transition={{ duration: 0.1, ease: "linear" }}
                        src="/Logo text.svg"
                        alt="logo"
                        width={91}
                        height={58}
                      />
                    </AnimatePresence>
                  </div>
                  <div className={styles.crm}>
                    <p>CRM</p>
                  </div>

                  <button onClick={clickboxleftbutton}>
                    <motion.img
                      animate={boxleft ? { rotate: 0 } : { rotate: 180 }}
                      transition={{ duration: 0.1, ease: "linear" }}
                      src="/closeboxleft.svg"
                      alt="open"
                      title="open"
                      width={34}
                      height={34}
                    />
                  </button>
                </div>
                <div className={styles.btnsclosed}>
                  <motion.button
                    onClick={clickbtnmain}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Главная"
                    className={
                      btnmain
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image src="/home.svg" alt="home" width={24} height={24} />
                    <p>{boxleft ? "Главное" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtnreport}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Отчеты"
                    className={
                      btnreport
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/report.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Отчеты" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtncontrol}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Управление билетами"
                    className={
                      btncontrol
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/todayselledticket.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Управление билетами" : ""}</p>
                  </motion.button>
                  <motion.button
                    onClick={clickbtnsettings}
                    transition={{ duration: 0.1, ease: "linear" }}
                    animate={
                      boxleft
                        ? { justifyContent: "start" }
                        : { justifyContent: "center", gap: "0px" }
                    }
                    title="Настройки"
                    className={
                      btnsettings
                        ? styles.onebtnclosedactiove
                        : styles.onebtnclosednoactiove
                    }
                  >
                    <Image
                      src="/settings.svg"
                      alt="home"
                      width={24}
                      height={24}
                    />
                    <p>{boxleft ? "Настройки" : ""}</p>
                  </motion.button>
                </div>
              </div>
              <button className={styles.logoutclosed} onClick={logout}>
                <Image src="/logout.svg" alt="home" width={24} height={24} />
                <p>Выйти</p>
              </button>
            </motion.div>
          </AnimatePresence>
          <motion.div
            animate={boxleft ? { padding: "38px" } : { padding: "38px 97px" }}
            transition={{ duration: 0.1, ease: "linear" }}
            className={styles.boxright}
            style={{
              overflow: "auto",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE и Edge */,
            }}
          >
            {btnmain && (
              <div className={styles.boxinboxright}>
                <div className={styles.boxrowinfocashier}>
                  <h1>
                    Главная{" "}
                    <div className={styles.boxdateh1}>
                      <p>{time}</p>
                      <p>{date}</p>
                    </div>
                  </h1>
                  {getUserInfo && (
                  <div className={styles.infocashier}>
                    <div className={styles.boxavatarname}>
                      <Image
                        src="/avatar.png"
                        alt="avatar"
                        width={50}
                        height={50}
                      />
                      <h2>
                        {getUserInfo.last_name} <br /> {getUserInfo.first_name}
                      </h2>
                    </div>
                    <div className={styles.cashier}>
                      <p>{getUserInfo.role}</p>
                    </div>
                  </div>
                  )}
                </div>
                <div className={styles.maincashier}>
                  {/* <div className={styles.boxfastinstrument}>
                    <div className={styles.boxrowfastinstrument}>
                      <div className={styles.boxscanicon}>
                        <Image
                          src="/scanqr.svg"
                          alt="statistic"
                          width={24}
                          height={24}
                        />{" "}
                        <h1>Быстрые инструметы</h1>
                      </div>
                      <div className={styles.boxvibordata}>
                        <p>Выберите дату:</p>
                        <div className={styles.miniboxvibordate}>
                          <div className={styles.boxvibratdatu}>
                            <Image
                              src="/calendar.svg"
                              alt="calendar"
                              width={18}
                              height={18}
                            />
                            <p>Выберите дату</p>
                          </div>
                          <Image
                            src="/rightarrov.svg"
                            alt="right"
                            width={20}
                            height={20}
                          />
                          <div className={styles.boxvibratdatu}>
                            <Image
                              src="/calendar.svg"
                              alt="calendar"
                              width={18}
                              height={18}
                            />
                            <p>Выберите дату</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={styles.boxrowwingets}>
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/allselled.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Всего продано:</p>
                          <h2>24 200 000 UZS</h2>
                        </div>
                      </div>
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/todayselled.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Сегодня продано:</p>
                          <h2>1 200 000 UZS</h2>
                          <div className={styles.boxtreydsuka}>
                            <Image
                              src="/treyd.svg"
                              alt="all"
                              width={20}
                              height={20}
                            />
                            <p>+15% по сравнению со вчерашним днем</p>
                          </div>
                        </div>
                      </div>{" "}
                      <div className={styles.boxonewidget}>
                        <Image
                          src="/todayselledticket.svg"
                          alt="all"
                          width={44}
                          height={44}
                        />
                        <div className={styles.boxonewidgettext}>
                          <p>Количество проданных билетов:</p>
                          <h2>54 шт</h2>
                        </div>
                      </div>{" "}
                    </div>
                  </div> */}
                  {/* <div className={styles.boxstatistic}>
                    <div className={styles.boxrowstatandsort}>
                      <div className={styles.boxrowstatustic}>
                        <Image
                          src="/scanqr.svg"
                          alt="statistic"
                          width={24}
                          height={24}
                        />
                        <p>Статистика Продаж</p>
                      </div>

                      <div className={styles.boxcolsortopen}>
                        <button
                          onClick={clickopensort}
                          className={styles.boxsort}
                        >
                          <p>
                            Сортировка:{" "}
                            <b>{sort1 ? "По цене" : "По количеству продаж"}</b>
                          </p>
                          <AnimatePresence>
                            {opensort ? (
                              <motion.img
                                src="/closesort.svg"
                                alt="close"
                                title="close"
                                width={16}
                                height={16}
                              />
                            ) : (
                              <motion.img
                                animate={{ rotate: 180 }}
                                transition={{ duration: 0.1, ease: "linear" }}
                                src="/closesort.svg"
                                alt="open"
                                title="open"
                                width={16}
                                height={16}
                              />
                            )}
                          </AnimatePresence>
                        </button>
                        <AnimatePresence>
                          {opensort ? (
                            <motion.div
                              animate={opensort ? { y: 40 } : { y: 0 }}
                              transition={{ duration: 0.1, ease: "linear" }}
                              exit={{ y: 0, opacity: 0 }} // Анимация при закрытии
                              className={styles.boxopensort}
                            >
                              <button
                                onClick={clicksort1}
                                disabled={sort1} // Отключаем кнопку, если она уже активна
                                className={sort1 ? styles.disabledButton : ""}
                              >
                                <p>По цене</p>
                              </button>
                              <button
                                onClick={clicksort2}
                                disabled={sort2} // Отключаем кнопку, если она уже активна
                                className={sort2 ? styles.disabledButton : ""}
                              >
                                <p>По количеству продаж</p>
                              </button>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className={styles.boxline}>
                      {sort1 ? (
                        <Line data={chartData} options={options} />
                      ) : (
                        <Line data={chartData2} options={options2} />
                      )}
                    </div>
                  </div> */}
                  <div className={styles.boxrowstatusqr}>
                    <div className={styles.boxscanandstatusqr}>
                      <h1>
                        <div className={styles.imgstatusscan}>
                          <Image
                            src="/scanqr.svg"
                            alt="scan"
                            width={24}
                            height={24}
                          />
                          <p>Статусы сканирования</p>
                        </div>
                        <div className={styles.boxsucsesserror}>
                          <div className={styles.boxscansucsess}>
                            <Image
                              src="scan sucsess.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                            <p>1225</p>
                          </div>
                          <div className={styles.boxscanerror}>
                            <Image
                              src="scanerror.svg"
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                            <p>13</p>
                          </div>
                        </div>
                      </h1>
                      <div className={styles.boxfixedblock}>
                        <div className={styles.boxonestat}>
                          <p>ID</p>
                          <p>№</p>
                          <p>Дата</p>
                          <p>Статус</p>
                        </div>
                        <div className={styles.boxscrollstat}>
                        {getUserStat && getUserStat.map(({id, status, created_at, ticket, partner_ticket}) => (
                        <div key={id} className={styles.boxtwostat}>
                          <p>{id}</p>
                          <p>{ticket == null ? partner_ticket : ticket}</p>
                          <p>{new Date(created_at).toLocaleDateString("ru-RU")}</p>
                          <p>
                            <Image
                              src={status ? "/scansucsessone.svg" : "/scanerror.svg"}
                              alt="sucsess"
                              width={24}
                              height={24}
                            />
                          </p>
                        </div>
                        ))}
                      </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.boxscanandstatusqr}>
                    {isEnabled ? (
                      <div className={styles.blockforScanner}>
                        <div
                          id="qrCodeContainer"
                          style={{
                            width: "100%",
                            height: "100px",
                            borderRadius: "40px",
                          }}
                        ></div>
                        <button onClick={() => setIsEnabled(!isEnabled)}>
                          <Image
                            src="/closecamera.svg"
                            alt="close"
                            width={40}
                            height={40}
                          />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h1>
                          <div className={styles.imgstatusscan}>
                            <Image
                              src="/scanqr.svg"
                              alt="scan"
                              width={24}
                              height={24}
                            />
                            Сканирование QR
                          </div>
                        </h1>
                        <div className={styles.boxstatusqrcontent}>
                          <AnimatePresence>
                            <motion.div
                              transition={{ duration: 0.1, ease: "linear" }}
                              className={styles.boxqrimgandtext}
                            >
                              <Image
                                src="/scanerqr.svg"
                                alt="qr"
                                width={34}
                                height={34}
                              />
                              <p>Отсканировать QR</p>
                            </motion.div>
                          </AnimatePresence>
                          <div className={styles.boxrootbtncamera}>
                            <AnimatePresence>
                              <motion.button
                                transition={{ duration: 0.1, ease: "linear" }}
                                onClick={clickcamerabutton}
                                className={styles.btncamera}
                              >
                                <Image
                                  src="/camera.svg"
                                  alt="camera"
                                  width={24}
                                  height={24}
                                />
                                <p>Выбрать камеру</p>
                                <AnimatePresence>
                                  {camerabutton ? (
                                    <motion.img
                                      src="/arrowtop.svg"
                                      alt="arrow"
                                      width={24}
                                      height={24}
                                    />
                                  ) : (
                                    <motion.img
                                      animate={{ rotate: 180 }}
                                      transition={{
                                        duration: 0.1,
                                        ease: "linear",
                                      }}
                                      src="/arrowtop.svg"
                                      alt="arrow"
                                      width={24}
                                      height={24}
                                    />
                                  )}
                                </AnimatePresence>
                              </motion.button>
                            </AnimatePresence>
                            <AnimatePresence>
                              <motion.div
                                initial={{ y: 50, opacity: 0, display: "none" }}
                                animate={
                                  camerabutton
                                    ? { y: 70, opacity: 1, display: "flex" }
                                    : { y: 50, opacity: 0, display: "none" }
                                }
                                transition={{ duration: 0.1, ease: "linear" }}
                                className={styles.boxcameras}
                              >
                                {cameras.map((camera) => (
                                  <button
                                    key={camera.id}
                                    onClick={() => setSelectedCamera(camera.id)}
                                    style={{
                                      background:
                                        selectedCamera === camera.id
                                          ? "#262626"
                                          : "#191919",
                                      color:
                                        selectedCamera === camera.id
                                          ? "#fff"
                                          : "#fff",
                                      borderRadius: "10px",
                                      padding: "5px 10px",
                                    }}
                                    disabled={isEnabled} // Блокируем выбор камеры во время сканирования
                                  >
                                    {camera.label || `${camera.id}`}
                                  </button>
                                ))}
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          <AnimatePresence>
                            <motion.button
                              onClick={() => setIsEnabled(!isEnabled)}
                              transition={{ duration: 0.1, ease: "linear" }}
                              className={styles.btnscan}
                            >
                              <div>
                                {isEnabled ? (
                                  "Остановить сканер"
                                ) : (
                                  <p>Сканировать</p>
                                )}
                              </div>
                            </motion.button>
                          </AnimatePresence>
                          {qrMessage ? (
                            <p className={styles.qrMessage}>
                              {qrMessage}
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {btnreport && (
              <div className={styles.boxinboxright}>
                <div className={styles.boxrowh1reports}>
                  <h1>Отчеты</h1>
                  <div className={styles.boxdatatimeanddownload}>
                    <div className={styles.boxdateh1}>
                      <p>{time}</p>
                      <p>{date}</p>
                    </div>
                    <div className={styles.boxdownload} title="download">
                      <Image
                        src="/download.svg"
                        alt="download"
                        width={18}
                        height={18}
                      />
                      <p>Скачать как</p>
                      <Image
                        src="/opensort.svg"
                        alt="close"
                        title="close"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.salesreport}>
                  <div className={styles.boxonereport}>
                    <div className={styles.boxrowsalesreport}>
                      <div className={styles.boxh2report}>
                        <Image
                          src="/minireport.svg"
                          alt="report"
                          width={24}
                          height={24}
                        />
                        <p>Отчеты по продажам</p>
                      </div>
                      <div className={styles.downloadreport}>
                        <Image
                          src="/exel.svg"
                          alt="exel"
                          width={16}
                          height={16}
                        />
                        <p>Скачать Xlc</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {btncontrol && (
              <>
                <p>В разработке</p>
              </>
            )}
            {btnsettings && (
              <>
                <p>В разработке</p>
              </>
            )}
          </motion.div>
          <div className={styles.boxbottom}>
            <div className={styles.boxBottomContent}>
              <button onClick={clickbtnmain} className={styles.boxBottomBtn}>
                <Image src="/home.svg" alt="home" width={34} height={34} />
                <p>Главная</p>
              </button>
              <button onClick={clickbtnreport} className={styles.boxBottomBtn}>
                <Image src="/report.svg" alt="home" width={34} height={34} />
                <p>Отчеты</p>
              </button>
              <button onClick={clickbtncontrol} className={styles.boxBottomBtn}>
                <Image
                  src="/todayselledticket.svg"
                  alt="home"
                  width={34}
                  height={34}
                />
                <p>Управление</p>
              </button>
              <button
                onClick={clickbtnsettings}
                className={styles.boxBottomBtn}
              >
                <Image src="/settings.svg" alt="home" width={34} height={34} />
                <p>Настройки</p>
              </button>
              <button onClick={logout} className={styles.boxBottomBtn}>
                <Image src="/logout.svg" alt="home" width={34} height={34} />
                <p>Выйти</p>
              </button>
            </div>
          </div>
        </section>
      </section>
    </ClientWrapper>
  );
}
