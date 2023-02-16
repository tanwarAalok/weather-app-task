import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react';
import BiSearch from '@/components/SearchIcon';
import Navbar from '@/components/Navbar';

const months = ["Jan", "Feb", "Mar", "April", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

type WeatherDataType = {
  [key: string]: any; // 👈️ variable key
};

const errorObject = {
  error: {
    message: "Something went wrong."
  }
};

function Home() {
  const [location, setLocation] = useState("");
  const [data, setData] = useState<WeatherDataType>({});
  const [isLoading, setLoading] = useState(false);
  
  const [tempType, setTempType] = useState("");

  const fetchApiData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_API_KEY}&q=${location}&days=10&aqi=no&alerts=no`
      );
      const apiData = await res.json();
      setData(apiData);
      setLoading(false);
    } catch (err) {
      setData(errorObject);
      setLoading(false);
    }
  };

  useEffect(() => {
    const defaultTemp = localStorage?.getItem('tempType');
    if (defaultTemp !== null) {
      setTempType(defaultTemp);
    } else setTempType("c");
    
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        setLocation(latitude+","+longitude);
      });
    }
  }, []);


  useEffect(() => {
    if (location) {
      fetchApiData();
    }
  }, [location]);


  

  if (isLoading) return <h3 style={{textAlign: "center", marginTop: "30vh"}}>Loading...</h3>;
  if(!data || data === undefined) return <p>Data not found !!</p>
  if (data?.error) return <p>data?.error?.message</p>;

  const futureDays = data?.forecast?.forecastday?.slice(1);

  return (
    <>
      {/* ****************** Navbar content ********************** */}

      <Navbar
        setLocation={setLocation}
        setTempType={setTempType}
        tempType={tempType}
      />

      {/******************** Main content ********************** */}

      <div className={styles.main}>
        <section className={styles.first_section}>
          <div className={styles.nameDiv}>
            <h1>{data?.location?.name}</h1>
            <h4>
              {data?.location?.region}, {data?.location?.country}
            </h4>
          </div>

          <div className={styles.content}>
            <div className={styles.content_left_div}>
              <Image
                src={`https:${data?.current?.condition?.icon}`}
                width="150"
                height="150"
                alt="weather image"
              />
              <div>
                <h1>
                  {tempType === "c"
                    ? data?.current?.temp_c
                    : data?.current?.temp_f}
                  °
                </h1>
                <p>{data?.current?.condition?.text}</p>
              </div>
            </div>

            <div className={styles.vertical_line}></div>

            <div className={styles.content_right_div}>
              <div className={styles.content_cards}>
                <h3>
                  {tempType === "c"
                    ? data?.forecast?.forecastday[0].day.maxtemp_c
                    : data?.forecast?.forecastday[0].day.maxtemp_f}
                  °
                </h3>
                <p>High</p>
              </div>
              <div className={styles.content_cards}>
                <h3>{data?.current?.wind_kph} kph</h3>
                <p>Wind</p>
              </div>
              <div className={styles.content_cards}>
                <h3>{data?.forecast?.forecastday[0].astro.sunrise}</h3>
                <p>Sunrise</p>
              </div>
              <div className={styles.content_cards}>
                <h3>
                  {tempType === "c"
                    ? data?.forecast?.forecastday[0].day.mintemp_c
                    : data?.forecast?.forecastday[0].day.mintemp_f}
                  °
                </h3>
                <p>Low</p>
              </div>
              <div className={styles.content_cards}>
                <h3>{data?.current?.humidity}</h3>
                <p>Humidity</p>
              </div>
              <div className={styles.content_cards}>
                <h3>{data?.forecast?.forecastday[0].astro.sunset}</h3>
                <p>Sunset</p>
              </div>
            </div>
          </div>
        </section>

        {/******************** Section 2 ********************** */}

        <section className={styles.second_section}>
          <h3>Next {futureDays?.length || 2} days</h3>
          <div className={styles.forcast_card_parent}>
            {futureDays?.map((day: any) => (
              <>
                <div key={day.date} className={styles.forcast_card}>
                  <p>
                    {day.date.slice(8)}{" "}
                    {months[parseInt(day.date.slice(5, 7)) - 1]}
                  </p>
                  <Image
                    src={`https:${day?.day?.condition?.icon}`}
                    width="50"
                    height="50"
                    alt="weather image"
                  />
                  <p>{day.day.avgtemp_c}°</p>
                </div>
              </>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}


export default Home;